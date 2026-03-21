import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Lesson from '../models/Lesson.js';

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB Connected for Sustainable Cities & Communities Seeding'))
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

const lessons = [
  {
    title: 'What is a Sustainable City?',
    chapter: 61, // Continuation after SDG 10 which ended at 60
    description: 'Understanding the anatomy of a clean, hyper-efficient metropolis.',
    content: `🟢 MODULE 1: THE ECO-METROPOLIS 🟢

A Sustainable City is an urban area designed entirely to combat climate change, ensuring its population lives in complete harmony with the environment without sacrificing modern luxuries.

🏙️ THE FOUR PILLARS:
🌿 Clean Environment: Massive green parks that absorb CO2 block by block.
🚍 Efficient Transport: Seamless, electrified public transit instead of gridlocked cars.
🏠 Proper Housing: Affordable, well-insulated homes that natively conserve heat and cooling.
⚡ Energy-Efficient Systems: Solar-paneled roofs and completely decentralized grid arrays.

📋 MICRO-QUIZ: 
Q: What defines the transportation network of a true Sustainable City?
1️⃣ Eight-lane highways designed strictly for personal fossil-fuel vehicles
2️⃣ Interconnected, electric-powered mass transit (trains/buses) alongside dedicated bicycle highways
3️⃣ Helicopters for fast travel

(Correct Answer: 2. Mass electrified transit drops urban pollution by over 70% instantly!)`,
    category: 'sdg',
    difficulty: 'beginner',
    points: 30,
    duration: 5,
  },
  {
    title: 'Problems in Cities Today',
    chapter: 62,
    description: 'Diagnosing the critical failures of modern urbanization.',
    content: `🚫 MODULE 2: THE CONCRETE JUNGLE 🚫

Currently, cities occupy just 3% of the Earth's land, but account for a staggering 80% of global energy consumption and 75% of carbon emissions.

⚠️ REAL-LIFE URBAN FAILURES:
🌫️ Toxic Smog: Over 90% of urban populations currently breathe air that fails WHO safety standards, heavily degrading lung capacity.
🚗 Perpetual Traffic: Hundreds of thousands of idling gasoline cars create concentrated pockets of extreme thermal heat and nitrogen dioxide.
🗑️ Waste Collapse: Mega-cities generate thousands of tons of plastic daily, overflowing landfills and bleeding directly into nearby oceans.

The old method of "Build first, worry about the environment later" has resulted in cities that actively poison their own citizens.`,
    category: 'sdg',
    difficulty: 'beginner',
    points: 40,
    duration: 6,
  },
  {
    title: 'Link Cities with Energy',
    chapter: 63,
    description: 'How fossil-fueled urban planning suffocates the modern world.',
    content: `⚡ MODULE 3: THE HIGH-DENSITY BURN (KEY CONNECTION) ⚡

Cities are essentially massive energy vacuums. How they generate that energy dictates whether they survive or suffocate.

❌ BEFORE (Fossil-Fuel Cities):
🚫 Coal Generation ➡️ The city imports dirty power from 100 miles away, losing 15% of the electricity simply traveling across the transmission wires.
🚫 Poor Planning ➡️ High-rise glass buildings trap heat. Massive air conditioning units must burn millions of gallons of diesel just to keep the buildings cold.
🚫 Gasoline Transport ➡️ Millions of cars idle in gridlock, suffocating pedestrians and heating the atmosphere.

✅ AFTER (Sustainable Energy Cities):
💡 Solar Generation ➡️ Every skyscraper roof generates its own power! Zero transmission loss!
🔋 EV Transport ➡️ Traffic noise drops to near zero. Exhaust pollution is entirely eradicated.
♻️ Smart Planning ➡️ Buildings use reflective paint and natural wind-tunnels to cool themselves naturally!`,
    category: 'energy',
    difficulty: 'intermediate',
    points: 50,
    duration: 8,
  },
  {
    title: 'Green Energy Solutions',
    chapter: 64,
    description: 'The revolutionary upgrades transforming our urban landscapes.',
    content: `🌞 MODULE 4: THE URBAN UPGRADE 🌞 (🚀 CORE WINNING PART)

To save the metropolis, we must upgrade its core operating system to Green Tech!

🏢 SOLAR-POWERED BUILDINGS
Imagine a skyscraper where every single window is a transparent solar panel. The building doesn't just consume energy; it generates a surplus and sells it back to the grid!

💡 SMART STREET LIGHTS
Lights equipped with motion sensors that glow at 20% capacity, but instantly dial up to 100% when a pedestrian or EV approaches. Saves entire cities millions in taxes!

🚗 ELECTRIC VEHICLES (EVs) & PUBLIC TRANSIT
Replacing 500 individual gasoline cars with one high-speed electric magnetic-levitation train. 

RESULTS: 🌬️ Crystal Cleaner Air | 📉 Slashed Municipal Costs | 🚶 Better, Safer Living!`,
    category: 'energy',
    difficulty: 'intermediate',
    points: 80,
    duration: 10,
  },
  {
    title: 'Smart City Technologies & Traffic Simulator',
    chapter: 65,
    description: 'Interact with AI-driven urban planning algorithms.',
    content: `🧠 MODULE 5: THE INTERNET OF CITIES 🧠

Welcome to the "Future City" concept, entirely run by IoT (Internet of Things).

[ 🏙️ SMART CITY SIMULATOR ] (🚀 MUST ADD FEATURE)

User Selection: [ ❌ Normal City ]
Simulating: Traffic lights operate on dumb timers. 1,000 cars idle at red lights while no one crosses. Waste trucks drive to empty bins, burning diesel.
📉 OUTCOME: High Pollution, Severe Traffic delays.

User Selection: [ ✅ Sustainable City ]
Simulating: AI Traffic Cameras predict flow. Green lights stay open dynamically for EV buses. Trash cans have IoT weight-sensors; trucks only drive to bins that are 100% full!
📈 OUTCOME: Traffic flow increased 40%. Pollution eradicated. Quality of Life maxed!

[ 🚗 GREEN TRANSPORT PLANNER ]
User Route: Home -> Downtown Office
👉 App Suggests: Take the electric tram at 8:02 AM. Walk the remaining 3 blocks. (Saves $4 and prevents 2kg of CO2!)`,
    category: 'sustainability',
    difficulty: 'advanced',
    points: 60,
    duration: 12,
  },
  {
    title: 'City Sustainability Dashboard & Hub',
    chapter: 66,
    description: 'Analyze real-time municipal data and report local community breakdowns.',
    content: `📊 MODULE 6: THE MAYORAL DASHBOARD 📊 (🔥 UNIQUE FEATURE)

You are now a verified Smart Citizen. Use your community hub to direct municipal action!

[ 📈 CITY SUSTAINABILITY DASHBOARD ]
☁️ Sector 4 Pollution Level: 12 AQI (Excellent)
⚡ Sector 4 Energy Usage: 400 MW (85% supplied by Renewables)
🚗 Traffic Status: Route 9 moving at optimal speeds.

[ 📢 COMMUNITY PARTICIPATION HUB ]
Build the community up!
👉 User Report 1: "Smart street lamp broken on 5th Ave." (Status: 🟢 Dispatched)
👉 User Report 2: "Public recycling bin overflowing near Central Park." (Status: 🟡 Re-routing IoT Waste Truck)
👉 Suggest Improvement: "We should add a dedicated bike lane to Elm Street." (Status: 🗳️ Up-voted by 400 community members)

Prove your elite status! Complete the final City Assessment below to secure your highly coveted "Smart Citizen" and "Green Builder" Badges!`,
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
      sdgNumber: 11, // Map to SDG 11 (Sustainable Cities & Communities)
      slug: (l.title + ' sustainable cities communities').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }));

    // Delete existing SDG 11 lessons to prevent duplicates
    await Lesson.deleteMany({ sdgNumber: 11 });
    
    await Lesson.insertMany(lessonsWithSlugs);
    
    console.log('🟢 6 "Sustainable Cities & Communities" (SDG 11) Gamified Lessons Injected Successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Insertion failed:', error);
    process.exit(1);
  }
};

seedDB();
