/* =========================================================
   APPLICATION — navigation entre écrans, rendu du menu,
   modale produit, paiement simulé
   ========================================================= */

let state = {
  orderType: null,
  currentCategory: CATEGORIES[0].id,
  activeProduct: null,
  selection: { formule: "menu", taille: "m", extras: [], qty: 1 },
};

function showScreen(id) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

/* ---------- Écran de veille ---------- */
document.getElementById("btn-start").addEventListener("click", () => {
  showScreen("screen-order-type");
});

/* ---------- Type de commande ---------- */
document.querySelectorAll('[data-order-type]').forEach((btn) => {
  btn.addEventListener("click", () => {
    state.orderType = btn.dataset.orderType;
    document.getElementById("order-type-badge").textContent =
      state.orderType === "sur-place" ? "🍽️ Sur place" : "🥡 À emporter";
    renderCategoryRail();
    renderProducts(state.currentCategory);
    showScreen("screen-menu");
  });
});

/* ---------- Rail de catégories ---------- */
function renderCategoryRail() {
  const rail = document.getElementById("category-rail");
  rail.innerHTML = CATEGORIES.map(
    (c) => `
    <button class="category-btn ${c.id === state.currentCategory ? "active" : ""}" data-cat="${c.id}">
      <span class="cat-icon">${c.icon}</span>
      <span>${c.label}</span>
    </button>`
  ).join("");

  rail.querySelectorAll(".category-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.currentCategory = btn.dataset.cat;
      renderCategoryRail();
      renderProducts(state.currentCategory);
    });
  });
}

/* ---------- Grille produits ---------- */
function renderProducts(categoryId) {
  const cat = CATEGORIES.find((c) => c.id === categoryId);
  document.getElementById("category-heading").textContent = cat.label;

  const grid = document.getElementById("product-grid");
  const products = PRODUCTS.filter((p) => p.category === categoryId);

  grid.innerHTML = products
    .map(
      (p) => `
    <button class="product-card" data-id="${p.id}">
      <div class="product-card-img-wrap">
        <img loading="lazy" src="${DriveImages.getUrl(p.image, p.name, p.category)}" alt="${p.name}">
      </div>
      <div class="product-card-body">
        <div class="product-card-name">${p.name}</div>
        <div class="product-card-price">${euro(p.price)}</div>
      </div>
    </button>`
    )
    .join("");

  grid.querySelectorAll(".product-card").forEach((card) => {
    card.addEventListener("click", () => openProductModal(card.dataset.id));
  });
}

/* ---------- Modale produit ---------- */
const modalOverlay = document.getElementById("product-modal-overlay");

function openProductModal(productId) {
  const p = PRODUCTS.find((x) => x.id === productId);
  state.activeProduct = p;
  state.selection = { formule: "menu", taille: "m", extras: [], qty: 1 };

  document.getElementById("product-modal-image").src = DriveImages.getUrl(p.image, p.name, p.category);
  document.getElementById("product-modal-image").alt = p.name;
  document.getElementById("product-modal-name").textContent = p.name;
  document.getElementById("product-modal-desc").textContent = p.desc;
  document.getElementById("qty-value").textContent = "1";

  // Formule (menu / seul) — uniquement pour les burgers vendus en "menus"
  const formuleWrap = document.getElementById("option-formule-wrap");
  if (p.formule) {
    formuleWrap.hidden = false;
    document.getElementById("option-formule").innerHTML = `
      <button class="pill selected" data-formule="menu">En menu</button>
      <button class="pill" data-formule="seul">Seul (-2,50 €)</button>`;
    bindPillGroup("option-formule", "formule", (val) => (state.selection.formule = val));
  } else {
    formuleWrap.hidden = true;
  }

  // Taille boisson/frite
  const tailleWrap = document.getElementById("option-taille-wrap");
  if (p.tailleBoisson) {
    tailleWrap.hidden = false;
    document.getElementById("option-taille").innerHTML = TAILLES_BOISSON.map(
      (t, idx) => `
      <button class="pill ${idx === 0 ? "selected" : ""}" data-formule="${t.id}">
        ${t.label} ${t.priceDelta > 0 ? `<span class="pill-extra-price">+${euro(t.priceDelta)}</span>` : ""}
      </button>`
    ).join("");
    bindPillGroup("option-taille", "taille", (val) => (state.selection.taille = val));
  } else {
    tailleWrap.hidden = true;
  }

  // Suppléments (multi-sélection)
  const extrasWrap = document.getElementById("option-extras-wrap");
  if (p.extras && p.extras.length) {
    extrasWrap.hidden = false;
    document.getElementById("option-extras").innerHTML = p.extras
      .map(
        (e) => `
      <button class="pill" data-extra="${e.id}">
        ${e.label} ${e.price > 0 ? `<span class="pill-extra-price">+${euro(e.price)}</span>` : ""}
      </button>`
      )
      .join("");
    document.querySelectorAll("#option-extras .pill").forEach((pill) => {
      pill.addEventListener("click", () => {
        pill.classList.toggle("selected");
        const id = pill.dataset.extra;
        if (pill.classList.contains("selected")) {
          state.selection.extras.push(id);
        } else {
          state.selection.extras = state.selection.extras.filter((x) => x !== id);
        }
        updateModalPrice();
      });
    });
  } else {
    extrasWrap.hidden = true;
  }

  updateModalPrice();
  modalOverlay.classList.add("active");
}

function bindPillGroup(containerId, stateKey, onChange) {
  const container = document.getElementById(containerId);
  container.querySelectorAll(".pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      container.querySelectorAll(".pill").forEach((p) => p.classList.remove("selected"));
      pill.classList.add("selected");
      onChange(pill.dataset.formule);
      updateModalPrice();
    });
  });
}

function computeUnitPrice() {
  const p = state.activeProduct;
  let price = p.price;
  if (p.formule && state.selection.formule === "seul") price -= 2.5;
  if (p.tailleBoisson) {
    const t = TAILLES_BOISSON.find((x) => x.id === state.selection.taille);
    if (t) price += t.priceDelta;
  }
  if (p.extras) {
    state.selection.extras.forEach((extraId) => {
      const e = p.extras.find((x) => x.id === extraId);
      if (e) price += e.price;
    });
  }
  return Math.max(price, 0);
}

function updateModalPrice() {
  const unit = computeUnitPrice();
  const total = unit * state.selection.qty;
  document.getElementById("product-modal-price").textContent = euro(total);
}

document.getElementById("qty-minus").addEventListener("click", () => {
  state.selection.qty = Math.max(1, state.selection.qty - 1);
  document.getElementById("qty-value").textContent = state.selection.qty;
  updateModalPrice();
});
document.getElementById("qty-plus").addEventListener("click", () => {
  state.selection.qty = Math.min(20, state.selection.qty + 1);
  document.getElementById("qty-value").textContent = state.selection.qty;
  updateModalPrice();
});

function closeProductModal() {
  modalOverlay.classList.remove("active");
}
document.getElementById("product-modal-close").addEventListener("click", closeProductModal);
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeProductModal();
});

document.getElementById("add-to-cart-btn").addEventListener("click", () => {
  const p = state.activeProduct;
  const sel = state.selection;
  const labels = [];
  if (p.formule) labels.push(sel.formule === "menu" ? "En menu" : "Seul");
  if (p.tailleBoisson) labels.push(TAILLES_BOISSON.find((t) => t.id === sel.taille).label);
  if (p.extras && sel.extras.length) {
    labels.push(sel.extras.map((id) => p.extras.find((e) => e.id === id).label).join(", "));
  }

  Cart.add({
    productId: p.id,
    name: p.name,
    image: DriveImages.getUrl(p.image, p.name, p.category),
    category: p.category,
    unitPrice: computeUnitPrice(),
    qty: sel.qty,
    optionsLabel: labels.join(" · "),
  });

  closeProductModal();
});

/* ---------- Panneau panier ---------- */
const cartPanel = document.getElementById("cart-panel");
const cartOverlay = document.getElementById("cart-overlay");

function openCart() {
  cartPanel.classList.add("open");
  cartOverlay.classList.add("active");
}
function closeCart() {
  cartPanel.classList.remove("open");
  cartOverlay.classList.remove("active");
}
document.getElementById("cart-fab").addEventListener("click", openCart);
document.getElementById("cart-close").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

document.getElementById("go-to-payment").addEventListener("click", () => {
  if (Cart.count() === 0) return;
  closeCart();
  showScreen("screen-payment");
});

/* ---------- Paiement simulé ---------- */
document.querySelectorAll("[data-payment]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const method = btn.dataset.payment;
    const title = document.getElementById("processing-title");
    title.textContent =
      method === "especes" ? "Dirigez-vous vers la caisse…" : "Paiement en cours…";
    showScreen("screen-processing");

    const delay = method === "especes" ? 1200 : 2200;
    setTimeout(() => {
      finalizeOrder();
    }, delay);
  });
});

function finalizeOrder() {
  const orderNumber = String(Math.floor(100 + Math.random() * 899));
  document.getElementById("order-number").textContent = orderNumber;
  document.getElementById("order-note").textContent =
    state.orderType === "sur-place"
      ? "Votre commande vous sera apportée à table. Merci de patienter."
      : "Rendez-vous au comptoir avec votre numéro pour récupérer votre commande.";
  Cart.clear();
  showScreen("screen-confirm");
}

document.getElementById("btn-new-order").addEventListener("click", () => {
  state = { orderType: null, currentCategory: CATEGORIES[0].id, activeProduct: null, selection: { formule: "menu", taille: "m", extras: [], qty: 1 } };
  showScreen("screen-idle");
});

/* ---------- Démarrage ---------- */
(async function init() {
  Cart.render();
  const status = await DriveImages.init();
  if (status.connected) {
    console.info(`Google Drive connecté : ${status.count} image(s) trouvée(s).`);
  } else {
    console.info("Mode démo : images de remplacement (configurez js/config.js pour utiliser Google Drive).");
  }
  renderCategoryRail();
})();
