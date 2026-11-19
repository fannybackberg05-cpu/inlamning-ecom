import { getCart, saveCart } from "./addtocartfunktioner.js";
// navigering mobil
const menuBtn = document.querySelector(".mobil-menu");
const nav = document.querySelector(".nav");
const checkoutBtn = document.querySelector("#checkout-btn");
const checkoutMessage = document.querySelector("#checkout-message");

menuBtn.addEventListener("click", () => {
  nav.classList.toggle("open");

  const isOpen = nav.classList.contains("open");

  menuBtn.setAttribute("aria-expanded", isOpen);
  menuBtn.setAttribute("aria-label", isOpen ? "Stäng menyn" : "Öppna menyn");
});

// Hämtar allt som har lagts till från andra sidor och visar det i kassans konsol
const currentCart = getCart();
console.log("Produkter som har kommit fram till kassan:", currentCart);
console.table(currentCart);

const container = document.querySelector("#cart-items");

currentCart.forEach((product) => {
  const card = document.createElement("article");
  card.classList.add("cart-item");

  const image = document.createElement("img");
  image.src = product.thumbnail;
  image.alt = product.title;
  image.classList.add("cart-product-image");

  const info = document.createElement("div");
  info.classList.add("cart-product-info");

  const title = document.createElement("h3");
  title.textContent = product.title;

  const price = document.createElement("p");
  price.textContent = product.price + " $";

  // Skapa en div för antal och knappar
  const quantity = document.createElement("div");
  quantity.classList.add("quantity-controls");

  const minusBtn = document.createElement("button");
  minusBtn.textContent = "−";
  minusBtn.type = "button";

  const quantityText = document.createElement("span");
  quantityText.classList.add("quantity");
  quantityText.textContent = product.quantity;

  const plusBtn = document.createElement("button");
  plusBtn.textContent = "+";
  plusBtn.type = "button";

  quantity.append(minusBtn, quantityText, plusBtn);
  plusBtn.addEventListener("click", () => {
    product.quantity += 1;

    quantityText.textContent = product.quantity;

    saveCart(currentCart);
    updateTotal();
  });
  minusBtn.addEventListener("click", () => {
    if (product.quantity > 1) {
      product.quantity -= 1;

      quantityText.textContent = product.quantity;

      saveCart(currentCart);
      updateTotal();
    }
  });

  info.append(title, price, quantity);
  card.append(image, info);

  container.append(card);
});


const subtotal = document.querySelector("#subtotal");
const cartTotal = document.querySelector("#cart-total");

// Funktion som räknar ut totalsumman
function updateTotal() {
  const cart = getCart();

  const total = cart.reduce((sum, product) => {
    return sum + product.price * product.quantity;
  }, 0);

  subtotal.textContent = total.toFixed(2) + " $";
  cartTotal.textContent = total.toFixed(2) + " $";
}
updateTotal();

checkoutBtn.addEventListener("click", () => {

  const cart = getCart();

  // Kontrollera att varukorgen inte är tom
  if (cart.length === 0) {
    checkoutMessage.textContent = "Din varukorg är tom!";
    return;
  }
  saveCart([]);
  document.querySelector("#cart-items").innerHTML = "";

  updateTotal();
  checkoutMessage.textContent =
    "Tack för ditt köp! Din beställning har genomförts.";

  setTimeout(() => {
    checkoutMessage.textContent = "";
  }, 2000);

});
