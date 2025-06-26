// assets/js/cart.js

document.addEventListener("DOMContentLoaded", () => {
  const cartListElement = document.getElementById("cart-page-list");
  const cartTotalElement = document.getElementById("cart-page-total");
  const cartCountElement = document.getElementById("cart-count");
  const mainContent = document.querySelector(".main-content");

  /**
   * Lấy giỏ hàng từ localStorage
   */
  function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
  }

  /**
   * Lưu giỏ hàng vào localStorage
   */
  function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCounter();
    renderCart();
  }

  /**
   * Cập nhật số lượng sản phẩm trên icon giỏ hàng
   */
  function updateCartCounter() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCountElement) {
      cartCountElement.textContent = totalItems;
    }
  }

  /**
   * Chuyển đổi chuỗi giá thành số
   */
  function parsePrice(priceString) {
    return parseFloat(priceString.replace(/[^0-9]/g, ""));
  }

  /**
   * Định dạng số thành chuỗi tiền tệ
   */
  function formatCurrency(number) {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(number);
  }

  /**
   * Thay đổi số lượng sản phẩm
   */
  function changeQuantity(productId, newQuantity) {
    let cart = getCart();
    const productIndex = cart.findIndex((item) => item.id === productId);

    if (productIndex !== -1) {
      if (newQuantity > 0) {
        cart[productIndex].quantity = newQuantity;
      } else {
        // Xóa nếu số lượng là 0
        cart.splice(productIndex, 1);
      }
    }
    saveCart(cart);
  }

  /**
   * Xóa sản phẩm khỏi giỏ hàng
   */
  function removeFromCart(productId) {
    let cart = getCart().filter((item) => item.id !== productId);
    saveCart(cart);
  }

  /**
   * Hiển thị các sản phẩm trong giỏ hàng
   */
  function renderCart() {
    if (!cartListElement) return;

    const cart = getCart();
    cartListElement.innerHTML = ""; // Xóa nội dung cũ

    if (cart.length === 0) {
      mainContent.innerHTML = `
                <div class="cart-empty-message">
                    <p>Giỏ hàng của bạn đang trống.</p>
                    <a href="/index.html">Tiếp tục mua sắm</a>
                </div>`;
      if (cartTotalElement) cartTotalElement.textContent = formatCurrency(0);
      return;
    }

    let total = 0;

    cart.forEach((item) => {
      const itemElement = document.createElement("div");
      itemElement.className = "cart-item";

      const itemPrice = parsePrice(item.price);
      total += itemPrice * item.quantity;

      itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p class="price">${item.price}</p>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-control">
                        <button class="quantity-btn" data-id="${item.id}" data-change="-1">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                        <button class="quantity-btn" data-id="${item.id}" data-change="1">+</button>
                    </div>
                    <button class="remove-btn" data-id="${item.id}">🗑️</button>
                </div>
            `;
      cartListElement.appendChild(itemElement);
    });

    if (cartTotalElement) {
      cartTotalElement.textContent = formatCurrency(total);
    }

    // Gán sự kiện cho các nút trong giỏ hàng
    addCartActionsListeners();
  }

  /**
   * Gán sự kiện cho các nút +, -, xóa, input số lượng
   */
  function addCartActionsListeners() {
    // Nút +/-
    document.querySelectorAll(".quantity-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        const productId = e.target.dataset.id;
        const change = parseInt(e.target.dataset.change, 10);
        const cart = getCart();
        const product = cart.find((item) => item.id === productId);
        if (product) {
          changeQuantity(productId, product.quantity + change);
        }
      });
    });

    // Input số lượng
    document.querySelectorAll(".quantity-input").forEach((input) => {
      input.addEventListener("change", (e) => {
        const productId = e.target.dataset.id;
        const newQuantity = parseInt(e.target.value, 10);
        if (newQuantity > 0) {
          changeQuantity(productId, newQuantity);
        } else {
          // Nếu người dùng nhập số <= 0, đặt lại là 1
          e.target.value = 1;
          changeQuantity(productId, 1);
        }
      });
    });

    // Nút xóa
    document.querySelectorAll(".remove-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        const productId = e.target.closest(".remove-btn").dataset.id;
        // Xác nhận trước khi xóa
        if (confirm("Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?")) {
          removeFromCart(productId);
        }
      });
    });
  }


  // Khởi tạo trang giỏ hàng
  updateCartCounter();
  renderCart();
});
