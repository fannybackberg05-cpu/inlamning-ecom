// Hämtar kundvagnen från localStorage
export function getCart() {
  return JSON.parse(localStorage.getItem("ecom_cart")) || [];
}

// Sparar kundvagnen till localStorage
export function saveCart(cart) {
  localStorage.setItem("ecom_cart", JSON.stringify(cart));
}

// Lägger till en produkt och loggar resultatet i konsolen
export function addToCart(product) {
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

  // Loggar tydligt i konsolen varje gång något läggs till
  console.log(` Lade till "${product.title}" i kundvagnen!`);
  console.table(getCart());
}