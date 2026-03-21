import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Lesson from '../models/Lesson.js';

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB Connected for Reduced Inequalities Seeding'))
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

const lessons = [
  {
    title: 'What are Inequalities?',
    chapter: 55, // Continuation after SDG 9 which ended at 54
    description: 'Understanding the massive economic and geographical divides in the modern world.',
    content: `🟢 MODULE 1: THE GREAT DIVIDE 🟢

Inequality is when a specific group of people is structurally denied the same baseline resources, opportunities, or rights as another.

📈 THE PRIMARY DIVIDES:
💰 Rich vs Poor: Access to healthcare, clean food, and safety.
🌆 Urban vs Rural: Access to high-paying jobs, infrastructure, and electricity.
💻 Digital vs Analogue: The severe gap between those with internet access and those without it.

📋 MICRO-QUIZ: 
Q: Which of these represents Geographic Inequality?
1️⃣ A company paying a worker less because of their gender
2️⃣ A rural village paying 300% more for dirty diesel fuel than an urban city pays for grid electricity
3️⃣ High taxation on luxury imported cars

(Correct Answer: 2. When your geographic location dictates whether you survive or suffer, that is a supreme inequality!)`,
    category: 'sdg',
    difficulty: 'beginner',
    points: 30,
    duration: 5,
  },
  {
    title: 'Problems Today',
    chapter: 56,
    description: 'How the digital divide directly results in a poverty trap.',
    content: `🚫 MODULE 2: THE DIGITAL & PHYSICAL DIVIDE 🚫

The gap between the "haves" and "have-nots" is widening. Why?

⚠️ 1. Energy Apartheid
Currently, millions of citizens live in total darkness while just a few hundred miles away, cities leave high-rise offices lit up fully 24/7. This is unacceptable.

⚠️ 2. Unequal Educational Job Opportunities
A child in a connected city can apply for 1,000s of remote jobs globally. A child in an unconnected village is entirely restricted to whatever manual labor is available within a 5-mile walking radius.

⚠️ 3. The Digital Divide
Every single high-paying skill today requires internet access. If you restrict electricity, you actively design a poverty trap for that entire demographic.`,
    category: 'sdg',
    difficulty: 'beginner',
    points: 40,
    duration: 6,
  },
  {
    title: 'Link Inequality with Energy',
    chapter: 57,
    description: 'How simple grid electricity functions as the great equalizer.',
    content: `⚡ MODULE 3: THE GREAT EQUALIZER (KEY CONNECTION) ⚡

Inequality is not just about money; it is fundamentally about energy cost and access.

❌ BEFORE (Off-Grid Poverty):
🚫 No Electricity ➡️ Rural students cannot read at night, immediately falling behind urban students.
🚫 No Power ➡️ Hospitals are just buildings. Serious illnesses require a massive, expensive trip to an urban center.
🚫 High Cost ➡️ Poor families spend up to 25% of their total income just to buy dirty kerosene lighting.

✅ AFTER (Grid Parity & Renewables):
💡 Infinite Solar ➡️ The rural student now accesses Harvard's free courseware under an LED bulb.
🔋 Energy Savings ➡️ Energy becomes practically free; families use that 25% income on structural food, saving lives instantly.`,
    category: 'energy',
    difficulty: 'intermediate',
    points: 50,
    duration: 8,
  },
  {
    title: 'Green Energy = Equal Opportunity',
    chapter: 58,
    description: 'Why solar panels inherently democratize human leverage.',
    content: `🌞 MODULE 4: DEMOCRATIZING POWER 🌞 (🚀 CORE WINNING PART)

Fossil fuels are centralized—only massive monopolies control oil refineries and coal mines. Green energy is *decentralized*. Anyone, anywhere, can harvest the sun.

This immediately shatters geographic inequality!

🌄 RURAL SOLAR ENERGY: Small-scale solar farms provide world-class electricity deep into the mountains without waiting for the government to build billion-dollar wire lines.
⚡ VILLAGE MICROGRIDS: A village bands together to buy one battery and a solar array, creating their own sovereign electrical grid!
🏘️ COMMUNITY SOLAR: Renters in urban apartments who don't have a roof can buy "shares" in a local solar garden to erase their electric bills!

RESULTS: Access for ALL | Wealth gap reduced | Eradication of the rural disadvantage!`,
    category: 'energy',
    difficulty: 'intermediate',
    points: 80,
    duration: 10,
  },
  {
    title: 'Inclusive Growth & Subsidy Finder',
    chapter: 59,
    description: 'Access Government Subsidies and build an inclusive global workflow.',
    content: `🌍 MODULE 5: INCLUSIVE GROWTH COMMAND CENTER 🌍

Growth isn't true growth unless the lowest percentage of society rises simultaneously. 

[ 🏛️ SUBSIDY & SUPPORT FINDER ]
Fetching Support based on geographic location...
✔️ FOUND: Global NGO "SolarAid" is actively subsidizing pico-solar lights for off-grid families in your province.
✔️ FOUND: The "Kusum Yojana" active schema allows farmers to install solar water pumps safely subsidized up to 60%!

[ 🤝 INCLUSIVE OPPORTUNITY HUB ]
Bridging Education with Rural Employment:
💻 Remote Freelancing: Found 4 actively hiring global companies that specifically require zero commuter transport (100% Work from Home).
🔨 Skill Training: Micro-grid technician licensing is available online. You can learn this strictly via mobile phone!`,
    category: 'sustainability',
    difficulty: 'advanced',
    points: 60,
    duration: 12,
  },
  {
    title: 'Inequality Impact Tracker & Community Energy',
    chapter: 60,
    description: 'Advanced metrics to calculate personal disparity and enable peer-to-peer energy sharing.',
    content: `📊 MODULE 6: THE DISPARITY TRACKER 📊 (🔥 UNIQUE FEATURE)

[ ⚖️ INEQUALITY IMPACT TRACKER ]
User Input:
Location: Rural Sector B
Income: Below regional average
Current Electricity: Off-grid (Kerosene reliance)

🤖 SYSTEM AI REPORT:
⚠️ Level: Severe Inequality Detected. You are paying a 300% premium for lighting compared to city users.
✅ DIRECT SUGGESTION: Immediate transition to a pico-solar home system to completely freeze utility taxation.

[ 💡 COMMUNITY ENERGY SHARING ] (🔥 VERY INNOVATIVE)
The absolute pinnacle of "Reduced Inequalities" is Peer-to-Peer power sharing.
⚡ "You generated 5kWh extra power today on your roof. Selling 3kWh to your neighbor for affordable rates via blockchain micro-transactions!" 

Pass the final Assessment below to definitively prove your understanding of the demographic divide, and earn your highly honored "Equality Builder" and "Inclusion Hero" Badges!`,
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
      sdgNumber: 10, // Map to SDG 10 (Reduced Inequalities)
      slug: (l.title + ' reduced inequalities').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }));

    // Delete existing SDG 10 lessons to prevent duplicates
    await Lesson.deleteMany({ sdgNumber: 10 });
    
    await Lesson.insertMany(lessonsWithSlugs);
    
    console.log('🟢 6 "Reduced Inequalities" (SDG 10) Gamified Lessons Injected Successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Insertion failed:', error);
    process.exit(1);
  }
};

seedDB();
