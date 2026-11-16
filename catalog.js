const productsContainer = document.getElementById('products-container');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');
const mainCategoriesBox = document.getElementById('main-categories');
const subCategoriesBox = document.getElementById('sub-categories');

const modal = document.getElementById('product-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const modalImg = document.getElementById('modal-img');
const modalCategory = document.getElementById('modal-category');
const modalTitle = document.getElementById('modal-title');
const modalPrice = document.getElementById('modal-price');
const modalDescription = document.getElementById('modal-description');
const modalSpecs = document.getElementById('modal-specs');
const modalSizes = document.getElementById('modal-sizes');
const minusBtn = document.getElementById('minus-btn');
const plusBtn = document.getElementById('plus-btn');
const qtyNumber = document.getElementById('qty-number');
const modalCartBtn = document.getElementById('modal-cart-btn');

const modalViewSection = document.getElementById('modal-view-section');
const editSection = document.getElementById('edit-section');
const saveEditBtn = document.getElementById('save-edit-btn');
const cancelEditBtn = document.getElementById('cancel-edit-btn');
const formHeading = document.getElementById('form-heading');

let allProducts = [];
let selectedMainCategory = "all";
let selectedSubCategory = "all";
let currentProduct = null;
let currentQuantity = 1;
let isCreatingNew = false; 

const categories = {
    "Women": ["womens-dresses", "womens-shoes", "womens-bags", "womens-jewellery", "womens-watches"],
    "Men": ["mens-shirts", "mens-shoes", "mens-watches"],
    "Home": ["furniture", "home-decoration", "kitchen-accessories"],
    "Beauty": ["beauty", "fragrances", "skin-care"],
    "Electronics": ["smartphones", "laptops", "tablets", "mobile-accessories"],
    "Food": ["groceries"]
};

fetch('https://dummyjson.com/products?limit=0')
    .then(res => res.json())
    .then(data => {
        allProducts = data.products;
        createMainCategoryButtons();
        updateProductList();
    if (!productsToShow || productsToShow.length === 0) {
        productsContainer.innerHTML = '<p>Inga produkter hittades.</p>';
        return;
    }

    const favorites = JSON.parse(localStorage.getItem("myFavorites")) || []; // Har skrivit här(Fadi)
    productsToShow.forEach(product => {
        const isFavorite = favorites.includes(product.id); // Har skrivit här(Fadi)
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <img id="productThumbnail" src="${product.thumbnail}" alt="${product.title}">
            <h2 id="productTitle">${product.title}</h2>
            <span id="productPrice" weight="bold">${product.price} $</span>
            <span id="productRating" weight="light">${product.rating} stars</span>
            <button id="read-more-btn">Läs mer</button>
            <button class="fav-btn">
                ${isFavorite ? '❤️ Sparad' : '🤍 Spara favorit'}
            </button>
        `;// Har skrivit härifrån(Fadi) 
        const favBtn = productCard.querySelector('.fav-btn');
        favBtn.addEventListener('click', () => {
            toggleFavorite(product.id, favBtn);
        });
        // tills här
        productsContainer.appendChild(productCard);
    });

function createMainCategoryButtons() {
    mainCategoriesBox.innerHTML = `
        <button class="${selectedMainCategory === 'all' ? 'active' : ''}" onclick="selectMainCategory('all')">All</button>
        ${Object.keys(categories).map(cat => `
            <button class="${selectedMainCategory === cat ? 'active' : ''}" onclick="selectMainCategory('${cat}')">${cat}</button>
        `).join('')}
    `;
}

function selectMainCategory(cat) {
    selectedMainCategory = cat;
    selectedSubCategory = "all";
    createMainCategoryButtons();
function toggleFavorite(productId, btnElement) {
    let favorites = JSON.parse(localStorage.getItem("myFavorites")) || [];

    if (favorites.includes(productId)) {
        // Ta bort om den redan finns
        favorites = favorites.filter(id => id !== productId);
        btnElement.textContent = '🤍 Spara favorit';
        btnElement.classList.remove('saved');
    } else {
        // Lägg till om den inte finns
        favorites.push(productId);
        btnElement.textContent = '❤️ Sparad';
        btnElement.classList.add('saved');
    }

    localStorage.setItem("myFavorites", JSON.stringify(favorites));
} // localstorage funktionen, kan toggla på knapparna så kan du lägga till eller ta bort via knapp tryck

function showCategory(products) {
    const uniqueCategories = [...new Set(products.map(product => product.category))];
    
    let categoriesHTML = '<button class="tag-btn active" onclick="selectCategory(\'\')">Alla</button>';
    
    if (cat === "all" || !categories[cat] || categories[cat].length <= 1) {
        subCategoriesBox.style.display = "none";
    } else {
        createSubCategoryButtons(cat);
    }
    updateProductList();
}

function createSubCategoryButtons(mainName) {
    const subList = categories[mainName];
    subCategoriesBox.style.display = "flex";
    
    subCategoriesBox.innerHTML = `
        <button class="${selectedSubCategory === 'all' ? 'active' : ''}" onclick="selectSubCategory('all')">All ${mainName}</button>
        ${subList.map(sub => `
            <button class="${selectedSubCategory === sub ? 'active' : ''}" onclick="selectSubCategory('${sub}')">${sub.replace('-', ' ')}</button>
        `).join('')}
    `;
}

function selectSubCategory(sub) {
    selectedSubCategory = sub;
    Array.from(subCategoriesBox.querySelectorAll('button')).forEach(btn => {
        btn.classList.toggle('active', btn.textContent.toLowerCase().includes(sub.replace('-', ' ')));
    });
    updateProductList();
}
function updateProductList() {
    const searchText = searchInput.value.toLowerCase();
    const sortChoice = sortSelect.value;

    let filtered = allProducts.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchText) || p.description.toLowerCase().includes(searchText);
        const matchesMain = selectedMainCategory === "all" || categories[selectedMainCategory].includes(p.category);
        const matchesSub = selectedSubCategory === "all" || p.category === selectedSubCategory;
        
        return matchesSearch && matchesMain && matchesSub;
    });

    if (sortChoice === "price-asc") filtered.sort((a, b) => a.price - b.price);
    if (sortChoice === "price-desc") filtered.sort((a, b) => b.price - a.price);
    if (sortChoice === "rating-desc") filtered.sort((a, b) => b.rating - a.rating);

    showProducts(filtered);
}

function showProducts(productsList) {
    let html = `
        <div class="product-card add-new-card" onclick="openCreateMode()" style="display: flex; align-items: center; justify-content: center; cursor: pointer; border: 2px dashed #ccc; background: #fafafa;">
            <div style="text-align: center;">
                <span style="font-size: 50px; color: #888; line-height: 1;">+</span>
                <p style="margin-top: 10px; color: #666; font-weight: bold;">Skapa ny produkt</p>
            </div>
        </div>
    `;

    html += productsList.map(product => `
        <div class="product-card" id="product-${product.id}">
            <div>
                <div class="image-box">
                    <button class="heart-btn" onclick="this.classList.toggle('liked')">♥</button>
                    <img src="${product.thumbnail}" alt="${product.title}">
                </div>
                <h2>${product.title}</h2>
            </div>
            <div>
                <div class="card-meta">
                    <span>$${product.price}</span>
                    <span>★ ${product.rating || 5}</span>
                </div>
                <button class="secondary-btn" onclick='openProductModal(${JSON.stringify(product)})'>Read more</button>
                <button class="primary-btn" onclick="alert('Added ${product.title} to cart!')">Add to cart</button>
            </div>
        </div>
    `).join('');

    productsContainer.innerHTML = html;
}
function openCreateMode() {
    isCreatingNew = true;
    formHeading.textContent = "Skapa ny produkt";

    document.getElementById("edit-title").value = "";
    document.getElementById("edit-price").value = "";
    document.getElementById("edit-description").value = "";
    document.getElementById("edit-thumbnail").value = "https://i.dummyjson.com/data/products/1/thumbnail.jpg";

    modalViewSection.style.display = "none";
    editSection.style.display = "block";
    modal.style.display = "flex";
}
function deleteCurrentProduct() {
    if (!currentProduct) return;
    if (confirm("Är du säker på att du vill ta bort denna produkt?")) {
        allProducts = allProducts.filter(p => Number(p.id) !== Number(currentProduct.id));
        modal.style.display = "none";
        updateProductList();
    }
}
searchInput.oninput = updateProductList;
sortSelect.onchange = updateProductList;

function openProductModal(product) {
    currentProduct = product;
    currentQuantity = 1;
    isCreatingNew = false;
    qtyNumber.textContent = currentQuantity;

    modalViewSection.style.display = "block";
    editSection.style.display = "none";

    modalImg.src = product.thumbnail;
    modalCategory.textContent = product.category.toUpperCase();
    modalTitle.textContent = product.title;
    modalPrice.textContent = "$" + product.price;
    modalDescription.textContent = product.description;

    let specsHtml = "";
    if (product.brand) specsHtml += `<li><strong>Brand:</strong> ${product.brand}</li>`;
    specsHtml += `<li><strong>In stock:</strong> ${product.stock || 10} items</li>`;
    if (product.warrantyInformation) specsHtml += `<li><strong>Warranty:</strong> ${product.warrantyInformation}</li>`;
    modalSpecs.innerHTML = specsHtml;

    const clothes = ["womens-dresses", "womens-shoes", "mens-shirts", "mens-shoes"];
    modalSizes.style.display = clothes.includes(product.category) ? "block" : "none";
    modal.style.display = "flex";
}
function openEditMode() {
    if (!currentProduct) return;

    isCreatingNew = false;
    formHeading.textContent = "Redigera produkt";

    document.getElementById("edit-title").value = currentProduct.title;
    document.getElementById("edit-price").value = currentProduct.price;
    document.getElementById("edit-description").value = currentProduct.description;
    document.getElementById("edit-thumbnail").value = currentProduct.thumbnail;

    modalViewSection.style.display = "none";
    editSection.style.display = "block";
}
saveEditBtn.addEventListener("click", () => {
    const title = document.getElementById("edit-title").value;
    const price = Number(document.getElementById("edit-price").value);
    const description = document.getElementById("edit-description").value;
    const thumbnail = document.getElementById("edit-thumbnail").value;

    if (!title) {
        alert("Du måste ange en titel!");
        return;
    }

    if (isCreatingNew) {
        const newProd = {
            id: Date.now(),
            title: title,
            price: price,
            description: description,
            thumbnail: thumbnail,
            category: selectedMainCategory !== "all" ? selectedMainCategory : "beauty",
            rating: 5,
            stock: 10
        };
        allProducts.unshift(newProd);
        alert("Ny produkt har skapats!");
    } else {
        if (!currentProduct) return;
        currentProduct.title = title;
        currentProduct.price = price;
        currentProduct.description = description;
        currentProduct.thumbnail = thumbnail;
        alert("Produkten har uppdaterats!");
    }

    modal.style.display = "none";
    updateProductList();
});

cancelEditBtn.addEventListener("click", () => {
    if (isCreatingNew) {
        modal.style.display = "none";
    } else {
        editSection.style.display = "none";
        modalViewSection.style.display = "block";
    }
});

closeModalBtn.onclick = () => modal.style.display = "none";

document.querySelectorAll('.size-btn').forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    };
});

minusBtn.onclick = () => {
    if (currentQuantity > 1) {
        currentQuantity--;
        qtyNumber.textContent = currentQuantity;
    }
};

plusBtn.onclick = () => {
    if (currentProduct && currentQuantity < (currentProduct.stock || 10)) {
        currentQuantity++;
        qtyNumber.textContent = currentQuantity;
    }
};
modalCartBtn.onclick = () => {
    alert(`Added ${currentQuantity}x ${currentProduct.title} to cart!`);
    modal.style.display = "none";
};
  
const menuBtn = document.querySelector(".mobil-menu");
const nav = document.querySelector("#nav");

menuBtn.addEventListener("click", () => {

  nav.classList.toggle("open");

  const isOpen = nav.classList.contains("open");

  menuBtn.setAttribute("aria-expanded", isOpen);
  menuBtn.setAttribute(
    "aria-label",
    isOpen ? "Stäng menyn" : "Öppna menyn"
  );

});