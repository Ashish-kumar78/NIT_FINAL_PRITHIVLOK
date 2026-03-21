import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Lesson from '../models/Lesson.js';

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB Connected for Gender Equality Seeding'))
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

const lessons = [
  {
    title: 'What is Gender Equality?',
    chapter: 25, // Continuation after SDG 4 which ended at 24
    description: 'Understanding fundamental human rights and the critical need for equal opportunities.',
    content: `🟢 MODULE 1: THE EQUAL FOUNDATION 🟢

Gender Equality simply means that all people—regardless of their gender—have identical rights, responsibilities, and opportunities. It ensures an equal playing field for education, jobs, and safety.

⚖️ RIGHT VS WRONG SITUATIONS:
❌ Wrong: A family only sends their son to school because they believe the daughter should only focus on house chores.
✅ Right: Both children receive equal schooling and have the freedom to choose their own career path.

📋 MICRO-QUIZ: 
Q: Which of these represents true Gender Equality?
1️⃣ Different safety standards entirely based on gender
2️⃣ Equal access to education, healthcare, and economic resources for everyone
3️⃣ Certain high-paying jobs restricted only to men

(Correct Answer: 2. Equality is about access and opportunity, not restriction!)`,
    category: 'sdg',
    difficulty: 'beginner',
    points: 30,
    duration: 5,
  },
  {
    title: 'Problems Faced',
    chapter: 26,
    description: 'Deconstructing the systemic barriers holding back millions of women globally.',
    content: `🚫 MODULE 2: SYSTEMIC BARRIERS 🚫

Despite progress, severe gender-based inequalities still plague developing nations.

⚠️ REAL-LIFE SCENARIOS (RURAL CRISIS):
✖️ Denied Education: In many regions, girls are immediately pulled out of school when they reach puberty.
✖️ Zero Safety: Walking at night without street lamps means women are highly vulnerable to violence and harassment.
✖️ Unpaid Labor: Women and girls are forced to spend up to 6 hours a day walking to collect water and firewood, completely destroying their ability to hold a paid job.

When women are denied opportunities, an entire country's economic potential is sliced completely in half!`,
    category: 'sdg',
    difficulty: 'beginner',
    points: 40,
    duration: 6,
  },
  {
    title: 'Link Gender Equality with Energy',
    chapter: 27,
    description: 'How simple electricity acts as the ultimate liberator for women.',
    content: `⚡ MODULE 3: THE ENERGY LIBERATOR (KEY CONNECTION) ⚡

Energy poverty affects everyone, but it disproportionately affects women. If a village lacks power, women pay the heaviest price in time and safety.

❌ BEFORE (No Energy):
🚫 Dark Streets ➡️ Extreme safety issues at night. Women are confined indoors after sunset.
🚫 Toxic Cooking ➡️ Women suffer chronic respiratory disease from inhaling indoor firewood smoke every day.
🚫 Manual Labor ➡️ Heavy, manual farming and washing leaves absolutely zero time for entrepreneurship.

✅ AFTER (With Energy):
💡 Electric Lighting ➡️ Streets are safe. Women can travel, socialize, or run night-shops safely.
⚙️ Motorized Mills ➡️ What took 4 hours of grinding by hand now takes 5 minutes by machine!
🔋 Stoves ➡️ Instant clean cooking means women reclaim 5 hours of their day!`,
    category: 'energy',
    difficulty: 'intermediate',
    points: 50,
    duration: 8,
  },
  {
    title: 'Green Energy Solutions',
    chapter: 28,
    description: 'How renewable power directly empowers and protects communities.',
    content: `🌞 MODULE 4: EMPOWERMENT VIA RENEWABLES 🌞 (🚀 WINNING POINT)

Clean energy creates direct pathways for gender equality by fundamentally saving time and improving safety.

🌆 SOLAR STREET LIGHTING
Simple rooftop lights and solar street lamps dramatically reduce crime and assault, allowing women absolute freedom of movement at any hour.

🍳 CLEAN COOKING (BIOGAS / ELECTRIC)
Replaces hours of dangerous firewood gathering with a simple switch. This eliminates the #1 cause of lung disease in rural women.

🏢 SOLAR-POWERED WORKPLACES
Provides stable electricity so women can work in local factories safely, operate mechanical sewing machines, or extend business hours indefinitely!

RESULTS: ⏳ Saves 5+ hours daily | 🛡️ Ensures absolute safety | 💼 Creates localized jobs`,
    category: 'energy',
    difficulty: 'intermediate',
    points: 80,
    duration: 10,
  },
  {
    title: 'Women Empowerment via Green Jobs',
    chapter: 29,
    description: 'Generating independent income using renewable technology.',
    content: `💼 MODULE 5: THE GREEN ECONOMY 💼 (🔥 CRITICAL IMPACT)

When women install and manage energy systems, they break traditional molds and generate immense independent income.

📈 THE "LEARN ➡️ SKILL ➡️ EARN" FLOW:
1️⃣ LEARN: Enter a rural green-tech program.
2️⃣ SKILL: Become certified in solar panel installation or maintenance.
3️⃣ EARN: Launch a cooperative business leasing solar lamps or setting up micro-grids for neighboring villages!

BUSINESS OPPORTUNITIES:
📱 Charging Stations: Women run solar kiosks, charging phones for a small fee.
👗 Electric Tailoring: Sewing machines powered by grid-tied solar quadruple clothing output.
💻 Digital Freelancing: A single laptop + solar battery allows women to work globally from home!

Energy independence directly creates financial independence.`,
    category: 'lifestyle',
    difficulty: 'advanced',
    points: 100,
    duration: 12,
  },
  {
    title: 'Rights, Awareness & Safety Tracker',
    chapter: 30,
    description: 'Monitor your safety parameters and learn your legal rights.',
    content: `⚖️ MODULE 6: RIGHTS & OPPORTUNITY SIMULATOR ⚖️ (🔥 UNIQUE FEATURE)

Empowerment requires absolute awareness of local laws and safety protocols.

📖 KNOW YOUR RIGHTS:
✔️ Equal Pay: It is a fundamental global standard to be paid the same as a man for identical work.
✔️ Education: Every child, regardless of gender, has a legal right to foundational schooling.

[ 📡 SAFETY + OPPORTUNITY TRACKER ]
Location Input: [ Rural Village Sector 4 ]
Time Input: [ Evening / Night ]

🔴 SYSTEM SCAN: Safety lighting is critically low.
👉 SAFETY TIP: Travel in groups or utilize the main solar-lit highway.
👉 NEARBY OPPORTUNITY: A "Green Skills Training Center" for solar deployment is opening 5 miles away! Learn how to install micro-grids and earn a living!

Claim your final XP by taking the Assessment below, and earn the exclusive "Equality Champion" & "Empowerment Leader" badges to complete SDG 5!`,
    category: 'lifestyle',
    difficulty: 'advanced',
    points: 100,
    duration: 12,
  },
];

const seedDB = async () => {
  try {
    const lessonsWithSlugs = lessons.map(l => ({
      ...l,
      sdgNumber: 5, // Map to SDG 5 (Gender Equality)
      slug: (l.title + ' gender equality').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }));

    // Delete existing SDG 5 lessons to prevent duplicates
    await Lesson.deleteMany({ sdgNumber: 5 });
    
    await Lesson.insertMany(lessonsWithSlugs);
    
    console.log('🟢 6 "Gender Equality" (SDG 5) Gamified Lessons Injected Successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Insertion failed:', error);
    process.exit(1);
  }
};

seedDB();
