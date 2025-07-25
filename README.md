# 🃏 Blackjack Master

> A polished, feature-rich single-player Blackjack game with professional animations, split functionality, and customizable themes.

![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)
![HTML5](https://img.shields.io/badge/HTML5-Canvas-orange)
![CSS3](https://img.shields.io/badge/CSS3-Animations-blue)
![Vite](https://img.shields.io/badge/Vite-Dev%20Server-green)
![License](https://img.shields.io/badge/License-MIT-purple)

**🎮 [Play Now Live!](https://azibmalik.github.io/blackjack-master/)**

---

## 📸 Screenshots

### 🎮 Main Game Interface
*Place your screenshot of the main game table here*
![Main Game Interface](screenshots/main-game.png)

### 🃏 Split Hands Feature  
*Show split functionality in action*
![Split Hands](screenshots/split-hands.png)

### ⚙️ Customization Options
*Settings modal with color customization*
![Settings](screenshots/settings.png)

### 📱 Mobile Responsive
*Mobile view of the game*
![Mobile View](screenshots/mobile.png)

---

## ✨ Features

### 🎯 Core Gameplay
- **Classic Blackjack Rules** - Hit, Stand, Double Down, Split
- **Advanced Split Logic** - Split up to 3 times (4 hands total)
- **Smart Re-splitting** - Split again when you get matching cards
- **Proper Payouts** - Blackjack pays 3:2, accurate chip calculations
- **Dealer AI** - Follows standard casino rules (hits on 16, stands on 17)

### 🎨 Visual Excellence  
- **Smooth Animations** - Card dealing with realistic timing
- **Professional UI** - Clean, modern interface with gradients
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Visual Feedback** - Clear hand values, bet amounts, and notifications
- **Split Hand Indicators** - Active hand highlighting during split play

### 🔧 Customization
- **Color Themes** - Customize background and card colors
- **Sound Control** - Toggle sound effects on/off
- **Settings Persistence** - Your preferences are saved automatically
- **Betting Limits** - Configurable bet amounts with slider control

### 🎲 Game Features
- **Multiple Split Support** - Split pairs up to 3 times
- **Individual Hand Betting** - Each split hand tracks its own bet
- **Accurate Calculations** - Proper push detection and payout logic
- **Help System** - Built-in rules and strategy guide
- **Chip Management** - Start with $1000, track your progress

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/azibmalik/blackjack-master.git
   cd blackjack-master
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

---

## 🎯 How to Play

### Basic Rules
1. **Place Your Bet** - Use the slider to select your bet amount ($10-$1000)
2. **Get Your Cards** - You and the dealer each get 2 cards
3. **Make Your Move** - Choose from Hit, Stand, Double, or Split
4. **Beat the Dealer** - Get closer to 21 without going over

### Actions Available

| Action | Description | When Available |
|--------|-------------|----------------|
| **Hit** | Take another card | Any time during your turn |
| **Stand** | Keep your current hand | Any time during your turn |
| **Double** | Double your bet, take one card | First two cards only |
| **Split** | Split matching cards into separate hands | When you have a pair |

### Split Rules
- Split any two cards of the same **value** (K+Q, J+10, etc.)
- Each split costs an additional bet equal to your original bet
- You can split up to **3 times** (maximum 4 hands)
- Play each hand individually from left to right
- Aces split only receive one additional card each

### Payouts
- **Regular Win**: 1:1 (double your bet)
- **Blackjack**: 3:2 (1.5x your bet + original bet back)
- **Push (Tie)**: Bet returned
- **Loss**: Lose your bet

---

## 🛠️ Technical Details

### Built With
- **Frontend**: Vanilla JavaScript (ES6+)
- **Styling**: CSS3 with Flexbox/Grid
- **Build Tool**: Vite
- **Development**: Hot reload and modern dev experience

### Project Structure
```
blackjack-master/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Pages auto-deployment
├── public/
│   └── audio/                  # Sound effects (bet, card, win, lose)
├── src/
│   ├── styles/
│   │   └── main.css           # Complete game styling
│   └── main.js                # Core blackjack game logic
├── .gitignore                 # Git ignore rules
├── index.html                 # Main HTML file
├── README.md                  # Project documentation
├── LICENCE
├── package.json               # Dependencies and scripts
└── vite.config.js             # Vite configuration
```

### Key Features Implementation
- **Split Logic**: Enhanced `canSplit()` function supporting value-based matching
- **Chip Management**: Accurate tracking with `handBets[]` array for multiple hands
- **UI State Management**: Real-time updates with proper split hand visualization
- **Responsive Design**: CSS Grid and Flexbox for all screen sizes
- **Local Storage**: Settings persistence across sessions

---

## 🎮 Game Strategy Tips

### Basic Strategy
- **Always split Aces and 8s**
- **Never split 10s, 5s, or 4s**
- **Double down on 11 when dealer shows 2-10**
- **Double down on 10 when dealer shows 2-9**
- **Stand on 17 or higher**
- **Hit on 16 or lower when dealer shows 7+**

### Advanced Splitting
- **10-value cards**: K, Q, J, and 10 can all be split together
- **Multiple splits**: Keep splitting if you get another matching card
- **Bet management**: Each split doubles your money at risk

---

## 📱 Responsive Design

The game adapts seamlessly to different screen sizes:

- **Desktop (1200px+)**: Full interface with all controls visible
- **Tablet (768px-1199px)**: Optimized layout with touch-friendly buttons  
- **Mobile (320px-767px)**: Streamlined interface, stacked controls

---

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run preview      # Preview production build locally
```

### Adding New Features

The codebase is modular and easy to extend:

1. **Game Logic**: Modify `main.js` for new rules or features
2. **Styling**: Update `main.css` for visual changes
3. **UI Components**: Add new modals or controls in the HTML structure

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes** and test thoroughly
4. **Commit your changes** (`git commit -m 'Add amazing feature'`)
5. **Push to the branch** (`git push origin feature/amazing-feature`)
6. **Open a Pull Request**

### Development Guidelines
- Follow existing code style and conventions
- Test all functionality thoroughly, especially split scenarios
- Ensure mobile responsiveness for new features
- Update documentation for significant changes

---

## 🐛 Known Issues & Roadmap

### Current Known Issues
- [ ] None! The game is fully functional 🎉

### Future Features
- [ ] **Statistics Tracking** - Win/loss ratios, best streaks
- [ ] **Achievement System** - Unlock badges for milestones
- [ ] **Card Counting Trainer** - Practice card counting
- [ ✅ **Multiple Splits** - Up to 3 splits implemented
- [ ✅ **Sound Effects** - Audio feedback implemented
- [ ✅ **Theme Customization** - Color picker implemented

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**⭐ Star this repository if you enjoyed playing! ⭐**

*Built with ❤️ for blackjack enthusiasts*

**[🎮 Play the Game](https://azibmalik.github.io/blackjack-master/)**

</div>
