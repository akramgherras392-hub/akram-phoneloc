const STORAGE_KEY = "akramPhoneLocProducts";

const defaultProducts = [
  {
    id: 1,
    name: "iPhone 13 Pro",
    brand: "Apple",
    price: 29990,
    condition: "Très bon état",
    category: "Vente",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80",
    description: "Écran OLED, 128 Go, autonomie solide, très demandé pour les clients sérieux.",
  },
  {
    id: 2,
    name: "Samsung Galaxy S23",
    brand: "Samsung",
    price: 32990,
    condition: "Neuf",
    category: "Vente",
    image:
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=900&q=80",
    description: "Appareil premium, caméra renforcée, très bon niveau de performance pour les usages quotidiens.",
  },
  {
    id: 3,
    name: "Xiaomi Redmi Note 12",
    brand: "Xiaomi",
    price: 18900,
    condition: "Bon état",
    category: "Vente",
    image:
      "https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=900&q=80",
    description: "Excellent rapport qualité/prix, écran lumineux et batterie performante.",
  },
  {
    id: 4,
    name: "Huawei P40 Pro",
    brand: "Huawei",
    price: 23990,
    condition: "Très bon état",
    category: "Échange",
    image:
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=80",
    description: "Très bon appareil pour les amateurs de photo et pour les échanges à prix avantageux.",
  },
];

function getProducts() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProducts));
    return defaultProducts;
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed : defaultProducts;
  } catch {
    return defaultProducts;
  }
}

function saveProducts(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

function formatPrice(value) {
  return Number(value).toLocaleString("fr-DZ") + " DZD";
}

function renderProducts() {
  const grid = document.getElementById("products-grid");
  if (!grid) return;

  const products = getProducts();

  if (!products.length) {
    grid.innerHTML = '<div class="empty-state">Aucun produit disponible pour le moment.</div>';
    return;
  }

  grid.innerHTML = products
    .map(
      (product) => `
        <article class="product-card">
          <img src="${product.image}" alt="${product.name}" />
          <div class="product-body">
            <div class="product-top">
              <h3>${product.name}</h3>
              <span class="product-price">${formatPrice(product.price)}</span>
            </div>

            <div class="product-meta">
              <span>${product.brand}</span>
              <span>${product.condition}</span>
            </div>

            <p>${product.description}</p>

            <div class="product-actions">
              <span class="badge-status">${product.category}</span>
              <a href="https://wa.me/213559180207" target="_blank" class="btn btn-primary btn-small">Commander</a>
            </div>
          </div>
        </article>
      `
    )
    .join("");
}

function handleProductSubmit(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const formData = new FormData(form);
  const product = {
    id: Date.now(),
    name: formData.get("name").toString().trim(),
    brand: formData.get("brand").toString().trim(),
    price: Number(formData.get("price")),
    condition: formData.get("condition").toString(),
    category: formData.get("category").toString(),
    image: formData.get("image").toString().trim(),
    description: formData.get("description").toString().trim(),
  };

  if (!product.name || !product.brand || !product.image || !product.description || !product.price) {
    alert("Veuillez remplir tous les champs correctement.");
    return;
  }

  const products = getProducts();
  products.unshift(product);
  saveProducts(products);
  form.reset();
  renderAdminProducts();
  alert("Produit ajouté avec succès !");
}

function renderAdminProducts() {
  const container = document.getElementById("adminProducts");
  if (!container) return;

  const products = getProducts();

  if (!products.length) {
    container.innerHTML = '<div class="empty-state">Aucune donnée enregistrée.</div>';
    return;
  }

  container.innerHTML = products
    .map(
      (product) => `
        <div class="admin-item">
          <div>
            <h4>${product.name}</h4>
            <p>${product.brand} • ${formatPrice(product.price)} • ${product.condition}</p>
          </div>
          <button class="delete-btn" data-id="${product.id}">Supprimer</button>
        </div>
      `
    )
    .join("");

  container.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset.id);
      const updated = getProducts().filter((item) => item.id !== id);
      saveProducts(updated);
      renderAdminProducts();
    });
  });
}

function handleContactForm(event) {
  event.preventDefault();
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !phone || !message) {
    alert("Veuillez remplir tous les champs du formulaire.");
    return;
  }

  const whatsappText = encodeURIComponent(
    `Bonjour Akram PhoneLoc, je suis ${name}. Mon téléphone : ${phone}. Message : ${message}`
  );

  window.open(`https://wa.me/213559180207?text=${whatsappText}`, "_blank");
  event.currentTarget.reset();
}

window.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderAdminProducts();

  const form = document.getElementById("productForm");
  if (form) {
    form.addEventListener("submit", handleProductSubmit);
  }

  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", handleContactForm);
  }
});

