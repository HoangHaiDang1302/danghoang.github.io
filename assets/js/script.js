document.addEventListener("DOMContentLoaded", () => {
  // Kiểm tra dữ liệu sản phẩm có được tải không
  if (typeof allProducts === "undefined") {
    console.error(
      "Lỗi: Dữ liệu sản phẩm (allProducts) không được tải. Hãy chắc chắn file products.js đã được nhúng trước file này."
    );
    return;
  }

  // CÁC BIẾN VÀ THAM CHIẾU DOM
  const featuredProductsSlider = document.getElementById(
    "featured-products-slider"
  ); // Slider cho sản phẩm nổi bật trên trang chủ
  const productGrid = document.getElementById("product-grid");
  const flashSaleGrid = document.querySelector(".flash-sale-grid");
  const mainboardGrid = document.getElementById("mainboard-grid");
  const mainContent = document.querySelector(".main-content");
  const searchInput = document.getElementById("search-input");
  const searchBtn = document.getElementById("search-btn");
  const sidebar = document.getElementById("sidebar");
  const sidebarToggle = document.getElementById("sidebar-toggle");
  const categoryLinks = document.querySelectorAll(".nav-categories .category");
  const fixedMenuBtn = document.getElementById("fixed-header-menu-btn");
  const pageTitleElement = mainContent?.querySelector("h2");
  const documentTitle = document.querySelector("title");
  const expandSidebarBtn = document.getElementById("expand-sidebar-btn");
  const navCategories = sidebar
    ? sidebar.querySelector(".nav-categories")
    : null;
  const fabMenu = document.getElementById("fab-menu");
  const authStatusElement = document.getElementById("auth-status");

  console.log("DOM elements initialized:");
  console.log("featuredProductsSlider:", featuredProductsSlider);
  console.log(
    "productGrid (on products.html or main product grid on index):",
    productGrid
  );
  console.log("flashSaleGrid:", flashSaleGrid);
  console.log("mainboardGrid:", mainboardGrid);

  // LOGIC GIỎ HÀNG (CART)

  /**
   * Lấy giỏ hàng từ localStorage
   * @returns {Array} - Mảng các sản phẩm trong giỏ hàng
   */
  function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
  }

  /**
   * @param {Array} cart - Mảng các sản phẩm trong giỏ hàng
   */
  function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCounter();
  }

  /**
   * Cập nhật số lượng sản phẩm trên icon giỏ hàng
   */
  function updateCartCounter() {
    const cartCountElement = document.getElementById("cart-count"); //
    const cart = getCart(); //
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0); //
    if (cartCountElement) {
      //
      cartCountElement.textContent = totalItems; //
    }
  }

  /**
   * Thêm sản phẩm vào giỏ hàng
   * @param {string} productId - ID của sản phẩm cần thêm
   */
  function addToCart(productId) {
    const cart = getCart();
    const productToAdd = allProducts.find((p) => p.id === productId);

    if (!productToAdd) return;

    const existingProduct = cart.find((item) => item.id === productId);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({ ...productToAdd, quantity: 1 });
    }

    saveCart(cart);
    showAddToCartNotification("Đã thêm sản phẩm!");
  }

  /**
   * Hiển thị thông báo nhỏ khi thêm sản phẩm vào giỏ hàng
   */
  function showAddToCartNotification(message = "Đã thêm sản phẩm!") {
    let notify = document.getElementById("add-to-cart-notification");
    if (!notify) {
      notify = document.createElement("div");
      notify.id = "add-to-cart-notification";
      notify.className = "add-to-cart-notification"; // Thêm class CSS
      document.body.appendChild(notify);
    }
    notify.textContent = message;
    notify.style.opacity = "1";
    setTimeout(() => {
      notify.style.opacity = "0";
    }, 1200);
  }

  // CÁC HÀM HIỂN THỊ SẢN PHẨM

  /**
   * Hiển thị danh sách sản phẩm ra màn hình
   * @param {Array} productsToDisplay - Mảng sản phẩm cần hiển thị
   * @param {HTMLElement} targetGrid - Element lưới để render sản phẩm
   */
  function displayProducts(productsToDisplay, targetGrid) {
    if (!targetGrid) {
      console.warn("Target grid not found for displayProducts:", targetGrid);
      return;
    }
    targetGrid.innerHTML = ""; // Xóa nội dung cũ

    if (productsToDisplay.length === 0) {
      targetGrid.innerHTML =
        '<p style="grid-column: 1 / -1; text-align: center;">Không tìm thấy sản phẩm phù hợp.</p>';
      return;
    }

    productsToDisplay.forEach((product) => {
      const isFlashSaleProduct =
        product.isFlashSale && product.oldPrice && product.flashSalePrice;
      const priceHTML = isFlashSaleProduct
        ? `<span class="old-price">${product.oldPrice}</span><span class="flash-sale-price">${product.flashSalePrice}</span>`
        : `<p class="price">${product.price}</p>`;

      const productCardHTML = `
            <div class="product-card" data-id="${product.id}" data-category="${product.category}">
                <a href="/pages/product-detail.html?id=${product.id}" class="product-link">
                    <img src="${product.image}" alt="${product.name}" loading="lazy" />
                    <h3>${product.name}</h3>
                </a>
                ${priceHTML}
                <button class="buy-btn">Mua ngay</button>
            </div>
        `;
      targetGrid.insertAdjacentHTML("beforeend", productCardHTML);
    });
    // Debug: Kiểm tra xem sản phẩm đã được thêm vào grid chưa
    console.log(
      `Rendered ${productsToDisplay.length} products to ${
        targetGrid.id || targetGrid.className
      }`
    );
  }

  // LOGIC TÌM KIẾM & LỌC DANH MỤC

  /**
   * Xử lý chức năng tìm kiếm sản phẩm
   */
  function handleSearch() {
    const keyword = searchInput.value.trim().toLowerCase();
    // Chuyển hướng đến trang products để hiển thị kết quả
    window.location.href = `/pages/products.html?search=${encodeURIComponent(
      keyword
    )}`;
  }

  /**
   * Cập nhật trạng thái 'active' cho link danh mục
   */
  function setActiveCategory(currentCategory) {
    categoryLinks.forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("data-category") === currentCategory
      );
    });
  }

  // LOGIC KHỞI TẠO TRANG

  // Cập nhật bộ đếm giỏ hàng ngay khi tải trang
  updateCartCounter();

  const urlParams = new URLSearchParams(window.location.search);
  const categoryFromUrl = urlParams.get("category");
  const searchTermFromUrl = urlParams.get("search");

  // Xác định đây là trang chủ hay trang sản phẩm để áp dụng logic render phù hợp
  const isHomePage =
    window.location.pathname === "/" ||
    window.location.pathname.includes("index.html");
  const isProductsPage = window.location.pathname.includes("products.html");

  if (isProductsPage) {
    // Logic cho trang products.html (luôn hiển thị dưới dạng lưới)
    let productsToRender = [];
    if (categoryFromUrl) {
      if (categoryFromUrl === "all") {
        productsToRender = allProducts;
        if (pageTitleElement) pageTitleElement.textContent = "Tất cả sản phẩm";
        if (documentTitle) documentTitle.textContent = "Tất cả sản phẩm";
      } else {
        productsToRender = allProducts.filter(
          (p) => p.category === categoryFromUrl
        );
        const categoryLink = document.querySelector(
          `.category[data-category='${categoryFromUrl}']`
        );
        const categoryName = categoryLink
          ? categoryLink.textContent
          : "Sản phẩm";
        if (pageTitleElement) pageTitleElement.textContent = categoryName;
        if (documentTitle) documentTitle.textContent = categoryName;
      }
      setActiveCategory(categoryFromUrl);
    } else if (searchTermFromUrl) {
      productsToRender = allProducts.filter((p) =>
        p.name.toLowerCase().includes(searchTermFromUrl.toLowerCase())
      );
      if (pageTitleElement)
        pageTitleElement.textContent = `Kết quả cho "${searchTermFromUrl}"`;
      if (documentTitle)
        documentTitle.textContent = `Tìm kiếm: ${searchTermFromUrl} `;
      setActiveCategory("");
    } else {
      // Mặc định cho trang products.html nếu không có params (hiển thị tất cả sản phẩm)
      productsToRender = allProducts;
      if (pageTitleElement) pageTitleElement.textContent = "Tất cả sản phẩm";
      if (documentTitle) documentTitle.textContent = "Tất cả sản phẩm ";
      setActiveCategory("all");
    }
    // Render sản phẩm vào #product-grid trên products.html (sẽ là một lưới CSS)
    if (productGrid) {
      displayProducts(productsToRender, productGrid);
    }
  } else if (isHomePage) {
    // Logic cho index.html (trang chủ)
    const featuredProducts = allProducts.filter((p) => p.isFeatured === true);
    if (featuredProducts.length === 0) {
      // Fallback nếu không có sản phẩm nổi bật
      featuredProducts = allProducts.slice(0, 10);
    }
    setActiveCategory("all"); // Giữ 'Tất cả' active trong sidebar cho trang chủ

    // Render sản phẩm nổi bật vào slider trên index.html
    if (featuredProductsSlider) {
      displayProducts(featuredProducts, featuredProductsSlider);
    }

    // Render sản phẩm flash sale
    if (flashSaleGrid) {
      const flashSaleProducts = allProducts.filter((p) => p.isFlashSale);
      displayProducts(flashSaleProducts, flashSaleGrid);
    }

    // Render sản phẩm Mainboard
    if (mainboardGrid) {
      const mainboardProducts = allProducts.filter(
        (p) => p.category === "mainboard"
      );
      displayProducts(mainboardProducts, mainboardGrid);
    }
  }

  // GÁN SỰ KIỆN CHUNG

  // Sự kiện tìm kiếm
  searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    handleSearch();
  });
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  });

  // Sự kiện Sidebar Toggle (Mobile)
  let sidebarBackdrop = null;
  function openSidebar() {
    sidebar.classList.add("active");
    if (!sidebarBackdrop) {
      sidebarBackdrop = document.createElement("div");
      sidebarBackdrop.className = "sidebar-backdrop";
      document.body.appendChild(sidebarBackdrop);
      sidebarBackdrop.addEventListener("click", closeSidebar);
    }
    document.body.style.overflow = "hidden"; // Ngăn cuộn body
    if (fabMenu) fabMenu.style.display = "none"; // Ẩn FAB khi sidebar mở
  }

  function closeSidebar() {
    sidebar.classList.remove("active");
    if (sidebarBackdrop) {
      sidebarBackdrop.remove();
      sidebarBackdrop = null;
    }
    document.body.style.overflow = ""; // Cho phép cuộn body trở lại
    handleFabMenuVisibility(); // Hiện lại FAB nếu cần
  }

  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", openSidebar);
  }

  if (fixedMenuBtn) {
    fixedMenuBtn.addEventListener("click", openSidebar);
  }

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1024) {
      closeSidebar(); // Tự động đóng sidebar nếu resize lên desktop
    }
  });

  // Xử lý click danh mục (cho trang products.html có SPA)
  categoryLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const isProductPage = window.location.pathname.includes("products.html");
      if (isProductPage) {
        e.preventDefault();
        const cat = link.getAttribute("data-category");
        const newUrl = link.getAttribute("href");
        history.pushState({ category: cat }, "", newUrl); // Thay đổi URL không tải lại trang

        const filtered =
          cat === "all"
            ? allProducts
            : allProducts.filter((p) => p.category === cat);
        displayProducts(filtered, productGrid); // Render lại lưới sản phẩm chính trên products.html

        const categoryName =
          cat === "all" ? "Tất cả sản phẩm" : link.textContent;
        if (pageTitleElement) pageTitleElement.textContent = categoryName;
        if (documentTitle) documentTitle.textContent = categoryName;
        setActiveCategory(cat);
      }
    });
  });

  // Gắn một listener duy nhất vào body để xử lý tất cả các nút "Mua ngay"
  document.body.addEventListener("click", function (e) {
    const btn = e.target.closest(".buy-btn"); // Tìm phần tử gần nhất là .buy-btn
    if (btn) {
      const productCard = btn.closest(".product-card");
      const productId = productCard
        ? productCard.getAttribute("data-id")
        : null;
      if (productId) {
        addToCart(productId);
        btn.textContent = "Đã thêm!";
        btn.classList.add("added");
        btn.disabled = true;
        setTimeout(() => {
          btn.textContent = "Mua ngay";
          btn.classList.remove("added");
          btn.disabled = false; // Kích hoạt lại nút
        }, 1200);
      }
    }
  });

  //  BANNER SLIDER
  function initBannerSlider() {
    const slider = document.getElementById("banner-slider");
    if (!slider) return;
    const slides = slider.querySelectorAll(".banner-slide");
    const prevBtn = document.getElementById("banner-prev");
    const nextBtn = document.getElementById("banner-next");
    const dotsContainer = document.getElementById("banner-dots");
    let current = 0;
    let autoSlideInterval;

    dotsContainer.innerHTML = "";
    slides.forEach((_, i) => {
      const dot = document.createElement("span");
      dot.className = "banner-dot" + (i === 0 ? " active" : "");
      dot.addEventListener("click", () => showSlide(i));
      dotsContainer.appendChild(dot);
    });
    const dots = dotsContainer.querySelectorAll(".banner-dot");

    function showSlide(idx) {
      slides.forEach((img, i) => {
        img.classList.toggle("active", i === idx);
      });
      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === idx);
      });
      current = idx;
    }

    function nextSlide() {
      showSlide((current + 1) % slides.length);
    }

    function prevSlide() {
      showSlide((current - 1 + slides.length) % slides.length);
    }

    function startAutoSlide() {
      stopAutoSlide();
      autoSlideInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoSlide() {
      clearInterval(autoSlideInterval);
    }

    prevBtn.addEventListener("click", () => {
      prevSlide();
      startAutoSlide();
    });
    nextBtn.addEventListener("click", () => {
      nextSlide();
      startAutoSlide();
    });

    slider.addEventListener("mouseenter", stopAutoSlide);
    slider.addEventListener("mouseleave", startAutoSlide);

    showSlide(0);
    startAutoSlide();
  }

  initBannerSlider();

  // ===== FAB MENU (menu nổi mở sidebar trên mobile) =====
  function handleFabMenuVisibility() {
    if (fabMenu && window.innerWidth < 1024) {
      if (window.scrollY > 120 && !sidebar.classList.contains("active")) {
        fabMenu.style.display = "flex";
      } else {
        fabMenu.style.display = "none";
      }
    } else if (fabMenu) {
      fabMenu.style.display = "none"; // Ẩn FAB trên desktop
    }
  }

  window.addEventListener("scroll", handleFabMenuVisibility);
  window.addEventListener("resize", handleFabMenuVisibility);
  if (fabMenu) {
    fabMenu.addEventListener("click", openSidebar);
  }
  if (sidebar) {
    sidebar.addEventListener("transitionend", handleFabMenuVisibility);
  }
  handleFabMenuVisibility(); // Khởi tạo trạng thái ban đầu

  // Hiệu ứng sticky header
  const headerMain = document.querySelector(".header-main");
  window.addEventListener("scroll", function () {
    if (headerMain) {
      if (window.scrollY > 10) {
        headerMain.classList.add("scrolled");
      } else {
        headerMain.classList.remove("scrolled");
      }
    }
  });
});

//  HIỂN THỊ TRẠNG THÁI ĐĂNG NHẬP HEADER
function updateAuthUI() {
  const authStatusElement = document.getElementById("auth-status");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (authStatusElement) {
    if (currentUser && currentUser.name) {
      // Hiển thị tên người dùng và số lượng sản phẩm trong giỏ hàng
      authStatusElement.innerHTML = `
        <span>Chào, <b>${currentUser.name}</b>!</span>
        <a href="#" id="logout-btn">Đăng xuất</a>
        <a href="pages/cart.html" class="cart-icon">🛒 <span id="cart-count">${totalItems}</span></a>
      `;
      const logoutBtn = document.getElementById("logout-btn");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
          e.preventDefault();
          localStorage.removeItem("currentUser");
          window.location.reload();
        });
      }
    } else {
      // Không đăng nhập vẫn hiển thị số lượng sản phẩm trong giỏ hàng
      authStatusElement.innerHTML = `
        <a href="/pages/login.html">Đăng nhập</a> /
        <a href="/pages/register.html">Đăng ký</a>
        <a href="/pages/cart.html" class="cart-icon">🛒 <span id="cart-count">${totalItems}</span></a>
      `;
    }
  }
}

document.addEventListener("DOMContentLoaded", updateAuthUI);
