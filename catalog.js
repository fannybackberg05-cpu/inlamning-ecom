const productsContainer = document.getElementById("products-container");
const searchInput = document.getElementById("search-input");
const sortSelect = document.getElementById("sort-select");
const mainCategoriesBox = document.getElementById("main-categories");
const subCategoriesBox = document.getElementById("sub-categories");

const modal = document.getElementById("product-modal");
const closeModalBtn = document.getElementById("close-modal-btn");
const modalImg = document.getElementById("modal-img");
const modalCategory = document.getElementById("modal-category");
const modalTitle = document.getElementById("modal-title");
const modalPrice = document.getElementById("modal-price");
const modalDescription = document.getElementById("modal-description");
const modalSpecs = document.getElementById("modal-specs");
const modalSizes = document.getElementById("modal-sizes");
const minusBtn = document.getElementById("minus-btn");
const plusBtn = document.getElementById("plus-btn");
const qtyNumber = document.getElementById("qty-number");
const modalCartBtn = document.getElementById("modal-cart-btn");

const modalViewSection = document.getElementById("modal-view-section");
const editSection = document.getElementById("edit-section");
const saveEditBtn = document.getElementById("save-edit-btn");
const cancelEditBtn = document.getElementById("cancel-edit-btn");
const formHeading = document.getElementById("form-heading");

let allProducts = [];
let selectedMainCategory = "all";
let selectedSubCategory = "all";
let currentProduct = null;
let currentQuantity = 1;
let isCreatingNew = false;

const categories = {
  Women: [
    "womens-dresses",
    "womens-shoes",
    "womens-bags",
    "womens-jewellery",
    "womens-watches",
  ],
  Men: ["mens-shirts", "mens-shoes", "mens-watches"],
  Home: ["furniture", "home-decoration", "kitchen-accessories"],
  Beauty: ["beauty", "fragrances", "skin-care"],
  Electronics: ["smartphones", "laptops", "tablets", "mobile-accessories"],
  Food: ["groceries"],
};

const savedProducts = JSON.parse(localStorage.getItem("allProducts"));


if (savedProducts && Array.isArray(savedProducts) && savedProducts.length > 0) {
  allProducts = savedProducts;
  createMainCategoryButtons();
  updateProductList();
} else {
  fetch('https://dummyjson.com/products?limit=0')
    .then(res => res.json())
    .then(data => {
      allProducts = data.products;
      saveToLocalStorage();
      createMainCategoryButtons();
      updateProductList();
    });
}

function saveToLocalStorage() {
  try {
    localStorage.setItem("allProducts", JSON.stringify(allProducts));
  } catch (err) {
    alert("Fel vid sparning till localStorage: " + err.message);
  }
}

function toggleFavorite(productId, btnElement) {
  let favorites = JSON.parse(localStorage.getItem("myFavorites")) || [];

  if (favorites.includes(productId)) {
    favorites = favorites.filter(id => id !== productId);
    btnElement.classList.remove("active");
  } else {
    favorites.push(productId);
    btnElement.classList.add("active");
  }

  localStorage.setItem("myFavorites", JSON.stringify(favorites));
}

function createMainCategoryButtons() {
  mainCategoriesBox.innerHTML = `
        <button class="${selectedMainCategory === "all" ? "active" : ""}" onclick="selectMainCategory('all')">All</button>
        ${Object.keys(categories)
          .map(
            (cat) => `
            <button class="${selectedMainCategory === cat ? "active" : ""}" onclick="selectMainCategory('${cat}')">${cat}</button>
        `,
          )
          .join("")}
    `;
}

function selectMainCategory(cat) {
  selectedMainCategory = cat;
  selectedSubCategory = "all";
  createMainCategoryButtons();

  if (cat === "all") {
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
        <button class="${selectedSubCategory === "all" ? "active" : ""}" onclick="selectSubCategory('all')">All ${mainName}</button>
        ${subList
          .map(
            (sub) => `
            <button class="${selectedSubCategory === sub ? "active" : ""}" onclick="selectSubCategory('${sub}')">${sub.replace("-", " ")}</button>
        `,
          )
          .join("")}
    `;
}

function selectSubCategory(sub) {
  selectedSubCategory = sub;
  Array.from(subCategoriesBox.querySelectorAll("button")).forEach((btn) => {
    btn.classList.toggle(
      "active",
      btn.textContent.toLowerCase().includes(sub.replace("-", " ")),
    );
  });
  updateProductList();
}

function updateProductList() {
  const searchText = searchInput.value.toLowerCase();
  const sortChoice = sortSelect.value;

  let filtered = allProducts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchText) ||
      p.description.toLowerCase().includes(searchText);
    const matchesMain =
      selectedMainCategory === "all" ||
      categories[selectedMainCategory].includes(p.category);
    const matchesSub =
      selectedSubCategory === "all" || p.category === selectedSubCategory;

    return matchesSearch && matchesMain && matchesSub;
  });

  if (sortChoice === "price-asc") filtered.sort((a, b) => a.price - b.price);
  if (sortChoice === "price-desc") filtered.sort((a, b) => b.price - a.price);
  if (sortChoice === "rating-desc")
    filtered.sort((a, b) => b.rating - a.rating);

  showProducts(filtered);
}

function showProducts(productsList) {
  const favorites = JSON.parse(localStorage.getItem("myFavorites")) || [];
  let html = `
        <div class="product-card add-new-card" onclick="openCreateMode()" style="display: flex; align-items: center; justify-content: center; cursor: pointer; border: 2px dashed #ccc; background: #fafafa;">
            <div style="text-align: center;">
                <span style="font-size: 50px; color: #888; line-height: 1;">+</span>
                <p style="margin-top: 10px; color: #666; font-weight: bold;">Skapa ny produkt</p>
            </div>
        </div>
    `;

  html += productsList
    .map((product) => {
      const isFavorite = favorites.includes(product.id);
      const activeClass = isFavorite ? "active" : "";

      var safeProduct = encodeURIComponent(JSON.stringify(product));

      // console.log(safeProduct)
      return `
        <div class="product-card" id="product-${product.id}">
            <div>
                <div class="image-box">
                    <button class="heart-btn ${activeClass}"
                        onclick="toggleFavorite(${product.id}, this)"> ♥
                    </button>
                    <img src="${product.thumbnail}" alt="${product.title}">
                </div>
                <h2>${product.title}</h2>
            </div>
            <div>
                <div class="card-meta">
                    <span>$${product.price}</span>
                    <span>★ ${product.rating || 5}</span>
                </div>
                <button class="secondary-btn" data-product="${safeProduct}" onclick="openProductModal(this)" >Read more</button>
                <button class="primary-btn" onclick="addProductToCart(${product.id})">Add to cart</button>
            </div>
        </div>
      `;
    })
    .join("");

  productsContainer.innerHTML = html;
}
async function addProductToCart(productId) {
  const product = allProducts.find(p => p.id === productId);

  if (!product) {
    return;
  }

  const { addToCart } = await import("./addtocartfunktioner.js");

  addToCart(product);

  alert("Produkten har lagts i varukorgen!");
}

let read_more = document.querySelectorAll('.secondary-btn')
read_more.forEach(button => {
    button.addEventListener('click', (e) => {
        
        // console.log(e.target)
    })
})

function openCreateMode() {
  isCreatingNew = true;
  formHeading.textContent = "Skapa ny produkt";

  document.getElementById("edit-title").value = "";
  document.getElementById("edit-price").value = "";
  document.getElementById("edit-description").value = "";
  document.getElementById("edit-thumbnail").value =
    "https://i.dummyjson.com/data/products/1/thumbnail.jpg";

  modalViewSection.style.display = "none";
  editSection.style.display = "block";
  modal.style.display = "flex";
}

function deleteCurrentProduct() {
  if (!currentProduct) return;
  if (confirm("Är du säker på att du vill ta bort denna produkt?")) {
    allProducts = allProducts.filter(
      (p) => Number(p.id) !== Number(currentProduct.id),
    );
    
    saveToLocalStorage();
    modal.style.display = "none";
    updateProductList();
  }
}

searchInput.oninput = updateProductList;
sortSelect.onchange = updateProductList;

function openProductModal(element) {

var product = JSON.parse(decodeURIComponent(element.dataset.product));
  
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
  if (product.brand)
    specsHtml += `<li><strong>Brand:</strong> ${product.brand}</li>`;
  specsHtml += `<li><strong>In stock:</strong> ${product.stock || 10} items</li>`;
  if (product.warrantyInformation)
    specsHtml += `<li><strong>Warranty:</strong> ${product.warrantyInformation}</li>`;
  modalSpecs.innerHTML = specsHtml;

  const clothes = [
    "womens-dresses",
    "womens-shoes",
    "mens-shirts",
    "mens-shoes",
  ];
  modalSizes.style.display = clothes.includes(product.category)
    ? "block"
    : "none";
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
      stock: 10,
    };
    
    allProducts.unshift(newProd);
    alert("Ny produkt har skapats!");
  } else {
    if (!currentProduct) return;

    currentProduct.title = title;
    currentProduct.price = price;
    currentProduct.description = description;
    currentProduct.thumbnail = thumbnail;

    allProducts = allProducts.map(p => Number(p.id) === Number(currentProduct.id) ? currentProduct : p);

    alert("Produkten har uppdaterats!");
  }
  saveToLocalStorage();
  modal.style.display = "none";
});

cancelEditBtn.addEventListener("click", () => {
  if (isCreatingNew) {
    modal.style.display = "none";
  } else {
    editSection.style.display = "none";
    modalViewSection.style.display = "block";
  }
});

closeModalBtn.onclick = () => (modal.style.display = "none");

document.querySelectorAll(".size-btn").forEach((btn) => {
  btn.onclick = () => {
    document
      .querySelectorAll(".size-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
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
// Lägger till produkter i kundvagnen
modalCartBtn.onclick = async () => {

  if (!currentProduct) {
    return;
  }
  const { addToCart } = await import("./addtocartfunktioner.js");
  for (let i = 0; i < currentQuantity; i++) {
    addToCart(currentProduct);
  }
  alert(`${currentQuantity} st ${currentProduct.title} har lagts i varukorgen!`);

  modal.style.display = "none";
};

const menuBtn = document.querySelector(".mobil-menu");
const nav = document.querySelector("#nav");

if (menuBtn && nav) {
  menuBtn.addEventListener("click", () => {
    nav.classList.toggle("open");
    const isOpen = nav.classList.contains("open");
    menuBtn.setAttribute("aria-expanded", isOpen);
    menuBtn.setAttribute("aria-label", isOpen ? "Stäng menyn" : "Öppna menyn");
  });
}