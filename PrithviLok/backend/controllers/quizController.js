// ============================================================
// AI dynamic Quiz Controller
// ============================================================
import mongoose from 'mongoose';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Lesson from '../models/Lesson.js';
import Question from '../models/Question.js';
import User from '../models/User.js';

const QUIZ_SIZE = 5;

const openaiClient = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const geminiClient = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

const pickDifficulty = (user, lessonId) => {
  const progress = Number(user.topicProgress?.get(lessonId) || 0);
  if (user.skillLevel === 'advanced' || progress > 80) return 'hard';
  if (user.skillLevel === 'intermediate' || progress > 40) return 'medium';
  return 'easy';
};

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
const normalizeQuestionKey = (text = '') => String(text).toLowerCase().trim().replace(/\s+/g, ' ');
const NO_REPEAT_SESSIONS = Math.max(1, Number.parseInt(process.env.QUIZ_NO_REPEAT_SESSIONS || '5', 10) || 5);
const MAX_RECENT_PER_LESSON = NO_REPEAT_SESSIONS * QUIZ_SIZE;

const parseJSONArrayFromText = (text = '') => {
  const trimmed = String(text).trim();

  try {
    const obj = JSON.parse(trimmed);
    if (Array.isArray(obj)) return obj;
    if (Array.isArray(obj.questions)) return obj.questions;
  } catch {
    // continue with regex fallback
  }

  const match = trimmed.match(/\[[\s\S]*\]/);
  if (!match) return [];
  try {
    return JSON.parse(match[0]);
  } catch {
    return [];
  }
};

const sanitizeQuestion = (q, fallbackDifficulty) => {
  if (!q || typeof q !== 'object') return null;

  const question = String(q.question || '').trim();
  const answer = String(q.answer || '').trim();
  const difficulty = ['easy', 'medium', 'hard'].includes(String(q.difficulty || '').toLowerCase())
    ? String(q.difficulty).toLowerCase()
    : fallbackDifficulty;
  const concept = String(q.concept || q.tag || 'AI_Generated').trim();

  if (!question || !answer) return null;

  const rawOptions = Array.isArray(q.options) ? q.options : [];
  const uniqueOptions = [...new Set(rawOptions.map((opt) => String(opt || '').trim()).filter(Boolean))];
  if (!uniqueOptions.includes(answer)) uniqueOptions.push(answer);
  if (uniqueOptions.length < 4) return null;

  const finalOptions = shuffle(uniqueOptions).slice(0, 4);
  if (!finalOptions.includes(answer)) {
    finalOptions[Math.floor(Math.random() * finalOptions.length)] = answer;
  }

  return {
    question,
    options: finalOptions,
    answer,
    difficulty,
    tags: [concept],
    isAIGenerated: true
  };
};

const buildPrompt = ({ lessonTitle, lessonCategory, topicName, difficulty, count, avoidQuestions }) => {
  const topic = topicName || lessonTitle;
  const avoid = avoidQuestions.length
    ? `Avoid these already-used questions:\n- ${avoidQuestions.join('\n- ')}`
    : 'Avoid generic repeated wording.';

  return `
You are generating SDG learning MCQs.
Topic: ${topic}
Category: ${lessonCategory || 'Sustainability'}
Difficulty: ${difficulty}
Count: ${count}

Rules:
1) Return strictly valid JSON.
2) Output JSON as an object with key "questions".
3) Each item must have: question, options(4 strings), answer(exactly matches one option), difficulty, concept.
4) Questions must be practical and specific to the topic/chapter, not generic.
5) Keep all options plausible; only one correct.
6) Do not include markdown or commentary.
7) Use diverse framing so each question feels unique.
${avoid}

Format:
{
  "questions": [
    {
      "question": "string",
      "options": ["A", "B", "C", "D"],
      "answer": "A",
      "difficulty": "${difficulty}",
      "concept": "string"
    }
  ]
}
`.trim();
};

const generateWithOpenAI = async (ctx) => {
  if (!openaiClient) return [];

  const model = process.env.OPENAI_QUIZ_MODEL || 'gpt-4o-mini';
  const prompt = buildPrompt(ctx);

  const completion = await openaiClient.chat.completions.create({
    model,
    temperature: 1.0,
    messages: [
      { role: 'system', content: 'You create high-quality educational multiple-choice quizzes.' },
      { role: 'user', content: prompt }
    ]
  });

  const text = completion.choices?.[0]?.message?.content || '';
  return parseJSONArrayFromText(text).map((q) => sanitizeQuestion(q, ctx.difficulty)).filter(Boolean);
};

const generateWithGemini = async (ctx) => {
  if (!geminiClient) return [];

  const prompt = buildPrompt(ctx);
  const model = geminiClient.getGenerativeModel({ model: process.env.GEMINI_QUIZ_MODEL || 'gemini-1.5-flash' });
  const response = await model.generateContent(prompt);
  const text = response?.response?.text?.() || '';

  return parseJSONArrayFromText(text).map((q) => sanitizeQuestion(q, ctx.difficulty)).filter(Boolean);
};

const generateOfflineFallback = ({ lessonId, topicName, lessonTitle, difficulty, count }) => {
  const topic = topicName || lessonTitle || 'Sustainability';
  const stems = [
    `Which local action most effectively advances ${topic}?`,
    `What is the strongest policy lever for improving ${topic}?`,
    `Which measurable outcome best signals progress in ${topic}?`,
    `Which intervention creates the fastest long-term gain for ${topic}?`,
    `What is the best community-level strategy for ${topic}?`,
    `Which decision reduces risk while improving ${topic}?`
  ];
  const correct = [
    `Targeted investments in community infrastructure and training for ${topic}.`,
    `Data-driven planning with transparent monitoring for ${topic}.`,
    `Inclusive programs that combine local participation and long-term financing.`,
    `Evidence-based regulation with practical incentives for adoption.`
  ];
  const wrong = [
    'Ignore local context and copy one fixed global template.',
    'Delay all implementation until perfect funding appears.',
    'Remove accountability and avoid measurable indicators.',
    'Focus only on short-term publicity outcomes.',
    'Cut maintenance budgets after initial rollout.',
    'Scale without any baseline or impact measurement.'
  ];

  const out = [];
  while (out.length < count) {
    const question = stems[Math.floor(Math.random() * stems.length)];
    const answer = correct[Math.floor(Math.random() * correct.length)];
    const distractors = shuffle(wrong).slice(0, 3);
    out.push({
      lessonId,
      question: `${question} (Variant ${Math.floor(Math.random() * 100000)})`,
      options: shuffle([answer, ...distractors]),
      answer,
      difficulty,
      tags: ['AI_Offline_Fallback'],
      isAIGenerated: true
    });
  }

  return out;
};

const generateQuestions = async (ctx) => {
  const provider = (process.env.QUIZ_PROVIDER || 'auto').toLowerCase();

  const tryOpenAI = provider === 'openai' || provider === 'auto';
  const tryGemini = provider === 'gemini' || provider === 'auto';

  if (tryOpenAI) {
    try {
      const q = await generateWithOpenAI(ctx);
      if (q.length > 0) return q;
    } catch (err) {
      console.error('OpenAI quiz generation failed:', err.message);
    }
  }

  if (tryGemini) {
    try {
      const q = await generateWithGemini(ctx);
      if (q.length > 0) return q;
    } catch (err) {
      console.error('Gemini quiz generation failed:', err.message);
    }
  }

  return generateOfflineFallback(ctx);
};

const toObjectIdList = (idList = []) =>
  idList
    .map((id) => String(id))
    .filter((id) => mongoose.Types.ObjectId.isValid(id))
    .map((id) => new mongoose.Types.ObjectId(id));

/**
 * @route   POST /api/learning/quiz/generate
 * @desc    Generate or fetch a unique, personalized AI quiz
 */
export const generateQuiz = async (req, res) => {
  try {
    const { lessonId, topicName, forceFresh } = req.body;
    const userId = req.user._id;

    if (!lessonId) {
      return res.status(400).json({ message: 'lessonId is required' });
    }

    let lessonTitle = 'Sustainability Topic';
    let lessonCategory = 'Global Goals';

    if (String(lessonId).startsWith('sdg_')) {
      const sdgNumber = String(lessonId).split('_')[1];
      lessonTitle = topicName || `SDG Goal ${sdgNumber}`;
      lessonCategory = `SDG ${sdgNumber}`;
    } else {
      const lesson = await Lesson.findById(lessonId).lean();
      if (!lesson) {
        return res.status(404).json({ message: 'Lesson not found' });
      }
      lessonTitle = topicName || lesson.title;
      lessonCategory = lesson.category || `SDG ${lesson.sdgNumber || ''}`.trim();
    }

    const user = await User.findById(userId);
    const targetDifficulty = pickDifficulty(user, lessonId);
    const attemptedObjectIds = toObjectIdList(user.attemptedQuestions || []);
    const recentQuestionKeys = Array.isArray(user.quizRecentQuestionKeys?.get(String(lessonId)))
      ? user.quizRecentQuestionKeys.get(String(lessonId))
      : [];

    // Keep questions fresh by random sampling rather than fixed slicing.
    const samplingPipeline = [
      {
        $match: {
          lessonId: String(lessonId),
          _id: { $nin: attemptedObjectIds }
        }
      },
      {
        $addFields: {
          questionKey: {
            $toLower: { $trim: { input: '$question' } }
          }
        }
      }
    ];

    if (recentQuestionKeys.length > 0) {
      samplingPipeline.push({
        $match: { questionKey: { $nin: recentQuestionKeys } }
      });
    }

    samplingPipeline.push({ $sample: { size: QUIZ_SIZE } });

    const sampled = await Question.aggregate(samplingPipeline);

    const shouldForceFresh = Boolean(forceFresh);
    const selectedQuestions = shouldForceFresh ? [] : [...sampled];
    const neededCount = shouldForceFresh ? QUIZ_SIZE : Math.max(0, QUIZ_SIZE - selectedQuestions.length);

    let aiGeneratedNow = false;
    if (neededCount > 0) {
      const recentQuestions = await Question.find({ lessonId: String(lessonId) })
        .sort({ createdAt: -1 })
        .limit(30)
        .select('question')
        .lean();

      const aiQuestions = await generateQuestions({
        lessonId: String(lessonId),
        lessonTitle,
        lessonCategory,
        topicName: topicName || lessonTitle,
        difficulty: targetDifficulty,
        count: neededCount,
        avoidQuestions: [
          ...new Set([
            ...recentQuestions.map((q) => q.question).filter(Boolean),
            ...recentQuestionKeys
          ])
        ].slice(0, 60)
      });

      const existingSet = new Set(
        (await Question.find({ lessonId: String(lessonId) }).select('question').lean()).map((q) =>
          normalizeQuestionKey(q.question)
        )
      );
      recentQuestionKeys.forEach((key) => existingSet.add(normalizeQuestionKey(key)));

      const toSave = aiQuestions
        .filter((q) => q.question && !existingSet.has(normalizeQuestionKey(q.question)))
        .map((q) => ({
          lessonId: String(lessonId),
          question: q.question,
          options: q.options,
          answer: q.answer,
          difficulty: q.difficulty || targetDifficulty,
          tags: q.tags || ['AI_Generated'],
          isAIGenerated: true
        }));

      if (toSave.length > 0) {
        const saved = await Question.insertMany(toSave, { ordered: false });
        selectedQuestions.push(...saved.map((q) => q.toObject()));
        aiGeneratedNow = true;
      }
    }

    const finalQuestions = shuffle(selectedQuestions)
      .slice(0, QUIZ_SIZE)
      .map((q) => ({
        ...q,
        options: shuffle(Array.isArray(q.options) ? q.options : [])
      }));

    if (finalQuestions.length === 0) {
      return res.status(503).json({
        success: false,
        message: 'Quiz generation temporarily unavailable. Please retry in a moment.'
      });
    }

    return res.json({
      success: true,
      message: aiGeneratedNow ? 'New chapter-aware AI questions generated.' : 'Fresh questions loaded.',
      questions: finalQuestions,
      isAIGenerated: aiGeneratedNow,
      difficultyContext: targetDifficulty,
      exhaustedPool: false
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @route   POST /api/learning/quiz/submit
 * @desc    Submit quiz results and update smart learning profile
 */
export const submitQuiz = async (req, res) => {
  try {
    const { lessonId, questionIds, totalCorrect, totalQuestions } = req.body;
    const userId = req.user._id;

    if (!questionIds || !Array.isArray(questionIds)) {
      return res.status(400).json({ message: 'questionIds array is required' });
    }

    const user = await User.findById(userId);

    const uniqueAttempted = new Set([...user.attemptedQuestions.map((id) => id.toString()), ...questionIds]);
    user.attemptedQuestions = Array.from(uniqueAttempted);

    // No-repeat memory: track recently shown question text per lesson for this user.
    const answeredQuestionObjectIds = toObjectIdList(questionIds);
    if (answeredQuestionObjectIds.length > 0) {
      const answeredQuestions = await Question.find({ _id: { $in: answeredQuestionObjectIds } })
        .select('lessonId question')
        .lean();

      if (!user.quizRecentQuestionKeys) {
        user.quizRecentQuestionKeys = new Map();
      }

      const groupedByLesson = new Map();
      for (const q of answeredQuestions) {
        const lid = String(q.lessonId || lessonId || '');
        if (!lid) continue;
        const key = normalizeQuestionKey(q.question);
        if (!key) continue;
        if (!groupedByLesson.has(lid)) groupedByLesson.set(lid, []);
        groupedByLesson.get(lid).push(key);
      }

      for (const [lid, newKeys] of groupedByLesson.entries()) {
        const current = Array.isArray(user.quizRecentQuestionKeys.get(lid))
          ? user.quizRecentQuestionKeys.get(lid)
          : [];
        const merged = [];
        const seen = new Set();
        for (const key of [...current, ...newKeys]) {
          const normalized = normalizeQuestionKey(key);
          if (!normalized || seen.has(normalized)) continue;
          seen.add(normalized);
          merged.push(normalized);
        }
        user.quizRecentQuestionKeys.set(lid, merged.slice(-MAX_RECENT_PER_LESSON));
      }
    }

    const xpGained = totalCorrect * 15;
    user.ecoScore += xpGained;
    user.ecoLevel = user.calculateEcoLevel();

    const accuracy = totalCorrect / (totalQuestions || questionIds.length || 1);

    let currentProgress = user.topicProgress?.get(lessonId) || 0;
    if (accuracy >= 0.8) currentProgress += 20;
    else if (accuracy >= 0.5) currentProgress += 5;
    else currentProgress = Math.max(0, currentProgress - 5);

    if (currentProgress > 100) currentProgress = 100;

    if (!user.topicProgress) user.topicProgress = new Map();
    user.topicProgress.set(lessonId, currentProgress);

    if (user.ecoScore > 500 && currentProgress > 60) {
      user.skillLevel = 'advanced';
    } else if (user.ecoScore > 200 && currentProgress > 30) {
      user.skillLevel = 'intermediate';
    }

    await user.save();

    let feedback = '';
    if (accuracy >= 0.8) {
      feedback = 'Incredible progress. Next round will become more challenging.';
    } else if (accuracy < 0.4) {
      feedback = 'Keep going. You will get simpler reinforcement questions next.';
    } else {
      feedback = 'Solid effort. You are steadily improving.';
    }

    return res.json({
      success: true,
      message: 'Quiz results processed',
      xpGained,
      newSkillLevel: user.skillLevel,
      topicProgress: currentProgress,
      feedback
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
