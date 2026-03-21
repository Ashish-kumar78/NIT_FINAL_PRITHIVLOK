import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Lesson from '../models/Lesson.js';

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB Connected for Zero Hunger Seeding'))
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

const lessons = [
  {
    title: 'What is Hunger?',
    chapter: 7, // Continuation
    description: 'Understanding the true definition of hunger and the crippling effects of malnutrition.',
    content: `🟢 MODULE 1: THE SILENT CRISIS 🟢

Hunger isn't just an empty stomach; it's a structural failure of food access. When people do not get enough fundamental nutrients daily, malnutrition sets in.

🩺 THE EFFECTS OF MALNUTRITION:
✖️ Weakened Body: Muscles deteriorate and cognitive functions slow down.
✖️ Low Energy: Adults cannot work, and children cannot study.
✖️ Disease Susceptibility: Immune systems crash, leading to higher mortality.

🌍 REAL-LIFE EXAMPLE:
In drought-stricken regions without proper logistics, entire communities suffer from stunting, where children never reach their full physical or mental growth potential. 

📋 MICRO-QUIZ: 
Q: What is the most dangerous long-term effect of chronic hunger on a population?
1️⃣ Increased food prices
2️⃣ Mass malnutrition and generational health deterioration
3️⃣ Excessive agricultural growth

(Correct Answer: 2. Malnutrition permanently alters the physical trajectory of a generation.)
`,
    category: 'sdg',
    difficulty: 'beginner',
    points: 30,
    duration: 5,
  },
  {
    title: 'Why Hunger Happens',
    chapter: 8,
    description: 'Deconstructing the root causes of global hunger crises.',
    content: `🌱 MODULE 2: THE ROOT CAUSES 🌱

Hunger is almost never about a lack of global food—it is about a lack of resources, logistics, and systemic issues.

⚠️ CAUSE ➡️ EFFECT DIAGRAM
Lack of Farming Resources ➡️ Unable to plant strong crops
No Irrigation ➡️ Dependency on unpredictable rain (Droughts destroy yields)
Severe Food Wastage ➡️ 1/3 of all food rots before reaching a plate
Extreme Poverty ➡️ Cannot afford to buy imported food during shortages

If a farmer has no modern tools or reliable water supply, their yield is restricted strictly to what manual labor and rainfall provide.`,
    category: 'sdg',
    difficulty: 'beginner',
    points: 40,
    duration: 7,
  },
  {
    title: 'Link Hunger with Energy',
    chapter: 9,
    description: 'Discover how electricity limits directly throttle agricultural yields.',
    content: `⚡ MODULE 3: THE ENERGY CONTINUUM (KEY CONNECTION) ⚡

How is hunger related to energy? Without power, farming is trapped in the 18th century.

❌ BEFORE (No Energy):
🚫 No Electricity ➡️ No automated irrigation ➡️ Low crop yield.
🚫 No Cold Storage ➡️ Ripe vegetables rot within 48 hours ➡️ Massive food waste.
🚫 No Machines ➡️ Tractors and harvesters don't run ➡️ Extremely slow, backbreaking farming.

✅ AFTER (With Energy):
💡 Electric Pumps ➡️ Water flows directly to crops 24/7.
🧊 Refrigeration ➡️ Farmers can store food for months and sell it safely.
⚙️ Motorized Milling ➡️ Grains are processed in seconds instead of hours.

Energy access immediately supercharges food preservation and production!`,
    category: 'energy',
    difficulty: 'intermediate',
    points: 50,
    duration: 9,
  },
  {
    title: 'Green Energy Solutions',
    chapter: 10,
    description: 'Implementing eco-friendly tech to permanently destroy hunger.',
    content: `🌞 MODULE 4: EMPOWERING THE FARMER 🌞 (🚀 WINNING POINT)

We don't just need energy; we need decentralized, FREE energy to fix hunger permanently.

🌊 SOLAR-POWERED IRRIGATION
Farmers no longer rely on expensive, polluting diesel pumps. The sun powers infinite water pumping, ensuring crops survive droughts.

❄️ SOLAR COLD STORAGE
Off-grid solar refrigerators allow farmers to preserve dairy, meat, and vegetables. They can travel to distant markets without the food spoiling!

🍳 BIOGAS FOR COOKING
Instead of chopping down forests for firewood (which causes soil erosion and less farming), communities use animal waste to generate clean cooking gas.

☀️ SOLAR DRYERS
Drying fruits and vegetables extends their shelf-life from days to YEARS! 

RESULTS: 📈 More Crops | 📉 Less Waste | 💰 More Income!
(Badges Unlocked: "Green Farmer" & "Food Saver")`,
    category: 'energy',
    difficulty: 'intermediate',
    points: 80,
    duration: 12,
  },
  {
    title: 'Smart Farming Techniques',
    chapter: 11,
    description: 'Modern, sustainable methods that maximize yield and save water.',
    content: `🚜 MODULE 5: PRECISION AGRICULTURE 🚜

Energy provides the power, but smart techniques provide the efficiency.

💧 DRIP IRRIGATION (Save Water)
Instead of flooding a field, special hoses drip exact amounts of water perfectly onto the roots of the plants. This saves 70% of water and uses very little electric power!

🌿 ORGANIC FARMING
Using natural compost instead of chemical fertilizers. It improves soil health and ensures the land can grow food for centuries without becoming toxic.

🔄 CROP ROTATION
Planting different crops every season so the soil nutrients don't get drained.

VISUAL GUIDE MAPPING:
[ Water Reservoir ] 〰️〰️ (Drip Hose) 〰️〰️ 🌱 Root 🌱 Root 🌱 Root
(Maximum efficiency, minimum waste!)`,
    category: 'sustainability',
    difficulty: 'advanced',
    points: 60,
    duration: 10,
  },
  {
    title: 'Food Waste Tracker Simulation',
    chapter: 12,
    description: 'Monitor your waste footprint and adopt preservation techniques.',
    content: `📊 MODULE 6: THE WASTE REDUCTION PROTOCOL 📊 (🔥 UNIQUE FEATURE)

Did you know 30% of global food is wasted? Here is how to analyze your daily habits:

[ SIMULATOR INTERFACE ]
Imagine your Daily Food Waste: 250 grams (about one large plate)
🔴 Weekly Waste: 1.75 kg
🔴 Yearly Waste: 91 kg

Think about that! 91 kg of food could feed a hungry child for months.

💡 ACTIONABLE STEPS TO REDUCE:
✔️ Prep-Mastery: Only cook exactly what your family will consume.
✔️ Composting: Turn unavoidable organic waste (banana peels) into rich soil for a home garden!
✔️ Preservation: Use simple solar-drying or pickling for excess vegetables.

Start tracking your real-world habits today and claim your "Food Saver" badge!`,
    category: 'lifestyle',
    difficulty: 'advanced',
    points: 100,
    duration: 15,
  },
];

const seedDB = async () => {
  try {
    // Generate unique slugs for all 6 new modules
    const lessonsWithSlugs = lessons.map(l => ({
      ...l,
      sdgNumber: 2, // Map to SDG 2 (Zero Hunger)
      slug: (l.title + ' zero hunger').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }));

    // Delete existing SDG 2 lessons to prevent duplicates if ran multiple times
    await Lesson.deleteMany({ sdgNumber: 2 });
    
    await Lesson.insertMany(lessonsWithSlugs);
    
    console.log('🟢 6 "Zero Hunger" (SDG 2) Gamified Lessons Injected Successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Insertion failed:', error);
    process.exit(1);
  }
};

seedDB();
