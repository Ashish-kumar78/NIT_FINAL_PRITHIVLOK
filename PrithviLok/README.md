# PrithviLok 🌍
**Decentralized Sustainability Platform (MERN 2-Mono Architecture)**

PrithviLok is a full-stack platform focused on environmental sustainability. It leverages the MERN stack and Polygon Blockchain (Web3) for minting Eco NFTs as users generate impact.

## System Architecture

- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Node.js + Express + MongoDB
- **Real-time Engine**: Socket.io (for chat & dustbin reports)
- **Blockchain**: Solidity (EcoNFT dynamically upgraded based on user actions)

## Features Included

- **Home Dashboard**: Real-time mock AQI, WQI, and Weather using Recharts
- **Dustbin Locator**: Leaflet map for finding & adding reported dustbins
- **OTP Auth**: Email verification flow with Nodemailer
- **Web3 Login**: Password-less MetaMask connect
- **Community Chat**: Real-time room-based discussion & posting
- **Learning Platform**: Educational lessons that award Eco Points
- **Leaderboard**: Gamified system tracking total impact
- **Eco NFT Engine**: Dynamic NFTs assigned / upgraded based on user level

## Pre-Requisites

Make sure you have:
1. Node.js (v18+)
2. MongoDB running locally or a MongoDB Atlas URI
3. MetaMask installed as a browser extension (for Web3 testing)

## Setup & Running Locally

### 1. Database Seed
To populate the DB with mock users, dustbins, and community posts:
```bash
cd backend
npm run seed
```

### 2. Run the Backend
Configure the `backend/.env` file. You will need to add a real Google app password if you want emails to actually arrive, otherwise the development OTP won't trigger an email but will log in console.
```bash
cd backend
npm run dev
```
Backend runs on port `5000`.

### 3. Run the Frontend
```bash
cd frontend
npm run dev
```
Open `http://localhost:5173` to view the platform.

### Smart Contract Development
The smart contract `EcoNFT.sol` is located under `blockchain/contracts`. It is an ERC721 dynamic NFT structure written in Solidity. You can compile & deploy it using Hardhat or Remix.

---
**Made with ❤️ for the Earth.**
