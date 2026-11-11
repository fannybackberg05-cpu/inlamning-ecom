//hämta produkter
async function getProducts() {
  const container = document.querySelector("#preview");

  container.textContent = "Laddar produkter...";
  try {
    const response = await fetch(
      "https://dummyjson.com/products?limit=0"
    );
     if (!response.ok) {
      throw new Error("Kunde inte hämta produkter");
    }
    const data = await response.json();

    container.innerHTML = "";

    // Välj tre produkter från olika kategorier
    const categories = ["beauty", "furniture", "fragrances"];

    categories.forEach((category) => {
        const product = data.products.find(
        (item) => item.category === category
      );

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

//skapa kort
function createCard(product) {

  // Skapa ett produktkort
  const card = document.createElement("div");
  card.classList.add("product-card");

  // Skapa produktbild
  const image = document.createElement("img");
  image.src = product.thumbnail;
  image.alt = product.title;

  // Skapa produktnamn
  const title = document.createElement("h3");
  title.textContent = product.title;

  // Skapa pris
  const price = document.createElement("p");
  price.textContent = product.price + " $";

  // Skapa länk
  const link = document.createElement("a");
  link.textContent = "Läs mer";
  link.href = "catalog.html";
  link.classList.add("product-btn");

  // Lägg ihop kortet
  card.append(image, title, price, link);

  return card;
}