// Initialization
let wallet = 1000;
let selectedColor = null;
let selectedNumber = null;
let timer = 30;
let roundInterval;
let betAmount = 10;
let bets = [];
let history = [];

function updateWallet() {
    document.getElementById('wallet-balance').innerText = `₹${wallet.toFixed(2)}`;
}
function resetBalance() {
    wallet = 1000;
    updateWallet();
}
function selectBet(color) {
    selectedColor = color;
    selectedNumber = null;
    highlightSelections();
}
function selectNumber(n) {
    selectedNumber = n;
    selectedColor = null;
    highlightSelections();
}
function highlightSelections() {
    let numButtons = document.querySelectorAll('#numbers button');
    numButtons.forEach(btn => {
        btn.style.backgroundColor = (parseInt(btn.innerText) === selectedNumber) ? '#ffeb3b' : '#fff';
    });
}
function placeBet() {
    let amount = parseInt(document.getElementById('bet-amount').value);
    if (amount > wallet || (!selectedColor && selectedNumber == null)) {
        alert('Invalid bet!');
        return;
    }
    wallet -= amount;
    updateWallet();
    bets.push({
        color: selectedColor,
        number: selectedNumber,
        amount: amount
    });
    alert('Bet placed!');
}
// Random result and winning
function getRandomResult() {
    let num = Math.floor(Math.random() * 10);
    let color = '';
    if ([1,3,5,7,9].includes(num)) color = 'Green';
    else if ([0,2,4,6,8].includes(num)) color = 'Red';
    else color = 'Violet';
    if (num === 0 || num === 5) color = 'Violet';
    return {num, color};
}
function settleBets(result) {
    let winText = '';
    bets.forEach(bet => {
        if ((bet.color && bet.color === result.color) ||
            (bet.number !== null && bet.number === result.num)) {
            let winnings = bet.amount * (bet.color ? 2 : 9); // color:2x, number:9x
            wallet += winnings;
            winText += `Won ₹${winnings} `;
        }
    });
    bets = [];
    updateWallet();
    document.getElementById('game-result').innerText = `Number: ${result.num}, Color: ${result.color} ${winText}`;
    // Add to history
    history.unshift(`${result.num} | ${result.color}`);
    updateHistory();
}
function updateHistory() {
    document.getElementById('history-list').innerHTML = history.slice(0,10).map(h=>`<div>${h}</div>`).join('');
}
function startRound() {
    timer = 30;
    document.getElementById('timer').innerText = timer;
    clearInterval(roundInterval);
    roundInterval = setInterval(() => {
        timer--;
        document.getElementById('timer').innerText = timer;
        if (timer === 0) {
            clearInterval(roundInterval);
            let result = getRandomResult();
            settleBets(result);
            startRound();
        }
    }, 1000);
}
function renderNumbers() {
    let html = '';
    for(let i=0;i<10;i++) {
        html += `<button onclick="selectNumber(${i})">${i}</button>`;
    }
    document.getElementById('numbers').innerHTML = html;
}
window.onload = function() {
    updateWallet();
    renderNumbers();
    startRound();
};
