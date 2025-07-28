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
  {
    threshold: 0.6, // trigger when 60% of section is visible
  }
);

sections.forEach(section => observer.observe(section));
