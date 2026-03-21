import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Lesson from '../models/Lesson.js';

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB Connected for Good Health Seeding'))
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

const lessons = [
  {
    title: 'What is Good Health?',
    chapter: 13, // Continuation after SDG 2 which ended at 12
    description: 'Understanding that true health is physical, mental, and environmental.',
    content: `🟢 MODULE 1: THE FOUNDATION OF WELLNESS 🟢

Health isn't just the absence of disease; it is complete physical, mental, and social well-being. A clean environment is a fundamental prerequisite for all three!

⚖️ HEALTHY VS UNHEALTHY LIFESTYLE

❌ Unhealthy Baseline:
• Drinking contaminated water
• Breathing smog or indoor smoke
• High stress and no green spaces

✅ Healthy Optimal:
• Clean, securely filtered water 💧
• Pure, renewable-powered air 🌬️
• Access to nature and mental peace 🌿

📋 MICRO-QUIZ: 
Q: Which external factor has the most immediate invisible impact on your cardiovascular health?
1️⃣ Watching too much TV
2️⃣ Consistent exposure to severe air pollution/smog
3️⃣ Eating a single unhealthy meal

(Correct Answer: 2. Air pollution acts as an invisible slow-poison to millions globally.)`,
    category: 'sdg',
    difficulty: 'beginner',
    points: 30,
    duration: 5,
  },
  {
    title: 'Health Problems Today',
    chapter: 14,
    description: 'Diagnosing the severe modern crises destroying human wellness.',
    content: `⚕️ MODULE 2: THE MODERN CRISIS ⚕️

Why are so many communities suffering despite modern medicine? Because environmental health is failing.

⚠️ 1. Air Pollution (The Silent Killer)
Burning coal and diesel vehicles cause severe asthma and lung disease. Over 7 million people die annually from toxic air.

⚠️ 2. Dirty Water
Without proper sanitation logic, waterborne diseases like cholera devastate local populations.

⚠️ 3. Lack of Hospitals
In extremely remote villages, the nearest operational clinic might be a 5-hour drive away, preventing emergency treatment or maternal care.

Real-life example: An entire village suffers from chronic breathing problems simply because they cook using indoor firewood instead of clean energy.`,
    category: 'sdg',
    difficulty: 'beginner',
    points: 40,
    duration: 7,
  },
  {
    title: 'Link Health with Energy',
    chapter: 15,
    description: 'How modern medicine is entirely dependent on electricity.',
    content: `⚡ MODULE 3: THE MEDICAL ENERGY CONTINUUM (KEY CONNECTION) ⚡

There is no modern medicine without energy. Period.

❌ BEFORE (Without Reliable Energy):
🚫 No Electricity ➡️ Clinics cannot operate life-support, incubators, or MRI machines.
🚫 No Refrigeration ➡️ Life-saving vaccines and antibiotics spoil in the heat.
🚫 Toxic Cooking ➡️ Using firewood indoors creates smoke equivalent to smoking 40 cigarettes a day!

✅ AFTER (With Reliable Energy):
💡 Well-lit hospitals run 24/7 emergency rooms.
🧊 Vaccines are preserved in deep-freeze, wiping out polio and measles.
⚡ Electric/Biogas stoves eliminate toxic indoor smoke completely.

When a community gets power, their life expectancy instantly shoots up!`,
    category: 'energy',
    difficulty: 'intermediate',
    points: 50,
    duration: 9,
  },
  {
    title: 'Green Energy Solutions',
    chapter: 16,
    description: 'The incredible medical innovations powered by renewables.',
    content: `🏥 MODULE 4: THE RENEWABLE CURE 🏥 (🚀 WINNING POINT)

Green Energy directly translates directly to human survival in remote areas. 

☀️ SOLAR-POWERED HOSPITALS
In rural Africa and India, micro-solar grids power entire maternal wards, drastically lowering infant mortality during night births.

❄️ SOLAR VACCINE STORAGE
Portable solar coolers mean vaccines can be transported deep into jungles and deserts without spoiling.

🍳 CLEAN COOKING (Electric / Biogas)
Replacing firewood with biogas or electric induction completely erases indoor air pollution, immediately curing chronic coughing and preventing lung cancer.

RESULTS: 📉 Less Disease | 🧑‍⚕️ Better Treatment | 🌬️ Cleaner Air
(Badges Unlocked: "Eco Protector" & "Healthy Hero")`,
    category: 'energy',
    difficulty: 'intermediate',
    points: 80,
    duration: 12,
  },
  {
    title: 'Mental Health & Environment',
    chapter: 17,
    description: 'The deep psychological connection between nature and the mind.',
    content: `🧠 MODULE 5: THE GREEN MIND 🧠

A sick planet creates a stressed population. Noise pollution, concrete jungles, and smog actively increase cortisol (the stress hormone) in human brains.

🌿 THE NATURAL REMEDY:
Studies prove that spending just 20 minutes in a green environment (a park, a forest) heavily drops anxiety levels and improves cognitive function. 

🧘 DAILY WELLNESS TIPS:
• Open your windows to let in natural light (improves circadian rhythms/sleep).
• Plant a small indoor garden (plants naturally filter indoor toxins).
• Disconnect from electronics 1 hour before sleep to let your brain naturally tire out.

A clean planet is a peaceful mind!`,
    category: 'lifestyle',
    difficulty: 'advanced',
    points: 60,
    duration: 8,
  },
  {
    title: 'Personal Health Tracker Simulation',
    chapter: 18,
    description: 'Monitor your critical daily habits to optimize your lifespan.',
    content: `📊 MODULE 6: THE VITAL STATS TRACKER 📊 (🔥 STRONG FEATURE)

Your daily routine dictates 80% of your long-term health. 

[ SIMULATOR INTERFACE ]
If your daily input is:
❌ Sleep: 5 Hours
❌ Water: 2 Glasses
❌ Activity: 0 Minutes
🔴 HEALTH SCORE: 35/100 (Critical Warning! High risk of fatigue and disease)

If your daily input is:
✅ Sleep: 8 Hours
✅ Water: 8 Glasses
✅ Activity: 45 Minutes
🟢 HEALTH SCORE: 98/100 (Optimal Functioning!)

💡 DAILY CHECKLIST TO MAXIMIZE YOUR SCORE:
[ ] Sleep 7-9 hours to let your brain flush out toxins.
[ ] Drink at least 2 liters of water to keep your kidneys functioning.
[ ] Do 30 minutes of cardio (walking, running, dancing) to train your heart.

Action Step: Start keeping a journal of these three metrics today. Earning the "Healthy Hero" badge requires consistency!`,
    category: 'lifestyle',
    difficulty: 'advanced',
    points: 100,
    duration: 14,
  },
];

const seedDB = async () => {
  try {
    // Generate unique slugs
    const lessonsWithSlugs = lessons.map(l => ({
      ...l,
      sdgNumber: 3, // Map to SDG 3 (Good Health)
      slug: (l.title + ' good health').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }));

    // Delete existing SDG 3 lessons to prevent duplicates if ran multiple times
    await Lesson.deleteMany({ sdgNumber: 3 });
    
    await Lesson.insertMany(lessonsWithSlugs);
    
    console.log('🟢 6 "Good Health & Well-being" (SDG 3) Gamified Lessons Injected Successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Insertion failed:', error);
    process.exit(1);
  }
};

seedDB();
