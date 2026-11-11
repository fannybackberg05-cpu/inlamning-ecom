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
getProducts(5, 7)
function loadFavorites() {
    const favoritesList = JSON.parse(localStorage.getItem("myFavorites")) || []; 
    const container = document.querySelector(".favorite-container");

    container.innerHTML = "";
    
    if (favoritesList.length === 0) {
        container.innerHTML = `<p class="empty-message">You have no favorites yet</p>`;
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
        <img src="${post.thumbnail}" alt="boll">
        <p>${post.description}</p>
        <p>${post.category}</p>
        <p>$${post.price}</p>
        <button class="add-to-cart-btn">Add to Cart</button>`;

    const closeBtn = item.querySelector(".close-btn");
    closeBtn.addEventListener("click", () => {
        removeFromFavorites(post.id);
    });

    favorites.appendChild(item);
}

loadFavorites();