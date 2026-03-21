import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Lesson from '../models/Lesson.js';

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB Connected for Life Below Water Seeding'))
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

const lessons = [
  {
    title: 'What is Life Below Water?',
    chapter: 79, // Continuation after SDG 13 which ended at 78
    description: 'Understanding the fragile, beautiful ecosystems of the deep.',
    content: `🟢 MODULE 1: THE BLUE HEART OF EARTH 🟢

Oceans cover 71% of the planet. They are not just water; they are massive, interconnected ecosystems containing marine animals, colossal coral reefs, and microscopic algae that produce over 50% of the Earth's oxygen!

🌊 THE DEEP ECOSYSTEM:
Without healthy oceans, life on land simply cannot exist. Oceans absorb heat and carbon, acting as the planet's primary cooling system.

📋 MICRO-QUIZ: 
Q: What is the most important function the ocean provides for human survival?
1️⃣ Providing a medium for cargo ships
2️⃣ Supplying salt for food preservation
3️⃣ Producing over 50% of the oxygen we breathe and absorbing global heat

(Correct Answer: 3. The ocean is literally the Earth's lungs!)`,
    category: 'sdg',
    difficulty: 'beginner',
    points: 30,
    duration: 5,
  },
  {
    title: 'Problems in Oceans Today',
    chapter: 80,
    description: 'Investigating the three-front war currently destroying marine life.',
    content: `🚫 MODULE 2: THE MARINE CRISIS 🚫

The ocean is under severe attack from multiple fronts of human negligence.

⚠️ 1. Plastic Pollution 🗑️
We dump 8 million tons of plastic into the ocean every year. Sea turtles mistake plastic bags for jellyfish, leading to starvation and death.

⚠️ 2. Oil Spills & Extraction 🛢️
Deep-water drilling accidents coat millions of square miles of ocean in thick, toxic oil, suffocating birds, fish, and coastal ecosystems instantly.

⚠️ 3. Overfishing & Acidification 🏭
Because the ocean absorbs our mass atmospheric CO2, the water is becoming highly acidic. This acid specifically burns and bleaches coral reef systems (the nurseries of the sea), killing them completely.`,
    category: 'sdg',
    difficulty: 'beginner',
    points: 40,
    duration: 6,
  },
  {
    title: 'Link Ocean Problems with Energy',
    chapter: 81,
    description: 'How fossil-fuel combustion specifically acidifies the oceanic water table.',
    content: `⚡ MODULE 3: THE ACID EFFECT (KEY CONNECTION) ⚡

The death of the ocean is directly tied to how we generate grid power on land.

🔄 CAUSE ➡️ EFFECT DIAGRAM:
🏭 Fossil Fuel Burning ➡️ Releases billion of tons of CO2 into the air.
🌊 Ocean Absorption ➡️ The ocean absorbs 25% of all that CO2 to protect the atmosphere.
🧪 Acidification ➡️ The CO2 mixes with saltwater, violently raising the acid levels.
💀 Coral Death ➡️ Acid dissolves the calcium shells of crabs and coral, collapsing the entire aquatic food chain!

❌ Industrial Waste ➡️ Coal runoff and cooling water from nuclear plants alter localized water temperatures, mutating local fish populations.`,
    category: 'energy',
    difficulty: 'intermediate',
    points: 50,
    duration: 8,
  },
  {
    title: 'Sustainable Solutions',
    chapter: 82,
    description: 'The green technological countermeasures saving marine ecosystems.',
    content: `🌞 MODULE 4: THE CLEAN INTERVENTION 🌞 (🚀 CORE WINNING PART)

We must replace oceanic harvesting with renewable harmony.

☀️ CLEAN ENERGY (Reducing Oil Reliance)
Transitioning strictly to solar and wind power immediately terminates the need for offshore deep-water oil drilling. Zero drilling = Zero oil spills!

♻️ WASTE MANAGEMENT SYSTEMS (IoT Filtration)
Installing large-scale solar-powered trash-interceptor barges at the mouths of the world's 10 biggest rivers stops 80% of plastic from ever reaching the ocean!

🔌 ECO-FRIENDLY INDUSTRIES (Electric Cargo)
Replacing massive diesel-burning shipping freighters with hydrogen or electric-powered cargo vessels stops global shipping pollution instantly.

RESULTS: 🐟 Safe Marine Life | 🌊 Reversing Acidification | 🪸 Massive Coral Regrowth`,
    category: 'energy',
    difficulty: 'intermediate',
    points: 80,
    duration: 10,
  },
  {
    title: 'Marine Protection Awareness Simulator',
    chapter: 83,
    description: 'Visualize the stark difference between conservation and annihilation.',
    content: `🤖 MODULE 5: THE AQUATIC THRESHOLD 🤖 (🔥 VERY IMPRESSIVE)

[ 🌊 OCEAN POLLUTION SIMULATOR ]

User Action: [ ❌ High Pollution / Fossil Status Quo ]
Simulating: CO2 continues rising. Ocean pH drops.
💀 RESULT: 90% of all Coral Reefs bleached. Massive fish die-offs due to micro-plastics. Water toxicity levels critical.

User Action: [ ✅ Sustainable Actions / Green Grid ]
Simulating: 100% transition to Renewables. Single-use plastics completely banned.
🐠 RESULT: Oceanic pH neutralizes. Coral Reefs regenerate aggressively. Marine biodiversity hits 200-year highs!

[ 🌿 DAILY MARINE HABITS ]
[ ] Swap all shower scrubs with micro-plastics to natural exfoliant bars.
[ ] Only purchase certified sustainable fish (or eat plant-based alternatives).
[ ] Absolutely zero single-use plastic water bottles.`,
    category: 'sustainability',
    difficulty: 'advanced',
    points: 60,
    duration: 12,
  },
  {
    title: 'Ocean Impact Tracker & Challenges',
    chapter: 84,
    description: 'Determine your exact chemical footprint on the oceanic biosphere.',
    content: `📊 MODULE 6: THE MARINE COMMAND CENTER 📊 (🔥 UNIQUE FEATURE)

[ 🗑️ PLASTIC REDUCTION TRACKER ]
User inputs:
Plastic Bags Used This Week: 12
Plastic Bottles Trashed: 5
Electric Usage (Fossil Grid): High

🤖 APP DIAGNOSTIC: ⚠️ Your oceanic footprint is critically heavy.
👉 "You directly contributed to micro-plastic runoff and 15kg of oceanic acidification this week."
📉 GOAL: Cut plastic usage to ZERO this week to drop your impact by 90%!

[ 🏆 CLEAN OCEAN CHALLENGES ]
🚀 NEW WEEKLY CHALLENGE: "The Plastic Purge" -> Use absolutely zero single-use plastics for 5 days. Rely only on canvas bags and steel bottles!
Reward: +800 XP

[ 🗺️ AWARENESS MAP (GPS) ]
🔴 High Pollution Zone: Sector 4 Beach requires immediate cleanup.
🟢 Clean Zone: Sector 2 Marine Reserve is actively protected.

Engage the final AI Assessment below to definitively prove your loyalty to the deep, and earn your "Ocean Protector" and "Blue Planet Hero" Badges!`,
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
      sdgNumber: 14, // Map to SDG 14 (Life Below Water)
      slug: (l.title + ' life below water').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }));

    // Delete existing SDG 14 lessons to prevent duplicates
    await Lesson.deleteMany({ sdgNumber: 14 });
    
    await Lesson.insertMany(lessonsWithSlugs);
    
    console.log('🟢 6 "Life Below Water" (SDG 14) Gamified Lessons Injected Successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Insertion failed:', error);
    process.exit(1);
  }
};

seedDB();
