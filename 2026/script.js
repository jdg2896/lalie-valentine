const messages = [
  "Are you sure?",
  "Are you really sure?",
  "Are you really really sure?",
  "es-tu sûr?",
  "你确定吗?",
  "¿Estás segura?",
  "Last chance!",
  "Sure ka na ba?",
  "Weh, di nga?",
  "Talaga ba?",
  "Edi okay, sure?",
  "Aw, seryoso?",
  "Game ka na ba?"
];

let messageIndex = 0;
let pauseDuration = 2000; // Fixed pause duration
let currentTransitionTime = 1; // Starts at 1s, decreases (faster movement)
let activeTimeouts = []; // Track timeouts to clear them later

function startTeleporting(btn) {
  // Set initial position to fixed if not already
  if (btn.style.position !== 'fixed') {
    const rect = btn.getBoundingClientRect();
    btn.style.position = 'fixed';
    btn.style.left = rect.left + 'px';
    btn.style.top = rect.top + 'px';
  }

  teleportLoop(btn);
}

function teleportLoop(btn) {
  const btnWidth = btn.offsetWidth;
  const btnHeight = btn.offsetHeight;
  const maxWidth = window.innerWidth - btnWidth;
  const maxHeight = window.innerHeight - btnHeight;

  // Apply current transition speed
  // Floating Yes buttons move much slower (3x duration)
  const duration = btn.classList.contains('floating-yes') ? currentTransitionTime * 3 : currentTransitionTime;
  btn.style.transition = `top ${duration}s ease-in-out, left ${duration}s ease-in-out, opacity 0.2s`;

  // Random position
  const randomX = Math.random() * maxWidth;
  const randomY = Math.random() * maxHeight;

  btn.style.left = randomX + 'px';
  btn.style.top = randomY + 'px';

  // Schedule next jump
  // Floating Yes buttons also pause longer (3x)
  const pause = btn.classList.contains('floating-yes') ? pauseDuration * 3 : pauseDuration;
  const timeoutId = setTimeout(() => teleportLoop(btn), pause);
  activeTimeouts.push(timeoutId);
}

function spawnFloatingYes() {
  const btn = document.createElement('button');
  btn.innerHTML = 'Yes';
  btn.className = 'btn btn-yes floating-yes';
  btn.style.position = 'fixed';
  btn.style.left = Math.random() * window.innerWidth + 'px';
  btn.style.top = Math.random() * window.innerHeight + 'px';
  btn.style.zIndex = 100;

  btn.addEventListener('click', handleYesClick);
  document.body.appendChild(btn);

  // Start teleporting this button too
  startTeleporting(btn);
}

function handleNoClick(e) {
  e.preventDefault();

  const noButton = document.querySelector('.btn-no');
  const yesButton = document.querySelector('.btn-yes');

  // Change text
  noButton.textContent = messages[messageIndex];
  messageIndex = (messageIndex + 1) % messages.length;

  // Make Yes button bigger
  const currentSize = parseFloat(window.getComputedStyle(yesButton).fontSize);
  const newSize = currentSize * 1.3;
  yesButton.style.fontSize = `${newSize}px`;

  // center yes button to cover everything
  yesButton.style.position = 'fixed';
  yesButton.style.top = '50%';
  yesButton.style.left = '50%';
  yesButton.style.transform = 'translate(-50%, -50%)';
  yesButton.style.zIndex = '500';

  // Make No button smaller (minimum 15px)
  const currentNoSize = parseFloat(window.getComputedStyle(noButton).fontSize);
  noButton.style.fontSize = `${Math.max(15, currentNoSize * 0.95)}px`;

  // Increase difficulty (speed)
  currentTransitionTime = Math.max(0.3, currentTransitionTime * 0.95);

  // Decrease pause duration (minimum 1s)
  pauseDuration = Math.max(1000, pauseDuration * 0.95);

  // Spawn new moving Yes buttons if main one is huge
  if (currentSize > 100) {
    spawnFloatingYes();
  }

  // Start continuous teleporting if not already running for No button
  // We check a flag or just rely on the loop. 
  // Since we refactored, let's just ensure it's started once.
  if (!noButton.dataset.moving) {
    noButton.dataset.moving = "true";
    startTeleporting(noButton);
  }
}

function handleYesClick() {
  // Clear all movement timers
  activeTimeouts.forEach(id => clearTimeout(id));
  window.location.href = "yes_page.html";
}

document.getElementById('noButton').addEventListener('click', handleNoClick);
document.getElementById('yesButton').addEventListener('click', handleYesClick);
