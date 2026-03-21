import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Lesson from '../models/Lesson.js';

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB Connected for Peace, Justice & Strong Institutions Seeding'))
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

const lessons = [
  {
    title: 'What is Peace & Justice?',
    chapter: 91, // Continuation after SDG 15 which ended at 90
    description: 'Understanding the bedrock of transparent laws and human safety.',
    content: `🟢 MODULE 1: THE SOCIAL CONTRACT 🟢

Peace and Justice are not just the absence of war. They represent the active presence of fair laws, safety, equality, and uncorrupted, strong institutions guarding those rights.

⚖️ THE THREE PILLARS:
1️⃣ Equal Rights: Everyone is treated perfectly equally under identical laws.
2️⃣ Safety & Security: Zero fear of systemic violence or abuse of power.
3️⃣ Strong Institutions: Police, courts, and governments that cannot be bought or corrupted.

📋 MICRO-QUIZ: 
Q: Which scenario represents a truly Strong Institution?
1️⃣ A court system that allows the wealthy to pay fines to avoid prison time
2️⃣ A government that forces all citizens to agree with their laws without voting
3️⃣ A digital public ledger where every single government dollar spent is tracked and visible to all citizens

(Correct Answer: 3. Total transparency guarantees absolute justice!)`,
    category: 'sdg',
    difficulty: 'beginner',
    points: 30,
    duration: 5,
  },
  {
    title: 'Problems Today',
    chapter: 92,
    description: 'Deconstructing the devastating effects of rampant corruption and gridlock.',
    content: `🚫 MODULE 2: SYSTEMIC DECAY 🚫

A society can have infinite clean energy and still fail if its institutions rot from the inside out.

⚠️ 1. Institutional Corruption
When officials steal public tax money, schools aren't built, roads aren't repaired, and hospitals lack equipment.

⚠️ 2. The Black Box (Lack of Transparency)
When citizens cannot see how their laws are passed or how their money is spent, massive inequality instantly festers.

⚠️ 3. Rural Exclusion
A farmer deep in the mountains has their land illegally seized. Because there are no physical courts nearby, they have absolutely zero access to justice or help.`,
    category: 'sdg',
    difficulty: 'beginner',
    points: 40,
    duration: 6,
  },
  {
    title: 'Link Institutions with Energy & Tech',
    chapter: 93,
    description: 'How robust digital grids eradicate human corruption entirely.',
    content: `⚡ MODULE 3: THE DIGITAL GOVERNOR (KEY CONNECTION) ⚡

How do you stop a corrupt official from manipulating paper records? You eliminate the paper. This requires uninterrupted electricity.

❌ BEFORE (Analogue Gridlock):
🚫 No Electricity ➡️ Government files are stored in physical paper folders, easily "lost" or burned.
🚫 No Internet ➡️ Rural citizens must travel 4 days simply to file a basic police report.
🚫 Weak Systems ➡️ Massive inequality flourishes in the dark.

✅ AFTER (The Transparent Digital Grid):
💡 Instant Tracking ➡️ Digital governance platforms powered by 24/7 clean energy use blockchain to record land ownership permanently.
📱 Global Access ➡️ That rural farmer files a supreme court injunction directly from their solar-charged smartphone!

Without reliable energy, digital justice is completely impossible.`,
    category: 'energy',
    difficulty: 'intermediate',
    points: 50,
    duration: 8,
  },
  {
    title: 'Smart & Transparent Systems',
    chapter: 94,
    description: 'The technological architecture of absolute systemic integrity.',
    content: `🌐 MODULE 4: ARCHITECTURE OF TRUTH 🌐 (🚀 CORE WINNING PART)

We can build systems that make corruption literally mathematically impossible.

📱 DIGITAL GOVERNANCE PLATFORMS
Citizens vote, pay taxes, and access health records through unified smartphone apps. No middlemen. No bribes. 

🚦 ONLINE COMPLAINT DISPATCH
Pothole on your street? Snap a photo. AI routes it directly to the local repair crew, completely bypassing bureaucratic red tape.

📈 PUBLIC SERVICE TRACKING
Every single tax dollar spent on a local school is logged publicly on a digital ledger. Any citizen can audit their city hall instantly using the open internet.

RESULTS: ⬆️ Total Transparency | ⬇️ Extinguished Corruption | ⬆️ Universal Access`,
    category: 'energy',
    difficulty: 'intermediate',
    points: 80,
    duration: 10,
  },
  {
    title: 'Trust & Security Hub',
    chapter: 95,
    description: 'Securing your identity and casting localized community votes.',
    content: `🔐 MODULE 5: THE CITIZEN KEY 🔐

Digital systems must be impenetrable to maintain justice.

[ 🛡️ LEGAL AWARENESS & SECURITY ]
Your data is your ultimate sovereignty. 
• Basic Rights: No institution may access your GPS or health data without explicit, cryptographic consent.
• Security Tips: Utilize Hardware 2FA (Two-Factor Authentication) for all Gov-Apps.

[ 🗳️ COMMUNITY VOTING SYSTEM ]
Test the localized DAO (Decentralized Autonomous Organization)!
Action Required: "Your district has a $100,000 budget surplus. Where should it go?"
[ ] Option A: Construct an Electric Bus Route (45% Votes)
[✓] Option B: Upgrade the Hospital Solar Grid (55% Votes)
✅ VOTE CAST. The blockchain is updating the municipal smart contract.

Citizens don't just complain; they architect the solution!`,
    category: 'sustainability',
    difficulty: 'advanced',
    points: 60,
    duration: 12,
  },
  {
    title: 'Governance Dashboard & Public Reporting',
    chapter: 96,
    description: 'The ultimate Hackathon nexus tracking everything from water to electricity.',
    content: `📊 MODULE 6: THE COMMAND CENTER 📊 (💥 MUST ADD)

Welcome to the ultimate transparent nexus connecting all previous SDGs! 

[ 🚨 PUBLIC ISSUE REPORTING SYSTEM ]
Select Issue Type:
[ ] 💧 Broken Water Main (Connects to SDG 6)
[ ] ⚡ Transformer Exploded (Connects to SDG 7)
[✓] 🗑️ Illegal Dumping (Connects to SDG 12)
Upload GPS Photo -> Submit. 
Status: 🟢 Dispatched!

[ 📈 TRANSPARENCY & GOVERNANCE DASHBOARD ]
City of PrithviLok Metrics:
• Active Service Requests: 34
• Complaints Status: 12 Open | 145 Resolved
• Average Response Time: 4.2 Hours (Ranked: A+)
• Government Approval Rating: 94%

Step up to the final AI Assessment below to formally ratify your knowledge, claiming the prestigious "Justice Champion" and "Responsible Citizen" Badges forever!`,
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
      sdgNumber: 16, // Map to SDG 16 (Peace, Justice & Strong Institutions)
      slug: (l.title + ' peace justice strong institutions').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }));

    // Delete existing SDG 16 lessons to prevent duplicates
    await Lesson.deleteMany({ sdgNumber: 16 });
    
    await Lesson.insertMany(lessonsWithSlugs);
    
    console.log('🟢 6 "Peace, Justice & Strong Institutions" (SDG 16) Gamified Lessons Injected Successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Insertion failed:', error);
    process.exit(1);
  }
};

seedDB();
