import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Lesson from '../models/Lesson.js';

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB Connected for Life on Land Seeding'))
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

const lessons = [
  {
    title: 'What is Life on Land?',
    chapter: 85, // Continuation after SDG 14 which ended at 84
    description: 'Understanding the complex terrestrial web that allows humans to breathe and eat.',
    content: `🟢 MODULE 1: THE TERRESTRIAL WEB 🟢

Forests cover nearly 31% of our planet's land area. From dense rainforests to dry savannahs, land ecosystems provide shelter, jobs, security, and the very oxygen we breathe.

🌲 THE SYSTEM:
Without forests, there is no wildlife. Without wildlife, there is no ecosystem. Earth contains over 8 million species of plants and animals, and we rely on them intimately to sustain human agriculture.

📋 MICRO-QUIZ: 
Q: Forests provide which of the heavily critical functions for Earth?
1️⃣ Creating large spaces to build new strip malls
2️⃣ Absorbing massive amounts of global CO2 and preventing immediate soil erosion
3️⃣ Blocking the wind from hitting cities

(Correct Answer: 2. Forests are the anchor of all terrestrial life!)`,
    category: 'sdg',
    difficulty: 'beginner',
    points: 30,
    duration: 5,
  },
  {
    title: 'Problems on Land',
    chapter: 86,
    description: 'The terrifying speed at which we are bulldozing our planet’s lungs.',
    content: `🚫 MODULE 2: THE CHAINSAW EFFECT 🚫

Every single second, a chunk of forest the exact size of a football field is physically cut down or burned into ash. 

⚠️ 1. Deforestation 🌳❌
Massive logging operations and clearing land for cattle grazing have permanently destroyed over half of the Earth's original forests.

⚠️ 2. Loss of Biodiversity 🐘
Because we destroy their habitats, over 1 million animal and plant species are currently facing total planetary extinction.

⚠️ 3. Land Degradation 🏜️
When trees are removed, their roots no longer hold the soil. Rich jungles turn literally into dead, dusty deserts within just a few years.`,
    category: 'sdg',
    difficulty: 'beginner',
    points: 40,
    duration: 6,
  },
  {
    title: 'Link Land Problems with Energy',
    chapter: 87,
    description: 'How the relentless search for fossil fuels physically tears the Earth apart.',
    content: `⚡ MODULE 3: THE COMBUSTION EFFECT (KEY CONNECTION) ⚡

Why are we destroying the land? Overwhelmingly, it is a desperate attempt to find and burn energy.

🔄 CAUSE ➡️ EFFECT DIAGRAM:
🔥 Firewood Harvesting ➡️ 2.4 Billion people still cut down local forests just to cook their dinner.
🛢️ Industrial Expansion ➡️ Mining for coal essentially strips the tops off entire mountains, utterly annihilating the ecosystem below.
🚗 Fossil Fuel Pollution ➡️ Nitrogen from car exhausts creates "Acid Rain" that directly burns the leaves off trees thousands of miles away!

Habitat loss is almost entirely driven by human energy demands. If we fix energy, we save the forest instantly.`,
    category: 'energy',
    difficulty: 'intermediate',
    points: 50,
    duration: 8,
  },
  {
    title: 'Sustainable Solutions',
    chapter: 88,
    description: 'Deploying technology to aggressively regenerate the Earth’s biosphere.',
    content: `🌞 MODULE 4: THE REGENERATION PROTOCOL 🌞 (🚀 CORE WINNING PART)

We must use energy to heal the land rather than hurt it.

⚡ CLEAN ENERGY (Stopping the Chainsaws)
By deploying Biogas digesters and Solar-Cookers in rural areas, people immediately stop cutting down local trees for firewood. The forest grows back automatically!

🌱 AFFORESTATION DEPLOYMENT
Using automated drone-swarms to safely fire thousands of seed-pods into burned-out wildfire zones, planting forests 100x faster than humans can.

🛖 SUSTAINABLE AGRICULTURE
Vertical indoor farming arrays run by LED solar lighting! They use 90% less land and 95% less water than traditional farming, leaving vast tracts of land entirely alone for wildlife to reclaim!

RESULTS: 🌲 Aggressive Forest Regrowth | 🦍 Protected Wildlife Zones`,
    category: 'energy',
    difficulty: 'intermediate',
    points: 80,
    duration: 10,
  },
  {
    title: 'Wildlife Protection & Deforestation Simulator',
    chapter: 89,
    description: 'Visualize the stark algorithmic difference between clear-cutting and preservation.',
    content: `🤖 MODULE 5: THE CANOPY ALGORITHM 🤖 (🔥 VERY IMPRESSIVE)

[ 🌳 DEFORESTATION SIMULATOR ]

User Setup: [ ❌ High Deforestation / Logging Allowed ]
Simulating: CO2 absorption drops by 40%.
💀 RESULT: Severe soil erosion causes massive mudslides into local villages. Elephant and Tiger populations drop immediately by 85% due to habitat collapse.

User Setup: [ ✅ Sustainable Actions / Green Zones ]
Simulating: Logging is banned. Drones drop 10M seed-pods.
🌲 RESULT: Forest cover increases by 30%. Endemic species bounce back from the edge of extinction. CO2 is aggressively wiped from the local atmosphere.

[ 🐾 DAILY WILDLIFE TIPS ]
[ ] Never purchase items made of ivory, coral, or exotic animal skins.
[ ] Support companies that guarantee "Zero-Deforestation" supply chains for palm oil.`,
    category: 'sustainability',
    difficulty: 'advanced',
    points: 60,
    duration: 12,
  },
  {
    title: 'Land Impact Tracker & Tree Plantation',
    chapter: 90,
    description: 'Calculate your exact geographic burden on the local biosphere.',
    content: `📊 MODULE 6: THE TERRESTRIAL COMMAND CENTER 📊 (🔥 UNIQUE FEATURE)

[ 📜 LAND IMPACT TRACKER ]
User inputs:
Paper Usage: 3 reams a month.
Fuel Usage: 40 Gallons (Gasoline).

🤖 APP DIAGNOSTIC: ⚠️ Your impact is destructive.
"Your paper consumption represents 0.5 trees cut down annually, and your gasoline requires destructive fracking."
👉 IMMEDIATE ACTION: Switch all billing and notes to digital. Stop printing entirely!

[ 🌱 TREE PLANTATION TRACKER ]
You planted a sapling yesterday!
Track Status: 🟢 Alive & Growing.
Lifetime Impact: Will absorb exactly 1 Ton of CO2 by maturity!

[ 🗺️ BIODIVERSITY AWARENESS MAP (GPS) ]
🔴 Endangered Zone: Sector 4 Wetlands (Being drained for a mall).
🟢 Protected Area: Sector 2 National Park.

[ 🏆 ECO CHALLENGE ]
🚀 "The Digital Shift" -> Use precisely ZERO paper products this week. Read digitally, wipe with bamboo!

Pass the final Assessment below to definitively claim your "Earth Protector" and "Forest Guardian" Badges!`,
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
      sdgNumber: 15, // Map to SDG 15 (Life on Land)
      slug: (l.title + ' life on land').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }));

    // Delete existing SDG 15 lessons to prevent duplicates
    await Lesson.deleteMany({ sdgNumber: 15 });
    
    await Lesson.insertMany(lessonsWithSlugs);
    
    console.log('🟢 6 "Life on Land" (SDG 15) Gamified Lessons Injected Successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Insertion failed:', error);
    process.exit(1);
  }
};

seedDB();
