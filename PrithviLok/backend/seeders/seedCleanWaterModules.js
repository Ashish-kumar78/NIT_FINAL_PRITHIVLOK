import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Lesson from '../models/Lesson.js';

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB Connected for Clean Water & Sanitation Seeding'))
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

const lessons = [
  {
    title: 'Water Awareness',
    chapter: 31, // Continuation after SDG 5 which ended at 30
    description: 'Understanding the true definition of sanitation and the dangers of contaminated water.',
    content: `🟢 MODULE 1: THE FOUNDATION OF LIFE 🟢

Clean water is more than just drinking; it dictates the survival and economic freedom of billions. Sanitation is the infrastructure that ensures this water remains clean before and strictly after use.

[ SWIPE CARDS SIMULATION ]
👉 CARD 1: What is Clean Water? 
Water absolutely free from chemical toxins, parasites, and massive bacterial colonies.
👉 CARD 2: Why Sanitation Matters
Without enclosed sewage logic, human waste directly reinfects the drinking supply.
👉 CARD 3: Diseases from Dirty Water
Cholera, Dysentery, Typhoid, and Polio are devastating rural areas right now due to microscopic sewage contamination.

📋 MICRO-QUIZ: 
Q: Which of these is the most significant factor preventing rural communities from achieving baseline sanitation?
1️⃣ Lack of advanced biological degrees
2️⃣ Lack of enclosed piping and energy-driven water pumps
3️⃣ Over-irrigation of farmland

(Correct Answer: 2. Pumping clean water and removing sewage physically requires massive amounts of power!)`,
    category: 'sdg',
    difficulty: 'beginner',
    points: 30,
    duration: 5,
  },
  {
    title: 'Problem Simulation (Interactive)',
    chapter: 32,
    description: 'Simulate the cascading systemic failures across different demographic landscapes.',
    content: `⚡ MODULE 2: GRID-LOCK SIMULATION (🔥 UNIQUE 🚀) ⚡

Observe the direct domino-effect when basic utilities collapse based on your demographic zone!

[ START SIMULATION ]

📍 SCENARIO A: You reside in a Rural Village
▶️ Input detected: [No Electricity]
💥 Result 1: The village's deep-water pump refuses to turn on. 
💥 Result 2: Women spend 4 hours walking to a shallow, stagnant river.
💥 Result 3: The stagnant water contains bacterial parasites. 
🛑 Final Impact: Widespread dysentery and massive health issues.

📍 SCENARIO B: You reside in an Urban City
▶️ Input detected: [Grid Power Failure]
💥 Result 1: Water treatment centers shut down their filtration lasers.
💥 Result 2: Urban sewage pipes back-up due to dead pressure-pumps.
🛑 Final Impact: Instant urban epidemic.

Without Energy, the illusion of safe water instantly crumbles.`,
    category: 'sdg',
    difficulty: 'intermediate',
    points: 40,
    duration: 7,
  },
  {
    title: 'Green Energy Solutions',
    chapter: 33,
    description: 'The monumental intersection of solar generation and fluid mechanics.',
    content: `🌞 MODULE 3: THE FLUID REVOLUTION 🌞 (🚀 CORE WINNING PART)

Clean water demands energy. Green Energy provides it locally, eternally, and cheaply.

💧 SOLAR WATER PUMPS
Submersible solar pumps drastically reverse village decline. Instead of hand-cranking a 50-foot well, the sun draws up millions of gallons essentially for free.

🔬 SOLAR PURIFICATION SYSTEMS (Reverse Osmosis)
Portable solar-UV filters can take dirty swamp water and turn it entirely potable in exactly 45 seconds using intense UV-C rays!

🔄 SMART SEWAGE TREATMENT
Decentralized biogas plants consume human sewage, completely treating the dirty water while actually GENERATING explosive biogas for free cooking stoves! 

📊 COST/BENEFIT ANALYSIS:
❌ Diesel Pump Cost: $1,200/Year in fuel alone (Slower, polluting, loud)
✅ Solar Pump Cost: $0/Year in fuel! (Immediate ROI within 18 months)`,
    category: 'energy',
    difficulty: 'intermediate',
    points: 70,
    duration: 9,
  },
  {
    title: 'Water Usage Tracker & Quality Checker',
    chapter: 34,
    description: 'Analyze your daily consumption and predict internal water safety.',
    content: `📊 MODULE 4: THE HYDRATION METRICS 📊 

Most households blindly waste water because they never accurately track it.

[ 💦 DAILY WATER USAGE TRACKER ]
User Input: 
🚿 Shower: 15 minutes
🚰 Sink left running while brushing teeth? [Yes]
💻 STATUS GRAPH: [██████████] 150 Liters
⚠️ ALERT: "You are wasting 20% water minimum!"
👉 TIP TO REDUCE: Install an aerator tap and cap showers to 5 minutes to immediately save 60 Liters daily!

[ 🔬 SMART WATER QUALITY CHECKER ]
User Inputs: 
👁️ Color: Slightly cloudy
👃 Smell: Musky/Earth
🏞️ Source: Municipal tap
🤖 APP PREDICTION: ⚠️ UNSAFE FOR DIRECT CONSUMPTION.
👉 SUGGESTED FILTRATION: Run through an activated carbon filter or fully boil prior to usage.`,
    category: 'sustainability',
    difficulty: 'advanced',
    points: 80,
    duration: 11,
  },
  {
    title: 'AI Water Advisor & Harvesting',
    chapter: 35,
    description: 'Interact with AI parameters to design incredible home-engineering setups.',
    content: `🧠 MODULE 5: THE AI WATER ADVISOR 🧠 (🔥 VERY POWERFUL)

Whenever you have a water infrastructure question, consulting AI changes the game!

💬 USER ASKS: "How can I capture free water at my house?"
🤖 AI ADVISOR RESPONDS: "The most effective method is a Rainwater Harvesting system linked to a simple biosand filter!"

🌧️ RAINWATER HARVESTING GUIDE (Step-by-Step):
1️⃣ Capture: Install tin or PVC gutters along the edges of your roof.
2️⃣ Transport: Angle the PVC pipes directly into a 1,000-liter storage tank.
3️⃣ Filter & Protect: Add a wire mesh to block leaves and a "first-flush" diverter to clear roof dirt!
💰 Cost Estimation: Under $150
📈 Benefits: Generates 5,000+ liters of totally free water per storm! Extends the municipal grid lifespan!`,
    category: 'sustainability',
    difficulty: 'advanced',
    points: 60,
    duration: 10,
  },
  {
    title: 'Community Infrastructure Map',
    chapter: 36,
    description: 'The social tracking apparatus for modern municipal intervention.',
    content: `📍 MODULE 6: THE SOCIAL IMPACT NETWORK 📍

Safe water isn't an individual sport; it is a community responsibility. This module acts as your local hub!

[ 🗺️ NEARBY WATER + TOILET FINDER ]
(GPS Tracker Simulation engaged)
⛲ Clean Water Station: 0.2 Miles North (Status: 🟢 Verified Active)
🚻 Public Sanitary Toilet: 0.5 Miles East (Status: 🟡 Needs Cleaning)

[ 📢 COMMUNITY REPORTING SYSTEM ]
See something broken? Report it to dispatch!
📸 Upload Photo: [ broken_pipe.jpg ]
📝 Issue: Main municipal pipeline burst on Maple Street.
✅ Report filed directly to Public Works API! 

By reporting infrastructure collapses, you directly prevent hundreds of gallons of clean water from vanishing into the dirt. 

Gain your ultimate XP below by passing the challenge, and forever claim your "Water Protector" & "Sanitation Hero" badges!`,
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
      sdgNumber: 6, // Map to SDG 6 (Clean Water & Sanitation)
      slug: (l.title + ' clean water sanitation').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }));

    // Delete existing SDG 6 lessons to prevent duplicates
    await Lesson.deleteMany({ sdgNumber: 6 });
    
    await Lesson.insertMany(lessonsWithSlugs);
    
    console.log('🟢 6 "Clean Water & Sanitation" (SDG 6) Gamified Lessons Injected Successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Insertion failed:', error);
    process.exit(1);
  }
};

seedDB();
