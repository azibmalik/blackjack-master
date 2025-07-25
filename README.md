# Card Game Master 🃏

A polished, modern multiplayer card game featuring **Texas Hold'em Poker** and **Blackjack** with real-time probability calculations and networking capabilities.

![Card Game Master](https://img.shields.io/badge/Game-Card%20Master-blue)
![Multiplayer](https://img.shields.io/badge/Multiplayer-WebSocket-green)
![Probability](https://img.shields.io/badge/Probability-Real--time-orange)

## ✨ Features

### 🎮 Game Modes
- **Texas Hold'em Poker**: Full implementation with community cards, betting rounds, and hand evaluation
- **Blackjack**: Classic 21 with dealer AI and basic strategy recommendations

### 🧮 Probability & Statistics
- **Real-time odds calculation** for both games
- **Pot odds** and **winning probability** for Poker
- **Bust probability** and **optimal actions** for Blackjack
- **Expected value** calculations
- **Outs counting** and hand improvement probabilities

### 🌐 Multiplayer Networking
- **WebSocket-based** real-time communication
- **Automatic game matching** and room creation
- **Live chat** with system messages
- **Player management** with join/leave handling

### 🎨 Modern UI/UX
- **Responsive design** that works on desktop and mobile
- **Smooth animations** and card transitions
- **Real-time notifications** and feedback
- **Professional card graphics** with suit symbols
- **Dark theme** with gradient backgrounds

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd card-game-master
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development servers**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001

## 🎯 How to Play

### Texas Hold'em Poker
1. **Join a game** and wait for other players
2. **Receive 2 hole cards** dealt face down
3. **Betting rounds**:
   - Pre-flop: Bet with your hole cards
   - Flop: 3 community cards revealed
   - Turn: 4th community card
   - River: 5th community card
4. **Actions available**:
   - **Fold**: Give up your hand
   - **Check**: Pass without betting (if no bet to call)
   - **Call**: Match the current bet
   - **Raise**: Increase the bet
5. **Best 5-card hand** wins the pot

### Blackjack
1. **Place your bet** using the slider
2. **Receive 2 cards** (dealer gets 1 visible, 1 hidden)
3. **Actions available**:
   - **Hit**: Take another card
   - **Stand**: Keep your current hand
   - **Double**: Double your bet and take one card
4. **Beat the dealer** to 21 without going over
5. **Dealer hits** on 16 and below, stands on 17+

## 📊 Probability Features

### Poker Statistics
- **Winning Probability**: Your chance to win the hand
- **Outs**: Number of cards that improve your hand
- **Pot Odds**: Ratio of pot size to call amount
- **Hand Improvement**: Chances for pairs, straights, flushes, etc.

### Blackjack Statistics
- **Bust Probability**: Chance of going over 21
- **Dealer Bust**: Probability dealer will bust
- **Optimal Action**: Best move based on basic strategy
- **Expected Value**: Long-term value of your decision

## 🛠️ Technical Architecture

### Backend (Node.js + Express + Socket.IO)
```
server/
├── index.js              # Main server with Socket.IO
├── gameEngine.js         # Core game logic
└── probabilityCalculator.js # Probability calculations
```

### Frontend (Vanilla JavaScript + Vite)
```
src/
├── main.js               # Main application logic
├── gameUI.js             # UI management
├── notificationManager.js # User notifications
├── chatManager.js        # Chat functionality
└── styles/
    └── main.css          # Complete styling
```

### Key Technologies
- **Backend**: Node.js, Express, Socket.IO
- **Frontend**: Vanilla JavaScript, Vite
- **Styling**: CSS3 with Flexbox/Grid
- **Real-time**: WebSocket communication
- **Math**: Probability calculations and game theory

## 🎨 UI Components

### Game Interface
- **Welcome Screen**: Game selection with animated cards
- **Game Table**: Central playing area with community cards
- **Player Areas**: Individual player cards and chips
- **Action Controls**: Game-specific buttons and betting
- **Probability Panel**: Real-time statistics sidebar
- **Chat Panel**: Collapsible multiplayer chat

### Responsive Design
- **Desktop**: Full-featured interface with side panels
- **Tablet**: Optimized layout with touch-friendly controls
- **Mobile**: Streamlined interface for smaller screens

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start both frontend and backend
npm run server       # Start backend only
npm run client       # Start frontend only
npm run build        # Build for production
npm run preview      # Preview production build
```

### Project Structure
```
card-game-master/
├── server/              # Backend code
├── src/                 # Frontend code
├── index.html           # Main HTML file
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
└── README.md           # This file
```

## 🎯 Game Rules

### Poker Hand Rankings (Highest to Lowest)
1. **Royal Flush**: A, K, Q, J, 10 of same suit
2. **Straight Flush**: 5 consecutive cards of same suit
3. **Four of a Kind**: 4 cards of same rank
4. **Full House**: 3 of a kind + pair
5. **Flush**: 5 cards of same suit
6. **Straight**: 5 consecutive cards
7. **Three of a Kind**: 3 cards of same rank
8. **Two Pair**: 2 pairs
9. **One Pair**: 2 cards of same rank
10. **High Card**: Highest card wins

### Blackjack Rules
- **Goal**: Beat dealer to 21 without going over
- **Face Cards**: J, Q, K = 10 points
- **Aces**: 1 or 11 points (player's choice)
- **Dealer**: Hits on 16 and below, stands on 17+
- **Blackjack**: A + 10-value card = automatic win (1.5x bet)
- **Push**: Tie = bet returned

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Card Game Logic**: Implemented from scratch with mathematical accuracy
- **Probability Calculations**: Based on standard poker and blackjack theory
- **UI Design**: Modern, clean interface inspired by professional gaming platforms
- **Real-time Features**: WebSocket implementation for seamless multiplayer experience

---

**Enjoy playing Card Game Master! 🎮🃏** 