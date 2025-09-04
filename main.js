import menuArray from "./data.js";

const paymentModalForm = document.getElementById("payment-modal-form");
let orderArr = [];

document.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    // Handle button clicks
    const action = e.target.dataset.action;

    if (action === "add") {
      handleAddItemBtnClick(parseInt(e.target.dataset.id));
    } else if (action === "remove") {
      handleRemoveItemBtnClick(e.target.dataset.index);
    } else if (e.target.id === "complete-order-btn") {
      handleCompleteOrderBtnClick();
    }
  } else if (e.target.id === "payment-modal-overlay") {
    // Handle div click
    closePaymentModal();
  }
});
paymentModalForm.addEventListener("submit", handlePayBtnSubmit);

let count = 0;
function handleAddItemBtnClick(id) {
  // Stretch Goal: Update the function so that the orderArr stores the number of items in the cart
  menuArray.forEach((item) => {
    if (item.id === id) {
      orderArr.push({ ...item, index: count++ });
    }
  });

  renderOrderSummary();
}

function handleRemoveItemBtnClick(index) {
  orderArr = orderArr.filter((orderItem) => orderItem.index != index);

  renderOrderSummary();
}

function renderOrderSummary() {
  document.getElementById("order-summary").innerHTML = getOrderSummaryHtml();
}

function getOrderSummaryHtml() {
  if (orderArr.length !== 0) {
    const totalPrice = orderArr.reduce(
      (totalPrice, currItem) => totalPrice + currItem.price,
      0
    );

    return `
			<h2 class="order-summary__title">Your order</h2>
			<ul class="order-summary-list">
				${getOrderSummaryListHtml()}
			</ul>
			<div class="row">
				<p class="order-summary__total">Total price:</p>
				<p class="order-summary__price">$${totalPrice}</p>
			</div>
			<button type="button" class="btn btn--rounded btn--primary" id="complete-order-btn">Complete order</button>
		`;
  } else return "";
}

function getOrderSummaryListHtml() {
  return orderArr
    .map((orderItem) => {
      const { name, price, index } = orderItem;

      return `
			<li class="order-summary-item">
				<p class="order-summary-item__title">${name}</p>
				<button type="button" class="btn btn--remove" data-action="remove" data-index="${index}">remove</button>
				<p class="order-summary-item__price">$${price}</p>
			</li>
		`;
    })
    .join("");
}

function handleCompleteOrderBtnClick() {
  document.getElementById("payment-modal").classList.remove("hidden");
}

function closePaymentModal() {
  document.getElementById("payment-modal").classList.add("hidden");
}

function handlePayBtnSubmit(e) {
  e.preventDefault();
  closePaymentModal();
  document.getElementById("order-summary").innerHTML = "";
  document.getElementById("thank-you").classList.remove("hidden");
  document.querySelectorAll(".btn[data-action='add']").forEach((btn) => {
    btn.disabled = true;
  });
}

// Rendering

function renderMenu() {
  document.getElementById("menu").innerHTML = getMenuHtml();
}

function getMenuHtml() {
  return menuArray
    .map((menuItem) => {
      const { name, ingredients, id, price, emoji } = menuItem;

      return `
    	<li class="menu-item">
				<span class="menu-item__icon">${emoji}</span>
    		<div class="menu-item__info">
					<h2 class="menu-item__title">${name}</h2>
					<p class="menu-item__subtitle">${ingredients.join(", ")}</p>
					<p class="menu-item__price">$${price}</p>
				</div>
				<button type="button" class="btn btn--round" data-action="add" data-id="${id}">+</button>
    	</li>
    `;
    })
    .join("");
}

renderMenu();
