import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Lesson from '../models/Lesson.js';

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB Connected for Quality Education Seeding'))
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

const lessons = [
  {
    title: 'What is Quality Education?',
    chapter: 19, // Continuation after SDG 3 which ended at 18
    description: 'Understanding that education is about skill-building, not just reading.',
    content: `🟢 MODULE 1: BEYOND THE TEXTBOOK 🟢

True "Quality Education" means much more than just learning to read. It means acquiring the critical thinking, digital skills, and practical knowledge required to survive and thrive in a modern economy.

📘 WHY EDUCATION MATTERS:
• Equal Access: Regardless of gender, location, or wealth, everyone deserves to learn.
• Practical Knowledge: Learning how to build, create, and solve problems.
• Digital Competency: Using tools like the internet and computing to access global information.

📋 MICRO-QUIZ: 
Q: Quality Education is primarily defined by:
1️⃣ Memorizing historical facts
2️⃣ Developing practical skills, digital literacy, and equal access
3️⃣ Attending a physical building for exactly 12 years

(Correct Answer: 2. Education is about empowerment, adaptability, and access!)`,
    category: 'sdg',
    difficulty: 'beginner',
    points: 30,
    duration: 5,
  },
  {
    title: 'Problems in Education',
    chapter: 20,
    description: 'Deconstructing the severe barriers to learning in rural communities.',
    content: `🚫 MODULE 2: THE BARRIERS TO LEARNING 🚫

In remote regions, the lack of infrastructure completely destroys a child's chance to learn.

⚠️ THE RURAL EDUCATIONAL CRISIS:
✖️ Ghost Schools: Many villages have no schools at all, requiring children to walk 10+ kilometers dangerously every day.
✖️ Zero Digital Access: No computers or internet means students are cut off from 99% of global knowledge.
✖️ The Teacher Shortage: Highly qualified teachers rarely move to remote villages because there are no basic amenities like electricity or running water.

Real-life example: In many Sub-Saharan communities, a student's education ends at sunset simply because they cannot afford the hazardous kerosene required to light a reading lamp.`,
    category: 'sdg',
    difficulty: 'beginner',
    points: 40,
    duration: 6,
  },
  {
    title: 'Link Education with Energy',
    chapter: 21,
    description: 'How the absence of electricity creates an inescapable digital divide.',
    content: `⚡ MODULE 3: THE LIGHT OF KNOWLEDGE (KEY CONNECTION) ⚡

We cannot talk about education without talking about power. Energy is the literal switch that turns on modern learning.

❌ BEFORE (No Energy):
🚫 No Light ➡️ Children are entirely unable to study after sunset or do their homework.
🚫 No Internet ➡️ No online courses, no Wikipedia, no modern skills.
🚫 No Computers ➡️ Students reach adulthood without ever sending an email.

✅ AFTER (With Energy):
💡 Well-lit homes ➡️ Students revise notes late into the evening safely.
💻 Digital Literacy ➡️ Children learn coding, mathematics, and science from masters across the world!
📶 Global Connectivity ➡️ A child in a desert village can take the exact same online class as a student in a major metropolis.`,
    category: 'energy',
    difficulty: 'intermediate',
    points: 50,
    duration: 8,
  },
  {
    title: 'Green Energy Solutions',
    chapter: 22,
    description: 'How renewable power grids are creating a learning revolution.',
    content: `🏫 MODULE 4: THE SOLAR CLASSROOM 🏫 (🚀 WINNING POINT)

Bringing grid-electricity over mountains and deserts is too expensive. Green energy solves this immediately by generating power directly on the school roof!

☀️ SOLAR-POWERED SCHOOLS
Rooftop solar panels power fans, lights, and laptop charging stations, turning heavily heated, dark rooms into comfortable, optimized learning environments.

💡 SOLAR STUDY LAMPS
Charities distribute small, cheap solar lamps to students. They charge them during the day and use them to read safely at night without inhaling toxic kerosene smoke.

💻 DIGITAL CLASSROOMS
With a single starlink satellite and a solar battery bank, an entire school can connect to the digital world. 

RESULTS: 📈 Better Learning Outcomes | 🧑‍🎓 Unlimited Access to Knowledge | 🔋 Device Charging Hubs
(Earn the "Eco Learner" badge by spreading the word!)`,
    category: 'energy',
    difficulty: 'intermediate',
    points: 80,
    duration: 10,
  },
  {
    title: 'Smart Learning (Tech + Sustainability)',
    chapter: 23,
    description: 'Using your education to learn about preserving the planet.',
    content: `💻 MODULE 5: THE EMPOWERED STUDENT 💻

When tech meets sustainability, the next generation can literally save the planet.

Access to online courses means students can learn high-level environmental skills directly.

🌱 MINI LESSON 1: "Save Energy at Home"
Did you know that leaving your laptop charger plugged in when not in use wastes 'vampire' energy? Unplugging saves you money and the grid load!

♻️ MINI LESSON 2: "Waste Management"
Properly sorting plastics into recycling instead of landfills drops city emissions drastically.

When we combine Skill-based learning with Environmental awareness, we build a civilization of guardians for the Earth!`,
    category: 'sustainability',
    difficulty: 'advanced',
    points: 60,
    duration: 9,
  },
  {
    title: 'Learning Progress Tracker',
    chapter: 24,
    description: 'Analyze your educational metrics and climb the skill ladder.',
    content: `📊 MODULE 6: THE ACADEMIC TRACKER SIMULATION 📊 (🔥 STRONG FEATURE)

Just as energy grids must be tracked for efficiency, your brain must be tracked for knowledge acquisition!

[ PROGRESS SIMULATOR ]
Current Status: "Knowledge Seeker"

[██████░░░░] 60% Core Modules Competed
[████████░░] 80% Tech Literacy Achieved
[██░░░░░░░░] 20% Environmental Mastery

Based on your current skill level, here are personalized AI suggestions:
👉 SUGGESTION 1: You have mastered Energy basics, start reading the "Smart Learning" advanced modules!
👉 SUGGESTION 2: Maintain a 5-day daily streak in the PRITHIVLOK learning app to permanently unlock the highly-coveted "Knowledge Master" emblem!

Claim your final XP by hitting the Complete Assessment button below, and become a master of SDG 4!`,
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
      sdgNumber: 4, // Map to SDG 4 (Quality Education)
      slug: (l.title + ' quality education').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }));

    // Delete existing SDG 4 lessons to prevent duplicates
    await Lesson.deleteMany({ sdgNumber: 4 });
    
    await Lesson.insertMany(lessonsWithSlugs);
    
    console.log('🟢 6 "Quality Education" (SDG 4) Gamified Lessons Injected Successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Insertion failed:', error);
    process.exit(1);
  }
};

seedDB();
