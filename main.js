import menuArray from "./data.js";

let orderArr = [];

document.addEventListener("click", (e) => {
  if (e.target.type === "button") {
    const id = parseInt(e.target.dataset.id);

    if (e.target.dataset.action === "add-item") {
      handleAddItemBtnClick(id);
    } else if (e.target.dataset.action === "remove-item") {
      handleRemoveItemBtnClick(id);
    } else if (e.target.dataset.action === "complete-order") {
      handleCompleteOrderBtnClick();
    }
  } else if (e.target.id === "payment-modal-overlay") {
    closePaymentModal();
  }
});

document.addEventListener("submit", (e) => {
  handlePaymentFormSubmission(e);
});

function handleAddItemBtnClick(id) {
  const existingItem = orderArr.find((item) => item.id === id);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    const menuItem = menuArray.find((item) => item.id === id);
    orderArr.push({ ...menuItem, quantity: 1 });
  }

  renderOrderSummary();
}

function handleRemoveItemBtnClick(id) {
  const selectedItem = orderArr.find((orderItem) => orderItem.id === id);
  if (selectedItem.quantity === 1) {
    const selectedItemIndex = orderArr.indexOf(selectedItem);
    orderArr.splice(selectedItemIndex, 1);
  } else {
    selectedItem.quantity--;
  }

  renderOrderSummary();
}

function handleCompleteOrderBtnClick() {
  const paymentModal = document.getElementById("payment-modal");
  paymentModal.classList.remove("hidden");
}

function handlePaymentFormSubmission(e) {
  e.preventDefault();
  closePaymentModal();
  clearOrderSummary();
  renderThankYou();
}

function closePaymentModal() {
  const paymentModal = document.getElementById("payment-modal");
  paymentModal.classList.add("hidden");
}

function clearOrderSummary() {
  const orderSummary = document.getElementById("order-summary");
  orderSummary.classList.add("hidden");
}

function renderThankYou() {
  const thankYou = document.getElementById("thank-you");
  thankYou.classList.remove("hidden");
}

function renderOrderSummary() {
  const orderSummary = document.getElementById("order-summary");
  orderSummary.innerHTML = getOrderSummaryHtml();
}

function getOrderSummaryHtml() {
  if (orderArr.length !== 0) {
    const totalPrice = orderArr.reduce(
      (total, curr) => total + curr.price * curr.quantity,
      0
    );

    return `
			<h2 class="order-summary__title">Your order</h2>
			<div class="order-items">${getOrderItemsHtml()}</div>
			<div class="total-price__info">
				<p class="total-price__text">Total price:</p>
				<span class="total-price__price align-right">$${totalPrice}</span>
			</div>
			<button 
				type="button" 
				class="btn btn--rounded btn--primary" 
				data-action="complete-order"
			>
				Complete order
			</button>
		`;
  } else return "";
}

function getOrderItemsHtml() {
  return orderArr
    .map((orderItem) => {
      const { name, id, price, quantity } = orderItem;

      return `
				<div class="order-item">
					<p class="order-item__name">${name}</p>
					<p class="order-item__quantity">${quantity > 1 ? "x" + quantity : ""}</p>
					<button 
						type="button" 
						class="btn btn--remove-item" 
						data-id="${id}" 
						data-action="remove-item"
					>
						remove
					</button>
					<p class="order-item__price align-right">$${price}</p>
				</div>
			`;
    })
    .join("");
}

function renderMenuItems() {
  const menu = document.getElementById("menu");
  menu.innerHTML = getMenuItemsHtml();
}

function getMenuItemsHtml() {
  return menuArray
    .map((menuItem) => {
      const { name, ingredients, id, price, emoji } = menuItem;

      return `
			<div class="menu-item">
				<span class="menu-item__icon">${emoji}</span>
				<div class="menu-item__info">
					<h2 class="menu-item__name">${name}</h2>
					<p class="menu-item__ingredients">${ingredients.join(", ")}</p>
					<p class="menu-item__price">$${price}</p>
				</div>
				<button type="button" class="btn btn--circle align-right" data-id="${id}" data-action="add-item">+</button>
			</div>
		`;
    })
    .join("");
}

renderMenuItems();
