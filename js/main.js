// ====== SCROLLSPY ======
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("nav a");

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      const id = entry.target.getAttribute("id");
      const navItem = document.querySelector(`nav a[href="#${id}"]`);
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.remove("active"));
        navItem.classList.add("active");
      }
    });
  },
  { threshold: 0.6 }
);

sections.forEach(section => observer.observe(section));

// ====== MOBILE NAV TOGGLE ======
const toggleBtn = document.getElementById("menu-toggle");
const navList = document.getElementById("nav-links");

if (toggleBtn && navList) {
  toggleBtn.addEventListener("click", () => {
    navList.classList.toggle("show");
    toggleBtn.classList.toggle("active");
  });
}

// Hide nav when a link is clicked
navLinks.forEach(link => {
  link.addEventListener("click", () => {
    navList.classList.remove("show");
    toggleBtn.classList.remove("active");
  });
});

// ====== AOS (Animate On Scroll) ======
if (typeof AOS !== "undefined") {
  AOS.init({
    offset: 100,
    duration: 600,
    easing: 'ease-in-out',
    once: true,
  });
}

// ====== SPLIT HERO ANIMATION (Desktop only) ======
const splitLayout = document.querySelector('.split-layout');
const splitLeft = document.querySelector('.split-left');
const splitRight = document.querySelector('.split-right');
const splitDivider = document.querySelector('.split-divider');
const labelLeft = document.querySelector('.label-left');
const labelRight = document.querySelector('.label-right');

let targetPercent = 50;
let currentPercent = 50;
let animating = false;

// --- Desktop check
function isDesktop() {
  return window.innerWidth >= 900;
}

// --- Animate the split hero (divider, images, labels)
function animateSplit() {
  if (!splitLayout) return;

  // Lerp current toward target for smooth animation
  currentPercent += (targetPercent - currentPercent) * 0.12;
  if (Math.abs(currentPercent - targetPercent) < 0.05) {
    currentPercent = targetPercent;
  }

  // Update UI
  splitDivider.style.left = `${currentPercent}%`;
  splitLeft.style.clipPath = `inset(0 ${100 - currentPercent}% 0 0)`;
  splitRight.style.clipPath = `inset(0 0 0 ${currentPercent}%)`;

  // Move labels near divider, clamped to edges
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

  // Keep animating if desktop and not at target
  if (isDesktop() && Math.abs(currentPercent - targetPercent) >= 0.05) {
    requestAnimationFrame(animateSplit);
    animating = true;
  } else {
    animating = false;
  }
}

// --- Desktop event listeners ---
function handleMouseMove(e) {
  const rect = splitLayout.getBoundingClientRect();
  const relX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
  targetPercent = (relX / rect.width) * 100;
  if (!animating) {
    animateSplit();
  }
}

function handleMouseLeave() {
  targetPercent = 50;
  if (!animating) {
    animateSplit();
  }
}

// --- Enable/Disable Split Animation Responsively ---
function enableSplitAnimation() {
  if (!splitLayout) return;
  splitLayout.addEventListener('mousemove', handleMouseMove);
  splitLayout.addEventListener('mouseleave', handleMouseLeave);
  // Start animating if needed
  targetPercent = currentPercent; // keep position
}

function disableSplitAnimation() {
  if (!splitLayout) return;
  splitLayout.removeEventListener('mousemove', handleMouseMove);
  splitLayout.removeEventListener('mouseleave', handleMouseLeave);
  // Reset split to center (static)
  targetPercent = 50;
  if (!animating) {
    animateSplit();
  }
}

// --- Choose which mode to use (desktop vs mobile/tablet)
function updateSplitMode() {
  if (!splitLayout) return;
  if (isDesktop()) {
    enableSplitAnimation();
  } else {
    disableSplitAnimation();
    // On mobile: always keep at center
    currentPercent = 50;
    splitDivider.style.left = "50%";
    splitLeft.style.clipPath = "inset(0 50% 0 0)";
    splitRight.style.clipPath = "inset(0 0 0 50%)";
    // Center labels
    const labelGap = 32;
    const labelLeftWidth = labelLeft.offsetWidth;
    const labelRightWidth = labelRight.offsetWidth;
    const containerWidth = splitLayout.offsetWidth;
    let leftLabelPos = (50 / 100) * containerWidth - labelLeftWidth - labelGap;
    leftLabelPos = Math.max(8, Math.min(leftLabelPos, containerWidth / 2 - labelGap));
    let rightLabelPos = (50 / 100) * containerWidth + labelGap;
    rightLabelPos = Math.max(containerWidth / 2 + labelGap, Math.min(rightLabelPos, containerWidth - labelRightWidth - 8));
    labelLeft.style.left = `${leftLabelPos}px`;
    labelRight.style.left = `${rightLabelPos}px`;
  }
}

// --- On DOM ready, on resize ---
window.addEventListener('DOMContentLoaded', () => {
  updateSplitMode();
  targetPercent = 50;
  currentPercent = 50;
  animateSplit();
});
window.addEventListener('resize', updateSplitMode);
