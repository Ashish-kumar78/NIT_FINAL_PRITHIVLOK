import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Check, X, Award, ChevronRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const AIQuizEngine = ({ lessonId, onClose, topicName, color }) => {
  const { updateUser } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [isAIGenerated, setIsAIGenerated] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resultsData, setResultsData] = useState(null);

  // Fetch Questions from the Backend
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const reqData = { 
          lessonId: lessonId || '60d0fe4f5311236168a109ca',
          topicName: topicName,
          forceFresh: String(lessonId || '').startsWith('sdg_')
        };

        const res = await api.post('/learning/quiz/generate', reqData);
        if (res.data.exhaustedPool) {
          toast.success(res.data.message);
          onClose(); // Auto close if exhausted
          return;
        }
        
        setQuestions(res.data.questions || []);
        setIsAIGenerated(res.data.isAIGenerated || false);
        
        if (res.data.isAIGenerated) {
          toast('🔥 ' + res.data.message, { icon: '🤖', style: { borderRadius: '10px', background: '#333', color: '#fff' } });
        }
      } catch (err) {
        toast.error('AI Generator currently unavailable or syncing...');
        onClose();
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [lessonId]);

  const handleSelect = (option) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);
    
    if (option === questions[currentIndex].answer) {
      setCorrectAnswers((prev) => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    setSubmitting(true);
    try {
      const qIds = questions.map(q => q._id);
      const reqData = {
        lessonId: lessonId || '60d0fe4f5311236168a109ca',
        questionIds: qIds,
        totalCorrect: correctAnswers + (selectedOption === questions[currentIndex].answer ? 1 : 0),
        totalQuestions: questions.length
      };

      const res = await api.post('/learning/quiz/submit', reqData);
      setResultsData(res.data);
      if (res.data.xpGained > 0) {
         updateUser(); // Refresh user state context in background
      }
      setQuizFinished(true);
    } catch (err) {
      toast.error('Failed to save quiz results');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: '#fff' }}>
        <Loader2 size={48} className="animate-spin mx-auto mb-4" color={color || '#10B981'} />
        <h3 style={{ fontSize: '20px', fontWeight: 800 }}>Generating AI Quiz Variants...</h3>
        <p style={{ color: '#94A3B8', marginTop: 8 }}>Ensuring zero repetitions and personalizing difficulty...</p>
      </div>
    );
  }

  if (questions.length === 0 && !loading && !quizFinished) {
    return null;
  }

  const currentQ = questions[currentIndex];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="card-glass" 
      style={{ padding: '32px', marginTop: '24px', background: 'rgba(15,23,42,0.95)', border: `1px solid ${color || '#10B981'}50`, position: 'relative', overflow: 'hidden' }}
    >
      {/* Decorative AI background */}
      <div style={{ position: 'absolute', top: -100, right: -100, width: 300, height: 300, background: `radial-gradient(circle, ${color || '#10B981'}20, transparent 70%)`, filter: 'blur(40px)', pointerEvents: 'none' }} />
      
      {!quizFinished ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ background: `${color || '#10B981'}20`, padding: '8px', borderRadius: '12px' }}>
                 <BrainCircuit color={color || '#10B981'} size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', m: 0 }}>AI Dynamic Assessment</h3>
                <p style={{ fontSize: '12px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Topic: {topicName}</p>
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}><X size={24} /></button>
          </div>

          {/* Progress Bar */}
          <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 10, width: '100%', marginBottom: 32, overflow: 'hidden' }}>
            <motion.div 
              style={{ height: '100%', background: color || '#10B981', borderRadius: 10 }}
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex) / questions.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <div style={{ marginBottom: 32 }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: color || '#10B981', textTransform: 'uppercase', letterSpacing: '0.1em', background: `${color || '#10B981'}20`, padding: '4px 10px', borderRadius: 100, marginBottom: '16px', display: 'inline-block' }}>
              Level: {currentQ?.difficulty || 'Adaptive'}
            </span>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#fff', lineHeight: 1.5 }}>{currentQ?.question}</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: 32 }}>
            {currentQ?.options.map((opt, i) => {
              const isCorrect = isAnswered && opt === currentQ.answer;
              const isWrong = isAnswered && selectedOption === opt && opt !== currentQ.answer;
              return (
                <button 
                  key={i} 
                  onClick={() => handleSelect(opt)}
                  disabled={isAnswered}
                  style={{
                    padding: '16px 20px', 
                    borderRadius: '16px', 
                    textAlign: 'left',
                    fontSize: '15px',
                    fontWeight: 600,
                    cursor: isAnswered ? 'default' : 'pointer',
                    background: isCorrect ? 'rgba(16,185,129,0.1)' : isWrong ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.03)',
                    border: isCorrect ? '1px solid rgba(16,185,129,0.5)' : isWrong ? '1px solid rgba(239,68,68,0.5)' : selectedOption === opt ? `1px solid ${color || '#10B981'}` : '1px solid rgba(255,255,255,0.1)',
                    color: isCorrect ? '#10B981' : isWrong ? '#ef4444' : '#E2E8F0',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                  onMouseOver={(e) => { if (!isAnswered) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                  onMouseOut={(e) => { if (!isAnswered) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                >
                  {opt}
                  {isCorrect && <Check size={20} />}
                  {isWrong && <X size={20} />}
                </button>
              )
            })}
          </div>

          <AnimatePresence>
            {isAnswered && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                 <button 
                   onClick={nextQuestion} 
                   disabled={submitting}
                   className="btn-primary" 
                   style={{ background: color || '#10B981', display: 'flex', alignItems: 'center', gap: 8, padding: '12px 28px', borderRadius: '12px' }}
                 >
                   {submitting ? <Loader2 size={18} className="animate-spin" /> : currentIndex === questions.length - 1 ? 'Finish Assessment' : 'Next Engine Variable'} <ChevronRight size={18} />
                 </button>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
           <div style={{ width: 80, height: 80, background: 'rgba(16,185,129,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 0 40px rgba(16,185,129,0.3)' }}>
              <Award size={40} color="#10B981" />
           </div>
           <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#fff', marginBottom: 12 }}>Assessment Complete!</h2>
           <p style={{ color: '#94A3B8', fontSize: '16px', marginBottom: 24 }}>You scored {correctAnswers} out of {questions.length} accurately.</p>
           
           {resultsData && (
             <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px', marginBottom: 32, display: 'inline-block', textAlign: 'left', minWidth: '300px' }}>
                <p style={{ color: '#FBBF24', fontWeight: 800, fontSize: '14px', marginBottom: 8, textTransform: 'uppercase' }}>Performance Analysis</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 12 }}>
                  <span style={{ color: '#94A3B8' }}>XP Gained:</span>
                  <span style={{ color: '#fff', fontWeight: 800 }}>+{resultsData.xpGained}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 12 }}>
                  <span style={{ color: '#94A3B8' }}>Adaptive Skill Rating:</span>
                  <span style={{ color: '#fff', fontWeight: 800, textTransform: 'capitalize' }}>{resultsData.newSkillLevel}</span>
                </div>
                <div>
                  <p style={{ color: '#10B981', fontSize: '14px', fontStyle: 'italic', fontWeight: 600, marginTop: 12 }}>"{resultsData.feedback}"</p>
                </div>
             </div>
           )}

           <div>
             <button onClick={onClose} className="btn-primary" style={{ padding: '12px 32px', borderRadius: '12px' }}>Return to Explorer</button>
           </div>
        </div>
      )}
    </motion.div>
  );
};

export default AIQuizEngine;
