// Single-player Blackjack game logic

const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

let player = {
    chips: 1000,
    bet: 0,
    hands: [[]],  // Array of hands to support splitting
    handBets: [0], // Track bet for each hand
    currentHandIndex: 0,
    isActive: true,
    hasSplit: false,
    splitCount: 0 // Track number of splits (max 3 = 4 hands total)
};
let dealer = {
    hand: []
};
let deck = [];
let gameInProgress = false;
let playerTurn = false;
let dealerHoleCardRevealed = false;

// DOM Elements
const playerChipsEl = document.getElementById('player-chips');
const currentBetEl = document.getElementById('current-bet');
const betAmountEl = document.getElementById('bet-amount');
const betValueEl = document.getElementById('bet-value');
const placeBetBtn = document.getElementById('place-bet-btn');
const dealBtn = document.getElementById('deal-btn');
const playerControls = document.getElementById('player-controls');
const hitBtn = document.getElementById('hit-btn');
const standBtn = document.getElementById('stand-btn');
const doubleBtn = document.getElementById('double-btn');
const playerHandEl = document.getElementById('player-hand');
const dealerHandEl = document.getElementById('dealer-hand');
const handValueEl = document.getElementById('hand-value');
const dealerValueEl = document.getElementById('dealer-value');
const notificationsEl = document.getElementById('notifications');

// Split button - with error handling
let splitBtn = document.getElementById('split-btn');
if (!splitBtn) {
    console.error('❌ Split button not found in HTML! Creating it dynamically...');
    // Create split button if it doesn't exist
    splitBtn = document.createElement('button');
    splitBtn.id = 'split-btn';
    splitBtn.className = 'btn btn-info';
    splitBtn.innerHTML = '<i class="fas fa-clone"></i> Split';
    splitBtn.style.display = 'none';
    splitBtn.addEventListener('click', () => playerAction('split'));
    
    // Add it to player controls
    if (playerControls) {
        playerControls.appendChild(splitBtn);
        console.log('✅ Split button created and added to player controls');
    }
}

// Modal and settings logic
const helpBtn = document.getElementById('help-btn');
const settingsBtn = document.getElementById('settings-btn');
const helpModal = document.getElementById('help-modal');
const settingsModal = document.getElementById('settings-modal');
const closeHelp = document.getElementById('close-help');
const closeSettings = document.getElementById('close-settings');
const bgColorPicker = document.getElementById('bg-color-picker');
const cardColorPicker = document.getElementById('card-color-picker');
const gameScreen = document.getElementById('game-screen');

// Audio cues
const soundFiles = {
    placebet: '/audio/placebet.mp3',
    placecard: '/audio/placecard.mp3',
    win: '/audio/win.mp3',
    lose: '/audio/lose.mp3',
};
let isMuted = false;

function playSound(name) {
    if (isMuted) return;
    const src = soundFiles[name];
    if (src) {
        const audio = new Audio(src);
        audio.play();
    }
}

function createDeck() {
    const d = [];
    for (const suit of suits) {
        for (const rank of ranks) {
            d.push({ suit, rank });
        }
    }
    return d;
}

function shuffleDeck(d) {
    for (let i = d.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [d[i], d[j]] = [d[j], d[i]];
    }
}

function getCardValue(rank) {
    if (rank === 'A') return 11;
    if (['K', 'Q', 'J'].includes(rank)) return 10;
    return parseInt(rank);
}

function calculateHandValue(hand) {
    let value = 0;
    let aces = 0;
    for (const card of hand) {
        if (card.rank === 'A') {
            aces++;
            value += 11;
        } else if (["K","Q","J"].includes(card.rank)) {
            value += 10;
        } else {
            value += parseInt(card.rank);
        }
    }
    while (value > 21 && aces > 0) {
        value -= 10;
        aces--;
    }
    return value;
}

function renderHand(hand, revealAll = true, isDealer = false) {
    return hand.map((card, idx) => {
        if (isDealer && !revealAll && idx === 0) {
            // Hide the dealer's first card (hole card) if not revealing
            return '<div class="card-element face-down"></div>';
        }
        const suitSymbol = getSuitSymbol(card.suit);
        return `<div class="card-element" style="color: #111; font-weight: bold; background: var(--card-bg, #fff);">${card.rank}${suitSymbol}</div>`;
    }).join('');
}

function getSuitSymbol(suit) {
    const symbols = {
        'hearts': '♥',
        'diamonds': '♦',
        'clubs': '♣',
        'spades': '♠'
    };
    return symbols[suit] || '';
}

function getCurrentHand() {
    return player.hands[player.currentHandIndex];
}

function canSplit() {
    const currentHand = getCurrentHand();
    // Allow splitting if:
    // 1. Current hand has exactly 2 cards
    // 2. Both cards have same value
    // 3. Player has enough chips for another bet
    // 4. Haven't exceeded max splits (3 splits = 4 hands max)
    // 5. It's the player's turn
    if (currentHand.length === 2 && player.splitCount < 3 && player.chips >= player.bet && playerTurn && gameInProgress) {
        const value1 = getCardValue(currentHand[0].rank);
        const value2 = getCardValue(currentHand[1].rank);
        return value1 === value2;
    }
    return false;
}

function renderPlayerHands() {
    if (player.hasSplit) {
        return player.hands.map((hand, index) => {
            const isActive = index === player.currentHandIndex && playerTurn;
            const handClass = isActive ? 'active-hand' : 'inactive-hand';
            const bet = player.handBets[index] || player.bet;
            return `
                <div class="split-hand ${handClass}">
                    <div class="hand-label">Hand ${index + 1} (${bet})</div>
                    <div class="player-hand">${renderHand(hand)}</div>
                    <div class="hand-value">${hand.length ? calculateHandValue(hand) : ''}</div>
                </div>
            `;
        }).join('');
    } else {
        return `<div class="player-hand">${renderHand(getCurrentHand())}</div>`;
    }
}

function calculateVisibleDealerValue() {
    if (!dealer.hand.length) return '';
    
    if (dealerHoleCardRevealed) {
        // Show full hand value when hole card is revealed
        return calculateHandValue(dealer.hand);
    } else {
        // Show only visible cards value (excluding hole card at index 0)
        const visibleCards = dealer.hand.slice(1); // Skip the first card (hole card)
        return visibleCards.length ? calculateHandValue(visibleCards) : '';
    }
}

function updateBetSlider() {
    betAmountEl.max = player.chips;
    if (parseInt(betAmountEl.value) > player.chips) {
        betAmountEl.value = player.chips;
    }
    betValueEl.textContent = `$${betAmountEl.value}`;
}

function updateUI() {
    playerChipsEl.textContent = player.chips;
    
    // Show total bet across all hands
    let totalBet = 0;
    if (player.handBets && player.handBets.length > 0) {
        totalBet = player.handBets.reduce((sum, bet) => sum + (bet || 0), 0);
    } else {
        totalBet = player.bet;
    }
    
    console.log(`💰 UI Update - Chips: ${player.chips}, Total Bet: ${totalBet}, HandBets:`, player.handBets);
    
    currentBetEl.textContent = totalBet;
    
    playerHandEl.innerHTML = renderPlayerHands();
    dealerHandEl.innerHTML = renderHand(dealer.hand, dealerHoleCardRevealed, true);
    if (!player.hasSplit) {
        handValueEl.textContent = getCurrentHand().length ? calculateHandValue(getCurrentHand()) : '';
    } else {
        handValueEl.textContent = '';
    }
    dealerValueEl.textContent = calculateVisibleDealerValue();
    
    if (splitBtn) {
        if (playerTurn && gameInProgress) {
            splitBtn.style.display = '';
            splitBtn.disabled = !canSplit();
            if (player.splitCount > 0) {
                splitBtn.innerHTML = `<i class="fas fa-clone"></i> Split (${player.splitCount}/3)`;
            } else {
                splitBtn.innerHTML = '<i class="fas fa-clone"></i> Split';
            }
        } else {
            splitBtn.style.display = 'none';
        }
    }
    
    updateBetSlider();
    if (player.bet === 0 && totalBet === 0) {
        dealBtn.style.display = 'none';
        playerControls.style.display = 'none';
    }
}

function showNotification(msg, type = 'info') {
    notificationsEl.innerHTML = `<div class="notification ${type}">${msg}</div>`;
    setTimeout(() => { notificationsEl.innerHTML = ''; }, 2000);
}

function resetHands() {
    player.hands = [[]];
    player.handBets = [0];
    player.currentHandIndex = 0;
    player.hasSplit = false;
    player.splitCount = 0;
    dealer.hand = [];
    handValueEl.textContent = '';
    dealerValueEl.textContent = '';
    
    console.log('🔄 Hands reset - handBets:', player.handBets);
}

function startNewRound() {
    resetHands();
    dealerHoleCardRevealed = false;
    deck = createDeck();
    shuffleDeck(deck);
    player.bet = 0;
    gameInProgress = false;
    playerTurn = false;
    updateUI();
    betAmountEl.disabled = false;
    placeBetBtn.disabled = false;
    dealBtn.style.display = 'none';
    playerControls.style.display = 'none';
    updateBetSlider();
}

function placeBet() {
    const bet = parseInt(betAmountEl.value);
    if (bet > player.chips) {
        showNotification('Not enough chips!', 'error');
        return;
    }
    if (bet < 10) {
        showNotification('Minimum bet is $10', 'error');
        return;
    }
    player.bet = bet;
    player.handBets = [bet]; // Initialize handBets array with first bet
    player.chips -= bet; // Deduct bet immediately
    
    console.log(`💰 Placed bet: ${bet}, Chips remaining: ${player.chips}`);
    
    playerChipsEl.textContent = player.chips;
    currentBetEl.textContent = bet;
    placeBetBtn.disabled = true;
    betAmountEl.disabled = true;
    dealBtn.style.display = '';
    updateBetSlider();
    playSound('placebet');
    showNotification('Bet placed! Click Deal to start.', 'success');
}

function dealCards() {
    // Reset only the hands and cards, NOT the bets (they're already placed)
    player.hands = [[]];
    player.currentHandIndex = 0;
    player.hasSplit = false;
    player.splitCount = 0;
    dealer.hand = [];
    dealerHoleCardRevealed = false;
    
    console.log('🃏 Dealing cards - preserving bet:', player.handBets);
    
    // Hide deal button immediately to prevent multiple clicks
    dealBtn.style.display = 'none';
    
    updateUI();
    // Real Blackjack dealing order
    setTimeout(() => {
        getCurrentHand().push(deck.pop()); // Player 1st card (face up)
        playSound('placecard');
        updateUI();
        setTimeout(() => {
            dealer.hand.push(deck.pop()); // Dealer 1st card (face down, hole card)
            playSound('placecard');
            updateUI();
            setTimeout(() => {
                getCurrentHand().push(deck.pop()); // Player 2nd card (face up)
                playSound('placecard');
                updateUI();
                setTimeout(() => {
                    dealer.hand.push(deck.pop()); // Dealer 2nd card (face up)
                    playSound('placecard');
                    updateUI();
                    gameInProgress = true;
                    playerTurn = true;
                    playerControls.style.display = '';
                    // Deal button stays hidden until round ends
                    showNotification('Your turn!', 'info');
                    updateUI(); // Update UI again to show split button if applicable
                    checkForBlackjack();
                }, 600);
            }, 600);
        }, 600);
    }, 200);
}

function checkForBlackjack() {
    const playerValue = calculateHandValue(getCurrentHand());
    const dealerValue = calculateHandValue(dealer.hand);
    
    // If both have blackjack, it's a push
    if (playerValue === 21 && dealerValue === 21) {
        endRound('push');
        return;
    }
    
    // If dealer has blackjack
    if (dealerValue === 21) {
        setTimeout(() => endRound('dealer_blackjack'), 1200);
        return;
    }
    
    // If player has blackjack
    if (playerValue === 21) {
        setTimeout(() => endRound('blackjack'), 1200);
        return;
    }
}

function splitHand() {
    if (!canSplit()) {
        showNotification('Cannot split these cards!', 'error');
        return;
    }
    
    console.log('🃏 Splitting hand...', getCurrentHand());
    
    // Get the bet for the current hand
    const currentBet = player.handBets[player.currentHandIndex] || player.bet;
    
    // Check if player has enough chips for additional bet
    if (player.chips < currentBet) {
        showNotification(`Not enough chips to split! Need ${currentBet}`, 'error');
        return;
    }
    
    // Deduct additional bet for new hand
    player.chips -= currentBet;
    console.log(`💰 Split bet: ${currentBet}, Chips remaining: ${player.chips}`);
    
    // Split the cards
    const currentHand = getCurrentHand();
    const secondCard = currentHand.pop(); // Remove second card
    player.hands.push([secondCard]); // Create new hand with second card
    player.handBets.push(currentBet); // Set same bet for new hand
    player.hasSplit = true;
    player.splitCount++;
    
    const splitNumber = player.splitCount;
    showNotification(`Split ${splitNumber}! Creating new hand...`, 'info');
    updateUI();
    
    // Deal one card to each hand with animation
    setTimeout(() => {
        getCurrentHand().push(deck.pop()); // Card to current hand
        playSound('placecard');
        updateUI();
        showNotification(`Card dealt to hand ${player.currentHandIndex + 1}`, 'info');
        
        setTimeout(() => {
            player.hands[player.hands.length - 1].push(deck.pop()); // Card to new hand
            playSound('placecard');
            updateUI();
            showNotification(`Cards split! Playing hand ${player.currentHandIndex + 1}.`, 'success');
            
            // Ensure UI is updated to show split options for current hand
            setTimeout(() => {
                updateUI();
            }, 100);
        }, 400);
    }, 400);
}

function nextHand() {
    if (player.hasSplit && player.currentHandIndex < player.hands.length - 1) {
        player.currentHandIndex++;
        showNotification(`Playing hand ${player.currentHandIndex + 1} now.`, 'info');
        updateUI();
        return true;
    }
    return false;
}

function playerAction(action) {
    if (!gameInProgress || !playerTurn) return;
    
    const currentHand = getCurrentHand();
    
    if (action === 'split') {
        splitHand();
        return;
    }
    
    if (action === 'hit') {
        currentHand.push(deck.pop());
        playSound('placecard');
        updateUI();
        const value = calculateHandValue(currentHand);
        if (value > 21) {
            // Bust this hand
            if (nextHand()) {
                // Continue with next hand
                return;
            } else {
                // All hands done or busted
                dealerHoleCardRevealed = true;
                endRound('bust');
            }
        } else if (value === 21) {
            // This hand has 21
            if (nextHand()) {
                // Continue with next hand
                return;
            } else {
                // All hands done
                dealerHoleCardRevealed = true;
                stand();
            }
        }
    } else if (action === 'stand') {
        if (nextHand()) {
            // Continue with next hand
            return;
        } else {
            // All hands done
            dealerHoleCardRevealed = true;
            stand();
        }
    } else if (action === 'double') {
        const currentBet = player.handBets[player.currentHandIndex] || player.bet;
        if (player.chips < currentBet) {
            showNotification('Not enough chips to double!', 'error');
            return;
        }
        player.chips -= currentBet;
        player.handBets[player.currentHandIndex] = currentBet * 2; // Double the bet for this hand
        
        console.log(`💰 Doubled hand ${player.currentHandIndex + 1}: ${currentBet} → ${player.handBets[player.currentHandIndex]}, Chips remaining: ${player.chips}`);
        
        currentHand.push(deck.pop());
        playSound('placecard');
        updateUI();
        const value = calculateHandValue(currentHand);
        
        if (nextHand()) {
            // Continue with next hand
            return;
        } else {
            // All hands done
            dealerHoleCardRevealed = true;
            if (value > 21) {
                endRound('bust');
            } else {
                stand();
            }
        }
    }
}

function stand() {
    playerTurn = false;
    updateUI(); // Hide split button when turn ends
    
    // First, reveal the hole card with a delay
    setTimeout(() => {
        dealerHoleCardRevealed = true;
        playSound('placecard');
        updateUI();
        
        // Then deal additional cards one by one if needed
        dealDealerCards();
    }, 600);
}

function dealDealerCards() {
    let dealerValue = calculateHandValue(dealer.hand);
    
    if (dealerValue < 17) {
        // Deal one card with delay
        setTimeout(() => {
            dealer.hand.push(deck.pop());
            playSound('placecard');
            updateUI();
            
            // Recursively deal more cards if needed
            dealDealerCards();
        }, 800);
    } else {
        // Dealer is done, determine the result after a short delay
        setTimeout(() => {
            if (player.hasSplit) {
                endRound('split_complete');
            } else {
                const playerValue = calculateHandValue(getCurrentHand());
                if (dealerValue > 21) {
                    endRound('win');
                } else if (dealerValue === playerValue) {
                    endRound('push');
                } else if (playerValue > dealerValue) {
                    endRound('win');
                } else {
                    endRound('lose');
                }
            }
        }, 600);
    }
}

function endRound(result) {
    gameInProgress = false;
    playerTurn = false;
    dealerHoleCardRevealed = true;
    playerControls.style.display = 'none';
    dealBtn.style.display = 'none';
    betAmountEl.disabled = false;
    placeBetBtn.disabled = true;
    placeBetBtn.style.display = 'none';
    
    let msg = '';
    let totalWinnings = 0;
    
    if (player.hasSplit) {
        // Handle split hands
        const dealerValue = calculateHandValue(dealer.hand);
        let wins = 0, losses = 0, pushes = 0;
        let handResults = [];
        
        player.hands.forEach((hand, index) => {
            const handValue = calculateHandValue(hand);
            const handBet = player.handBets[index];
            
            if (handValue > 21) {
                losses++;
                handResults.push(`Hand ${index + 1}: Bust (Lost ${handBet})`);
            } else if (dealerValue > 21) {
                wins++;
                totalWinnings += handBet * 2; // Win: get bet back + winnings
                handResults.push(`Hand ${index + 1}: Won ${handBet} (Dealer bust)`);
            } else if (handValue > dealerValue) {
                wins++;
                totalWinnings += handBet * 2; // Win: get bet back + winnings
                handResults.push(`Hand ${index + 1}: Won ${handBet}`);
            } else if (handValue === dealerValue) {
                pushes++;
                totalWinnings += handBet; // Push: get bet back only
                handResults.push(`Hand ${index + 1}: Push (Returned ${handBet})`);
            } else {
                losses++;
                handResults.push(`Hand ${index + 1}: Lost ${handBet}`);
            }
        });
        
        player.chips += totalWinnings;
        
        // Create detailed message
        console.log('Split hand results:', handResults);
        
        if (wins === player.hands.length) {
            playSound('win');
            msg = `All ${player.hands.length} hands win!`;
        } else if (losses === player.hands.length) {
            playSound('lose');
            msg = `All ${player.hands.length} hands lose!`;
        } else if (pushes === player.hands.length) {
            msg = `All ${player.hands.length} hands push! Bets returned.`;
        } else {
            // Mixed results
            msg = `${wins} wins, ${losses} losses, ${pushes} pushes`;
            if (wins > losses) {
                playSound('win');
            } else if (losses > wins) {
                playSound('lose');
            }
        }
    } else {
        // Handle single hand
        const playerValue = calculateHandValue(getCurrentHand());
        const currentBet = player.handBets[0] || player.bet;
        
        console.log(`🎰 Single hand final calculation:`);
        console.log(`Player value: ${playerValue}, Dealer value: ${calculateHandValue(dealer.hand)}, Bet: ${currentBet}`);
        console.log(`Chips before payout: ${player.chips}`);
        
        if (result === 'bust') {
            playSound('lose');
            msg = 'You Busted! Dealer Wins.';
            console.log(`BUST - No money back`);
        } else if (result === 'win') {
            playSound('win');
            player.chips += currentBet * 2;
            msg = `You Win! +${currentBet * 2}`;
            console.log(`WIN - Get back ${currentBet * 2} (bet + winnings)`);
        } else if (result === 'blackjack') {
            playSound('win');
            const payout = Math.floor(currentBet * 2.5);
            player.chips += payout;
            msg = `Blackjack! You Win 3:2! +${payout}`;
            console.log(`BLACKJACK - Get back ${payout} (1.5x bet + original bet)`);
        } else if (result === 'dealer_blackjack') {
            playSound('lose');
            msg = 'Dealer has Blackjack! You Lose.';
            console.log(`DEALER BLACKJACK - No money back`);
        } else if (result === 'push') {
            msg = 'Push! Bet returned.';
            player.chips += currentBet;
            console.log(`PUSH - Get back ${currentBet} (bet returned)`);
        } else {
            playSound('lose');
            msg = 'You Lose!';
            console.log(`LOSE - No money back`);
        }
        
        console.log(`Chips after payout: ${player.chips}`);
    }
    
    updateUI();
    showNotification(msg, result === 'win' || result === 'blackjack' || totalWinnings > 0 ? 'success' : (result === 'push' ? 'warning' : 'error'));
    setTimeout(() => {
        placeBetBtn.style.display = '';
        placeBetBtn.disabled = false;
        startNewRound();
    }, 3000); // Longer delay for split hands
}

// Event Listeners
betAmountEl.addEventListener('input', e => {
    betValueEl.textContent = `$${e.target.value}`;
});
placeBetBtn.addEventListener('click', placeBet);
dealBtn.addEventListener('click', dealCards);
hitBtn.addEventListener('click', () => playerAction('hit'));
standBtn.addEventListener('click', () => playerAction('stand'));
doubleBtn.addEventListener('click', () => playerAction('double'));
if (splitBtn) splitBtn.addEventListener('click', () => playerAction('split'));

// Modal and settings logic
function openModal(modal) {
    modal.style.display = 'flex';
}
function closeModal(modal) {
    modal.style.display = 'none';
}
helpBtn.addEventListener('click', () => openModal(helpModal));
settingsBtn.addEventListener('click', () => openModal(settingsModal));
closeHelp.addEventListener('click', () => closeModal(helpModal));
closeSettings.addEventListener('click', () => closeModal(settingsModal));
window.addEventListener('click', (e) => {
    if (e.target === helpModal) closeModal(helpModal);
    if (e.target === settingsModal) closeModal(settingsModal);
});

// Color customization
function setGameBgColor(color) {
    gameScreen.style.background = color;
    const gameTable = document.querySelector('.game-table');
    if (gameTable) gameTable.style.background = color;
    
    // Create a darker version of the selected color for body background
    const darkColor = adjustColorBrightness(color, -0.4);
    // Use !important to override CSS gradient
    document.body.style.setProperty('background', darkColor, 'important');
    
    localStorage.setItem('bj_bg_color', color);
}

// Helper function to adjust color brightness
function adjustColorBrightness(hexColor, percent) {
    // Remove # if present
    const hex = hexColor.replace('#', '');
    
    // Handle 3-character hex codes
    const fullHex = hex.length === 3 ? 
        hex.split('').map(char => char + char).join('') : hex;
    
    // Convert hex to RGB
    const r = parseInt(fullHex.substr(0, 2), 16);
    const g = parseInt(fullHex.substr(2, 2), 16);
    const b = parseInt(fullHex.substr(4, 2), 16);
    
    // Adjust brightness
    const newR = Math.max(0, Math.min(255, Math.round(r * (1 + percent))));
    const newG = Math.max(0, Math.min(255, Math.round(g * (1 + percent))));
    const newB = Math.max(0, Math.min(255, Math.round(b * (1 + percent))));
    
    // Convert back to hex
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}

function setCardColor(color) {
    document.documentElement.style.setProperty('--card-bg', color);
    localStorage.setItem('bj_card_color', color);
}
bgColorPicker.addEventListener('input', e => {
    console.log('Color picker changed to:', e.target.value);
    setGameBgColor(e.target.value);
});
cardColorPicker.addEventListener('input', e => setCardColor(e.target.value));

// Add mute toggle functionality
const muteToggle = document.getElementById('mute-toggle');
if (muteToggle) {
    muteToggle.addEventListener('change', e => {
        isMuted = muteToggle.checked;
        localStorage.setItem('bj_muted', isMuted);
    });
}

// On load, apply saved colors
function applySavedColors() {
    const bg = localStorage.getItem('bj_bg_color');
    const card = localStorage.getItem('bj_card_color');
    
    if (bg) {
        bgColorPicker.value = bg;
        setGameBgColor(bg);
        // Also apply to .game-table if present
        const gameTable = document.querySelector('.game-table');
        if (gameTable) gameTable.style.background = bg;
    } else {
        // Apply default dark background immediately
        const defaultColor = '#0f4c75';
        const darkColor = adjustColorBrightness(defaultColor, -0.4);
        document.body.style.setProperty('background', darkColor, 'important');
        bgColorPicker.value = defaultColor;
    }
    
    if (card) {
        cardColorPicker.value = card;
        setCardColor(card);
    }
    
    const mute = localStorage.getItem('bj_muted');
    isMuted = mute === 'true';
    if (muteToggle) muteToggle.checked = isMuted;
}

document.addEventListener('DOMContentLoaded', () => {
    // Force apply background color override immediately
    const defaultBg = localStorage.getItem('bj_bg_color') || '#0f4c75';
    const darkBg = adjustColorBrightness(defaultBg, -0.4);
    document.body.style.setProperty('background', darkBg, 'important');
    
    applySavedColors();
    startNewRound();
});