import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Lesson from '../models/Lesson.js';

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB Connected for Decent Work & Economic Growth Seeding'))
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

const lessons = [
  {
    title: 'What is Decent Work?',
    chapter: 43, // Continuation after SDG 7 which ended at 42
    description: 'Understanding fundamental labor rights and fair compensation.',
    content: `🟢 MODULE 1: THE FOUNDATION OF ECONOMICS 🟢

A job is not just about making money; it is about dignity, safety, and upward mobility. 

👔 WHAT IS DECENT WORK?
✔️ Safe Jobs: Zero physical hazards and proper localized safety gear.
✔️ Fair Salary: A living wage that covers food, housing, and savings, not just survival.
✔️ Equal Opportunities: A workplace where gender, race, or background do not determine promotions.

📋 MICRO-QUIZ: 
Q: Which scenario perfectly defines "Decent Work"?
1️⃣ Working 14 hours a day in a dark factory for below minimum wage
2️⃣ A legally contracted job offering fair pay, an 8-hour shift, and workplace safety protocols
3️⃣ Working from home exclusively without any legal protections

(Correct Answer: 2. Decent work mandates safety, legal protection, and fair compensation!)`,
    category: 'sdg',
    difficulty: 'beginner',
    points: 30,
    duration: 5,
  },
  {
    title: 'Problems Today',
    chapter: 44,
    description: 'The grim reality of global unemployment and exploitative labor.',
    content: `🚫 MODULE 2: THE MODERN LABOR CRISIS 🚫

Why do so many people remain trapped in poverty despite working every single day? 

⚠️ 1. Mass Unemployment
There simply aren't enough formalized jobs being created in developing nations for the massive influx of youth entering the workforce.

⚠️ 2. Wage Exploitation
Because jobs are scarce, employers often pay pennies for manual labor (especially in fashion and mining). 

⚠️ 3. Unsafe Environments
In many countries, laborers work extremely close to toxic chemicals or heavy, unguarded machinery without any health insurance.

Real-life Scenario: A factory worker breathing toxic fumes for 12 hours a day, earning $2, without the legal right to form a protective union. This is what we must abolish entirely.`,
    category: 'sdg',
    difficulty: 'beginner',
    points: 40,
    duration: 6,
  },
  {
    title: 'Link Jobs with Energy',
    chapter: 45,
    description: 'How expensive, unreliable power systems throttle localized economies.',
    content: `⚡ MODULE 3: THE ENGINE OF INDUSTRY (KEY CONNECTION) ⚡

Without energy, there is absolutely zero modern economic growth. Electricity is the literal engine that spins the global economy.

❌ BEFORE (No Reliable Energy):
🚫 No Electricity ➡️ Workshops cannot run heavy machinery; manufacturing defaults back to manual labor.
🚫 No Power ➡️ Entire tech, digital, and communication job sectors simply cease to exist.
🚫 Expensive Energy ➡️ Small businesses cannot afford massive fuel bills, resulting in mass layoffs and company closures.

✅ AFTER (With Energy):
💡 Industries boom with automated robotics and high-tech manufacturing!
💻 App developers, remote freelancers, and call centers instantly open up for business!
⚙️ Massive scaling of local factories, creating thousands of high-paying jobs!`,
    category: 'energy',
    difficulty: 'intermediate',
    points: 50,
    duration: 8,
  },
  {
    title: 'Green Energy = Job Creation',
    chapter: 46,
    description: 'The green industrial revolution is the largest job-creator in history.',
    content: `🌞 MODULE 4: THE GREEN RUSH 🌞 (🚀 CORE WINNING PART)

Green Energy is not just about saving the trees; it is the ultimate global wealth generation engine! 

Here are the new mass-employment sectors being established today:

☀️ SOLAR PANEL INSTALLATION:
Every single roof on Earth will eventually need solar. Millions of hands-on technical jobs are opening up right now!

🌬️ WIND ENERGY TECHNICIANS:
One of the highest-paying and fastest-growing jobs in modern manufacturing. Servicing offshore turbines generates serious wealth.

🔌 EV CHARGING NETWORKS:
As electric cars take over, thousands of mechanics and electricians are transitioning to EV diagnostics and battery retrofitting.

📈 THE OUTCOME: Sustainable Income + Infinite Growth. The fossil fuel era fired its workers as mines ran dry; the green era constantly expands!`,
    category: 'energy',
    difficulty: 'intermediate',
    points: 80,
    duration: 10,
  },
  {
    title: 'Digital Jobs + Income Tracker',
    chapter: 47,
    description: 'Track your economic trajectory and pivot into the remote workforce.',
    content: `💻 MODULE 5: THE DIGITAL ECONOMY 💻

Grid electricity connects you directly to the 5 Trillion-dollar digital economy. 
The Pipeline: SKILL ➡️ ONLINE JOB ➡️ INDEPENDENT INCOME.

[ 📱 MOBILE INCOME TRACKER SIMULATION ] (🔥 STRONG FEATURE)
User earning inputs: 
Month 1: ₹5,000 (Freelance Data Entry)
Month 2: ₹12,000 (Learning UI/UX Design)
Month 3: ₹35,000 (Contracted Web Developer)

📈 GROWTH GRAPH: [ ▇ ➖ ▇▇▇ ➖ ▇▇▇▇▇▇ ] 

🤖 APP SUGGESTIONS TO INCREASE CAP:
• Your income doubled when you learned coding. Transition entirely into Remote Development using your electric / internet connection.
• Drop commuting fees. Work exclusively online to cut expenses by 30%!`,
    category: 'lifestyle',
    difficulty: 'advanced',
    points: 60,
    duration: 12,
  },
  {
    title: 'Green Business Generator',
    chapter: 48,
    description: 'Advanced algorithms to calculate, launch, and fund your green startup.',
    content: `💼 MODULE 6: THE ECO-ENTREPRENEUR HUB 💼 (🔥 VERY UNIQUE)

[ ⚙️ BUSINESS IDEA GENERATOR ]
Enter Your Local Budget: "Low" ($500)
🤖 AI STARTUP SUGGESTIONS:
👉 "Start a solar phone-charging station in a dense market area!"
👉 "Start a small water purification filter distribution route using a bicycle."

[ 🔍 GREEN JOB FINDER ]
(GPS Scanned) 👉 Open Roles Near You:
• Junior Solar Installer (ABC Energy Ltd.) - No college necessary.
• Remote Sustainability Consultant (GlobalCorp) - Work from home!

[ 📊 SALARY + COST ANALYZER ]
Current Income: $2,000/mo
Current Expenses: $1,800/mo (High utility bills!)
👉 AI STRATEGY: Take out a micro-loan for rooftop solar. Your $200 utility bill vanishes immediately. The solar pays for itself in 3 years, leaving you with an extra $2,400 per year essentially for free!

Take the Assessment below to complete your training and claim your "Job Creator" and "Eco Entrepreneur" Badges!`,
    category: 'lifestyle',
    difficulty: 'advanced',
    points: 100,
    duration: 15,
  },
];

const seedDB = async () => {
  try {
    const lessonsWithSlugs = lessons.map(l => ({
      ...l,
      sdgNumber: 8, // Map to SDG 8 (Decent Work & Economic Growth)
      slug: (l.title + ' decent work economic growth').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }));

    // Delete existing SDG 8 lessons to prevent duplicates
    await Lesson.deleteMany({ sdgNumber: 8 });
    
    await Lesson.insertMany(lessonsWithSlugs);
    
    console.log('🟢 6 "Decent Work & Economic Growth" (SDG 8) Gamified Lessons Injected Successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Insertion failed:', error);
    process.exit(1);
  }
};

seedDB();
