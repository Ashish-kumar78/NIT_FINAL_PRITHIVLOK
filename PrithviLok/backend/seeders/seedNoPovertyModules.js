import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Lesson from '../models/Lesson.js';

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB Connected for Seeding'))
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

const lessons = [
  {
    title: 'What is Poverty?',
    chapter: 1,
    description: 'Understanding the cycle of poverty and real-world impacts.',
    content: `🟢 MODULE 1: THE INVISIBLE CHAINS 🟢

In its simplest form, poverty is having no money for food, shelter, or electricity. 

Consider a village disconnected from the grid:
🏠 No electricity means children cannot study after sunset.
🏥 No electricity means clinics cannot store vaccines in refrigerators.
🍞 No electricity means no way to process or store food safely for the winter.

💡 DID YOU KNOW? 
Over 700 million people globally still live without access to electricity, keeping them trapped in a cycle where they cannot use modern tools to scale their local economy.

📋 SHORT QUIZ CHECK 📋
Q: What is a direct consequence of a village having no electricity?
1️⃣ Increased agricultural output
2️⃣ The inability to safely store medicine and food
3️⃣ Lower emissions

(If you guessed 2, you're right! Poverty is deeply intertwined with energy access.)
`,
    category: 'sdg',
    difficulty: 'beginner',
    points: 30,
    duration: 5,
  },
  {
    title: 'Link Poverty with Energy',
    chapter: 2,
    description: 'Explore how energy acts as a catalyst for economic independence.',
    content: `⚡ MODULE 2: THE ENERGY CATALYST ⚡

Without energy, there is no escape. 
No electricity ➡️ no modern jobs ➡️ poverty continues.

Take a look at the drastic difference energy makes:

❌ BEFORE ENERGY:
🌑 No light = No studying late, limiting educational growth.
🪵 No machines = Manual labor only, preventing businesses from scaling.
🔥 Toxic smoke = Cooking over open fires causes severe health complications.

✨ AFTER ENERGY:
💡 LED Lights = Children study safely at night.
⚙️ Motorized Tools = Blacksmiths, tailors, and carpenters quadruple their productivity.
💻 Internet Access = Villagers can check global market prices for their crops.

Energy is not just power to turn on a light; it is the power to generate an income.`,
    category: 'energy',
    difficulty: 'beginner',
    points: 40,
    duration: 8,
  },
  {
    title: 'Green Energy as Solution',
    chapter: 3,
    description: 'Why solar, wind, and biogas are the ultimate keys to poverty eradication.',
    content: `🌞 MODULE 3: THE GREEN SOLUTION 🌞

Why is Green Energy the best solution for impoverished regions? Because it is decentralized and free once established!

1️⃣ SOLAR PANELS (☀️)
Capture sunlight anywhere. A tiny panel is enough to power a house's lights and charge phones, completely replacing expensive, dangerous kerosene lamps.

2️⃣ WIND ENERGY (🌬️)
Small wind turbines can pump water from deep wells for entire agricultural communities, preventing drought-induced famine.

3️⃣ BIOGAS (🐄)
By capturing methane from animal manure, farmers get free, clean gas for cooking stoves, saving hours of firewood gathering each day!

🏆 THE THREE PILLARS OF GREEN ENERGY:
✔️ Free energy after setup
✔️ Saves immense amounts of money previously spent on dirty fuels
✔️ Creates high-tech local jobs (installation and maintenance)`,
    category: 'energy',
    difficulty: 'intermediate',
    points: 50,
    duration: 10,
  },
  {
    title: 'Earn with Green Energy',
    chapter: 4,
    description: 'How to turn renewable energy into an instant local business.',
    content: `💼 MODULE 4: BECOME A GREEN EARNER 💼 (🚀 HIGH IMPACT 🚀)

Green Energy isn't just about saving money; it is a mechanism for generating it! Impoverished communities can instantly boost their GDP using renewables.

💰 START EARNING - STEP-BY-STEP GUIDE:

👉 IDEA 1: Mobile Charging Station
Step 1: Buy a medium solar panel and a battery bank.
Step 2: Charge neighbors' smartphones in the village for a tiny fee.
Result: Instant daily income!

👉 IDEA 2: Solar Irrigation for Farmers
Step 1: Replace diesel water pumps with a solar-powered pump.
Step 2: Rent out the excess water to neighboring farms.
Result: Doubled crop yields and secondary rental income!

👉 IDEA 3: Sell Solar Electricity
In micro-grid networks, if your roof generates more solar power than you need, you can sell the surplus back to your neighbors through decentralized ledgers. 

(Badges you will earn here: "Green Earner" & "Energy Saver")`,
    category: 'lifestyle',
    difficulty: 'intermediate',
    points: 80,
    duration: 12,
  },
  {
    title: 'Smart Energy Usage',
    chapter: 5,
    description: 'Maximizing the impact of the energy you generate.',
    content: `📊 MODULE 5: SMART ENERGY OPTIMIZATION 📊

Tracking your electricity usage is the first step to financial freedom!
When you conserve energy, you lower bills and reduce grid-load.

🤖 AI SUGGESTIONS FOR YOUR HOME:
• Swap old bulbs for LED bulbs (Uses 75% less energy!)
• Turn off unused devices (Ghost power drains 10% of grids)
• Utilize natural sunlight during the day

📈 USAGE GRAPH [ASCII Simulation]:
WINTER ▇▇▇▇▇▇▇▇ 300kWh (High heating)
SPRING ▇▇▇ 110kWh
SUMMER ▇▇▇▇ 180kWh
AUTUMN ▇▇ 90kWh

By tracking smartly, a household can save up to $300/year—money that can be reinvested into education and health!`,
    category: 'sustainability',
    difficulty: 'advanced',
    points: 60,
    duration: 10,
  },
  {
    title: 'Government Schemes (India)',
    chapter: 6,
    description: 'Understanding Indian government subsidies for solar and rural electrification.',
    content: `🌍 MODULE 6: INDIAN GOVERNMENT SCHEMES 🇮🇳 🌍

The government of India provides massive subsidies to help people break out of energy poverty! 

🏛️ 1. PM Surya Ghar: Muft Bijli Yojana
Provides up to ₹78,000 subsidy to households to install rooftop solar panels, enabling 300 units of free electricity every month!
• Eligibility: Must own a house with a proper roof, valid electricity connection.

🏛️ 2. PM-KUSUM Scheme
Aims to add solar capacities in rural India via farmers. Heavily subsidizes standalone solar agriculture pumps to replace diesel.
• Eligibility: Farmers, panchayats, and cooperatives.

🏛️ 3. Deen Dayal Upadhyaya Gram Jyoti Yojana (DDUGJY)
Focuses on continuous rural electrification across India to ensure poverty is eradicated by giving 24/7 power to farmers and rural homes.

💡 Take Action: Visit the official MNRE portal to check your eligibility and claim your solar subsidies today! Start your green journey.`,
    category: 'sdg',
    difficulty: 'advanced',
    points: 100,
    duration: 15,
  },
];

const seedDB = async () => {
  try {
    // Generate slugs first so insertMany doesn't fail on unique constraint
    const lessonsWithSlugs = lessons.map(l => ({
      ...l,
      sdgNumber: 1,
      slug: l.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }));

    await Lesson.deleteMany({});
    await Lesson.insertMany(lessonsWithSlugs);
    
    console.log('🟢 6 "No Poverty" Gamified Lessons Injected Successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Insertion failed:', error);
    process.exit(1);
  }
};

seedDB();
