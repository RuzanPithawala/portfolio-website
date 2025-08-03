// ====== SPLIT HERO ANIMATION ======
const splitLayout = document.querySelector('.split-layout');
const splitLeft = document.querySelector('.split-left');
const splitRight = document.querySelector('.split-right');
const splitDivider = document.querySelector('.split-divider');
const labelLeft = document.querySelector('.label-left');
const labelRight = document.querySelector('.label-right');

let targetPercent = 50;
let currentPercent = 50;

// This keeps animation running until currentPercent matches targetPercent
function animateSplit() {
  // Easing: Lerp toward targetPercent
  currentPercent += (targetPercent - currentPercent) * 0.12;

  // If we're close, just snap to target
  if (Math.abs(currentPercent - targetPercent) < 0.05) {
    currentPercent = targetPercent;
  }

  // Update visuals
  splitDivider.style.left = `${currentPercent}%`;
  splitLeft.style.clipPath = `inset(0 ${100 - currentPercent}% 0 0)`;
  splitRight.style.clipPath = `inset(0 0 0 ${currentPercent}%)`;

  // Labels: Clamp so they never leave the container or overlap divider
  const labelGap = 32;
  const labelLeftWidth = labelLeft.offsetWidth;
  const labelRightWidth = labelRight.offsetWidth;
  const containerWidth = splitLayout.offsetWidth;

  let leftLabelPos = (currentPercent / 100) * containerWidth - labelLeftWidth - labelGap;
  leftLabelPos = Math.max(8, Math.min(leftLabelPos, containerWidth / 2 - labelGap));

  let rightLabelPos = (currentPercent / 100) * containerWidth + labelGap;
  rightLabelPos = Math.max(containerWidth / 2 + labelGap, Math.min(rightLabelPos, containerWidth - labelRightWidth - 8));

  labelLeft.style.left = `${leftLabelPos}px`;
  labelRight.style.left = `${rightLabelPos}px`;

  // Always run, so everything updates in sync
  requestAnimationFrame(animateSplit);
}

// --- Event listeners update only the target! ---
splitLayout.addEventListener('mousemove', e => {
  const rect = splitLayout.getBoundingClientRect();
  const relX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
  targetPercent = (relX / rect.width) * 100;
});

splitLayout.addEventListener('touchmove', e => {
  if (e.touches.length === 1) {
    const rect = splitLayout.getBoundingClientRect();
    const relX = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
    targetPercent = (relX / rect.width) * 100;
  }
});

// Reset to center on mouse leave
splitLayout.addEventListener('mouseleave', () => {
  targetPercent = 50;
});

// On resize, recalculate layout
window.addEventListener('resize', () => {
  animateSplit();
});

// Start the animation loop on page load
window.addEventListener('DOMContentLoaded', () => {
  targetPercent = 50;
  currentPercent = 50;
  animateSplit();
});
