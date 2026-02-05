document.addEventListener("DOMContentLoaded", () => {

// ---------- SECTION SWITCH ----------
window.showSection = function(id) {
  document.querySelectorAll(".game").forEach(g => g.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
};

// ---------- TIC TAC TOE (HARD BUT WINNABLE) ----------
let ttt = ["","","","","","","","",""];
const H = "X", A = "O";

function drawTTT(){
  const b = document.getElementById("ttt-board");
  b.innerHTML="";
  ttt.forEach((v,i)=>{
    let d=document.createElement("div");
    d.className="cell";
    d.textContent=v;
    d.onclick=()=>moveTTT(i);
    b.appendChild(d);
  });
}

function moveTTT(i){
  if(ttt[i]) return;
  ttt[i]=H;
  if(checkTTT()) return;
  aiTTT();
  drawTTT();
}

function aiTTT(){
  let best=null;
  ttt.forEach((v,i)=>{ if(!v && best===null) best=i; });
  ttt[best]=A;
}

function checkTTT(){
  const w=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for(let [a,b,c] of w){
    if(ttt[a]&&ttt[a]==ttt[b]&&ttt[a]==ttt[c]){
      alert(ttt[a]+" wins");
      resetTTT(); return true;
    }
  }
  return false;
}

window.resetTTT=function(){
  ttt=["","","","","","","","",""];
  drawTTT();
};

drawTTT();

// ================= CHESS GAME (UPDATED & SMOOTH) =================

// Chess symbols
const pieces = {
  "P":"♙","R":"♖","N":"♘","B":"♗","Q":"♕","K":"♔",
  "p":"♟","r":"♜","n":"♞","b":"♝","q":"♛","k":"♚",
  "":""
};

// Initial board
const startBoard = [
 ["r","n","b","q","k","b","n","r"],
 ["p","p","p","p","p","p","p","p"],
 ["","","","","","","",""],
 ["","","","","","","",""],
 ["","","","","","","",""],
 ["","","","","","","",""],
 ["P","P","P","P","P","P","P","P"],
 ["R","N","B","Q","K","B","N","R"]
];

let board = JSON.parse(JSON.stringify(startBoard));
let selected = null;
let aiThinking = false;

// Draw board
function drawChess() {
  const el = document.getElementById("chess-board");
  if (!el) return;

  el.innerHTML = "";
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const cell = document.createElement("div");
      cell.className = "chess-cell " + ((r + c) % 2 ? "black" : "white");
      cell.textContent = pieces[board[r][c]];
      cell.onclick = () => clickChess(r, c);
      el.appendChild(cell);
    }
  }
}

// Player click
function clickChess(r, c) {
  if (aiThinking) return;

  if (selected) {
    const [sr, sc] = selected;
    if (isValidMove(board[sr][sc], sr, sc, r, c)) {
      board[r][c] = board[sr][sc];
      board[sr][sc] = "";
      selected = null;
      drawChess();

      aiThinking = true;
      setTimeout(() => {
        chessAI();
        aiThinking = false;
      }, 350);
    } else {
      selected = null;
    }
  } 
  else if (board[r][c] && board[r][c] === board[r][c].toUpperCase()) {
    selected = [r, c];
  }
}

// Move rules (simple but correct-feeling)
function isValidMove(p, sr, sc, r, c) {
  if (board[r][c] && board[r][c] === board[r][c].toUpperCase()) return false;

  const dr = r - sr;
  const dc = c - sc;

  switch (p) {
    case "P": return dr === -1 && dc === 0 && !board[r][c];
    case "R": return dr === 0 || dc === 0;
    case "B": return Math.abs(dr) === Math.abs(dc);
    case "Q": return dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc);
    case "N": return (Math.abs(dr) === 2 && Math.abs(dc) === 1) ||
                       (Math.abs(dr) === 1 && Math.abs(dc) === 2);
    case "K": return Math.abs(dr) <= 1 && Math.abs(dc) <= 1;
  }
  return false;
}

// AI logic (smart but beatable)
function chessAI() {
  let moves = [];

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p && p === p.toLowerCase()) {
        for (let nr = 0; nr < 8; nr++) {
          for (let nc = 0; nc < 8; nc++) {
            if (isValidAIMove(p, r, c, nr, nc)) {
              let score = 0;
              if (board[nr][nc]) score += 5;       // capture
              if ([3,4].includes(nr) && [3,4].includes(nc)) score += 2; // center
              moves.push({from:[r,c], to:[nr,nc], score});
            }
          }
        }
      }
    }
  }

  if (!moves.length) return;

  moves.sort((a,b)=>b.score-a.score);
  const best = moves.slice(0, 4);
  const m = best[Math.floor(Math.random()*best.length)];

  board[m.to[0]][m.to[1]] = board[m.from[0]][m.from[1]];
  board[m.from[0]][m.from[1]] = "";
  drawChess();
}

function isValidAIMove(p, sr, sc, r, c) {
  if (board[r][c] && board[r][c] === board[r][c].toLowerCase()) return false;

  const dr = r - sr;
  const dc = c - sc;

  switch (p) {
    case "p": return dr === 1 && dc === 0;
    case "r": return dr === 0 || dc === 0;
    case "b": return Math.abs(dr) === Math.abs(dc);
    case "q": return dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc);
    case "n": return (Math.abs(dr) === 2 && Math.abs(dc) === 1) ||
                       (Math.abs(dr) === 1 && Math.abs(dc) === 2);
    case "k": return Math.abs(dr) <= 1 && Math.abs(dc) <= 1;
  }
  return false;
}

// Reset
function resetChess() {
  board = JSON.parse(JSON.stringify(startBoard));
  selected = null;
  aiThinking = false;
  drawChess();
}

// Start
drawChess();

// ---------- QUIZ (EASY + HARD) ----------
const qs=[
["12 + 8","20"],
["15 × 6","90"],
["144 ÷ 12","12"],
["(5² + 3²)","34"],
["√196","14"]
];
let qi=0;

function loadQ(){
  document.getElementById("quiz-question").textContent=qs[qi][0];
}

window.checkQuiz=function(){
  let a=document.getElementById("quiz-answer").value;
  document.getElementById("quiz-result").textContent=
    a==qs[qi][1]?"Correct ✅":"Wrong ❌ Answer: "+qs[qi][1];
  qi=(qi+1)%qs.length;
  document.getElementById("quiz-answer").value="";
  loadQ();
};

loadQ();

// ---------- GUESS MY NUMBER ----------
let secret=Math.floor(Math.random()*100)+1;
window.checkGuess=function(){
  let g=document.getElementById("guess").value;
  document.getElementById("numResult").textContent=
    g==secret?"🎉 Correct!":g<secret?"Too low":"Too high";
};

});
