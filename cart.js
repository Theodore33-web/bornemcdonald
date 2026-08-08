/* =========================================================
   PANIER
   ========================================================= */

function euro(amount) {
  return amount.toFixed(2).replace(".", ",") + " €";
}

const Cart = (() => {
  let items = []; // { uid, name, image, category, unitPrice, qty, optionsLabel }

  function add(item) {
    items.push({ ...item, uid: `${item.productId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` });
    render();
  }

  function remove(uid) {
    items = items.filter((i) => i.uid !== uid);
    render();
  }

  function changeQty(uid, delta) {
    const item = items.find((i) => i.uid === uid);
    if (!item) return;
    item.qty = Math.max(1, item.qty + delta);
    render();
  }

  function clear() {
    items = [];
    render();
  }

  function subtotal() {
    return items.reduce((sum, i) => sum + i.unitPrice * i.qty, 0);
  }

  function count() {
    return items.reduce((sum, i) => sum + i.qty, 0);
  }

  function getItems() {
    return items;
  }

  function render() {
    const listEl = document.getElementById("cart-items");
    const panelEl = document.getElementById("cart-panel");
    const total = subtotal();

    listEl.innerHTML = items
      .map(
        (i) => `
      <div class="cart-item" data-uid="${i.uid}">
        <img class="cart-item-img" src="${i.image}" alt="">
        <div class="cart-item-info">
          <div class="cart-item-name">${i.name}</div>
          ${i.optionsLabel ? `<div class="cart-item-opts">${i.optionsLabel}</div>` : ""}
          <div class="cart-item-row">
            <div class="cart-item-qty">
              <button class="qty-btn" data-action="dec" aria-label="Diminuer">–</button>
              <span class="qty-value">${i.qty}</span>
              <button class="qty-btn" data-action="inc" aria-label="Augmenter">+</button>
            </div>
            <span class="cart-item-price">${euro(i.unitPrice * i.qty)}</span>
          </div>
          <button class="cart-item-remove" data-action="remove">Retirer</button>
        </div>
      </div>`
      )
      .join("");

    panelEl.classList.toggle("is-empty", items.length === 0);

    document.getElementById("cart-subtotal").textContent = euro(total);
    document.getElementById("cart-total").textContent = euro(total);
    document.getElementById("cart-fab-count").textContent = count();
    document.getElementById("cart-fab-total").textContent = euro(total);
    document.getElementById("payment-total-display").textContent = euro(total);

    const goPayBtn = document.getElementById("go-to-payment");
    goPayBtn.disabled = items.length === 0;
    goPayBtn.style.opacity = items.length === 0 ? 0.5 : 1;

    // Actions sur chaque ligne (délégation)
    listEl.querySelectorAll(".cart-item").forEach((row) => {
      const uid = row.dataset.uid;
      row.querySelector('[data-action="inc"]').onclick = () => changeQty(uid, 1);
      row.querySelector('[data-action="dec"]').onclick = () => changeQty(uid, -1);
      row.querySelector('[data-action="remove"]').onclick = () => remove(uid);
    });
  }

  return { add, remove, changeQty, clear, subtotal, count, getItems, render };
})();
