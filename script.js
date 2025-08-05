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
  let numButtons = document.querySelectorAll('.number-btn');
  numButtons.forEach(btn => {
    btn.classList.remove("selected");
    if (parseInt(btn.innerText) === selectedNumber) {
      btn.classList.add("selected");
    }
  });
  // No explicit highlight for color, but you can add if wanted
}
function placeBet() {
  let amount = parseInt(document.getElementById('bet-amount').value);
  if (amount > wallet || (!selectedColor && selectedNumber==null)) {
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
  document.getElementById("game-result").innerText = "Bet placed!";
}
function getRandomResult() {
  let num = Math.floor(Math.random()*10);
  let color = ([1,3,5,7,9].includes(num)) ? 'Green' : 'Red';
  if (num === 0 || num === 5) color = 'Violet';
  return {num, color};
}
function settleBets(result) {
  let winText = '';
  bets.forEach(bet => {
    if ((bet.color && bet.color === result.color) ||
      (bet.number!=null && bet.number === result.num)) {
      let winnings = bet.amount * (bet.color?2:9);
      wallet += winnings;
      winText += ` Won ₹${winnings}`;
    }
  });
  bets = [];
  updateWallet();
  document.getElementById('game-result').innerHTML = `
    <span>Number: <b>${result.num}</b></span>,
    Color: <span style="color:${chipColorVal(result.color)}"><b>${result.color}</b></span>
    ${winText ? `<br><span style="color:#44ecd7">${winText}</span>` : '<br>Better luck next round!'}
  `;
  // Add to history
  history.unshift({num: result.num, color: result.color});
  updateHistory();
}
function chipColorVal(c) {
  if(c==='Green') return '#19c070';
  if(c==='Red') return '#f0303c';
  if(c==='Violet') return '#b060f3';
  return '#fff';
}
function updateHistory() {
  let html = '';
  history.slice(0,7).forEach(h => {
    html += `<span class="bchip ${h.color.toLowerCase()}">${h.num}</span>`;
  });
  document.getElementById('history-list').innerHTML = html;
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
    html += `<button class="number-btn" onclick="selectNumber(${i})">${i}</button>`;
  }
  document.getElementById('numbers').innerHTML = html;
}
window.onload = function() {
  updateWallet();
  renderNumbers();
  updateHistory();
  startRound();
};
