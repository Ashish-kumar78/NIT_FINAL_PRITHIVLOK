import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Lesson from '../models/Lesson.js';

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB Connected for Responsible Consumption & Production Seeding'))
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

const lessons = [
  {
    title: 'What is Responsible Consumption?',
    chapter: 67, // Continuation after SDG 11 which ended at 66
    description: 'Understanding the absolute difference between needing and wasting.',
    content: `🟢 MODULE 1: THE MINDFUL LIFESTYLE 🟢

Responsible Consumption means doing more and better with less. It is about actively decoupling economic growth from environmental degradation.

🛒 DAILY EXAMPLES:
❌ Unsustainable: Buying pre-packaged single-use plastic water bottles every day.
✅ Sustainable: Buying one steel water bottle and using a filtered tap.
❌ Unsustainable: Leaving a desktop computer running 24/7 "just in case."
✅ Sustainable: Setting the computer to sleep automatically after 10 minutes.

📋 MICRO-QUIZ: 
Q: What is the primary goal of sustainable consumption?
1️⃣ To entirely stop manufacturing and buying all physical products
2️⃣ To maximize economic efficiency while actively minimizing resource waste and pollution
3️⃣ To only purchase extremely expensive luxury organic goods

(Correct Answer: 2. We don't stop living; we just stop wasting the materials required to live!)`,
    category: 'sdg',
    difficulty: 'beginner',
    points: 30,
    duration: 5,
  },
  {
    title: 'Problems Today',
    chapter: 68,
    description: 'The terrifying reality of hyper-consumerism and infinite trash.',
    content: `🚫 MODULE 2: THE THROWAWAY SOCIETY 🚫

Our current "take-make-dispose" model is violently destroying the planet's resource baseline.

⚠️ 1. Massive Food Waste 🍛
Over 1/3 of all food produced globally is thrown away while millions starve. This rotting food in landfills creates immense methane emissions (a greenhouse gas 25x worse than CO2).

⚠️ 2. The Plastic Ocean 🗑️
We produce 400 million tons of plastic waste annually. Because plastic takes 500 years to degrade, micro-plastics are now permanently embedded in the oceanic food chain.

⚠️ 3. Energy Hemorrhaging ⚡
"Vampire appliances" (devices left plugged in but turned off) account for nearly 10% of a home's total electricity bill. That is pure wasted coal smoke for zero benefit.`,
    category: 'sdg',
    difficulty: 'beginner',
    points: 40,
    duration: 6,
  },
  {
    title: 'Link Consumption with Energy',
    chapter: 69,
    description: 'The hidden energetic cost of creating things you throw away.',
    content: `⚡ MODULE 3: THE INVISIBLE BURN (KEY CONNECTION) ⚡

Every single item you buy contains "embodied energy." This is the massive amount of fuel required to mine the materials, manufacture the product, and ship it to your local store.

🔄 CAUSE ➡️ EFFECT FLOW:
🏭 More Consumption ➡️ Factories burn vastly more coal/gas to keep up with production demand.
🏭 More Production ➡️ Rivers are polluted with chemical runoff and the air fills with industrial smog.
🗑️ Waste = Wasted Energy ➡️ Throwing away an aluminum can doesn't just waste metal; it wastes the massive amount of electrical energy required to forge it!

When you throw away food, you are literally throwing away the diesel used by the tractor, the electricity used by the refrigerator, and the water used on the farm.`,
    category: 'energy',
    difficulty: 'intermediate',
    points: 50,
    duration: 8,
  },
  {
    title: 'Sustainable Solutions',
    chapter: 70,
    description: 'The circular economy model that saves environments and wallets.',
    content: `🌞 MODULE 4: THE CIRCULAR ECONOMY 🌞 (🚀 CORE WINNING PART)

To fix this, we shift from a straight line (Take-Make-Trash) to a true circle.

♻️ 1. REDUCE, REUSE, RECYCLE:
The ultimate hierarchy. First, buy less. Second, use it multiple times. Third, break it down and forge it into something new.

🔌 2. ENERGY-EFFICIENT APPLIANCES:
A modern 5-star inverter refrigerator uses 60% less energy than a 15-year-old model. It actively pays for itself in electrical savings within 3 years.

🌿 3. SUSTAINABLE ZERO-WASTE PRODUCTS:
Bamboo toothbrushes, biodegradable packaging, and buying bulk grains using your own glass jars.

RESULTS: 📉 Drastically slashed monthly utility bills | 🌍 Millions of tons of plastic diverted from the oceans!`,
    category: 'energy',
    difficulty: 'intermediate',
    points: 80,
    duration: 10,
  },
  {
    title: 'Smart Lifestyle Habits & Suggestions',
    chapter: 71,
    description: 'Daily algorithmic checks to dramatically cut your carbon footprint.',
    content: `🧠 MODULE 5: THE DAILY GUARDIAN 🧠

Sustainability is not an event. It is a daily automated habit.

[ ✅ YOUR DAILY ECO-CHECKLIST ]
[ ] Use a reusable tote bag at the grocery store.
[ ] Unplug chargers physically from the wall when devices reach 100%.
[ ] Limit meat consumption to 4 days a week (saves thousands of gallons of water).
[ ] Wash clothes in cold water. (Heating water accounts for 90% of a washing machine's load!)

[ 💡 SMART PRODUCT SUGGESTIONS ]
Instead of: Standard LED Bulbs (9W) -> Buy: Smart IoT Bulbs that auto-dim based on daylight.
Instead of: Plastic Tupperware -> Buy: Borosilicate Glass (Lasts an entire lifetime).`,
    category: 'sustainability',
    difficulty: 'advanced',
    points: 60,
    duration: 12,
  },
  {
    title: 'Eco Score & Consumption Tracker',
    chapter: 72,
    description: 'Real-time interactive waste tracking and localized recycling mapping.',
    content: `📊 MODULE 6: THE ECO-SCORE TERMINAL 📊 (🔥 MUST ADD)

[ 🗑️ WASTE TRACKER + ANALYZER ]
User Input:
Food discarded this week: 3kg (Mostly expired vegetables)
Electricity Usage: 140 kWh/month
Plastic Usage: 10 Bags

🤖 APP DIAGNOSTIC: "You are currently wasting roughly 30% of your purchased food."
👉 TIP TO REDUCE: Map out your meals on Sunday. Freeze vegetables immediately if you cannot eat them within 4 days!

[ 🌍 OVERALL ECO-SCORE ] (🚀 VERY IMPRESSIVE)
Based on your metrics, you are currently operating at:
SCORE: 78 / 100 (B-Grade Sustainability)
Drop your food waste by an additional 1kg a week to reach A-Grade!

[ 📍 RECYCLING LOCATOR ]
Scanning GPS coordinates...
🟢 FOUND: E-Waste drop-off center 2 miles West. (Recycle old batteries and phones here!)
🟢 FOUND: Organic Compost community bin 0.5 miles East.

Complete the master assessment below to definitively claim your "Eco Saver" and "Sustainability Champion" Badges!`,
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
      sdgNumber: 12, // Map to SDG 12 (Responsible Consumption & Production)
      slug: (l.title + ' responsible consumption').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }));

    // Delete existing SDG 12 lessons to prevent duplicates
    await Lesson.deleteMany({ sdgNumber: 12 });
    
    await Lesson.insertMany(lessonsWithSlugs);
    
    console.log('🟢 6 "Responsible Consumption & Production" (SDG 12) Gamified Lessons Injected Successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Insertion failed:', error);
    process.exit(1);
  }
};

seedDB();
