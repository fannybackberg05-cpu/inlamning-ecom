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
let currentCart = getCart();
// ändrade till let annars så kraschar det när man använder filter
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

  const quantity = document.createElement("div");
  quantity.classList.add("quantity-controls");

  const minusBtn = document.createElement("button");
  minusBtn.textContent = "−";
  minusBtn.type = "button";
  // ta-bort knappen och dens event listener
  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.classList.add("remove-item-btn");
  removeBtn.setAttribute("aria-label", `Remove ${product.title}`);
  removeBtn.innerHTML = `
    <svg xmlns="http://w3.org" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      <line x1="10" y1="11" x2="10" y2="17"></line>
      <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
  `;
  removeBtn.addEventListener("click", () => {
    currentCart = currentCart.filter((item) => item.id !== product.id);
    saveCart(currentCart);
    card.remove();
    updateTotal();
  });

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
  card.append(image, info, removeBtn); // append så att knappen syns

  container.append(card);
});


const cartCount = document.querySelector("#cart-count");
const cartTotal = document.querySelector("#cart-total");

// Funktion som räknar ut totalsumman antal produkter i varukorgen och uppdaterar summan i kassan
function updateTotal() {
  const cart = getCart();

  const totalQuantity = cart.reduce((sum, product) => {
    return sum + product.quantity;
  }, 0);

  const total = cart.reduce((sum, product) => {
    return sum + product.price * product.quantity;
  }, 0);

  cartCount.textContent = totalQuantity;
  cartTotal.textContent = total.toFixed(2) + " $";
}
updateTotal();

checkoutBtn.addEventListener("click", () => {

  const cart = getCart();

  // Kontrollera att varukorgen inte är tom
  if (cart.length === 0) {
    checkoutMessage.textContent = "Your shopping cart is empty!";
    return;
  }
  saveCart([]);
  document.querySelector("#cart-items").innerHTML = "";

  updateTotal();
  checkoutMessage.textContent =
    "Thank you for your purchase! Your order has been placed successfully.";

  setTimeout(() => {
    checkoutMessage.textContent = "";
  }, 3000);

});
