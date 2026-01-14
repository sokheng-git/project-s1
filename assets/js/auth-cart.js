/* auth-cart.js
   Simple frontend-only auth + per-user cart (localStorage)
   Paste this file to assets/js/auth-cart.js and include it at the end of your pages.
*/

/* ---------- Utilities ---------- */
function readJSON(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (e) {
    return null;
  }
}
function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/* ---------- User management (simple demo) ---------- */
function getUsers() {
  return readJSON("users") || [];
}
function saveUsers(users) {
  writeJSON("users", users);
}
function findUserByUsername(username) {
  return getUsers().find((u) => u.username === username);
}
function registerUser(username, email, password) {
  if (!username || !password)
    return { ok: false, msg: "Username and password required" };
  if (findUserByUsername(username))
    return { ok: false, msg: "Username already exists" };
  const users = getUsers();
  users.push({ username, email, password }); // demo only: plain password
  saveUsers(users);
  return { ok: true };
}
function loginUser(username, password) {
  const user = findUserByUsername(username);
  if (!user || user.password !== password)
    return { ok: false, msg: "Invalid credentials" };
  localStorage.setItem("currentUser", username);
  mergeGuestCartToUser(username);
  return { ok: true };
}
function logoutUser() {
  localStorage.removeItem("currentUser");
}

/* ---------- Cart helpers (per-user) ---------- */
function getCurrentUsername() {
  return localStorage.getItem("currentUser") || null;
}
function getCartKeyForUser(username) {
  return `cart_user_${username}`;
}
function getGuestCartKey() {
  return "cart_guest";
}

function getCart() {
  const username = getCurrentUsername();
  if (username) {
    return readJSON(getCartKeyForUser(username)) || [];
  } else {
    return readJSON(getGuestCartKey()) || [];
  }
}
function saveCart(cart) {
  const username = getCurrentUsername();
  if (username) {
    writeJSON(getCartKeyForUser(username), cart);
  } else {
    writeJSON(getGuestCartKey(), cart);
  }
}

/* Merge guest cart into user's cart on login */
function mergeGuestCartToUser(username) {
  const guestCart = readJSON(getGuestCartKey()) || [];
  if (guestCart.length === 0) return;
  const userKey = getCartKeyForUser(username);
  const userCart = readJSON(userKey) || [];

  guestCart.forEach((gItem) => {
    const existing = userCart.find((u) => u.id === gItem.id);
    if (existing) existing.quantity += gItem.quantity;
    else userCart.push(gItem);
  });

  writeJSON(userKey, userCart);
  localStorage.removeItem(getGuestCartKey());
}

/* ---------- Add to cart (use this everywhere) ---------- */
function addToCart(id, name, price) {
  const cart = getCart();
  const existing = cart.find((i) => i.id === id);
  if (existing) existing.quantity++;
  else cart.push({ id, name, price, quantity: 1 });
  saveCart(cart);
  updateCartBadge();
  alert(name + " added to cart");
}

/* ---------- Cart badge update helper ---------- */
function updateCartBadge() {
  const badge = document.getElementById("cart-badge");
  if (!badge) return;
  const cart = getCart();
  const totalQty = cart.reduce((s, i) => s + (i.quantity || 0), 0);
  badge.textContent = totalQty;
}

/* ---------- Auth UI integration ---------- */
function updateAuthUI() {
  const username = getCurrentUsername();
  const authContainer = document.getElementById("auth-container");
  if (!authContainer) return;
  if (username) {
    authContainer.innerHTML = `
      <span class="text-light me-2">Hi, ${username}</span>
      <button class="btn btn-sm btn-outline-light" id="logoutBtn">Logout</button>
    `;
    document.getElementById("logoutBtn").addEventListener("click", () => {
      logoutUser();
      updateAuthUI();
      updateCartBadge();
    });
  } else {
    authContainer.innerHTML = `
      <a class="btn btn-sm btn-outline-light" href="account.html">Account</a>
    `;
  }
}

/* ---------- Simple modal forms (demo) ---------- */
function showRegisterModal() {
  const html = `
    <div id="authModal" class="auth-modal">
      <div class="auth-content">
        <h5>Register</h5>
        <input id="regUsername" placeholder="Username" class="form-control mb-2"/>
        <input id="regEmail" placeholder="Email" class="form-control mb-2"/>
        <input id="regPassword" placeholder="Password" type="password" class="form-control mb-2"/>
        <div class="d-flex gap-2">
          <button id="regSubmit" class="btn btn-primary">Register</button>
          <button id="regCancel" class="btn btn-secondary">Cancel</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", html);
  document
    .getElementById("regCancel")
    .addEventListener("click", () =>
      document.getElementById("authModal").remove()
    );
  document.getElementById("regSubmit").addEventListener("click", () => {
    const u = document.getElementById("regUsername").value.trim();
    const e = document.getElementById("regEmail").value.trim();
    const p = document.getElementById("regPassword").value;
    const res = registerUser(u, e, p);
    if (!res.ok) alert(res.msg);
    else {
      alert("Registered. You can now login.");
      document.getElementById("authModal").remove();
    }
  });
}

function showLoginModal() {
  const html = `
    <div id="authModal" class="auth-modal">
      <div class="auth-content">
        <h5>Login</h5>
        <input id="loginUsername" placeholder="Username" class="form-control mb-2"/>
        <input id="loginPassword" placeholder="Password" type="password" class="form-control mb-2"/>
        <div class="d-flex gap-2">
          <button id="loginSubmit" class="btn btn-primary">Login</button>
          <button id="loginCancel" class="btn btn-secondary">Cancel</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", html);
  document
    .getElementById("loginCancel")
    .addEventListener("click", () =>
      document.getElementById("authModal").remove()
    );
  document.getElementById("loginSubmit").addEventListener("click", () => {
    const u = document.getElementById("loginUsername").value.trim();
    const p = document.getElementById("loginPassword").value;
    const res = loginUser(u, p);
    if (!res.ok) alert(res.msg);
    else {
      alert("Login successful");
      document.getElementById("authModal").remove();
      updateAuthUI();
      updateCartBadge();
    }
  });
}

/* ---------- Init on page load ---------- */
document.addEventListener("DOMContentLoaded", () => {
  // inject auth container into navbar if not present
  if (!document.getElementById("auth-container")) {
    const nav =
      document.querySelector(".navbar .container .collapse .navbar-nav") ||
      document.querySelector(".navbar .container");
    if (nav) {
      const li = document.createElement("li");
      li.className = "nav-item";
      li.innerHTML =
        '<div id="auth-container" class="d-flex align-items-center"></div>';
      nav.appendChild(li);
    }
  }

  // inject small cart badge if not present
  if (!document.getElementById("cart-badge")) {
    const cartLink = document.querySelector('.nav-link[href="cart.html"]');
    if (cartLink) {
      const span = document.createElement("span");
      span.id = "cart-badge";
      span.className = "badge bg-danger ms-1";
      span.textContent = "0";
      cartLink.appendChild(span);
    }
  }

  updateAuthUI();
  updateCartBadge();
});
