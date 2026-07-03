const DB = {
  _key: "nexuspanel_db",

  defaults() {
    return {
      products: [],
      categories: [],
      users: [],
      nextId: { products: 0, categories: 0, users: 0 },
      activity: [],
    };
  },

  load() {
    try {
      const raw = localStorage.getItem(this._key);
      return raw ? JSON.parse(raw) : this.defaults();
    } catch {
      return this.defaults();
    }
  },

  save(data) {
    try {
      localStorage.setItem(this._key, JSON.stringify(data));
    } catch (e) {
      console.warn("Storage full", e);
    }
  },

  reset() {
    const d = this.defaults();
    this.save(d);
    return d;
  },
};

// ============================================================
// APP STATE
// ============================================================
let state = DB.load();
let currentPage = "dashboard";
let deleteTarget = null;

// Pagination
const PAGE_SIZE = 6;
let productPage = 1;
let userPage = 1;

// Filtered lists
let filteredProducts = [...state.products];
let filteredUsers = [...state.users];
let filteredCategories = [...state.categories];

// ============================================================
// NAVIGATION
// ============================================================
function navigateTo(page) {
  document.querySelectorAll(".page").forEach((p) => p.classList.add("hidden"));
  document
    .querySelectorAll(".nav-item")
    .forEach((n) => n.classList.remove("active"));

  const target = document.getElementById("page-" + page);
  if (target) {
    target.classList.remove("hidden");
    target.scrollTop = 0;
  }

  const navEl = document.getElementById("nav-" + page);
  if (navEl) navEl.classList.add("active");

  currentPage = page;

  const titles = {
    dashboard: "Dashboard",
    products: "Products",
    categories: "Categories",
    users: "Users",
    settings: "Settings",
  };
  document.getElementById("pageTitle").textContent = titles[page] || page;
  document.getElementById("breadcrumb").textContent =
    `Home / ${titles[page] || page}`;

  if (page === "dashboard") renderDashboard();
  if (page === "products") {
    populateCategoryFilter();
    filterProducts();
  }
  if (page === "categories") filterCategories();
}

document.querySelectorAll(".nav-item").forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    navigateTo(item.dataset.page);
  });
});

// ============================================================
// SIDEBAR TOGGLE
// ============================================================
document.getElementById("sidebarToggle").addEventListener("click", () => {
  document.getElementById("sidebar").classList.toggle("collapsed");
});

// ============================================================
// MODAL SYSTEM
// ============================================================
let activeModal = null;

function openModal(type, id = null) {
  closeModal(false);
  let modalId;

  if (type === "product") {
    modalId = "productModal";
    prepareProductModal(id);
  }
  if (type === "category") {
    modalId = "categoryModal";
    prepareCategoryModal(id);
  }
  if (type === "user") {
    modalId = "userModal";
    prepareUserModal(id);
  }
  if (type === "delete") {
    modalId = "deleteModal";
  }

  const overlay = document.getElementById("modalOverlay");
  const modal = document.getElementById(modalId);

  overlay.classList.add("active");
  modal.classList.add("active");
  activeModal = modalId;

  // Focus first input
  setTimeout(() => {
    const input = modal.querySelector("input:not([type=hidden])");
    if (input) input.focus();
  }, 100);
}

function closeModal(animate = true) {
  document.getElementById("modalOverlay").classList.remove("active");
  document
    .querySelectorAll(".modal")
    .forEach((m) => m.classList.remove("active"));
  activeModal = null;
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

// ============================================================
// GLOBAL SEARCH
// ============================================================
document.getElementById("globalSearch").addEventListener("input", function () {
  const q = this.value.toLowerCase();
  if (!q) return;

  // Quick navigation hints
  if ("products".includes(q)) navigateTo("products");
  else if ("categories".includes(q)) navigateTo("categories");
  else if ("users".includes(q)) navigateTo("users");
  else if ("settings".includes(q)) navigateTo("settings");
  else if ("dashboard".includes(q)) navigateTo("dashboard");
});

// ============================================================
// INIT
// ============================================================
function init() {
  navigateTo("dashboard");
}

init();

// ============================================================
// DASHBOARD
// ============================================================
function renderDashboard() {
  updateStats();

  // Recent products (last 5)
  const tbody = document.getElementById("dashProductBody");
  if (tbody) {
    const recent = state.products.slice(0, 5);
    tbody.innerHTML = recent
      .map(
        (p) => `
      <tr>
        <td style="font-weight:600">${escapeHtml(p.name)}</td>
        <td style="color:var(--text-secondary)">${escapeHtml(p.category)}</td>
        <td style="color:var(--accent);font-weight:600">$${p.price.toFixed(2)}</td>
        <td>${statusBadge(p.status)}</td>
      </tr>
    `,
      )
      .join("");
  }

  // Recent users (last 5)
  const ubody = document.getElementById("dashUserBody");
  if (ubody) {
    const recent = state.users.slice(0, 5);
    ubody.innerHTML = recent
      .map(
        (u) => `
      <tr>
        <td style="font-weight:600">${escapeHtml(u.name)}</td>
        <td style="color:var(--text-secondary);font-size:0.82rem">${escapeHtml(u.email)}</td>
        <td>${roleBadge(u.role)}</td>
        <td>${statusBadge(u.status)}</td>
      </tr>
    `,
      )
      .join("");
  }

  // Activity
  renderActivity();
}

function updateStats() {
  animateCount("statProducts", state.products.length);
  animateCount("statCategories", state.categories.length);
  animateCount("statUsers", state.users.length);
}

function animateCount(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  const start = parseInt(el.textContent) || 0;
  const diff = target - start;
  const steps = 20;
  let i = 0;
  const timer = setInterval(() => {
    i++;
    el.textContent = Math.round(start + (diff * i) / steps);
    if (i >= steps) {
      el.textContent = target;
      clearInterval(timer);
    }
  }, 18);
}

function renderActivity() {
  const feed = document.getElementById("activityFeed");
  if (!feed) return;

  const icons = { create: "✦", update: "✎", delete: "✕" };
  const colors = { create: "#10b981", update: "#6366f1", delete: "#ef4444" };

  feed.innerHTML = state.activity
    .slice(0, 8)
    .map(
      (a) => `
    <div class="activity-item">
      <div class="activity-dot" style="background:${colors[a.type] || "#6366f1"}"></div>
      <div class="activity-content">
        <div class="activity-text"><strong>${capitalize(a.type)}d</strong> ${a.entity} — ${escapeHtml(a.name)}</div>
        <div class="activity-time">${a.time}</div>
      </div>
    </div>
  `,
    )
    .join("");
}

function logActivity(type, entity, name) {
  state.activity.unshift({
    type,
    entity,
    name,
    time: "Just now",
    color: "#10b981",
  });
  if (state.activity.length > 20) state.activity.pop();
  if (currentPage === "dashboard") renderActivity();
}

// ============================================================
// PRODUCT CRUD
// ============================================================

function prepareProductModal(id) {
  clearProductForm();
  if (id) {
    const p = state.products.find((x) => x.id === id);
    if (!p) return;
    document.getElementById("productId").value = p.id;
    document.getElementById("productName").value = p.name;
    document.getElementById("productCategory").value = p.category;
    document.getElementById("productPrice").value = p.price;
    document.getElementById("productStock").value = p.stock;
    document.getElementById("productDescription").value = p.description;
    document.getElementById("productStatus").value = p.status;
    document.getElementById("productImage").value = p.image || "";
    document.getElementById("productModalTitle").textContent = "Edit Product";
    document.getElementById("saveProductBtn").textContent = "Save Changes";
  } else {
    document.getElementById("productModalTitle").textContent = "Add Product";
    document.getElementById("saveProductBtn").textContent = "Add Product";
  }
  populateProductCategorySelect();
}

function clearProductForm() {
  [
    "productId",
    "productName",
    "productCategory",
    "productPrice",
    "productStock",
    "productDescription",
    "productImage",
  ].forEach((id) => {
    document.getElementById(id).value = "";
  });
  document.getElementById("productStatus").value = "Active";
}

function populateProductCategorySelect() {
  const sel = document.getElementById("productCategory");
  const current = sel.value;
  sel.innerHTML = '<option value="">Select category</option>';
  state.categories
    .filter((c) => c.status === "Active")
    .forEach((c) => {
      const opt = document.createElement("option");
      opt.value = c.name;
      opt.textContent = c.name;
      if (c.name === current) opt.selected = true;
      sel.appendChild(opt);
    });
}

function saveProduct() {
  const id = document.getElementById("productId").value;
  const name = document.getElementById("productName").value.trim();
  const cat = document.getElementById("productCategory").value;
  const price = parseFloat(document.getElementById("productPrice").value);
  const stock = parseInt(document.getElementById("productStock").value);
  const desc = document.getElementById("productDescription").value.trim();
  const status = document.getElementById("productStatus").value;
  const image = document.getElementById("productImage").value.trim();

  if (!name) {
    showToast("Product name is required.", "error");
    return;
  }
  if (!cat) {
    showToast("Please select a category.", "error");
    return;
  }
  if (isNaN(price) || price < 0) {
    showToast("Enter a valid price.", "error");
    return;
  }
  if (isNaN(stock) || stock < 0) {
    showToast("Enter a valid stock.", "error");
    return;
  }

  if (id) {
    // UPDATE
    const idx = state.products.findIndex((p) => p.id === parseInt(id));
    if (idx > -1) {
      state.products[idx] = {
        ...state.products[idx],
        name,
        category: cat,
        price,
        stock,
        description: desc,
        status,
        image,
      };
      logActivity("update", "product", name);
      showToast(`Product "${name}" updated successfully.`, "success");
    }
  } else {
    // CREATE
    const newProduct = {
      id: state.nextId.products++,
      name,
      category: cat,
      price,
      stock,
      description: desc,
      status,
      image,
      createdAt: new Date().toISOString().split("T")[0],
    };
    state.products.unshift(newProduct);
    logActivity("create", "product", name);
    showToast(`Product "${name}" added successfully.`, "success");
  }

  DB.save(state);
  closeModal();
  filterProducts();
  updateStats();
}

function deleteProduct(id) {
  const p = state.products.find((x) => x.id === id);
  if (!p) return;
  document.getElementById("deleteMessage").textContent =
    `Are you sure you want to delete "${p.name}"? This action cannot be undone.`;
  deleteTarget = { type: "product", id };
  openModal("delete");
}

function confirmDelete() {
  if (!deleteTarget) return;

  if (deleteTarget.type === "product") {
    const p = state.products.find((x) => x.id === deleteTarget.id);
    state.products = state.products.filter((x) => x.id !== deleteTarget.id);
    logActivity("delete", "product", p?.name || "Product");
    showToast("Product deleted successfully.", "success");
    DB.save(state);
    filterProducts();
  }

  if (deleteTarget.type === "category") {
    const c = state.categories.find((x) => x.id === deleteTarget.id);
    state.categories = state.categories.filter((x) => x.id !== deleteTarget.id);
    logActivity("delete", "category", c?.name || "Category");
    showToast("Category deleted successfully.", "success");
    DB.save(state);
    filterCategories();
    populateCategoryFilter();
  }

  if (deleteTarget.type === "user") {
    const u = state.users.find((x) => x.id === deleteTarget.id);
    state.users = state.users.filter((x) => x.id !== deleteTarget.id);
    logActivity("delete", "user", u?.name || "User");
    showToast("User deleted successfully.", "success");
    DB.save(state);
    filterUsers();
  }

  updateStats();
  deleteTarget = null;
  closeModal();
}

function filterProducts() {
  const q = (
    document.getElementById("productSearch")?.value || ""
  ).toLowerCase();
  const cat = document.getElementById("productCatFilter")?.value || "";

  filteredProducts = state.products.filter((p) => {
    const matchQ =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q);
    const matchCat = !cat || p.category === cat;
    return matchQ && matchCat;
  });
  productPage = 1;
  renderProductTable();
}

function renderProductTable() {
  const tbody = document.getElementById("productTableBody");
  if (!tbody) return;

  const start = (productPage - 1) * PAGE_SIZE;
  const page = filteredProducts.slice(start, start + PAGE_SIZE);

  if (filteredProducts.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8"><div class="empty-state">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none"><path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" stroke="currentColor" stroke-width="1.5"/></svg>
      <p>No products found.</p>
    </div></td></tr>`;
    renderPagination("productPagination", 0, productPage, (p) => {
      productPage = p;
      renderProductTable();
    });
    return;
  }

  tbody.innerHTML = page
    .map(
      (p) => `
    <tr>
      <td><span style="color:var(--text-muted);font-size:0.78rem">#${p.id}</span></td>
      <td>
        <div class="product-img">${p.image ? `<img src="${escapeHtml(p.image)}" style="width:100%;height:100%;object-fit:cover;border-radius:6px" onerror="this.style.display='none'">` : getCategoryEmoji(p.category)}</div>
      </td>
      <td>
        <div style="font-weight:600">${escapeHtml(p.name)}</div>
        <div style="font-size:0.75rem;color:var(--text-muted)">${escapeHtml(p.description).substring(0, 50)}${p.description.length > 50 ? "…" : ""}</div>
      </td>
      <td><span style="color:var(--text-secondary)">${escapeHtml(p.category)}</span></td>
      <td><span style="font-weight:600;color:var(--accent)">$${p.price.toFixed(2)}</span></td>
      <td><span style="${p.stock === 0 ? "color:var(--danger)" : p.stock < 10 ? "color:var(--warning)" : "color:var(--success)"};font-weight:600">${p.stock}</span></td>
      <td>${statusBadge(p.status)}</td>
      <td>
        <div class="action-btns">
          <button class="action-btn edit" onclick="openModal('product',${p.id})" title="Edit">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="2"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2"/></svg>
          </button>
          <button class="action-btn delete" onclick="deleteProduct(${p.id})" title="Delete">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><polyline points="3 6 5 6 21 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="currentColor" stroke-width="2"/><path d="M10 11v6M14 11v6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" stroke="currentColor" stroke-width="2"/></svg>
          </button>
        </div>
      </td>
    </tr>
  `,
    )
    .join("");

  renderPagination(
    "productPagination",
    filteredProducts.length,
    productPage,
    (p) => {
      productPage = p;
      renderProductTable();
    },
  );
}

function populateCategoryFilter() {
  const sel = document.getElementById("productCatFilter");
  if (!sel) return;
  const current = sel.value;
  sel.innerHTML = '<option value="">All Categories</option>';
  const cats = [...new Set(state.products.map((p) => p.category))];
  cats.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    if (c === current) opt.selected = true;
    sel.appendChild(opt);
  });
}
// ============================================================
// TOAST SYSTEM
// ============================================================
function showToast(message, type = "success") {
  const container = document.getElementById("toastContainer");
  const icons = { success: "✓", error: "✕", info: "ℹ", warning: "⚠" };
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type] || "ℹ"}</span><span>${escapeHtml(message)}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("out");
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
// ============================================================
// PAGINATION
// ============================================================
function renderPagination(containerId, total, current, onChange) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const totalPages = Math.ceil(total / PAGE_SIZE);
  if (totalPages <= 1) {
    container.innerHTML = "";
    return;
  }

  let html = `<span style="font-size:0.78rem;color:var(--text-muted);margin-right:8px">
    Showing ${Math.min((current - 1) * PAGE_SIZE + 1, total)}–${Math.min(current * PAGE_SIZE, total)} of ${total}
  </span>`;

  html += `<button class="page-btn" onclick="(${onChange.toString()})(${current - 1})" ${current === 1 ? "disabled" : ""}>&#8249;</button>`;

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - current) <= 1) {
      html += `<button class="page-btn${i === current ? " active" : ""}" onclick="(${onChange.toString()})(${i})">${i}</button>`;
    } else if (Math.abs(i - current) === 2) {
      html += `<span style="color:var(--text-muted);padding:0 4px">…</span>`;
    }
  }

  html += `<button class="page-btn" onclick="(${onChange.toString()})(${current + 1})" ${current === totalPages ? "disabled" : ""}>&#8250;</button>`;

  container.innerHTML = html;
}

// ============================================================
// CATEGORY CRUD
// ============================================================
function prepareCategoryModal(id) {
  clearCategoryForm();
  if (id) {
    const c = state.categories.find((x) => x.id === id);
    if (!c) return;
    document.getElementById("categoryId").value = c.id;
    document.getElementById("categoryName").value = c.name;
    document.getElementById("categoryDescription").value = c.description;
    document.getElementById("categoryColor").value = c.color;
    document.getElementById("categoryIcon").value = c.icon;
    document.getElementById("categoryStatus").value = c.status;
    document.getElementById("categoryModalTitle").textContent = "Edit Category";
    document.getElementById("saveCategoryBtn").textContent = "Save Changes";
  } else {
    document.getElementById("categoryModalTitle").textContent = "Add Category";
    document.getElementById("saveCategoryBtn").textContent = "Add Category";
  }
}

function clearCategoryForm() {
  ["categoryId", "categoryName", "categoryDescription", "categoryIcon"].forEach(
    (id) => {
      document.getElementById(id).value = "";
    },
  );
  document.getElementById("categoryColor").value = "#6366f1";
  document.getElementById("categoryStatus").value = "Active";
}

function saveCategory() {
  const id = document.getElementById("categoryId").value;
  const name = document.getElementById("categoryName").value.trim();
  const desc = document.getElementById("categoryDescription").value.trim();
  const color = document.getElementById("categoryColor").value;
  const icon = document.getElementById("categoryIcon").value.trim() || "📦";
  const status = document.getElementById("categoryStatus").value;

  if (!name) {
    showToast("Category name is required.", "error");
    return;
  }

  if (id) {
    const idx = state.categories.findIndex((c) => c.id === parseInt(id));
    if (idx > -1) {
      state.categories[idx] = {
        ...state.categories[idx],
        name,
        description: desc,
        color,
        icon,
        status,
      };
      logActivity("update", "category", name);
      showToast(`Category "${name}" updated.`, "success");
    }
  } else {
    // Check duplicate
    if (
      state.categories.some((c) => c.name.toLowerCase() === name.toLowerCase())
    ) {
      showToast("A category with this name already exists.", "error");
      return;
    }
    state.categories.push({
      id: state.nextId.categories++,
      name,
      description: desc,
      color,
      icon,
      status,
      createdAt: new Date().toISOString().split("T")[0],
    });
    logActivity("create", "category", name);
    showToast(`Category "${name}" created.`, "success");
  }

  DB.save(state);
  closeModal();
  filterCategories();
  populateCategoryFilter();
  updateStats();
}

function deleteCategory(id) {
  const c = state.categories.find((x) => x.id === id);
  if (!c) return;
  const prodCount = state.products.filter((p) => p.category === c.name).length;
  document.getElementById("deleteMessage").textContent =
    `Are you sure you want to delete category "${c.name}"?${prodCount > 0 ? ` This will affect ${prodCount} product(s).` : ""} This action cannot be undone.`;
  deleteTarget = { type: "category", id };
  openModal("delete");
}

function filterCategories() {
  const q = (
    document.getElementById("categorySearch")?.value || ""
  ).toLowerCase();
  filteredCategories = state.categories.filter(
    (c) =>
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q),
  );
  renderCategoryGrid();
}

function renderCategoryGrid() {
  const grid = document.getElementById("categoryGrid");
  if (!grid) return;

  if (!filteredCategories.length) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h8M4 18h16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
      <p>No categories found.</p>
    </div>`;
    return;
  }

  const getCount = (name) =>
    state.products.filter((p) => p.category === name).length;

  grid.innerHTML = filteredCategories
    .map(
      (c) => `
    <div class="category-card" style="--cat-color:${c.color}">
      <div class="category-strip" style="background:${c.color}"></div>
      <div class="category-card-top">
        <div class="category-icon-wrap" style="background:${c.color}22">${c.icon}</div>
        <div class="action-btns">
          <button class="action-btn edit" onclick="openModal('category',${c.id})" title="Edit">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="2"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2"/></svg>
          </button>
          <button class="action-btn delete" onclick="deleteCategory(${c.id})" title="Delete">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><polyline points="3 6 5 6 21 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="currentColor" stroke-width="2"/></svg>
          </button>
        </div>
      </div>
      <div class="category-name">${escapeHtml(c.name)}</div>
      <div class="category-desc">${escapeHtml(c.description) || "No description."}</div>
      <div class="category-meta">
        <span style="color:${c.color};font-weight:600">${getCount(c.name)} products</span>
        ${statusBadge(c.status)}
      </div>
    </div>`,
    )
    .join("");
}

// ============================================================
// SETTINGS
// ============================================================
function switchSettingsTab(btn, tab) {
  document
    .querySelectorAll(".settings-tab")
    .forEach((b) => b.classList.remove("active"));
  document
    .querySelectorAll(".settings-panel")
    .forEach((p) => p.classList.remove("active"));
  btn.classList.add("active");
  document.getElementById("settings-" + tab).classList.add("active");
}

function saveSettings(section) {
  const messages = {
    general: "General settings saved successfully.",
    profile: "Profile updated successfully.",
    security: "Password changed successfully.",
    appearance: "Appearance preferences saved.",
  };

  if (section === "security") {
    const np = document.getElementById("newPass").value;
    const cp = document.getElementById("confirmPass").value;
    if (np && np !== cp) {
      showToast("Passwords do not match.", "error");
      return;
    }
    if (np && np.length < 6) {
      showToast("Password must be at least 6 characters.", "error");
      return;
    }
    document.getElementById("currentPass").value = "";
    document.getElementById("newPass").value = "";
    document.getElementById("confirmPass").value = "";
  }

  showToast(messages[section] || "Settings saved.", "success");
}

function updateSidebarName(value) {
  const el = document.getElementById("sidebarUserName");
  if (el) el.textContent = value || "Admin User";

  const topbar = document.getElementById("topbarAvatar");
  const sidebar = document.getElementById("sidebarAvatar");
  const profile = document.getElementById("profileAvatarLarge");
  const letter = (value || "A").charAt(0).toUpperCase();
  if (topbar) topbar.textContent = letter;
  if (sidebar) sidebar.textContent = letter;
  if (profile) profile.textContent = letter;
}

function changeAvatar() {
  showToast("Avatar upload coming soon!", "info");
}

function setTheme(theme, btn) {
  document.body.classList.toggle("light", theme === "light");
  document
    .querySelectorAll(".theme-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  showToast(`Switched to ${theme} theme.`, "success");
}

function setAccent(color, btn) {
  document.documentElement.style.setProperty("--accent", color);
  document.documentElement.style.setProperty("--accent-glow", color + "40");
  document.documentElement.style.setProperty("--accent-hover", color + "cc");
  document
    .querySelectorAll(".color-dot")
    .forEach((d) => d.classList.remove("active"));
  btn.classList.add("active");
}

function toggleCompact(cb) {
  document.body.classList.toggle("compact", cb.checked);
}

// ============================================================
// USER CRUD
// ============================================================
function prepareUserModal(id) {
  clearUserForm();
  const pwdGroup = document.getElementById("userPasswordGroup");
  if (id) {
    const u = state.users.find((x) => x.id === id);
    if (!u) return;
    document.getElementById("userId").value = u.id;
    document.getElementById("userName").value = u.name;
    document.getElementById("userEmail").value = u.email;
    document.getElementById("userRole").value = u.role;
    document.getElementById("userPhone").value = u.phone || "";
    document.getElementById("userDept").value = u.dept || "";
    document.getElementById("userStatus").value = u.status;
    document.getElementById("userModalTitle").textContent = "Edit User";
    document.getElementById("saveUserBtn").textContent = "Save Changes";
    pwdGroup.style.display = "none";
  } else {
    document.getElementById("userModalTitle").textContent = "Add User";
    document.getElementById("saveUserBtn").textContent = "Add User";
    pwdGroup.style.display = "";
  }
}

function clearUserForm() {
  [
    "userId",
    "userName",
    "userEmail",
    "userPhone",
    "userDept",
    "userPassword",
  ].forEach((id) => {
    document.getElementById(id).value = "";
  });
  document.getElementById("userRole").value = "Viewer";
  document.getElementById("userStatus").value = "Active";
}

function saveUser() {
  const id = document.getElementById("userId").value;
  const name = document.getElementById("userName").value.trim();
  const email = document.getElementById("userEmail").value.trim();
  const role = document.getElementById("userRole").value;
  const phone = document.getElementById("userPhone").value.trim();
  const dept = document.getElementById("userDept").value.trim();
  const status = document.getElementById("userStatus").value;

  if (!name) {
    showToast("Full name is required.", "error");
    return;
  }
  if (!email || !email.includes("@")) {
    showToast("Enter a valid email address.", "error");
    return;
  }

  // Duplicate email check
  const dupCheck = state.users.find(
    (u) => u.email === email && u.id !== parseInt(id),
  );
  if (dupCheck) {
    showToast("This email is already registered.", "error");
    return;
  }

  if (id) {
    const idx = state.users.findIndex((u) => u.id === parseInt(id));
    if (idx > -1) {
      state.users[idx] = {
        ...state.users[idx],
        name,
        email,
        role,
        phone,
        dept,
        status,
      };
      logActivity("update", "user", name);
      showToast(`User "${name}" updated.`, "success");
    }
  } else {
    state.users.push({
      id: state.nextId.users++,
      name,
      email,
      role,
      phone,
      dept,
      status,
      joinedAt: new Date().toISOString().split("T")[0],
    });
    logActivity("create", "user", name);
    showToast(`User "${name}" added.`, "success");
  }

  DB.save(state);
  closeModal();
  filterUsers();
  updateStats();
}

function deleteUser(id) {
  const u = state.users.find((x) => x.id === id);
  if (!u) return;
  document.getElementById("deleteMessage").textContent =
    `Are you sure you want to delete user "${u.name}"? This action cannot be undone.`;
  deleteTarget = { type: "user", id };
  openModal("delete");
}

function filterUsers() {
  const q = (document.getElementById("userSearch")?.value || "").toLowerCase();
  const role = document.getElementById("userRoleFilter")?.value || "";

  filteredUsers = state.users.filter((u) => {
    const matchQ =
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.dept || "").toLowerCase().includes(q);
    const matchRole = !role || u.role === role;
    return matchQ && matchRole;
  });
  userPage = 1;
  renderUserTable();
}

function renderUserTable() {
  const tbody = document.getElementById("userTableBody");
  if (!tbody) return;

  const start = (userPage - 1) * PAGE_SIZE;
  const page = filteredUsers.slice(start, start + PAGE_SIZE);

  if (filteredUsers.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="1.5"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="1.5"/></svg>
      <p>No users found.</p>
    </div></td></tr>`;
    renderPagination("userPagination", 0, userPage, (p) => {
      userPage = p;
      renderUserTable();
    });
    return;
  }

  tbody.innerHTML = page
    .map(
      (u) => `
    <tr>
      <td>
        <div class="user-avatar-sm" style="background:linear-gradient(135deg,${stringToColor(u.name)},${stringToColor(u.name + "x")})">${u.name.charAt(0).toUpperCase()}</div>
      </td>
      <td>
        <div style="font-weight:600">${escapeHtml(u.name)}</div>
        <div style="font-size:0.75rem;color:var(--text-muted)">${escapeHtml(u.dept || "—")}</div>
      </td>
      <td><span style="color:var(--text-secondary)">${escapeHtml(u.email)}</span></td>
      <td>${roleBadge(u.role)}</td>
      <td>${statusBadge(u.status)}</td>
      <td><span style="color:var(--text-muted);font-size:0.8rem">${u.joinedAt}</span></td>
      <td>
        <div class="action-btns">
          <button class="action-btn edit"   onclick="openModal('user',${u.id})" title="Edit">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="2"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2"/></svg>
          </button>
          <button class="action-btn delete" onclick="deleteUser(${u.id})" title="Delete">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><polyline points="3 6 5 6 21 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="currentColor" stroke-width="2"/></svg>
          </button>
        </div>
      </td>
    </tr>
  `,
    )
    .join("");

  renderPagination("userPagination", filteredUsers.length, userPage, (p) => {
    userPage = p;
    renderUserTable();
  });
}
// ============================================================
// UTILITY HELPERS
// ============================================================
function escapeHtml(str) {
  if (!str) return "";
  return String(str).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
}

function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
}

function statusBadge(status) {
  const map = {
    Active: "status-active",
    Inactive: "status-inactive",
    Draft: "status-draft",
    Pending: "status-pending",
  };
  return `<span class="status-badge ${map[status] || "status-inactive"}">${status}</span>`;
}

function roleBadge(role) {
  const map = {
    Admin: "role-admin",
    Editor: "role-editor",
    Viewer: "role-viewer",
  };
  return `<span class="role-badge ${map[role] || "role-viewer"}">${role}</span>`;
}

function getCategoryEmoji(category) {
  const cat = state.categories.find((c) => c.name === category);
  return cat ? cat.icon : "";
}
