document.addEventListener("DOMContentLoaded", () => {

  const products = [
    {
      id: 4,
      name: "ឧបករណ៍បំពងសម្លេង W-King D110",
      price: 25,
      brand: "W-KING",
      image: "assets/images/speaker.jpg"
    },
    {
      id: 5,
      name: "Xdobo Vibe Plus",
      price: 82,
      brand: "XDOBO",
      image: "assets/images/xdobo.jpg"
    },
    {
      id: 6,
      name: "Speaker Divoom Minitoo",
      price: 39,
      brand: "Divoom",
      image: "assets/images/divoom.jpg"
    }
  ];

  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id"));

  const product = products.find(p => p.id === id);
  const detail = document.getElementById("product-detail");
  const related = document.getElementById("related-products");

  if (!product) {
    detail.innerHTML = "<h4 class='text-danger'>Product not found</h4>";
    return;
  }

  // MAIN DETAIL
  detail.innerHTML = `
    <div class="row">
      <div class="col-md-6">
        <img src="${product.image}" class="img-fluid rounded">
        <div class="d-flex gap-2 mt-2">
          <img src="${product.image}" width="60" class="border rounded">
          <img src="${product.image}" width="60" class="border rounded">
        </div>
      </div>

      <div class="col-md-6">
        <h4>${product.name}</h4>
        <h3 class="text-danger">$${product.price}.00</h3>

        <p><strong>Brand:</strong> 
          <span class="text-primary">${product.brand}</span>
        </p>

        <button class="btn btn-warning text-white px-4"
          onclick="addToCart(${product.id})">
          បន្ថែមទៅកន្ត្រក
        </button>
      </div>
    </div>
  `;

  // RELATED PRODUCTS
  products.filter(p => p.id !== id).forEach(p => {
    related.innerHTML += `
      <div class="col-md-3 mb-3">
        <div class="card h-100">
          <img src="${p.image}" class="card-img-top">
          <div class="card-body">
            <h6>${p.name}</h6>
            <span class="badge bg-primary">$${p.price}</span>
          </div>
        </div>
      </div>
    `;
  });

  window.addToCart = function (id) {
    let cart = JSON.parse(sessionStorage.getItem("cart")) || [];
    const prod = products.find(p => p.id === id);

    const exist = cart.find(i => i.id === id);
    if (exist) exist.quantity++;
    else cart.push({ ...prod, quantity: 1 });

    sessionStorage.setItem("cart", JSON.stringify(cart));
    alert("បានបន្ថែមទៅកន្ត្រក");
  };
});
