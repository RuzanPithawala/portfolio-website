// 📌 Scrollspy: Highlight nav link when section is visible
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

// 📌 Mobile Nav Toggle (Hamburger menu)
const toggleBtn = document.getElementById("menu-toggle");
const navList = document.getElementById("nav-links");

// This line ensures script runs after DOM is loaded (optional safety)
if (toggleBtn && navList) {
  toggleBtn.addEventListener("click", () => {
    navList.classList.toggle("show");
  });
}

// 📌 Optional: Hide nav on link click (mobile)
navLinks.forEach(link => {
  link.addEventListener("click", () => {
    navList.classList.remove("show");
  });
});
