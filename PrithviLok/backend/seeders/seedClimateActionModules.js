import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Lesson from '../models/Lesson.js';

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB Connected for Climate Action Seeding'))
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

const lessons = [
  {
    title: 'What is Climate Change?',
    chapter: 73, // Continuation after SDG 12 which ended at 72
    description: 'Understanding the severe planetary shifts occurring at an unprecedented rate.',
    content: `🟢 MODULE 1: THE FEVER OF THE EARTH 🟢

Climate change refers to long-term shifts in temperatures and weather patterns. While nature does shift, human activity has accelerated global warming to devastating, unnatural speeds.

🌡️ THE REALITY OF RISING TEMPERATURES:
When the Earth "heats up," the oceans become warmer, causing historic ice-caps to melt at terminal velocity.

📋 MICRO-QUIZ: 
Q: What is the primary indicator of global climate change?
1️⃣ A single rainy week in August
2️⃣ A consistent, multi-decade rise in average global land and ocean temperatures
3️⃣ Earthquakes happening more frequently

(Correct Answer: 2. Climate is a long-term global average, not just daily localized weather!)`,
    category: 'sdg',
    difficulty: 'beginner',
    points: 30,
    duration: 5,
  },
  {
    title: 'Causes and Effects',
    chapter: 74,
    description: 'The domino effect of burning fossil fuels to power civilization.',
    content: `🚫 MODULE 2: REAPING THE WHIRLWIND 🚫

The root cause of this planetary fever is strictly man-made. 

⚠️ THE CAUSE ➡️ EFFECT DIAGRAM:
🏭 Burning Coal/Gas ➡️ Releases billions of tons of Carbon Dioxide (CO2).
🌲 Massive Deforestation ➡️ Removes the trees meant to absorb that CO2.
🔥 The Greenhouse Effect ➡️ Gases trap solar heat inside the atmosphere.
🌊 EFFECT: Extreme Oceans ➡️ Violent super-typhoons and flash floods.
🌾 EFFECT: Extreme Heat ➡️ Decades-long droughts and catastrophic wildfires destroying agriculture.

Real-life Example: The severe 2022 heatwaves across Europe buckled train tracks and evaporated massive rivers, completely halting commercial shipping. The effects are already here.`,
    category: 'sdg',
    difficulty: 'beginner',
    points: 40,
    duration: 6,
  },
  {
    title: 'Link Climate with Energy',
    chapter: 75,
    description: 'Why the global energy grid is the ultimate battleground.',
    content: `⚡ MODULE 3: THE COMBUSTION EQUATION (KEY CONNECTION) ⚡

Energy production is the single largest contributor to global climate change, accounting for 73% of ALL global emissions.

❌ BEFORE (Fossil-Fuel Dominance):
Every time you flip a light switch, a chunk of coal is physically lit on fire somewhere. The resulting CO2 acts as an invisible blanket, suffocating the atmosphere.

✅ AFTER (The Clean Grid):
A solar panel array catches pure radiation from the sun. The light switch turns on. The only thing produced is cold, silent, 100% emission-free electricity.

If we fix how we generate electricity, we solve the foundation of climate change instantly.`,
    category: 'energy',
    difficulty: 'intermediate',
    points: 50,
    duration: 8,
  },
  {
    title: 'Climate Solutions',
    chapter: 76,
    description: 'The green arsenal deployed to combat the greenhouse effect.',
    content: `🌞 MODULE 4: THE COUNTER-OFFENSIVE 🌞 (🚀 CORE WINNING PART)

We already possess the technology to drop out carbon footprint back to net-zero.

☀️ MEGA-SOLAR FARMS
Entire deserts are being fitted with mirrors to capture thermal momentum, replacing massive coal plants entirely.

🌬️ OFFSHORE WIND ENERGY
The ocean possesses infinite kinetic wind energy. Giant turbines provide base-load power to entire coastal nations.

🚗 THE EV MANDATE
Internal Combustion Engines are obsolete. An EV charged actively by a solar roof prevents roughly 4.6 metric tons of CO2 from entering the atmosphere every single year.

RESULTS: The absolute protection of global biodiversity, lowered atmospheric heat, and a permanently sustained environment!`,
    category: 'energy',
    difficulty: 'intermediate',
    points: 80,
    duration: 10,
  },
  {
    title: 'Climate Impact Simulator',
    chapter: 77,
    description: 'Advanced modeling demonstrating the stark fork in the road of humanity.',
    content: `🧠 MODULE 5: THE FORK IN THE ROAD 🧠 (🔥 VERY IMPRESSIVE)

[ 🌍 CLIMATE IMPACT SIMULATOR ]

Run the algorithm. The choice is binary.

User Scenario: [ ❌ NO ACTION REQUIRED ]
Simulating 15 years forward:
🌡️ Temperature Rise: +2.5°C
🌊 Sea Level: +2 feet (Coastal real estate flooded).
🌾 Agriculture: 40% crop failure. Severe global famines.

User Scenario: [ ✅ 100% GREEN TRANSITION ]
Simulating 15 years forward using the Paris Agreement specs:
🌡️ Temperature Rise: Capped definitively at +1.5°C
🌊 Sea Level: Stabilized.
🌳 Agriculture: Forests regrowing rapidly due to active carbon capture! 

[ 📢 DISASTER AWARENESS ALERTS ]
(Active Local Scan): ⚠️ Extreme Heatwave warning for Tomorrow. Ensure your neighbors have reliable grid access to air conditioning. Use solar-power heavily between 12 PM - 4 PM to offset grid load!`,
    category: 'sustainability',
    difficulty: 'advanced',
    points: 60,
    duration: 12,
  },
  {
    title: 'Carbon Footprint Tracker & Green Challenges',
    chapter: 78,
    description: 'Your personal command center for dropping CO2 emissions to zero.',
    content: `📊 MODULE 6: THE PERSONAL ACTION PLAN 📊 (🔥 MUST HAVE)

[ 👣 CARBON FOOTPRINT TRACKER ]
User inputs:
Drive to work: 15 miles (Gas car)
Electricity: 450 kWh/month
Meat Consumption: 6 Days a Week

🤖 AI DIAGNOSTIC: "You produce roughly 1,400 kg of CO2 monthly. Your footprint is highly severe."
👉 ACTION 1: Take the electric train to offset 400kg immediately!
👉 ACTION 2: Drop meat to 3 days a week to slash methane production!

[ 🏆 GREEN CHALLENGE SYSTEM ]
Join this week's active community sprint!
🔥 ACTIVE CHALLENGE: "The Vampire Slay" -> Unplug 100% of all unused electronics in your house for 7 days straight!
Reward if completed: +500 Bonus XP

Claim your mastery in the final Assessment below, dropping your CO2 rating, and universally unlocking the "Climate Warrior" and "Earth Protector" Badges!`,
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
      sdgNumber: 13, // Map to SDG 13 (Climate Action)
      slug: (l.title + ' climate action').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }));

    // Delete existing SDG 13 lessons to prevent duplicates
    await Lesson.deleteMany({ sdgNumber: 13 });
    
    await Lesson.insertMany(lessonsWithSlugs);
    
    console.log('🟢 6 "Climate Action" (SDG 13) Gamified Lessons Injected Successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Insertion failed:', error);
    process.exit(1);
  }
};

seedDB();
