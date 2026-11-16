async function getProducts(productId) {
    if (!productId) return;
    try {
        const res = await fetch(`https://dummyjson.com/products/${productId}`);
        
        if (!res.ok) {
            throw new Error(`Couldn't fetch product. Status: ${res.status}`);
        }
        const data = await res.json();
        createProductCards(data); 
    } catch (error){
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

    /* knapp-varugkorg-alternativ
        <button class="add-to-cart-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
                Add to Cart
        </button>
     */

    const closeBtn = item.querySelector(".close-btn");
    closeBtn.addEventListener("click", () => {
        removeFromFavorites(post.id);
    });

    favorites.appendChild(item);
}

loadFavorites();