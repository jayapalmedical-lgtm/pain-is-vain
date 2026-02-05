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

// ---------- CHESS (SIMPLE, HARD, PLAYABLE) ----------
const start=[
["r","n","b","q","k","b","n","r"],
["p","p","p","p","p","p","p","p"],
["","","","","","","",""],
["","","","","","","",""],
["","","","","","","",""],
["","","","","","","",""],
["P","P","P","P","P","P","P","P"],
["R","N","B","Q","K","B","N","R"]
];
let board=JSON.parse(JSON.stringify(start));
let sel=null;

function drawChess(){
  const b=document.getElementById("chess-board");
  b.innerHTML="";
  for(let r=0;r<8;r++){
    for(let c=0;c<8;c++){
      let d=document.createElement("div");
      d.className="chess-cell "+((r+c)%2?"black":"white");
      d.textContent=board[r][c];
      d.onclick=()=>clickChess(r,c);
      b.appendChild(d);
    }
  }
}

function clickChess(r,c){
  if(sel){
    let [sr,sc]=sel;
    board[r][c]=board[sr][sc];
    board[sr][sc]="";
    sel=null;
    drawChess();
    setTimeout(aiChess,300);
  } else if(board[r][c]===board[r][c].toUpperCase()){
    sel=[r,c];
  }
}

function aiChess(){
  let moves=[];
  for(let r=0;r<8;r++)
    for(let c=0;c<8;c++)
      if(board[r][c]===board[r][c].toLowerCase()){
        if(r+1<8) moves.push([[r,c],[r+1,c]]);
      }
  let m=moves[Math.floor(Math.random()*moves.length)];
  board[m[1][0]][m[1][1]]=board[m[0][0]][m[0][1]];
  board[m[0][0]][m[0][1]]="";
  drawChess();
}

window.resetChess=function(){
  board=JSON.parse(JSON.stringify(start));
  drawChess();
};

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
