const infoContainer = document.querySelector('.info-container');
const productsContainer = document.querySelector('.products-container');

const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');
const tagsContainer = document.getElementById('tags-container');

let allProducts = [];
let activeCategories = "";

function loadProducts() {
    fetch('https://dummyjson.com/products?limit=0')
        .then(response => {
            if (!response.ok) {
                throw new Error('Produkterna kunde inte hämtas.');
            } return response.json();
        })
        .then(data => {
            allProducts = data.products;
            showProducts(allProducts);
            showCategory(allProducts);
        })
        .catch(error=> {
            console.error('Fel vid hämtning av produkter:', error);
        });
}

function showProducts(productsToShow){
    productsContainer.innerHTML = '';

    if (!productsToShow || productsToShow.length === 0) {
        productsContainer.innerHTML = '<p>Inga produkter hittades.</p>';
        return;
    }
    productsToShow.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <img id="productThumbnail" src="${product.thumbnail}" alt="${product.title}">
            <h2 id="productTitle">${product.title}</h2>
            <span id="productPrice" weight="bold">${product.price} $</span>
            <span id="productRating" weight="light">${product.rating} stars</span>
            <button id="read-more-btn">Läs mer</button>
        `;
        productsContainer.appendChild(productCard);
    });
}

function showCategory(products) {
    const uniqueCategories = [...new Set(products.map(product => product.category))];
    
    let categoriesHTML = '<button class="tag-btn active" onclick="selectCategory(\'\')">Alla</button>';
    
    uniqueCategories.forEach(category => {
        const capitalized = category.charAt(0).toUpperCase() + category.slice(1);
        categoriesHTML += `<button class="tag-btn" onclick="selectCategory('${category}')">${capitalized}</button>`;
    });
    
    tagsContainer.innerHTML = categoriesHTML;
}

function selectCategory(category) {
    activeCategories = category;

    document.querySelectorAll('#tags-container button').forEach(btn => {
        if (btn.textContent.toLowerCase() === category.toLowerCase() || (category === '' && btn.textContent === 'Alla')) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    filterAndSort();
}
searchInput.addEventListener('input', () => {
    filterAndSort();
});

sortSelect.addEventListener('change', () => {
    filterAndSort();
});

function filterAndSort() {
    const searchTerm = searchInput.value.toLowerCase();
    const sortValue = sortSelect.value;

    let result = allProducts.filter(product => 
        product.title.toLowerCase().includes(searchTerm) || product.description.toLowerCase().includes(searchTerm) || product.category.toLowerCase().includes(searchTerm)
    );
    if (activeCategories !== "") {
        result = result.filter(product => product.category === activeCategories);
    }
    if (sortValue === 'price-asc') {
        result.sort((a, b) => a.price - b.price);
    } else if (sortValue === 'price-desc') {
        result.sort((a,b) => b.price - a.price);
    } else if (sortValue === 'rating-desc') {
        result.sort((a,b) => b.rating - a.rating);
    }

    showProducts(result);
}

loadProducts();


console.log('Catalog.js loaded');


