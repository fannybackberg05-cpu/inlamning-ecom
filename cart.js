// navigering mobil
const menuBtn = document.querySelector(".mobil-menu");
const nav = document.querySelector(".nav");

menuBtn.addEventListener("click", () => {

  nav.classList.toggle("open");

  const isOpen = nav.classList.contains("open");

  menuBtn.setAttribute("aria-expanded", isOpen);
  menuBtn.setAttribute(
    "aria-label",
    isOpen ? "Stäng menyn" : "Öppna menyn"
  );

});