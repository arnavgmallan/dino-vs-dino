const pairs = {
  madagascar: { place: "MADAGASCAR DINO DUEL", hunter: { name: "MAJUNGASAURUS", symbol: "ᕦ(ò_óˇ)ᕤ", say: "“CHOMP! CHOMP!”" }, plant: { name: "RAPETOSAURUS", symbol: "ᓚᘏᗢ", say: "“LEAF POWER!”" } },
  usa: { place: "USA DINO DUEL", hunter: { name: "ALLOSAURUS", symbol: "ᕙ(ò_óˇ)ᕗ", say: "“BIG BITE!”" }, plant: { name: "STEGOSAURUS", symbol: "ᐢ•⩊•ᐢ", say: "“SPIKE POWER!”" } }
};
const scores = [7, 8, 16, 24, 32, 40, 48, 56, 64, 72];
let pairKey = "madagascar", hunterScore = 0, plantScore = 0, turn = "hunter", holdStart = 0, holding = false, frame;
const $ = id => document.getElementById(id);
const action = $("action-button"), meter = $("hold-meter").firstElementChild;

function currentPair() { return pairs[pairKey]; }
function nextScore(score) { return scores.find(n => n > score) ?? 72; }
function update() {
  const p = currentPair(), isHunter = turn === "hunter", dino = isHunter ? p.hunter : p.plant;
  $("hunter-score").textContent = hunterScore; $("plant-score").textContent = plantScore;
  $("turn-message").textContent = `${dino.name}’s turn!`;
  $("action-icon").textContent = isHunter ? "🦷" : "🍃";
  $("action-label").textContent = isHunter ? "HOLD TO CHOMP!" : "HOLD TO DASH!";
  action.className = `action-button ${isHunter ? "hunter-action" : "plant-action"}`;
  $("help-text").textContent = isHunter ? "Hold until the teeth are full to earn the next points!" : "Hold until the leaves are full to zoom away and earn the next points!";
}
function setPair(key) {
  pairKey = key; const p = currentPair();
  $("place-label").textContent = p.place;
  ["hunter", "plant"].forEach(side => {
    $(side + "-name").textContent = p[side].name;
    $(side + "-symbol").textContent = p[side].symbol;
    $(side + "-say").textContent = p[side].say;
  });
  document.querySelectorAll(".pair-button").forEach(b => b.classList.toggle("active", b.dataset.pair === key));
  reset();
}
function reset() { hunterScore = 0; plantScore = 0; turn = "hunter"; meter.style.width = "0%"; update(); }
function startHold(event) { event.preventDefault(); if (holding || $("winner-modal").classList.contains("hidden") === false) return; holding = true; holdStart = performance.now(); action.classList.add("holding"); frame = requestAnimationFrame(fillMeter); }
function fillMeter(now) { if (!holding) return; const progress = Math.min((now - holdStart) / 1100, 1); meter.style.width = `${progress * 100}%`; if (progress >= 1) finishMove(); else frame = requestAnimationFrame(fillMeter); }
function stopHold() { if (!holding) return; holding = false; cancelAnimationFrame(frame); action.classList.remove("holding"); meter.style.width = "0%"; }
function finishMove() {
  const p = currentPair(), isHunter = turn === "hunter", side = isHunter ? "hunter" : "plant", card = $(side + "-card");
  stopHold(); card.classList.remove("bite", "cheer"); void card.offsetWidth; card.classList.add(isHunter ? "bite" : "cheer");
  if (isHunter) hunterScore = nextScore(hunterScore); else plantScore = nextScore(plantScore);
  const score = isHunter ? hunterScore : plantScore;
  if (score >= 72) { showWinner(isHunter ? p.hunter : p.plant); return; }
  turn = isHunter ? "plant" : "hunter"; update();
}
function showWinner(dino) { $("winner-symbol").textContent = dino.symbol; $("winner-title").textContent = `${dino.name} WINS!`; $("winner-text").textContent = `Got all 72 points! ${dino.say}`; $("winner-modal").classList.remove("hidden"); }
action.addEventListener("pointerdown", startHold); ["pointerup", "pointerleave", "pointercancel"].forEach(type => action.addEventListener(type, stopHold));
document.querySelectorAll(".pair-button").forEach(b => b.addEventListener("click", () => setPair(b.dataset.pair)));
$("reset-button").addEventListener("click", reset); $("play-again").addEventListener("click", () => { $("winner-modal").classList.add("hidden"); reset(); });
update();
