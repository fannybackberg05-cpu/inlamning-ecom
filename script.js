async function getProducts() {
  const container = document.querySelector("#preview");

  container.textContent = "Laddar produkter...";
  try {
    const response = await fetch("https://dummyjson.com/products?limit=0");
    if (!response.ok) {
      throw new Error("Kunde inte hämta produkter");
    }
    const data = await response.json();

    container.innerHTML = "";

    // Välj tre produkter från olika kategorier
    const categories = ["beauty", "furniture", "fragrances"];

    categories.forEach((category) => {
      const product = data.products.find((item) => item.category === category);

      if (product) {
        const card = createCard(product);

        container.append(card);
      }
    });
  } catch (error) {
    console.log(error);
    container.textContent = "Kunde inte ladda produkterna.";
  }
}
getProducts();

function createCard(product) {
  const card = document.createElement("div");
  card.classList.add("product-card");

  const image = document.createElement("img");
  image.src = product.thumbnail;
  image.alt = product.title;

  const title = document.createElement("h3");
  title.textContent = product.title;

  const price = document.createElement("p");
  price.textContent = product.price + " $";

  const link = document.createElement("a");
  link.textContent = "Read More";
  link.href = "catalog.html";
  link.classList.add("product-btn");

  card.append(image, title, price, link);

  return card;
}

const menuBtn = document.querySelector(".mobil-menu");
const nav = document.querySelector(".nav");

menuBtn.addEventListener("click", () => {
  nav.classList.toggle("open");

  const isOpen = nav.classList.contains("open");

  menuBtn.setAttribute("aria-expanded", isOpen);
  menuBtn.setAttribute("aria-label", isOpen ? "Stäng menyn" : "Öppna menyn");
});
