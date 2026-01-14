// assets/js/products.js
document.addEventListener("DOMContentLoaded", function () {

  const products = [
    { id: 1, name: "SONY WH-1000XM5 Wireless Industry Leading Noise Canceling Headphones", price: 299.00 , image: "assets/images/sonyhead.jpg" },
    { id: 2, name: "Mouse Fashion Wired Mouse 3600N", price: 6.00, image: "assets/images/mouse.jpg" },
    { id: 3, name: "ANKER PowerLine III Flow USB-C With Lightning Connector", price: 17.00, image: "assets/images/chargAnker.jpg" },
    { id: 4, name: "Xdobo Vibe Plus", price: 82.00, image: "assets/images/speaker.jpg" },
    { id: 7, name: "KIESLECT Lora3 (PINK)", price: 79, image: "assets/images/នាឡិកាឆ្លាតវៃ ​KIESLECT Lora3 (PINK.jpg" },
    { id: 8, name: "HUAWEI WATCH FIT 4", price: 119, image: "assets/images/HUAWEI WATCH FIT 4.jpg" },
    { id: 9, name: "REMAX POWER BANK RPP-533 PD20+22.5W 10000mAh", price: 29, image: "assets/images/ថ្មជំនួយទូរសព្ទ REMAX POWER BANK RPP-533 PD20+22.5W 10000mAh.jpg" },
    { id: 10, name: "HUAWEI M-Pen lite", price: 20, image: "assets/images/HUAWEI M-Pen lite.jpg" },
    { id: 11, name: "POWER BANK CUKTECH CP24 40W (20000mAh)", price: 39, image: "assets/images/POWER BANK CUKTECH CP24 40W ( 20000mAh ).jpg" },
    { id: 12, name: "LDNIO USB-A+C HUB 4 IN 1 Adapter DS-114uc", price: 29, image: "assets/images/adapter.jpg" },
    { id: 13, name: "Speaker Divoom Minitoo", price: 39, image: "assets/images/Speaker Divoom Minitoo.jpg" },
    { id: 14, name: "BMTJ GRAMMY SINCE 2007", price: 17, image: "assets/images/BMTJ GRAMMY SINCE 2007.jpg" },
    { id: 15, name: "Speaker Divoom Tiivoo2 (White)", price: 69, image: "assets/images/Speaker Divoom Tiivoo2 (White).jpg" },
    { id: 16, name: "SONY SES-XE200 Bluetooth", price: 109, image: "assets/images/ឧបករណ៍បំពងសម្លេង​ SONY SES-XE200 Bluetooth.jpg" },
    { id: 17, name: "Apple EarPods (USB-C)", price: 38, image: "assets/images/Apple EarPods គុណភាពខ្ពស និងប្រើឌុយ USB-C.jpg" },
    { id: 18, name: "REMAX AMOLED WATCH30", price: 59, image: "assets/images/REMAX AMOLED WATCH30.jpg" },
    { id: 19, name: "Apple USB-C Charge Cable (1m)", price: 28, image: "assets/images/Apple USB-C Charge Cable (1m).jpg" },
    { id: 20, name: "Magnetic Charger W50", price: 18, image: "assets/images/ថ្មជំនួយទូរសព្ទទាន់សម័យ Magnetic Charger W50.jpg" }
  ];

  const productList = document.getElementById("product-list");
  const searchInput = document.getElementById("searchInput");
  if (!productList) return;

  // fallback helpers (if auth-cart.js not loaded)
  function readCartFallback() { return JSON.parse(localStorage.getItem('cart')) || []; }
  function writeCartFallback(cart) { localStorage.setItem('cart', JSON.stringify(cart)); }

  function renderProducts(list) {
    productList.innerHTML = "";
    list.forEach(p => {
      productList.innerHTML += `
        <div class="col-md-3 mb-4">
          <div class="card h-100 shadow-sm product-card" data-id="${p.id}">
            <img src="${p.image}" class="card-img-top" alt="${p.name}">
            <div class="card-body text-center">
              <h6 class="card-title">${p.name}</h6>
              <p class="text-primary">$${p.price.toFixed(2)}</p>
              <div class="d-flex justify-content-center gap-2">
                <button class="btn btn-sm btn-outline-primary view-detail-btn" data-id="${p.id}">View</button>
                <button class="btn btn-sm btn-primary add-cart-btn" data-id="${p.id}">Add to Cart</button>
              </div>
            </div>
          </div>
        </div>
      `;
    });
    attachEvents();
  }

  function attachEvents() {
    // view detail
    document.querySelectorAll(".view-detail-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        window.location.href = `product-detail.html?id=${id}`;
      });
    });

    // card click -> detail
    document.querySelectorAll(".product-card").forEach(card => {
      card.addEventListener("click", () => {
        const id = card.dataset.id;
        window.location.href = `product-detail.html?id=${id}`;
      });
    });

    // add to cart
    document.querySelectorAll(".add-cart-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = Number(btn.dataset.id);
        const product = products.find(p => p.id === id);
        if (!product) return alert('Product not found');

        // prefer global addToCart from auth-cart.js if available
        if (typeof addToCart === 'function') {
          addToCart(product.id, product.name, product.price);
        } else {
          // fallback: use 'cart' key
          let cart = readCartFallback();
          const existing = cart.find(i => i.id === product.id);
          if (existing) existing.quantity++;
          else cart.push({ id: product.id, name: product.name, price: product.price, quantity: 1 });
          writeCartFallback(cart);
          // update badge if present
          const badge = document.getElementById('cart-badge');
          if (badge) badge.textContent = cart.reduce((s,i)=>s+(i.quantity||0),0);
          alert(product.name + ' added to cart');
        }
      });
    });
  }

  // search
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const keyword = searchInput.value.trim().toLowerCase();
      renderProducts(products.filter(p => p.name.toLowerCase().includes(keyword)));
    });
  }

  renderProducts(products);
});
