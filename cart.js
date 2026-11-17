import { getCart } from "./addtocartfunktioner.js";
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

// Hämtar allt som har lagts till från andra sidor och visar det i kassans konsol
const currentCart = getCart();
console.log("Produkter som har kommit fram till kassan:", currentCart);
console.table(currentCart);