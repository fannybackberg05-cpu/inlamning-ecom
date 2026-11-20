import { addToCart } from "./addtocartfunktioner.js";  // lagt till import

async function getProducts(productId) {
    if (!productId) return;
    const savedProducts = JSON.parse(localStorage.getItem("allProducts")) || [];
    const foundProduct = savedProducts.find(p => Number(p.id) === Number(productId));
    if (foundProduct) {
        createProductCards(foundProduct);
        return;
    }
    try {
        const res = await fetch(`https://dummyjson.com/products/${productId}`);
        if (!res.ok) {
            throw new Error(`Couldn't fetch product. Status: ${res.status}`);
        }
        const data = await res.json();
        createProductCards(data); 
    } catch (error) {
        console.error(error);
    }
}

function loadFavorites() {
    const favoritesList = JSON.parse(localStorage.getItem("myFavorites")) || []; 
    const container = document.querySelector(".favorite-container");

    container.innerHTML = "";
    
    if (favoritesList.length === 0) {
        container.innerHTML = `
        <div class="no-favorites">
            <p class="empty-message">You have no favorites yet!</p>
            <a href="catalog.html" class="back-to-catalog-btn">Browse Catalog</a>
        </div>`;
        return;
    }

    favoritesList.forEach(id => {
        getProducts(id);
    });
}

function removeFromFavorites(productId) {
    let favorites = JSON.parse(localStorage.getItem("myFavorites")) || []; 
    
    favorites = favorites.filter(id => id !== productId);
    
    localStorage.setItem("myFavorites", JSON.stringify(favorites));
    
    loadFavorites();
}

function createProductCards(post) {
    const favorites = document.querySelector(".favorite-container");
    const item = document.createElement("div");
    item.classList.add("item");
    item.innerHTML = `
    <div class="title-and-remove">
        <h2 class="h2">${post.title}</h2>
        <button class="close-btn">&times;</button>
    </div>
        <img class="product-img" src="${post.thumbnail}" alt="boll">
        <p class="product-desc">${post.description}</p>
        <div class="card-footer">
            <p class="product-category">${post.category}</p>
            <p class="product-price">$${post.price}</p>
            <button class="add-to-cart-btn">🛒 Add to Cart</button>
        </div>`
    ;

    const closeBtn = item.querySelector(".close-btn");
    closeBtn.addEventListener("click", () => {
        removeFromFavorites(post.id);
    });

    const addBtn = item.querySelector(".add-to-cart-btn"); // la till knapp för addtocart import
    addBtn.addEventListener("click", () => {
        addToCart(post);
        showToast(`"${post.title}" has been added to your cart!`);
    });

    favorites.appendChild(item);
}

loadFavorites();

function showToast(message) {
    // Ta bort eventuell gammal toast om användaren klickar snabbt flera gånger
    const existingToast = document.querySelector(".cart-toast");
    if (existingToast) existingToast.remove();

    const toast = document.createElement("div");
    toast.classList.add("cart-toast");
    toast.setAttribute("role", "status");
    toast.textContent = message;

    document.body.appendChild(toast);

    // Trigga inflygningen
    requestAnimationFrame(() => {
        toast.classList.add("show");
    });

    // Dölj och ta bort efter 3 sekunder
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

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