// 1. Lägger in CSS för laddningscirkeln automatiskt när filen laddas
if (typeof document !== "undefined" && !document.getElementById("cart-spinner-styles")) {
  const style = document.createElement("style");
  style.id = "cart-spinner-styles";
  style.textContent = `
    .btn-spinner {
      display: inline-block;
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: currentColor;
      border-radius: 50%;
      animation: cartSpin 0.6s linear infinite;
      vertical-align: middle;
      margin-right: 6px;
    }
    .is-loading {
      opacity: 0.85;
      cursor: wait;
    }
    @keyframes cartSpin {
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}

// 2. Hämtar kundvagnen från localStorage
export function getCart() {
  return JSON.parse(localStorage.getItem("ecom_cart")) || [];
}

// 3. Sparar kundvagnen till localStorage
export function saveCart(cart) {
  localStorage.setItem("ecom_cart", JSON.stringify(cart));
}

// 4. Lägger till en produkt och visar laddningseffekten
export function addToCart(product, button = null) {
  const cart = getCart();
  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
      quantity: 1,
    });
  }

  saveCart(cart);

  console.log(` Lade till "${product.title}" i kundvagnen!`);
  console.table(getCart());

 // Hitta knappen via argument, event, fokus eller hovring
  const targetBtn =
    button ||
    (typeof window !== "undefined" &&
    window.event?.currentTarget?.tagName === "BUTTON"
      ? window.event.currentTarget
      : typeof document !== "undefined" &&
        document.activeElement?.tagName === "BUTTON"
      ? document.activeElement
      : typeof document !== "undefined"
      ? document.querySelector("button:hover")
      : null);

  if (targetBtn && !targetBtn.classList.contains("is-loading")) {
    const originalHTML = targetBtn.innerHTML;
    targetBtn.disabled = true;
    targetBtn.classList.add("is-loading");
    targetBtn.innerHTML = `<span class="btn-spinner"></span> Loading...`;

    // Startar timern först när webbläsaren ritar skärmen (alltså EFTER att alerten stängts)
    requestAnimationFrame(() => {
      setTimeout(() => {
        targetBtn.innerHTML = originalHTML;
        targetBtn.disabled = false;
        targetBtn.classList.remove("is-loading");
      }, 800);
    });
  }
}