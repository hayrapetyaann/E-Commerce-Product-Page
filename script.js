document.addEventListener("DOMContentLoaded", () => {
const productGrid = document.getElementById("product-grid");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const cartTotalSidebar = document.getElementById("cart-total-sidebar");

// Initialize cart from localStorage or an empty array if no cart data exists
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Fetch products from products.json
fetch("products.json")
  .then((response) => response.json())
  .then((products) => {
    renderProducts(products);
  });

// Function to render products dynamically in the product grid
function renderProducts(products) {
  productGrid.innerHTML = "";
  products.forEach((product) => {
    // Create a new product card for each product
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");
    productCard.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>$${product.price.toFixed(2)}</p>
      <button onclick="addToCart(${product.id})">Add to Cart</button>
    `;
    productGrid.appendChild(productCard); // Append the new product card to the grid
  });
}

// Function to render the shopping cart
function renderCart() {
  cartItems.innerHTML = "";
  let total = 0;
  let itemCount = 0;

  cart.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${item.name}</span>
      <div class="quantity-controls">
        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
        <span>${item.quantity}</span>
        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
      </div>
      <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
    `;
    cartItems.appendChild(li);
    total += item.price * item.quantity;
    itemCount += item.quantity;
  });

  cartCount.textContent = itemCount;
  cartTotal.textContent = total.toFixed(2);
  cartTotalSidebar.textContent = total.toFixed(2);
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Function to add a product to the cart
window.addToCart = function (id) {
  const product = cart.find((item) => item.id === id);
  if (product) {
    product.quantity++;
  } else {
    fetch("products.json")
      .then((response) => response.json())
      .then((products) => {
        const product = products.find((p) => p.id === id);
        cart.push({ ...product, quantity: 1 });
        renderCart();
      });
  }
  renderCart();
};

// Function to update the quantity of an item in the cart
window.updateQuantity = function (id, change) {
  const product = cart.find((item) => item.id === id);
  if (product) {
    product.quantity += change;
    if (product.quantity <= 0) {
      removeFromCart(id);
    } else {
      renderCart();
    }
  }
};

// remove functional
window.removeFromCart = function (id) {
  cart = cart.filter((item) => item.id !== id);
  renderCart();
};

renderCart();
});
