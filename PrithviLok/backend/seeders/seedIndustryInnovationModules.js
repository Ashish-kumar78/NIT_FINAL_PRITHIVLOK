import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Lesson from '../models/Lesson.js';

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB Connected for Industry, Innovation & Infrastructure Seeding'))
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

const lessons = [
  {
    title: 'What is Infrastructure?',
    chapter: 49, // Continuation after SDG 8 which ended at 48
    description: 'The physical and digital backbone of human civilization.',
    content: `🟢 MODULE 1: THE BACKBONE OF SOCIETY 🟢

Infrastructure is the fundamental facilities and systems serving a country, city, or area. Without it, development is impossible.

🏗️ TYPES OF INFRASTRUCTURE:
🛣️ Roads & Bridges: Transporting goods and people.
🏢 Buildings & Factories: Housing the economy and population.
🌐 The Internet: The digital highway of global knowledge.
⚡ The Energy Grid: The blood that keeps every other system alive.

📋 MICRO-QUIZ: 
Q: Which of the following is considered the most critical foundational infrastructure that powers all others?
1️⃣ A local bakery building
2️⃣ An asphalt highway
3️⃣ A reliable electrical power grid

(Correct Answer: 3. Without power, the internet dies, factories freeze, and cities shut down completely!)`,
    category: 'sdg',
    difficulty: 'beginner',
    points: 30,
    duration: 5,
  },
  {
    title: 'Problems Today',
    chapter: 50,
    description: 'Deconstructing the massive failure points in modern structural design.',
    content: `🚫 MODULE 2: SYSTEMIC FRAGILITY 🚫

Why do so many global infrastructures collapse under pressure?

⚠️ 1. Rural Exclusion
Millions of villages lack basic paved roads, making it impossible to transport emergency medical supplies or export farming goods.

⚠️ 2. The Power Shortage
Rolling blackouts completely destroy industrial output. A factory losing power for 3 hours a day loses 20% of its yearly revenue.

⚠️ 3. Outdated, Toxic Industries
Many massive steel and concrete plants still operate using 1950s tech, heavily polluting local rivers and skyways rather than innovating.

Real-life Example: A hospital in a developing nation has an advanced MRI machine, but because the local grid is outdated and constantly surges, the machine is fried and useless.`,
    category: 'sdg',
    difficulty: 'beginner',
    points: 40,
    duration: 6,
  },
  {
    title: 'Link Infrastructure with Energy',
    chapter: 51,
    description: 'How true infrastructural evolution demands infinite green power.',
    content: `⚡ MODULE 3: THE IMPERATIVE OF POWER (KEY CONNECTION) ⚡

Infrastructure is just metal and wire until energy breathes life into it.

❌ BEFORE (Fossil Fuel & Rolling Blackouts):
🚫 No Electricity ➡️ Manufacturing plants sit idle, halting economic export.
🚫 No Power ➡️ Telecommunication towers die; rural populations lose internet access.
🚫 Expensive Energy ➡️ Cities cannot afford to run streetlights or water treatment plants at night.

✅ AFTER (Green & Infinite Energy):
💡 Factories run 24/7 on robust, local solar/wind generation!
💻 The Internet NEVER goes down, because server farms are powered by geothermal and 100% renewables.
🏗️ Development accelerates exponentially because energy is no longer a restricted bottleneck!`,
    category: 'energy',
    difficulty: 'intermediate',
    points: 50,
    duration: 8,
  },
  {
    title: 'Green Energy Infrastructure',
    chapter: 52,
    description: 'Designing the invincible Smart Cities of tomorrow.',
    content: `🌞 MODULE 4: ARCHITECTURE 2.0 🌞 (🚀 CORE WINNING PART)

We must stop building dumb buildings and start building smart, living infrastructure!

⚡ THE SMART GRID (The Internet of Energy):
Instead of power flowing one way from a massive coal plant, a smart grid allows thousands of homes with solar panels to share and sell power to each other instantly using AI.

🏢 SOLAR-POWERED BUILDINGS (Zero-Emission Architecture):
Entire skyscrapers completely wrapped in solar-glass. They generate 100% of their own cooling and lighting internally!

🚗 EV CHARGING NETWORKS:
Gas stations replaced by ultra-fast induction chargers powered entirely by overhead wind turbines.

📈 THE RESULTS: Lightning-fast development | Absolutely zero pollution | Systems that repair themselves automatically!`,
    category: 'energy',
    difficulty: 'intermediate',
    points: 80,
    duration: 10,
  },
  {
    title: 'Innovation & Technology + Smart City Simulator',
    chapter: 53,
    description: 'Engage with IoT and automate energy efficiency using Artificial Intelligence.',
    content: `🤖 MODULE 5: THE SMART CITY SIMULATION 🤖 (🔥 VERY IMPRESSIVE)

Innovation meets infrastructure. Let's see how much impact AI has on urban planning!

[ 🏙️ SMART CITY SIMULATION UI ]
User Selects Base: [ Dense Metropolis ]

🔴 WITHOUT GREEN INNOVATION:
Traffic gridlocked. Smog levels toxic. Fossil-fuel grid operating at 99% capacity (Implosion imminent). Jobs stagnant.

✅ WITH GREEN AI INNOVATION APPLIED:
🔄 IoT Streetlights dim automatically when roads are empty (Saves 40% power).
🤖 AI dynamically routes EV traffic to avoid congestion.
☀️ Rooftop solar covers 70% of the city peak-load.
📈 POLLUTION: DOWN 80% | 💼 HIGH-TECH JOBS: UP 300% | 🏗️ GROWTH: ENORMOUS.

This is the power of the "Internet of Things" (IoT). Devices talking to each other to save the planet.`,
    category: 'sustainability',
    difficulty: 'advanced',
    points: 60,
    duration: 12,
  },
  {
    title: 'Infrastructure Planner & Startup Hub',
    chapter: 54,
    description: 'Generate advanced structural plans and launch your startup idea.',
    content: `📊 MODULE 6: THE INNOVATION COMMAND CENTER 📊 (🔥 BIG IMPACT)

You have the knowledge. Now you must plan the execution.

[ 🏗️ INFRASTRUCTURE PLANNER ]
User Input: [ Rural Village / Budget: Medium ]
🤖 AI BLUEPRINT RENDERED:
1. Deploy a 5kW Solar Micro-Grid.
2. Install a Smart Water-Pump hooked to a central IoT sensor.
3. Result: Absolute energy independence and disease eradication.

[ 💡 INNOVATION IDEA GENERATOR ]
User Problem Input: "Vast amounts of local food wasting."
🧠 AI SUGGESTION: Build a Solar-Powered Cold Storage startup and rent out space to farmers! Connects directly with Economic Growth (SDG 8)!

[ 📈 INFRASTRUCTURE IMPACT DASHBOARD ]
Location: Your Node
⚡ Energy Generated: 340 kWh
🌱 Pollution Prevented: 4.2 Tons of CO2
🏗️ Development Index Score: 94 / 100 (Advanced)

Pass the final Assessment below to definitively prove your architectural prowess, entirely unlocking your "Innovator" and "Smart Builder" Badges!`,
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
      sdgNumber: 9, // Map to SDG 9 (Industry, Innovation & Infrastructure)
      slug: (l.title + ' industry innovation infrastructure').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }));

    // Delete existing SDG 9 lessons to prevent duplicates
    await Lesson.deleteMany({ sdgNumber: 9 });
    
    await Lesson.insertMany(lessonsWithSlugs);
    
    console.log('🟢 6 "Industry, Innovation & Infrastructure" (SDG 9) Gamified Lessons Injected Successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Insertion failed:', error);
    process.exit(1);
  }
};

seedDB();
