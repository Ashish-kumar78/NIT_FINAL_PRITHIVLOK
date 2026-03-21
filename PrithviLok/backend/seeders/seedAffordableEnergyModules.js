import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Lesson from '../models/Lesson.js';

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB Connected for Affordable & Clean Energy Seeding'))
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

const lessons = [
  {
    title: 'What is Energy?',
    chapter: 37, // Continuation after SDG 6 which ended at 36
    description: 'Understanding the fundamentals of renewable and non-renewable energy sources.',
    content: `🟢 MODULE 1: THE POWER OF OUR WORLD 🟢

Everything you do requires energy—from charging your phone to lighting your home. But where does it come from?

🔋 TYPES OF ENERGY:

🔴 Non-Renewable (The Past):
• Coal, Oil, and Natural Gas.
• They take millions of years to form and will eventually run out.
• Burning them releases toxic carbon emissions.

🟢 Renewable (The Future) 🌞🌬️:
• Solar (Sunlight), Wind, and Hydropower (Water).
• They are infinite and completely free to capture!
• They produce zero harmful emissions.

📋 MICRO-QUIZ: 
Q: Which of the following is considered a non-renewable energy source?
1️⃣ Solar Power
2️⃣ Wind Turbines
3️⃣ Coal

(Correct Answer: 3. Coal takes millions of years to form and is finite!)`,
    category: 'sdg',
    difficulty: 'beginner',
    points: 30,
    duration: 5,
  },
  {
    title: 'Problems with Current Energy',
    chapter: 38,
    description: 'The grim reality of relying on fossil fuels for global electricity.',
    content: `🌫️ MODULE 2: THE FOSSIL FUEL CRISIS 🌫️

Why do we need to abandon old energy urgently?

⚠️ 1. Severe Pollution & Health Impact
Burning coal produces fine particulate matter (PM2.5). Breathing this continuously causes severe lung diseases, asthma, and premature death.

⚠️ 2. Skyrocketing Costs
Fossil fuels are limited. As they become harder to mine, power companies drastically increase your electricity bill every year.

⚠️ 3. Climate Destruction
Greenhouse gases trap heat, causing extreme droughts, deadly floods, and rising sea levels.

Real-life Impact: A family living next to a coal power plant has a 40% higher chance of developing respiratory illnesses. Dirt energy is quite literally toxic.`,
    category: 'sdg',
    difficulty: 'beginner',
    points: 40,
    duration: 6,
  },
  {
    title: 'Why Clean Energy is Important',
    chapter: 39,
    description: 'The massive environmental and economic benefits of transitioning instantly.',
    content: `⚡ MODULE 3: THE PARADIGM SHIFT ⚡

Switching to clean energy is no longer just "nice for the environment;" it is an absolute economic necessity.

[ COAL VS SOLAR COMPARISON ]

🏭 COAL POWER:
• Fuel Cost: Extremely High (You must constantly buy more coal).
• Emissions: 1,000g of CO2 per kWh.
• Sustainability: Depleting rapidly.

☀️ SOLAR POWER:
• Fuel Cost: $0 (The sun is free forever).
• Emissions: 0g of CO2 per kWh.
• Sustainability: Infinite.

By deploying clean energy, humanity stops destroying the atmosphere while simultaneously securing free power for future generations. Saves the planet 🌍 + Saves your wallet 💰!`,
    category: 'energy',
    difficulty: 'intermediate',
    points: 50,
    duration: 8,
  },
  {
    title: 'Green Energy Solutions',
    chapter: 40,
    description: 'The core technologies powering the next century.',
    content: `🌞 MODULE 4: THE CORE TECHNOLOGIES 🌞 (🚀 CORE PART)

How exactly do we capture free energy?

☀️ SOLAR PANELS
Photovoltaic cells absorb sunlight and instantly convert it into DC electricity. It’s a silent, motionless generator on your roof!

🌬️ WIND TURBINES
Massive aerodynamic blades catch the wind, turning an internal rotor that spins a generator, creating electricity. (Perfect for coastal areas!)

💧 HYDROPOWER
Flowing water in rivers or dams spins underwater turbines. It provides highly reliable, 24/7 base-load power.

🐄 BIOGAS
Agricultural and food waste decomposes in a sealed tank (digester), releasing methane gas which is captured and burned cleanly for cooking or heating!

Each technology is a masterclass in utilizing nature without destroying it.`,
    category: 'energy',
    difficulty: 'intermediate',
    points: 80,
    duration: 10,
  },
  {
    title: 'Energy Usage Tracker & Appliance Analyzer',
    chapter: 41,
    description: 'Simulate tracking your home consumption to unlock massive savings.',
    content: `📊 MODULE 5: THE SMART GRID SIMULATOR 📊

You cannot reduce what you do not measure! Welcome to the interactive tracker.

[ ⚡ APPLIANCE ENERGY ANALYZER ]
Let's see where your electricity goes:
🌀 Old Ceiling Fan: 75 Watts
❄️ AC Unit (10 years old): 2,000 Watts! (Massive drain)
🧊 Refrigerator: 400 Watts

💡 "REDUCE USAGE" AI SUGGESTIONS:
• Swap the old AC for a 5-Star Inverter AC (Uses half the power!)
• Change incandescent bulbs (60W) to LED bulbs (9W).
• Unplug the TV when not in use.

[ 📈 USAGE GRAPH ]
Morning: ▇▇ 20%
Afternoon: ▇▇▇▇ 40% (AC running)
Evening: ▇▇▇▇ 40%

By making small appliance switches, an average house can slash its energy bill by 35% overnight!`,
    category: 'sustainability',
    difficulty: 'advanced',
    points: 60,
    duration: 12,
  },
  {
    title: 'Smart Energy Advisor & “Earn with Energy”',
    chapter: 42,
    description: 'Advanced features for calculating ROI and establishing green income.',
    content: `🧠 MODULE 6: THE ADVANCED ENERGY ADVISOR 🧠 (🔥 MUST HAVE)

[ ☀️ SOLAR COST & SAVINGS CALCULATOR ]
Enter Monthly Bill: ₹3,000 / $40
Enter Roof Size: Medium
🤖 AI CALCULATION RESULTS:
• Recommended System: 3kW Solar Plant
• Installation Cost: ~₹1,20,000 (after subsidies)
• Monthly Savings: 100% (Your bill drops to zero!)
• Payback Time: ~3.5 Years. After that, free electricity for 25 years!

[ 💰 EARN WITH ENERGY FEATURE ]
Clean energy connects directly with SDG 1 (No Poverty) and SDG 5 (Gender Equality):
1️⃣ Sell to the Grid: Use Net-Metering to sell extra solar power back to the government for passive income!
2️⃣ Charging Stations: Start a local business charging e-rickshaws or phones in your village.

[ 📍 NEARBY SOLAR PROVIDERS ]
Searching your area...
🟢 Found 3 certified installers near your Zip Code.
🟢 PM Surya Ghar Subsidy is ACTIVE in your region.

Claim your massive XP reward below to unlock the highly coveted "Energy Saver" and "Green Champion" badges!`,
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
      sdgNumber: 7, // Map to SDG 7 (Affordable & Clean Energy)
      slug: (l.title + ' affordable clean energy').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }));

    // Delete existing SDG 7 lessons to prevent duplicates
    await Lesson.deleteMany({ sdgNumber: 7 });
    
    await Lesson.insertMany(lessonsWithSlugs);
    
    console.log('🟢 6 "Affordable & Clean Energy" (SDG 7) Gamified Lessons Injected Successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Insertion failed:', error);
    process.exit(1);
  }
};

seedDB();
