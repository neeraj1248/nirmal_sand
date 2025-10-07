// Basic JavaScript (add more for carousels, animations, etc.)
console.log("Script loaded!");

// Example: Simple animation (using vanilla JavaScript - consider using Animate.css for more complex animations)
const expertiseItems = document.querySelectorAll("#our-expertise .expertise-item");

expertiseItems.forEach(item => {
    item.addEventListener("mouseover", () => {
        item.style.transform = "scale(1.05)";  // Simple zoom on hover
        item.style.transition = "transform 0.3s ease";
    });
    item.addEventListener("mouseout", () => {
        item.style.transform = "scale(1)";
    });
});
