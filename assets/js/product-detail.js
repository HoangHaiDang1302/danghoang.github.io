// assets/js/product-detail.js

document.addEventListener("DOMContentLoaded", () => {
  // Check if necessary files are loaded
  if (typeof allProducts === "undefined") {
    console.error(
      "Error: Product data (allProducts) not loaded. Ensure products.js is included before this file."
    );
    return;
  }

  const detailContainer = document.getElementById("product-detail-content");
  const cartCountElement = document.getElementById("cart-count");
  const breadcrumbCategory = document.getElementById("breadcrumb-category");
  const breadcrumbProductName = document.getElementById(
    "breadcrumb-product-name"
  );

  // Get product ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  // Find product in allProducts array
  const product = allProducts.find((p) => p.id === productId);

  // --- Cart handling functions (copied from script.js for standalone use) ---
  function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
  }
  function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCounter();
  }
  function updateCartCounter() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCountElement) {
      cartCountElement.textContent = totalItems;
    }
  }
  function addToCart(id) {
    const cart = getCart();
    const productToAdd = allProducts.find((p) => p.id === id);
    if (!productToAdd) return;
    const existingProduct = cart.find((item) => item.id === id);
    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      cart.push({ ...productToAdd, quantity: 1 });
    }
    saveCart(cart);
  }
  // --- End of cart functions ---

  // Function to render product details
  function renderProductDetail() {
    if (!product) {
      detailContainer.innerHTML = `
                <div class="product-not-found">
                    <h2>Không tìm thấy sản phẩm</h2>
                    <p>Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
                    <a href="../../index.html">Quay về trang chủ</a>
                </div>
            `;
      // Update breadcrumbs for not found state
      if (breadcrumbCategory) breadcrumbCategory.textContent = "Lỗi";
      if (breadcrumbProductName)
        breadcrumbProductName.textContent = "Không tìm thấy sản phẩm";
      return;
    }

    // Update page title
    document.title = `${product.name} | GEARVN Clone`;

    // Update breadcrumbs dynamically
    if (breadcrumbCategory) {
      // Map category keys to Vietnamese names for display
      const categoryMap = {
        cpu: "CPU - Bộ vi xử lý",
        gpu: "GPU - Card màn hình",
        mainboard: "Mainboard - Bo mạch chủ",
        ram: "RAM - Bộ nhớ trong",
        ssd: "SSD - Ổ cứng SSD",
        hdd: "HDD - Ổ cứng HDD",
        psu: "PSU - Nguồn máy tính",
        case: "Case - Vỏ máy tính",
        cooler: "Tản nhiệt",
        monitor: "Màn hình",
        all: "Tất cả sản phẩm",
      };
      const categoryName = categoryMap[product.category] || "Sản phẩm";
      breadcrumbCategory.innerHTML = `<a href="/pages/products.html?category=${product.category}">${categoryName}</a>`;
    }
    if (breadcrumbProductName) {
      breadcrumbProductName.textContent = product.name;
    }

    // Render HTML
    detailContainer.innerHTML = `
      <div class="product-detail-image">
        <div class="gallery-main">
            <img id="gallery-main-img" src="${
              product.image ||
              product.gallery?.[0] ||
              "https://placehold.co/400x300?text=No+Image"
            }" alt="${product.name}">
        </div>
        ${
          product.gallery && product.gallery.length > 0
            ? `<div class="gallery-thumbs">
               ${product.gallery
                 .map(
                   (img, i) =>
                     `<img src="${img}" class="gallery-thumb" data-idx="${i}" alt="thumb ${
                       i + 1
                     }">`
                 )
                 .join("")}
             </div>`
            : ""
        }
      </div>
      <div class="product-detail-info">
        ${(product.tags || [])
          .map((tag) => `<span class="badge">${tag}</span>`)
          .join(" ")}
        <h1>${product.name}</h1>
        <div class="brand-warranty-row">
          ${
            product.brand
              ? `<span class="brand">Thương hiệu: <b>${product.brand}</b></span>`
              : ""
          }
          ${
            product.warranty
              ? `<span class="warranty">Bảo hành: <b>${product.warranty}</b></span>`
              : ""
          }
        </div>
        <div class="stock-rating-row">
          ${
            product.stockStatus
              ? `<span class="stock-status">${product.stockStatus}</span>`
              : ""
          }
          ${
            typeof product.rating === "number" && product.rating > 0
              ? `<span class="rating">${renderStars(
                  product.rating
                )} (${product.rating.toFixed(1)})</span>`
              : `<span class="rating no-rating">Chưa có đánh giá</span>`
          }
        </div>
        <div class="price-row">
          ${
            product.isFlashSale && product.oldPrice && product.flashSalePrice
              ? `<span class="old-price">${product.oldPrice}</span><span class="flash-sale-price">${product.flashSalePrice}</span>`
              : `<span class="flash-sale-price">${product.price}</span>`
          }
        </div>
        <div class="description">
          <p>${
            product.description ||
            "Hiện chưa có mô tả chi tiết cho sản phẩm này."
          }</p>
        </div>
        ${product.specs ? renderSpecsTable(product.specs) : ""}
        <button class="detail-buy-btn" data-id="${
          product.id
        }">Thêm vào giỏ hàng</button>
      </div>
    `;

    // Initialize gallery events
    if (product.gallery && product.gallery.length > 0) {
      const mainImg = detailContainer.querySelector("#gallery-main-img");
      const thumbs = detailContainer.querySelectorAll(".gallery-thumb");

      // Set initial active thumbnail
      if (thumbs.length > 0) {
        thumbs[0].classList.add("active-thumb");
      }

      thumbs.forEach((thumb) => {
        thumb.addEventListener("click", function () {
          mainImg.src = this.src;
          // Remove active class from all and add to clicked one
          thumbs.forEach((t) => t.classList.remove("active-thumb"));
          this.classList.add("active-thumb");
        });
      });
    }

    // Attach event listener for "Add to Cart" button
    const buyBtn = detailContainer.querySelector(".detail-buy-btn");
    if (buyBtn) {
      buyBtn.addEventListener("click", () => {
        addToCart(product.id);
        // Visual feedback for button
        buyBtn.textContent = "Đã thêm!";
        buyBtn.classList.add("added-to-cart"); // Use a CSS class for styling
        buyBtn.disabled = true;
        showAddToCartNotification("Đã thêm sản phẩm!");
        setTimeout(() => {
          buyBtn.textContent = "Thêm vào giỏ hàng";
          buyBtn.classList.remove("added-to-cart");
          buyBtn.disabled = false;
        }, 1200);
      });
    }

    // Append review and related products sections after the main detail content
    const reviewsSection = document.createElement("div");
    reviewsSection.className = "product-reviews";
    reviewsSection.innerHTML = `
      <h2>Đánh giá sản phẩm</h2>
      ${renderReviews(product.reviews)}
    `;
    detailContainer.after(reviewsSection); // Insert after the product-detail-container

    const relatedProductsSection = document.createElement("div");
    relatedProductsSection.className = "related-products";
    relatedProductsSection.innerHTML = renderRelatedProducts();
    if (relatedProductsSection.innerHTML.trim() !== "") {
      // Only append if there are related products
      reviewsSection.after(relatedProductsSection); // Insert after reviews section
    }
  }

  // Function to render product specs table
  function renderSpecsTable(specs) {
    let rows = Object.entries(specs)
      .map(([key, value]) => `<tr><th>${key}</th><td>${value}</td></tr>`)
      .join("");
    return `<h3 class="specs-heading">Thông số kỹ thuật</h3><table class="product-specs-table">${rows}</table>`;
  }

  // Function to suggest related products
  function renderRelatedProducts() {
    const related = allProducts
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 4); // Limit to 4 related products
    if (related.length === 0) return ""; // Return empty string if no related products

    return `<h2>Sản phẩm liên quan</h2><div class="related-list">${related
      .map(
        (p) => `
      <a class='related-card' href='product-detail.html?id=${p.id}'>
        <img src='${p.image}' alt='${
          p.name
        }' onerror="this.onerror=null;this.src='https://placehold.co/100x100?text=No+Image';"/>
        <div class='related-name'>${p.name}</div>
        <div class='related-price'>${
          p.isFlashSale && p.oldPrice && p.flashSalePrice
            ? `<span class='old-price'>${p.oldPrice}</span> <span class='flash-sale-price'>${p.flashSalePrice}</span>`
            : p.price
        }</div>
      </a>`
      )
      .join("")}</div>`;
  }

  // Show small notification when adding to cart (similar to index)
  function showAddToCartNotification(message = "Đã thêm sản phẩm!") {
    let notify = document.getElementById("add-to-cart-notification");
    if (!notify) {
      notify = document.createElement("div");
      notify.id = "add-to-cart-notification";
      notify.style.position = "fixed";
      notify.style.top = "60px";
      notify.style.right = "32px";
      notify.style.zIndex = "9999";
      notify.style.background = "#4caf50";
      notify.style.color = "#fff";
      notify.style.padding = "10px 18px";
      notify.style.borderRadius = "6px";
      notify.style.boxShadow = "0 2px 8px rgba(0,0,0,0.12)";
      notify.style.fontSize = "1rem";
      notify.style.opacity = "0";
      notify.style.transition = "opacity 0.3s";
      document.body.appendChild(notify);
    }
    notify.textContent = message;
    notify.style.opacity = "1";
    setTimeout(() => {
      notify.style.opacity = "0";
    }, 1200);
  }

  // Function to render star rating
  function renderStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return (
      '<span class="stars">' +
      "★".repeat(full) +
      (half ? "½" : "") +
      '<span style="color:#ccc">' +
      "★".repeat(empty) +
      "</span>" +
      "</span>"
    );
  }

  // Function to render product reviews
  function renderReviews(reviews) {
    if (!reviews || !reviews.length)
      return '<div class="no-reviews">Chưa có đánh giá nào cho sản phẩm này. Hãy là người đầu tiên để lại đánh giá!</div>';
    return (
      '<ul class="reviews-list">' +
      reviews
        .map(
          (r) => `
      <li class="review-item">
        <div class="review-user">${r.user} ${renderStars(r.rating)}</div>
        <div class="review-comment">${r.comment}</div>
      </li>
    `
        )
        .join("") +
      "</ul>"
    );
  }

  // Run initialization functions
  updateCartCounter();
  renderProductDetail();
});
