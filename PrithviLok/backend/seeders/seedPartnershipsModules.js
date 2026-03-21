import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Lesson from '../models/Lesson.js';

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB Connected for Partnerships for the Goals Seeding'))
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

const lessons = [
  {
    title: 'What are Partnerships?',
    chapter: 97, // Continuation after SDG 16 which ended at 96
    description: 'The foundation of collective action to survive and thrive on Earth.',
    content: `🟢 MODULE 1: THE COLLECTIVE ENGINE 🟢

No nation, company, or individual is wealthy or powerful enough to stop a planetary climate crisis by themselves. Achieving the Sustainable Development Goals requires an unprecedented level of global partnership.

🤝 WHAT PARTNERSHIP MEANS:
• Collaboration: Sharing critical technology instead of hiding it behind patents.
• Resource Pooling: Combining government budgets with private-sector agility.
• Shared Truth: Committing globally to the identical goal of saving the planet.

📋 MICRO-QUIZ: 
Q: What is the absolute core requirement of SDG 17?
1️⃣ A single wealthy nation taking complete control over all global decisions
2️⃣ Disconnecting local economies to focus only on oneself
3️⃣ Connecting governments, private businesses, and everyday citizens to pool massive resources together

(Correct Answer: 3. The crisis is global, therefore the solution must be united!)`,
    category: 'sdg',
    difficulty: 'beginner',
    points: 30,
    duration: 5,
  },
  {
    title: 'Why Partnerships are Important',
    chapter: 98,
    description: 'Understanding the severe limitations of localized isolationism.',
    content: `🌍 MODULE 2: THE ISOLATION FALLACY 🌍

A single person installing solar panels is fantastic, but it won’t stop global warming if their local government is simultaneously constructing three new coal power plants.

⚠️ THE TRIFECTA NECESSITY:
🏛️ Governments must pass the laws and offer the massive land use required.
💼 Companies must invent and mass-produce the green technology cheaply.
👤 Citizens must demand the laws, buy the products, and actively recycle.

Real-World Example: The "International Space Station" is the single greatest example of human partnership. Rivals on Earth shared trillions of dollars and scientific data to build a sovereign laboratory in the sky. To save Earth, we must replicate that exact exact collaborative spirit!`,
    category: 'sdg',
    difficulty: 'beginner',
    points: 40,
    duration: 6,
  },
  {
    title: 'Link Partnerships with Energy & Sustainability',
    chapter: 99,
    description: 'How organizational synergy instantly deploys advanced infrastructure.',
    content: `⚡ MODULE 3: THE SYNERGY PIPELINE (KEY CONNECTION) ⚡

How does electricity fundamentally connect these macro-organizations?

🔄 PARTNER ➡️ SOLUTION ➡️ IMPACT (Flow Diagram)

🤝 Partnership 1: Solar Companies + Rural End-Users 
➡️ Solution: Micro-finance loans for rooftop solar arrays. 
📈 Impact: Universal energy access and eradication of kerosene smoke.

🤝 Partnership 2: Government Regulators + Citizens
➡️ Solution: The government provides tax-rebates for EV purchases based on citizen demand.
📈 Impact: Exponentially cleaner urban air and rapid national infrastructure upgrades.

🤝 Partnership 3: NGOs + Vulnerable Communities
➡️ Solution: Distributing free bio-sand water filters.
📈 Impact: Wiped out local Dysentery and drastically massive social health impact.`,
    category: 'energy',
    difficulty: 'intermediate',
    points: 50,
    duration: 8,
  },
  {
    title: 'Digital Collaboration Platform',
    chapter: 100,
    description: 'The technological nexus bridging all humanity together into one operational force.',
    content: `🌐 MODULE 4: THE APEX NETWORK 🌐 (🚀 CORE WINNING PART)

To partner effectively, humanity requires a flawless, zero-friction digital communication grid. Enter the Collaboration Platform.

We must connect all 4 pillars of civilization on one active app:
👤 USERS: Post local daily issues, log impact hours, and vote.
🏢 NGOs: Identify verified crises and deploy volunteer squads.
🏛️ GOVERNMENTS: Issue broad algorithmic data sets and transparent funding.
💼 COMPANIES: Sponsor NGO tasks and deploy their massive proprietary tech for free.

When a citizen discovers a dying coral reef, they log it. The NGO verifies it. The Company builds the coral-growth tech. The Government funds the 10-year deployment. 

This alone solves the Earth's crisis.`,
    category: 'energy',
    difficulty: 'intermediate',
    points: 80,
    duration: 10,
  },
  {
    title: 'SDG Progress Dashboard & Global Map',
    chapter: 101,
    description: 'Analyze real-world, peer-reviewed macro-data to optimize planetary deployment.',
    content: `📊 MODULE 5: THE PLANETARY DASHBOARD 📊 (🔥 POWERFUL FEATURE)

[ 🌍 GLOBAL COMMUNITY MAP ]
GPS Scan Active: Mapping 500,000 live SDG projects globally...
📍 Brazil: Active NGO operation replanting 2M trees in the Amazon this month!
📍 India: Government subsidies currently equipping 40,000 rural farmers with solar pumps!
📍 Germany: Private Sector companies successfully closed down 4 coal hubs this year!

[ 📈 SDG PROGRESS DASHBOARD ]
Analyzing PrithviLok App's Global Contributions:
SDG 1 (No Poverty): 45% Complete
SDG 7 (Clean Energy): 88% Complete
SDG 14 (Life Below Water): 23% Complete (⚠️ Requires Immediate Partnership Focus!)

Data reveals the exact planetary weaknesses. The community rallies to correct them.`,
    category: 'sustainability',
    difficulty: 'advanced',
    points: 60,
    duration: 12,
  },
  {
    title: 'Collaboration Hub & Funding System',
    chapter: 102,
    description: 'Directly fund and participate in the grandest mission in human history.',
    content: `🤝 MODULE 6: THE COMMAND NEXUS 🤝 (🔥 MUST ADD)

You have completed 16 modules. You possess the elite terminal knowledge. Now, you act.

[ 💡 THE COLLABORATION HUB ]
Post ID: #9942
User Alert: "Need 5kW solar installation in mountain village Sector B. Winters are freezing here."
🔗 Match Found: "SunTech Corp" has agreed to provide the panels at 60% discount!
🔗 Match Found: "GreenHand NGO" is deploying 4 technicians to install it tomorrow!

[ 💰 FUNDING & SUPPORT SYSTEM ]
The remaining 40% cost for Post #9942 requires $1,500. 
Crowdfunding active... 840 users contributed! 
✅ TARGET MET! Project fully sponsored! 

[ 🏛️ NGO & GOVERNMENT CONNECT ]
Verified active grant: "State EV Subsidy" - Apply your newly learned skills here to claim it!

Take the final, ultimate AI Assessment below. Prove your universal mastery. Shatter your limits and unlock your final, permanent badges: "Global Collaborator" and "Change Maker". 

WELCOME TO PRITHIVLOK.`,
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
      sdgNumber: 17, // Map to SDG 17 (Partnerships for the Goals)
      slug: (l.title + ' partnerships for goals').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }));

    // Delete existing SDG 17 lessons to prevent duplicates
    await Lesson.deleteMany({ sdgNumber: 17 });
    
    await Lesson.insertMany(lessonsWithSlugs);
    
    console.log('🟢 6 "Partnerships for the Goals" (SDG 17) Gamified Lessons Injected Successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Insertion failed:', error);
    process.exit(1);
  }
};

seedDB();
