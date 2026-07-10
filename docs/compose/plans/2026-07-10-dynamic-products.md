# Dynamic Product Management Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use compose:subagent (recommended) or compose:execute to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enable admins to add, edit, delete products and categories from the panel, with changes automatically reflected on the index and order pages.

**Architecture:** Move product data from hardcoded JS to JSONBin cloud storage. Create admin UI in contenido.html for CRUD operations. Update index.html and pedidos.html to dynamically load products from cloud.

**Tech Stack:** HTML/CSS/JS, JSONBin API, html2canvas (existing)

## Global Constraints

- All data stored in JSONBin via existing cloud.js functions
- Admin password: `rochy2026` (existing)
- Products must maintain backward compatibility during migration
- No new external dependencies

---

### Task 1: Add Cloud Functions for Categories and Products

**Files:**
- Modify: `cloud.js`

**Interfaces:**
- Produces: `fetchCategories()`, `saveCategories()`, `fetchProducts()`, `saveProducts()`

- [ ] **Step 1: Add category CRUD functions**

```javascript
// Add after existing savePromotions function

// ===== CATEGORIES =====
async function fetchCategories() {
    const data = await fetchAll();
    return data.categories || [];
}

async function saveCategories(categories) {
    const data = await fetchAll();
    data.categories = categories;
    return await saveAll(data);
}
```

- [ ] **Step 2: Add product CRUD functions**

```javascript
// ===== PRODUCTS =====
async function fetchProducts() {
    const data = await fetchAll();
    return data.products || [];
}

async function saveProducts(products) {
    const data = await fetchAll();
    data.products = products;
    return await saveAll(data);
}
```

- [ ] **Step 3: Commit**

```bash
git add cloud.js
git commit -m "feat: add category and product cloud functions"
```

---

### Task 2: Add Product Management Tab to Admin Panel

**Files:**
- Modify: `contenido.html`

**Interfaces:**
- Consumes: `fetchCategories()`, `saveCategories()`, `fetchProducts()`, `saveProducts()` from Task 1

- [ ] **Step 1: Add Products tab button**

Find the tabs section in contenido.html and add a new tab:
```html
<!-- Existing tabs -->
<button class="tab-btn active" onclick="showTab('carousel')"><i class="fas fa-film"></i> Marquesina</button>
<button class="tab-btn" onclick="showTab('promotions')"><i class="fas fa-fire"></i> Promociones</button>
<button class="tab-btn" onclick="showTab('config')"><i class="fas fa-cog"></i> Configuracion</button>
<!-- Add this new tab -->
<button class="tab-btn" onclick="showTab('products')"><i class="fas fa-box"></i> Productos</button>
```

- [ ] **Step 2: Add Products tab content**

Add after the config tab content:
```html
<!-- Products Tab -->
<div id="tab-products" class="tab-content" style="display:none;">
    <div class="content-header">
        <h2><i class="fas fa-box"></i> Gestion de Productos</h2>
        <div style="display:flex; gap:10px;">
            <button class="btn-primary" onclick="showAddCategoryModal()"><i class="fas fa-plus"></i> Nueva Categoria</button>
            <button class="btn-primary" onclick="showAddProductModal()"><i class="fas fa-plus"></i> Nuevo Producto</button>
        </div>
    </div>
    <div id="categoriesList" class="content-list">
        <p class="empty-orders">Cargando...</p>
    </div>
</div>
```

- [ ] **Step 3: Add Category Modal**

Add after the promotions modal:
```html
<!-- Add Category Modal -->
<div id="categoryModal" class="modal">
    <div class="modal-content modal-login" style="max-width:450px;">
        <button class="modal-close" onclick="closeModal('categoryModal')">&times;</button>
        <div class="login-box" style="padding:30px;">
            <h2 style="margin-bottom:20px;"><i class="fas fa-folder" style="color:#ff6b35;"></i> <span id="categoryModalTitle">Agregar Categoria</span></h2>
            <form onsubmit="saveCategoryItem(event)" style="text-align:left;">
                <div class="form-group" style="margin-bottom:15px;">
                    <label style="font-weight:500; margin-bottom:5px; display:block;">Nombre *</label>
                    <input type="text" id="categoryName" placeholder="Ej: Deditos" required style="width:100%; padding:10px; border:2px solid #e0e0e0; border-radius:10px; font-family:Poppins;">
                </div>
                <div class="form-group" style="margin-bottom:15px;">
                    <label style="font-weight:500; margin-bottom:5px; display:block;">Icono (Font Awesome)</label>
                    <input type="text" id="categoryIcon" placeholder="Ej: fas fa-hand-pointer" style="width:100%; padding:10px; border:2px solid #e0e0e0; border-radius:10px; font-family:Poppins;">
                    <p style="margin-top:5px; color:#888; font-size:0.8rem;">Ver iconos en fontawesome.com/icons</p>
                </div>
                <div class="form-group" style="margin-bottom:15px;">
                    <label style="font-weight:500; margin-bottom:5px; display:block;">Descripcion</label>
                    <input type="text" id="categoryDescription" placeholder="Ej: Crujientes deditos rellenos" style="width:100%; padding:10px; border:2px solid #e0e0e0; border-radius:10px; font-family:Poppins;">
                </div>
                <div class="form-group" style="margin-bottom:15px;">
                    <label style="font-weight:500; margin-bottom:5px; display:block;">Orden</label>
                    <input type="number" id="categoryOrder" value="1" min="1" style="width:100%; padding:10px; border:2px solid #e0e0e0; border-radius:10px; font-family:Poppins;">
                </div>
                <input type="hidden" id="categoryEditId">
                <button type="submit" class="btn-primary" style="width:100%; justify-content:center;"><i class="fas fa-save"></i> Guardar</button>
            </form>
        </div>
    </div>
</div>
```

- [ ] **Step 4: Add Product Modal**

```html
<!-- Add Product Modal -->
<div id="productModal" class="modal">
    <div class="modal-content modal-login" style="max-width:550px;">
        <button class="modal-close" onclick="closeModal('productModal')">&times;</button>
        <div class="login-box" style="padding:30px;">
            <h2 style="margin-bottom:20px;"><i class="fas fa-box" style="color:#ff6b35;"></i> <span id="productModalTitle">Agregar Producto</span></h2>
            <form onsubmit="saveProductItem(event)" style="text-align:left;">
                <div class="form-group" style="margin-bottom:15px;">
                    <label style="font-weight:500; margin-bottom:5px; display:block;">Nombre *</label>
                    <input type="text" id="productName" placeholder="Ej: Deditos de Queso" required style="width:100%; padding:10px; border:2px solid #e0e0e0; border-radius:10px; font-family:Poppins;">
                </div>
                <div class="form-group" style="margin-bottom:15px;">
                    <label style="font-weight:500; margin-bottom:5px; display:block;">Categoria *</label>
                    <select id="productCategory" required style="width:100%; padding:10px; border:2px solid #e0e0e0; border-radius:10px; font-family:Poppins;">
                        <option value="">Seleccionar categoria...</option>
                    </select>
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px; margin-bottom:15px;">
                    <div class="form-group">
                        <label style="font-weight:500; margin-bottom:5px; display:block;">Precio por bandeja ($) *</label>
                        <input type="number" id="productPrice" placeholder="Ej: 12000" required style="width:100%; padding:10px; border:2px solid #e0e0e0; border-radius:10px; font-family:Poppins;">
                    </div>
                    <div class="form-group">
                        <label style="font-weight:500; margin-bottom:5px; display:block;">Unidades por bandeja *</label>
                        <input type="number" id="productQtyPerTray" placeholder="Ej: 10" required style="width:100%; padding:10px; border:2px solid #e0e0e0; border-radius:10px; font-family:Poppins;">
                    </div>
                </div>
                <div class="form-group" style="margin-bottom:15px;">
                    <label style="font-weight:500; margin-bottom:5px; display:block;">Descripcion</label>
                    <textarea id="productDescription" rows="2" placeholder="Descripcion del producto..." style="width:100%; padding:10px; border:2px solid #e0e0e0; border-radius:10px; font-family:Poppins;"></textarea>
                </div>
                <div class="form-group" style="margin-bottom:15px;">
                    <label style="font-weight:500; margin-bottom:5px; display:block;">Caracteristicas (una por linea)</label>
                    <textarea id="productFeatures" rows="3" placeholder="Masa crujiente&#10;Relleno generoso&#10;Sin conservantes" style="width:100%; padding:10px; border:2px solid #e0e0e0; border-radius:10px; font-family:Poppins;"></textarea>
                </div>
                <div class="form-group" style="margin-bottom:15px;">
                    <label style="font-weight:500; margin-bottom:5px; display:block;">Instrucciones de preparacion</label>
                    <textarea id="productPreparation" rows="2" placeholder="Hornear a 180°C por 15-20 minutos..." style="width:100%; padding:10px; border:2px solid #e0e0e0; border-radius:10px; font-family:Poppins;"></textarea>
                </div>
                <div class="form-group" style="margin-bottom:15px;">
                    <label style="font-weight:500; margin-bottom:5px; display:block;">URL de imagen</label>
                    <input type="url" id="productImageUrl" placeholder="https://..." style="width:100%; padding:10px; border:2px solid #e0e0e0; border-radius:10px; font-family:Poppins;">
                </div>
                <div class="form-group" style="margin-bottom:15px;">
                    <label style="font-weight:500; margin-bottom:5px; display:block;">O subir imagen</label>
                    <input type="file" id="productImageFile" accept="image/*" onchange="previewImage(this, 'productPreview')" style="width:100%; padding:10px; border:2px solid #e0e0e0; border-radius:10px; font-family:Poppins;">
                    <div id="productPreviewContainer" style="display:none; margin-top:10px; text-align:center; background:#f5f5f5; padding:10px; border-radius:10px;">
                        <img id="productPreview" style="max-width:100%; max-height:150px; border-radius:10px;">
                    </div>
                </div>
                <div class="form-group" style="margin-bottom:15px;">
                    <label style="font-weight:500; margin-bottom:5px; display:block;">Badge (opcional)</label>
                    <input type="text" id="productBadge" placeholder="Ej: Popular, Nuevo, Premium" style="width:100%; padding:10px; border:2px solid #e0e0e0; border-radius:10px; font-family:Poppins;">
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px; margin-bottom:15px;">
                    <label class="checkbox-option" style="margin:0;">
                        <input type="checkbox" id="productIsPasabocas">
                        <span>Es pasabocas (mini)</span>
                    </label>
                    <div class="form-group" id="pasabocasPriceGroup" style="display:none;">
                        <label style="font-weight:500; margin-bottom:5px; display:block;">Precio unitario pasabocas ($)</label>
                        <input type="number" id="productPasabocasPrice" placeholder="Ej: 800" style="width:100%; padding:10px; border:2px solid #e0e0e0; border-radius:10px; font-family:Poppins;">
                    </div>
                </div>
                <input type="hidden" id="productEditId">
                <button type="submit" class="btn-primary" style="width:100%; justify-content:center;"><i class="fas fa-save"></i> Guardar</button>
            </form>
        </div>
    </div>
</div>
```

- [ ] **Step 5: Add JavaScript for product management**

Add to the script section at the bottom of contenido.html:
```javascript
// ===== PRODUCTS MANAGEMENT =====
async function renderCategoriesList() {
    var container = document.getElementById('categoriesList');
    try {
        var categories = await fetchCategories();
        var products = await fetchProducts();
        
        if (categories.length === 0) {
            container.innerHTML = '<p class="empty-orders">No hay categorias. Agrega una para empezar a crear productos.</p>';
            return;
        }
        
        categories.sort(function(a, b) { return a.order - b.order; });
        
        var html = '';
        categories.forEach(function(cat) {
            var catProducts = products.filter(function(p) { return p.categoryId === cat.id; });
            html += '<div class="content-card" style="flex-direction:column; align-items:flex-start;">';
            html += '<div style="display:flex; align-items:center; gap:15px; width:100%;">';
            html += '<div style="width:50px; height:50px; background:linear-gradient(135deg, #1e3c72, #2a5298); border-radius:12px; display:flex; align-items:center; justify-content:center;"><i class="' + (cat.icon || 'fas fa-folder') + '" style="color:white; font-size:1.2rem;"></i></div>';
            html += '<div class="content-card-info" style="flex:1;">';
            html += '<h4>' + cat.name + '</h4>';
            html += '<p>' + catProducts.length + ' producto(s) | Orden: ' + cat.order + '</p>';
            html += '<span class="' + (cat.active !== false ? 'status-active' : 'status-inactive') + '">' + (cat.active !== false ? 'Activa' : 'Inactiva') + '</span>';
            html += '</div>';
            html += '<div class="content-card-actions">';
            html += '<button class="btn-sm btn-view" onclick="toggleCategoryItem(\'' + cat.id + '\', ' + (cat.active === false) + ')"><i class="fas fa-eye"></i></button>';
            html += '<button class="btn-sm btn-complete" onclick="editCategoryItem(\'' + cat.id + '\')"><i class="fas fa-edit"></i></button>';
            html += '<button class="btn-sm btn-delete" onclick="deleteCategoryItem(\'' + cat.id + '\')"><i class="fas fa-trash"></i></button>';
            html += '</div></div>';
            
            // Products in this category
            if (catProducts.length > 0) {
                html += '<div style="width:100%; margin-top:15px; padding-top:15px; border-top:1px solid #eee;">';
                catProducts.forEach(function(prod) {
                    html += '<div style="display:flex; align-items:center; gap:10px; padding:8px 0; border-bottom:1px solid #f5f5f5;">';
                    html += '<img src="' + (prod.imageUrl || '') + '" style="width:40px; height:40px; border-radius:8px; object-fit:cover;">';
                    html += '<div style="flex:1;">';
                    html += '<strong style="font-size:0.9rem;">' + prod.name + '</strong>';
                    html += '<p style="font-size:0.8rem; color:#888; margin:0;">$' + prod.price.toLocaleString('es-VE') + ' x' + prod.qtyPerTray + '</p>';
                    html += '</div>';
                    html += '<div style="display:flex; gap:5px;">';
                    html += '<button class="btn-sm btn-view" onclick="editProductItem(\'' + prod.id + '\')" title="Editar"><i class="fas fa-edit"></i></button>';
                    html += '<button class="btn-sm btn-delete" onclick="deleteProductItem(\'' + prod.id + '\')" title="Eliminar"><i class="fas fa-trash"></i></button>';
                    html += '</div></div>';
                });
                html += '</div>';
            }
            html += '</div>';
        });
        container.innerHTML = html;
    } catch(e) {
        container.innerHTML = '<p class="empty-orders">Error al cargar categorias.</p>';
    }
}

function showAddCategoryModal() {
    document.getElementById('categoryModalTitle').textContent = 'Agregar Categoria';
    document.getElementById('categoryName').value = '';
    document.getElementById('categoryIcon').value = '';
    document.getElementById('categoryDescription').value = '';
    document.getElementById('categoryOrder').value = '1';
    document.getElementById('categoryEditId').value = '';
    document.getElementById('categoryModal').classList.add('active');
}

async function editCategoryItem(id) {
    var categories = await fetchCategories();
    var cat = categories.find(function(c) { return c.id === id; });
    if (!cat) return;
    document.getElementById('categoryModalTitle').textContent = 'Editar Categoria';
    document.getElementById('categoryName').value = cat.name || '';
    document.getElementById('categoryIcon').value = cat.icon || '';
    document.getElementById('categoryDescription').value = cat.description || '';
    document.getElementById('categoryOrder').value = cat.order || 1;
    document.getElementById('categoryEditId').value = cat.id;
    document.getElementById('categoryModal').classList.add('active');
}

var isSavingCategory = false;

async function saveCategoryItem(e) {
    e.preventDefault();
    if (isSavingCategory) return;
    isSavingCategory = true;
    
    var categories = await fetchCategories();
    var editId = document.getElementById('categoryEditId').value;
    
    var newCategory = {
        id: editId || 'cat-' + Date.now(),
        name: document.getElementById('categoryName').value,
        icon: document.getElementById('categoryIcon').value || 'fas fa-folder',
        description: document.getElementById('categoryDescription').value,
        order: parseInt(document.getElementById('categoryOrder').value) || 1,
        active: true
    };
    
    if (editId) {
        var idx = categories.findIndex(function(c) { return c.id === editId; });
        if (idx !== -1) categories[idx] = newCategory;
    } else {
        categories.push(newCategory);
    }
    
    var result = await saveCategories(categories);
    isSavingCategory = false;
    if (result) {
        closeModal('categoryModal');
        await renderCategoriesList();
        alert('Categoria guardada exitosamente!');
    } else {
        alert('Error al guardar. Intenta de nuevo.');
    }
}

async function toggleCategoryItem(id, newActive) {
    var categories = await fetchCategories();
    var idx = categories.findIndex(function(c) { return c.id === id; });
    if (idx !== -1) {
        categories[idx].active = newActive;
        await saveCategories(categories);
        await renderCategoriesList();
    }
}

async function deleteCategoryItem(id) {
    if (!confirm('Eliminar esta categoria? Los productos asociados NO se eliminaran.')) return;
    var categories = await fetchCategories();
    categories = categories.filter(function(c) { return c.id !== id; });
    await saveCategories(categories);
    await renderCategoriesList();
}

// Product functions
async function showAddProductModal() {
    document.getElementById('productModalTitle').textContent = 'Agregar Producto';
    document.getElementById('productName').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('productQtyPerTray').value = '';
    document.getElementById('productDescription').value = '';
    document.getElementById('productFeatures').value = '';
    document.getElementById('productPreparation').value = '';
    document.getElementById('productImageUrl').value = '';
    document.getElementById('productBadge').value = '';
    document.getElementById('productIsPasabocas').checked = false;
    document.getElementById('productPasabocasPrice').value = '';
    document.getElementById('productEditId').value = '';
    document.getElementById('productPreview').src = '';
    document.getElementById('productPreviewContainer').style.display = 'none';
    document.getElementById('productImageFile').value = '';
    document.getElementById('pasabocasPriceGroup').style.display = 'none';
    
    // Load categories into select
    var categories = await fetchCategories();
    var select = document.getElementById('productCategory');
    select.innerHTML = '<option value="">Seleccionar categoria...</option>';
    categories.filter(function(c) { return c.active !== false; }).forEach(function(cat) {
        select.innerHTML += '<option value="' + cat.id + '">' + cat.name + '</option>';
    });
    
    document.getElementById('productModal').classList.add('active');
}

document.getElementById('productIsPasabocas').addEventListener('change', function() {
    document.getElementById('pasabocasPriceGroup').style.display = this.checked ? 'block' : 'none';
});

async function editProductItem(id) {
    var products = await fetchProducts();
    var prod = products.find(function(p) { return p.id === id; });
    if (!prod) return;
    
    document.getElementById('productModalTitle').textContent = 'Editar Producto';
    document.getElementById('productName').value = prod.name || '';
    document.getElementById('productPrice').value = prod.price || '';
    document.getElementById('productQtyPerTray').value = prod.qtyPerTray || '';
    document.getElementById('productDescription').value = prod.description || '';
    document.getElementById('productFeatures').value = (prod.features || []).join('\n');
    document.getElementById('productPreparation').value = prod.preparation || '';
    document.getElementById('productImageUrl').value = prod.imageUrl || '';
    document.getElementById('productBadge').value = prod.badge || '';
    document.getElementById('productIsPasabocas').checked = prod.isPasabocas || false;
    document.getElementById('productPasabocasPrice').value = prod.pasabocasPrice || '';
    document.getElementById('productEditId').value = prod.id;
    document.getElementById('productPreview').src = prod.imageUrl || '';
    document.getElementById('productPreviewContainer').style.display = prod.imageUrl ? 'block' : 'none';
    document.getElementById('pasabocasPriceGroup').style.display = prod.isPasabocas ? 'block' : 'none';
    
    // Load categories
    var categories = await fetchCategories();
    var select = document.getElementById('productCategory');
    select.innerHTML = '<option value="">Seleccionar categoria...</option>';
    categories.forEach(function(cat) {
        select.innerHTML += '<option value="' + cat.id + '"' + (cat.id === prod.categoryId ? ' selected' : '') + '>' + cat.name + '</option>';
    });
    
    document.getElementById('productModal').classList.add('active');
}

var isSavingProduct = false;

async function saveProductItem(e) {
    e.preventDefault();
    if (isSavingProduct) return;
    isSavingProduct = true;
    
    var products = await fetchProducts();
    var editId = document.getElementById('productEditId').value;
    var imageUrl = document.getElementById('productImageUrl').value;
    
    var fileInput = document.getElementById('productImageFile');
    if (fileInput.files && fileInput.files[0]) {
        imageUrl = document.getElementById('productPreview').src;
    }
    
    var featuresText = document.getElementById('productFeatures').value;
    var features = featuresText.split('\n').filter(function(f) { return f.trim(); });
    
    var newProduct = {
        id: editId || 'prod-' + Date.now(),
        name: document.getElementById('productName').value,
        categoryId: document.getElementById('productCategory').value,
        price: parseInt(document.getElementById('productPrice').value) || 0,
        qtyPerTray: parseInt(document.getElementById('productQtyPerTray').value) || 0,
        description: document.getElementById('productDescription').value,
        features: features,
        preparation: document.getElementById('productPreparation').value,
        imageUrl: imageUrl,
        badge: document.getElementById('productBadge').value,
        isPasabocas: document.getElementById('productIsPasabocas').checked,
        pasabocasPrice: parseInt(document.getElementById('productPasabocasPrice').value) || 0,
        icon: 'fas fa-box',
        active: true
    };
    
    if (editId) {
        var idx = products.findIndex(function(p) { return p.id === editId; });
        if (idx !== -1) products[idx] = newProduct;
    } else {
        products.push(newProduct);
    }
    
    var result = await saveProducts(products);
    isSavingProduct = false;
    if (result) {
        closeModal('productModal');
        await renderCategoriesList();
        alert('Producto guardado exitosamente!');
    } else {
        alert('Error al guardar. Intenta de nuevo.');
    }
}

async function deleteProductItem(id) {
    if (!confirm('Eliminar este producto permanentemente?')) return;
    var products = await fetchProducts();
    products = products.filter(function(p) { return p.id !== id; });
    await saveProducts(products);
    await renderCategoriesList();
}
```

- [ ] **Step 6: Update showTab function to handle products tab**

Find the showTab function and update it:
```javascript
function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(function(el) { el.style.display = 'none'; });
    document.querySelectorAll('.tab-btn').forEach(function(el) { el.classList.remove('active'); });
    document.getElementById('tab-' + tabName).style.display = 'block';
    event.target.classList.add('active');
    if (tabName === 'carousel') renderCarouselList();
    if (tabName === 'promotions') renderPromotionsList();
    if (tabName === 'config') loadConfig();
    if (tabName === 'products') renderCategoriesList();
}
```

- [ ] **Step 7: Commit**

```bash
git add contenido.html
git commit -m "feat: add product management tab to admin panel"
```

---

### Task 3: Migrate Existing Products to Cloud

**Files:**
- Modify: `contenido.html` (add migration function)

**Interfaces:**
- Consumes: `fetchProducts()`, `saveProducts()` from Task 1
- Consumes: `fetchCategories()`, `saveCategories()` from Task 1

- [ ] **Step 1: Add migration function**

Add to the script section in contenido.html:
```javascript
// ===== MIGRATION: Move hardcoded products to cloud =====
async function migrateProductsToCloud() {
    var existingProducts = await fetchProducts();
    if (existingProducts.length > 0) {
        console.log('Products already in cloud, skipping migration.');
        return;
    }
    
    // Define categories
    var categories = [
        { id: 'cat-deditos', name: 'Deditos', icon: 'fas fa-hand-pointer', description: 'Crujientes deditos rellenos para picar', order: 1, active: true },
        { id: 'cat-empanadas', name: 'Empanadas', icon: 'fas fa-cookie', description: 'Empanadas rellenas con los mejores ingredientes', order: 2, active: true },
        { id: 'cat-panzerottis', name: 'Panzerottis', icon: 'fas fa-pizza-slice', description: 'Estilo italiano, crujientes y sabrosos', order: 3, active: true },
        { id: 'cat-pastelitos', name: 'Pastelitos', icon: 'fas fa-birthday-cake', description: 'Pastelitos crujientes con rellenos deliciosos', order: 4, active: true }
    ];
    
    // Define products
    var products = [
        { id: 'prod-deditos-queso', name: 'Deditos de Queso', categoryId: 'cat-deditos', price: 12000, qtyPerTray: 10, description: 'Nuestros deditos de queso son elaborados con masa crujiente por fuera y queso fundido por dentro.', features: ['Masa crujiente y dorada', 'Relleno generoso de queso derretido', 'Sin conservantes artificiales'], preparation: 'Hornear a 180°C por 15-20 minutos hasta que esten dorados.', imageUrl: 'IMAGENES/IMG_20250623_120956_100.jpg', badge: 'Popular', isPasabocas: false, pasabocasPrice: 0, icon: 'fas fa-cheese', active: true },
        { id: 'prod-deditos-bocadillo', name: 'Deditos de Bocadillo', categoryId: 'cat-deditos', price: 12000, qtyPerTray: 10, description: 'Deliciosos deditos rellenos de bocadillo.', features: ['Relleno cremoso de bocadillo', 'Masa ligera y crujiente'], preparation: 'Hornear a 180°C por 15-20 minutos.', imageUrl: 'IMAGENES/IMG_20250623_120956_100.jpg', badge: '', isPasabocas: false, pasabocasPrice: 0, icon: 'fas fa-bread-slice', active: true },
        { id: 'prod-deditos-especiales', name: 'Deditos Especiales (Queso - Bocadillo)', categoryId: 'cat-deditos', price: 12000, qtyPerTray: 10, description: 'Surteido especial de deditos con queso y bocadillo.', features: ['Mezcla de queso y bocadillo', 'Variedad en cada bandeja'], preparation: 'Hornear a 180°C por 15-20 minutos o freir en aceite caliente.', imageUrl: 'IMAGENES/IMG_20250623_120956_100.jpg', badge: 'Especial', isPasabocas: false, pasabocasPrice: 0, icon: 'fas fa-layer-group', active: true },
        { id: 'prod-empanadas-pollo', name: 'Empanadas de Pollo', categoryId: 'cat-empanadas', price: 10000, qtyPerTray: 6, description: 'Empanadas rellenas de pollo sazonado con nuestra receta secreta.', features: ['Pollo desmechado y sazonado', 'Masa fina y crocante'], preparation: 'Hornear a 200°C por 20-25 minutos.', imageUrl: 'IMAGENES/EMPANADAS.jpeg', badge: 'Favorita', isPasabocas: false, pasabocasPrice: 0, icon: 'fas fa-drumstick-bite', active: true },
        { id: 'prod-empanadas-hawaianas', name: 'Empanadas Hawaianas', categoryId: 'cat-empanadas', price: 10000, qtyPerTray: 6, description: 'La combinacion tropical perfecta: jamon y piña.', features: ['Combinacion de jamon y piña', 'Masa crocante y sabrosa'], preparation: 'Hornear a 200°C por 20-25 minutos.', imageUrl: 'IMAGENES/EMPANADAS.jpeg', badge: '', isPasabocas: false, pasabocasPrice: 0, icon: 'fas fa-umbrella-beach', active: true },
        { id: 'prod-empanadas-jamon-queso', name: 'Empanadas Jamon Queso', categoryId: 'cat-empanadas', price: 10000, qtyPerTray: 6, description: 'La combinacion clasica que nunca falla.', features: ['Combinacion clasica de jamon y queso', 'Queso que se derrite perfectamente'], preparation: 'Hornear a 200°C por 20-25 minutos.', imageUrl: 'IMAGENES/EMPANADAS.jpeg', badge: '', isPasabocas: false, pasabocasPrice: 0, icon: 'fas fa-cheese', active: true },
        { id: 'prod-empanadas-especiales', name: 'Empanadas Especiales', categoryId: 'cat-empanadas', price: 10000, qtyPerTray: 6, description: 'Nuestra empanada especial de la casa.', features: ['Receta exclusiva de la casa', 'Ingredientes premium seleccionados'], preparation: 'Hornear a 200°C por 20-25 minutos.', imageUrl: 'IMAGENES/EMPANADAS.jpeg', badge: 'Especial', isPasabocas: false, pasabocasPrice: 0, icon: 'fas fa-star', active: true },
        { id: 'prod-pastelitos-pollo', name: 'Pastelitos de Pollo', categoryId: 'cat-pastelitos', price: 10000, qtyPerTray: 6, description: 'Pastelitos rellenos de pollo desmechado con nuestra sazon especial.', features: ['Pollo desmechado y sazonado', 'Masa ligera y crocante'], preparation: 'Hornear a 190°C por 18-22 minutos.', imageUrl: 'IMAGENES/PASTELITOS.jpg', badge: '', isPasabocas: false, pasabocasPrice: 0, icon: 'fas fa-drumstick-bite', active: true },
        { id: 'prod-pastelitos-jamon-queso', name: 'Pastelitos Jamon Queso', categoryId: 'cat-pastelitos', price: 10000, qtyPerTray: 6, description: 'La combinacion clasica que nunca falla.', features: ['Combinacion clasica de jamon y queso', 'Queso que se derrite perfectamente'], preparation: 'Hornear a 190°C por 18-22 minutos.', imageUrl: 'IMAGENES/PASTELITOS.jpg', badge: '', isPasabocas: false, pasabocasPrice: 0, icon: 'fas fa-cheese', active: true },
        { id: 'prod-pastelitos-especiales', name: 'Pastelitos Especiales', categoryId: 'cat-pastelitos', price: 10000, qtyPerTray: 6, description: 'Nuestra seleccion premium de pastelitos.', features: ['Ingredientes premium seleccionados', 'Receta exclusiva de la casa'], preparation: 'Hornear a 190°C por 18-22 minutos.', imageUrl: 'IMAGENES/PASTELITOS.jpg', badge: 'Especial', isPasabocas: false, pasabocasPrice: 0, icon: 'fas fa-star', active: true },
        { id: 'prod-pastelitos-hawaianos', name: 'Pastelitos Hawaianos', categoryId: 'cat-pastelitos', price: 10000, qtyPerTray: 6, description: 'Tropical mezcla de jamon, queso y piña.', features: ['Combinacion tropical unica', 'Piña fresca y jamon de calidad'], preparation: 'Hornear a 190°C por 18-22 minutos.', imageUrl: 'IMAGENES/PASTELITOS.jpg', badge: '', isPasabocas: false, pasabocasPrice: 0, icon: 'fas fa-umbrella-beach', active: true },
        { id: 'prod-panzerottis', name: 'Panzerottis', categoryId: 'cat-panzerottis', price: 25000, qtyPerTray: 5, description: 'Los panzerottis al estilo italiano, con masa gruesa y esponjosa.', features: ['Masa al estilo italiano, esponjosa', 'Relleno de mozzarella y tomate'], preparation: 'Hornear a 190°C por 22-28 minutos.', imageUrl: 'IMAGENES/IMG_20250623_121049_763.jpg', badge: 'Premium', isPasabocas: false, pasabocasPrice: 0, icon: 'fas fa-pizza-slice', active: true },
        // Pasabocas
        { id: 'prod-pb-deditos-queso', name: 'Deditos Mini Queso', categoryId: 'cat-deditos', price: 0, qtyPerTray: 0, description: 'Deditos de queso en tamaño mini para eventos.', features: [], preparation: '', imageUrl: 'IMAGENES/IMG_20250623_120956_100.jpg', badge: '', isPasabocas: true, pasabocasPrice: 800, icon: 'fas fa-cheese', active: true },
        { id: 'prod-pb-deditos-bocadillo', name: 'Deditos Mini Bocadillo', categoryId: 'cat-deditos', price: 0, qtyPerTray: 0, description: 'Deditos de bocadillo en tamaño mini para eventos.', features: [], preparation: '', imageUrl: 'IMAGENES/IMG_20250623_120956_100.jpg', badge: '', isPasabocas: true, pasabocasPrice: 800, icon: 'fas fa-bread-slice', active: true },
        { id: 'prod-pb-deditos-especiales', name: 'Deditos Mini Especiales', categoryId: 'cat-deditos', price: 0, qtyPerTray: 0, description: 'Deditos especiales en tamaño mini para eventos.', features: [], preparation: '', imageUrl: 'IMAGENES/IMG_20250623_120956_100.jpg', badge: '', isPasabocas: true, pasabocasPrice: 800, icon: 'fas fa-layer-group', active: true },
        { id: 'prod-pb-empanadas-pollo', name: 'Empanaditas Mini Pollo', categoryId: 'cat-empanadas', price: 0, qtyPerTray: 0, description: 'Empanadas de pollo en tamaño mini para eventos.', features: [], preparation: '', imageUrl: 'IMAGENES/EMPANADAS.jpeg', badge: '', isPasabocas: true, pasabocasPrice: 900, icon: 'fas fa-drumstick-bite', active: true },
        { id: 'prod-pb-empanadas-hawaianas', name: 'Empanaditas Mini Hawaianas', categoryId: 'cat-empanadas', price: 0, qtyPerTray: 0, description: 'Empanadas hawaianas en tamaño mini para eventos.', features: [], preparation: '', imageUrl: 'IMAGENES/EMPANADAS.jpeg', badge: '', isPasabocas: true, pasabocasPrice: 900, icon: 'fas fa-umbrella-beach', active: true },
        { id: 'prod-pb-empanadas-jamon-queso', name: 'Empanaditas Mini Jamon Queso', categoryId: 'cat-empanadas', price: 0, qtyPerTray: 0, description: 'Empanadas de jamon y queso en tamaño mini.', features: [], preparation: '', imageUrl: 'IMAGENES/EMPANADAS.jpeg', badge: '', isPasabocas: true, pasabocasPrice: 900, icon: 'fas fa-cheese', active: true },
        { id: 'prod-pb-empanadas-especiales', name: 'Empanaditas Mini Especiales', categoryId: 'cat-empanadas', price: 0, qtyPerTray: 0, description: 'Empanadas especiales en tamaño mini.', features: [], preparation: '', imageUrl: 'IMAGENES/EMPANADAS.jpeg', badge: '', isPasabocas: true, pasabocasPrice: 900, icon: 'fas fa-star', active: true },
        { id: 'prod-pb-ojos', name: 'Ojos de Buey', categoryId: 'cat-pastelitos', price: 0, qtyPerTray: 0, description: 'Ojos de buey para eventos y celebraciones.', features: [], preparation: '', imageUrl: 'IMAGENES/PASTELITOS.jpg', badge: '', isPasabocas: true, pasabocasPrice: 1000, icon: 'fas fa-eye', active: true }
    ];
    
    await saveCategories(categories);
    await saveProducts(products);
    alert('Migracion completada! Se han guardado ' + categories.length + ' categorias y ' + products.length + ' productos en la nube.');
    renderCategoriesList();
}
```

- [ ] **Step 2: Add migration button to products tab**

Update the products tab header:
```html
<div class="content-header">
    <h2><i class="fas fa-box"></i> Gestion de Productos</h2>
    <div style="display:flex; gap:10px;">
        <button class="btn-primary" onclick="showAddCategoryModal()"><i class="fas fa-plus"></i> Nueva Categoria</button>
        <button class="btn-primary" onclick="showAddProductModal()"><i class="fas fa-plus"></i> Nuevo Producto</button>
        <button class="btn-danger" onclick="migrateProductsToCloud()" style="background:#ff6b35;"><i class="fas fa-database"></i> Migrar Productos Existentes</button>
    </div>
</div>
```

- [ ] **Step 3: Commit**

```bash
git add contenido.html
git commit -m "feat: add product migration function"
```

---

### Task 4: Update Index Page to Load Products Dynamically

**Files:**
- Modify: `index.html`
- Modify: `script.js`

**Interfaces:**
- Consumes: `fetchCategories()`, `fetchProducts()` from Task 1

- [ ] **Step 1: Replace hardcoded products section in index.html**

Replace the entire `<section id="productos" class="products-section">` with:
```html
<section id="productos" class="products-section">
    <div class="container">
        <div class="section-header">
            <span class="section-badge"><i class="fas fa-star"></i> Nuestros Productos</span>
            <h2 class="section-title">Elige tus favoritos</h2>
            <p class="section-subtitle">Haz clic en cualquier producto para ver sus caracteristicas y precios</p>
        </div>
        <div id="dynamicProductsContainer">
            <p style="text-align:center; color:#888;">Cargando productos...</p>
        </div>
    </div>
</section>
```

- [ ] **Step 2: Add dynamic product loading function to script.js**

Add to the end of script.js:
```javascript
// ===== DYNAMIC PRODUCTS FROM CLOUD =====
async function loadDynamicProducts() {
    var container = document.getElementById('dynamicProductsContainer');
    if (!container) return;
    
    try {
        var categories = await fetchCategories();
        var products = await fetchProducts();
        
        var activeCategories = categories.filter(function(c) { return c.active !== false; }).sort(function(a, b) { return a.order - b.order; });
        var trayProducts = products.filter(function(p) { return !p.isPasabocas && p.active !== false; });
        
        if (activeCategories.length === 0) {
            container.innerHTML = '<p style="text-align:center; color:#888;">No hay productos disponibles.</p>';
            return;
        }
        
        var html = '';
        activeCategories.forEach(function(cat) {
            var catProducts = trayProducts.filter(function(p) { return p.categoryId === cat.id; });
            if (catProducts.length === 0) return;
            
            html += '<div class="category">';
            html += '<div class="category-header">';
            html += '<div class="category-icon"><i class="' + (cat.icon || 'fas fa-box') + '"></i></div>';
            html += '<div><h3>' + cat.name + '</h3>';
            html += '<p>' + (cat.description || '') + '</p></div></div>';
            html += '<div class="products-grid">';
            
            catProducts.forEach(function(prod) {
                html += '<div class="product-card" onclick="openModal(\'' + prod.id + '\')">';
                html += '<div class="product-image">';
                if (prod.imageUrl) {
                    html += '<img src="' + prod.imageUrl + '" loading="lazy" alt="' + prod.name + '">';
                }
                if (prod.badge) {
                    var badgeClass = prod.badge === 'Premium' ? 'badge-premium' : (prod.badge === 'Especial' ? 'badge-new' : '');
                    html += '<div class="product-badge ' + badgeClass + '">' + prod.badge + '</div>';
                }
                html += '</div>';
                html += '<div class="product-info">';
                html += '<h4>' + prod.name + '</h4>';
                html += '<p class="product-preview">' + (prod.description || '').substring(0, 60) + '...</p>';
                html += '<div class="product-price-tag">$' + prod.price.toLocaleString('es-VE') + ' <span>x' + prod.qtyPerTray + ' uds</span></div>';
                html += '<span class="view-details">Ver detalles <i class="fas fa-arrow-right"></i></span>';
                html += '</div></div>';
            });
            
            html += '</div></div>';
        });
        
        container.innerHTML = html;
        
        // Update products object for modal
        products.forEach(function(prod) {
            products[prod.id] = {
                name: prod.name,
                icon: prod.icon || 'fas fa-box',
                description: prod.description || '',
                features: prod.features || [],
                prices: prod.price > 0 ? [{ presentation: 'Bandeja x ' + prod.qtyPerTray + ' unidades', price: '$' + prod.price.toLocaleString('es-VE') }] : [],
                preparation: prod.preparation || ''
            };
        });
    } catch(e) {
        container.innerHTML = '<p style="text-align:center; color:#888;">Error al cargar productos.</p>';
    }
}

// Update openModal to work with dynamic products
var originalProducts = products;

document.addEventListener('DOMContentLoaded', function() {
    loadDynamicProducts();
});
```

- [ ] **Step 3: Update openModal function to handle dynamic products**

Replace the existing openModal function in script.js:
```javascript
function openModal(productId) {
    var product = originalProducts[productId] || products[productId];
    if (!product) return;
    
    var modal = document.getElementById('productModal');
    
    document.getElementById('modal-icon').innerHTML = '<i class="' + product.icon + '"></i>';
    document.getElementById('modal-title').textContent = product.name;
    document.getElementById('modal-description').textContent = product.description;
    
    var featuresList = document.getElementById('modal-features');
    featuresList.innerHTML = product.features.map(function(f) { return '<li>' + f + '</li>'; }).join('');
    
    var pricesContainer = document.getElementById('modal-prices');
    pricesContainer.innerHTML = '<table class="price-table"><thead><tr><th>Presentacion</th><th>Precio</th></tr></thead><tbody>' + 
        product.prices.map(function(p) { return '<tr><td>' + p.presentation + '</td><td>' + p.price + '</td></tr>'; }).join('') + 
        '</tbody></table>';
    
    document.getElementById('modal-preparation-text').textContent = product.preparation;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}
```

- [ ] **Step 4: Commit**

```bash
git add index.html script.js
git commit -m "feat: load products dynamically from cloud on index page"
```

---

### Task 5: Update Pedidos Page to Load Products Dynamically

**Files:**
- Modify: `pedidos.html`
- Modify: `pedidos.js`

**Interfaces:**
- Consumes: `fetchCategories()`, `fetchProducts()` from Task 1

- [ ] **Step 1: Replace hardcoded product sections in pedidos.html**

Replace the entire products section (from `<!-- Product Selection: Bandejas -->` to the end of that form-section) with:
```html
<!-- Product Selection: Bandejas -->
<div class="form-section">
    <h2><i class="fas fa-box-open"></i> Seleccionar Productos (Bandejas)</h2>
    <p class="form-note">Selecciona la cantidad de bandejas que deseas de cada producto.</p>
    <div id="dynamicOrderProducts" class="order-grid">
        <p style="text-align:center; color:#888; grid-column:1/-1;">Cargando productos...</p>
    </div>
</div>
```

- [ ] **Step 2: Replace hardcoded pasabocas section in pedidos.html**

Replace the pasabocas section with:
```html
<!-- Pasabocas Selection -->
<div class="form-section pasabocas-order-section">
    <h2><i class="fas fa-glass-cheers"></i> Pasabocas para Eventos</h2>
    <p class="form-note">Deditos, empanaditas y otros en tamaño mini. Indica la cantidad de unidades que necesitas.</p>
    <div id="dynamicPasabocasProducts" class="order-grid">
        <p style="text-align:center; color:#888; grid-column:1/-1;">Cargando pasabocas...</p>
    </div>
</div>
```

- [ ] **Step 3: Add dynamic loading function to pedidos.js**

Add to the end of pedidos.js:
```javascript
// ===== DYNAMIC PRODUCTS FROM CLOUD =====
var dynamicTrayProducts = {};
var dynamicPasabocasProducts = {};

async function loadDynamicOrderProducts() {
    var trayContainer = document.getElementById('dynamicOrderProducts');
    var pasabocasContainer = document.getElementById('dynamicPasabocasProducts');
    
    try {
        var categories = await fetchCategories();
        var products = await fetchProducts();
        
        var activeCategories = categories.filter(function(c) { return c.active !== false; }).sort(function(a, b) { return a.order - b.order; });
        var trayProducts = products.filter(function(p) { return !p.isPasabocas && p.active !== false; });
        var pasabocasProductsList = products.filter(function(p) { return p.isPasabocas && p.active !== false; });
        
        // Render tray products
        var trayHtml = '';
        activeCategories.forEach(function(cat) {
            var catProducts = trayProducts.filter(function(p) { return p.categoryId === cat.id; });
            if (catProducts.length === 0) return;
            
            trayHtml += '<div class="order-category">';
            trayHtml += '<h3><i class="' + (cat.icon || 'fas fa-box') + '"></i> ' + cat.name + '</h3>';
            
            catProducts.forEach(function(prod) {
                var productId = prod.id.replace('prod-', '');
                dynamicTrayProducts[productId] = { name: prod.name + ' (x' + prod.qtyPerTray + ')', price: prod.price, qty: prod.qtyPerTray };
                
                trayHtml += '<div class="order-product">';
                trayHtml += '<span class="order-product-name">' + prod.name + ' (x' + prod.qtyPerTray + ')</span>';
                trayHtml += '<span class="order-product-price">$' + prod.price.toLocaleString('es-VE') + '</span>';
                trayHtml += '<div class="qty-control">';
                trayHtml += '<button type="button" onclick="changeQty(\'' + productId + '\', -1)">-</button>';
                trayHtml += '<input type="number" id="qty-' + productId + '" value="0" min="0" onchange="updateTotal()">';
                trayHtml += '<button type="button" onclick="changeQty(\'' + productId + '\', 1)">+</button>';
                trayHtml += '</div></div>';
            });
            
            trayHtml += '</div>';
        });
        trayContainer.innerHTML = trayHtml;
        
        // Render pasabocas products
        var pasabocasHtml = '';
        activeCategories.forEach(function(cat) {
            var catPasabocas = pasabocasProductsList.filter(function(p) { return p.categoryId === cat.id; });
            if (catPasabocas.length === 0) return;
            
            pasabocasHtml += '<div class="order-category">';
            pasabocasHtml += '<h3><i class="' + (cat.icon || 'fas fa-box') + '"></i> ' + cat.name + ' Mini</h3>';
            
            catPasabocas.forEach(function(prod) {
                var productId = prod.id.replace('prod-', '');
                dynamicPasabocasProducts[productId] = { name: prod.name, pricePerUnit: true };
                
                pasabocasHtml += '<div class="order-product">';
                pasabocasHtml += '<span class="order-product-name">' + prod.name + '</span>';
                pasabocasHtml += '<span class="order-product-price-unit">$' + prod.pasabocasPrice.toLocaleString('es-VE') + ' c/u</span>';
                pasabocasHtml += '<div class="qty-control">';
                pasabocasHtml += '<button type="button" onclick="changeQty(\'' + productId + '\', -1)">-</button>';
                pasabocasHtml += '<input type="number" id="qty-' + productId + '" value="0" min="0" onchange="updateTotal()">';
                pasabocasHtml += '<button type="button" onclick="changeQty(\'' + productId + '\', 1)">+</button>';
                pasabocasHtml += '</div></div>';
            });
            
            pasabocasHtml += '</div>';
        });
        pasabocasContainer.innerHTML = pasabocasHtml;
        
        // Update trayProducts and pasabocasProducts objects
        Object.assign(trayProducts, dynamicTrayProducts);
        Object.assign(pasabocasProducts, dynamicPasabocasProducts);
        
    } catch(e) {
        trayContainer.innerHTML = '<p style="text-align:center; color:#888; grid-column:1/-1;">Error al cargar productos.</p>';
        pasabocasContainer.innerHTML = '<p style="text-align:center; color:#888; grid-column:1/-1;">Error al cargar pasabocas.</p>';
    }
}

// Load dynamic products on page load
document.addEventListener('DOMContentLoaded', function() {
    loadDynamicOrderProducts();
});
```

- [ ] **Step 4: Commit**

```bash
git add pedidos.html pedidos.js
git commit -m "feat: load products dynamically from cloud on order page"
```

---

### Task 6: Test and Verify

**Files:**
- Verify: `contenido.html` (admin panel)
- Verify: `index.html` (product display)
- Verify: `pedidos.html` (order form)

- [ ] **Step 1: Opencontenido.html and test migration**

1. Open `contenido.html` in browser
2. Login with password `rochy2026`
3. Go to "Productos" tab
4. Click "Migrar Productos Existentes"
5. Verify categories and products appear

- [ ] **Step 2: Test adding a new category**

1. Click "Nueva Categoria"
2. Fill in name, icon, description
3. Save and verify it appears in the list

- [ ] **Step 3: Test adding a new product**

1. Click "Nuevo Producto"
2. Fill in all fields including category, price, image
3. Save and verify it appears under its category

- [ ] **Step 4: Test editing and deleting**

1. Edit a product name and save
2. Delete a test product and confirm

- [ ] **Step 5: Open index.html and verify**

1. Refresh index.html
2. Verify new category and product appear
3. Click on product to open modal

- [ ] **Step 6: Open pedidos.html and verify**

1. Refresh pedidos.html
2. Verify products appear in order form
3. Test quantity controls and total calculation

- [ ] **Step 7: Commit final verification**

```bash
git add -A
git commit -m "feat: complete dynamic product management system"
```
