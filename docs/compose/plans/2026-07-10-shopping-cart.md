# Shopping Cart Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use compose:subagent (recommended) or compose:execute to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a persistent shopping cart to the order page with localStorage (future-ready for cloud storage).

**Architecture:** Create a cart.js module with abstraction layer for storage. Modify pedidos.html/pedidos.js to use cart module. Add cart summary UI with bottom bar and modal.

**Tech Stack:** Vanilla JS, localStorage, CSS animations

## Global Constraints

- Cart data stored in localStorage with prefix `rochy_cart_`
- Abstraction layer allows switching to cloud storage later
- Cart persists across page reloads
- Cart clears after order submission
- No new external dependencies

---

### Task 1: Create Cart Module (cart.js)

**Files:**
- Create: `cart.js`

**Interfaces:**
- Produces: `Cart.getItems()`, `Cart.addItem(item)`, `Cart.removeItem(id)`, `Cart.updateQty(id, qty)`, `Cart.clear()`, `Cart.getTotal()`, `Cart.getCount()`

- [ ] **Step 1: Create cart.js with storage abstraction**

```javascript
// ===== CART MODULE =====
// Abstraction layer for cart storage (localStorage now, cloud later)

var Cart = (function() {
    var STORAGE_KEY = 'rochy_cart';
    var storage = localStorage; // Can be swapped to cloud later
    
    function getCart() {
        try {
            var data = storage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : { items: [], updatedAt: null };
        } catch(e) {
            return { items: [], updatedAt: null };
        }
    }
    
    function saveCart(cart) {
        cart.updatedAt = new Date().toISOString();
        try {
            storage.setItem(STORAGE_KEY, JSON.stringify(cart));
            return true;
        } catch(e) {
            console.error('Error saving cart:', e);
            return false;
        }
    }
    
    function getItems() {
        return getCart().items;
    }
    
    function addItem(product) {
        var cart = getCart();
        var existing = cart.items.find(function(i) { return i.id === product.id; });
        
        if (existing) {
            existing.qty += product.qty || 1;
        } else {
            cart.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                isPasabocas: product.isPasabocas || false,
                qty: product.qty || 1
            });
        }
        
        saveCart(cart);
        notifyListeners();
        return cart.items;
    }
    
    function removeItem(id) {
        var cart = getCart();
        cart.items = cart.items.filter(function(i) { return i.id !== id; });
        saveCart(cart);
        notifyListeners();
        return cart.items;
    }
    
    function updateQty(id, qty) {
        var cart = getCart();
        var item = cart.items.find(function(i) { return i.id === id; });
        
        if (item) {
            if (qty <= 0) {
                cart.items = cart.items.filter(function(i) { return i.id !== id; });
            } else {
                item.qty = qty;
            }
        }
        
        saveCart(cart);
        notifyListeners();
        return cart.items;
    }
    
    function clear() {
        var cart = { items: [], updatedAt: new Date().toISOString() };
        saveCart(cart);
        notifyListeners();
    }
    
    function getTotal() {
        var items = getItems();
        return items.reduce(function(sum, item) {
            return sum + (item.price * item.qty);
        }, 0);
    }
    
    function getCount() {
        var items = getItems();
        return items.reduce(function(sum, item) {
            return sum + item.qty;
        }, 0);
    }
    
    // Observer pattern for UI updates
    var listeners = [];
    
    function onChange(callback) {
        listeners.push(callback);
    }
    
    function notifyListeners() {
        listeners.forEach(function(cb) { cb(); });
    }
    
    return {
        getItems: getItems,
        addItem: addItem,
        removeItem: removeItem,
        updateQty: updateQty,
        clear: clear,
        getTotal: getTotal,
        getCount: getCount,
        onChange: onChange
    };
})();
```

- [ ] **Step 2: Commit**

```bash
git add cart.js
git commit -m "feat: add cart module with localStorage abstraction"
```

---

### Task 2: Add Cart CSS Styles

**Files:**
- Modify: `styles.css`

**Interfaces:**
- Consumes: None
- Produces: CSS classes for cart UI

- [ ] **Step 1: Add cart bar styles**

Add to the end of styles.css:
```css
/* ===== CART BAR ===== */
.cart-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
    color: white;
    padding: 15px 20px;
    display: none;
    align-items: center;
    justify-content: space-between;
    z-index: 1500;
    box-shadow: 0 -5px 30px rgba(0,0,0,0.2);
    animation: slideUp 0.3s ease;
}

.cart-bar.active {
    display: flex;
}

@keyframes slideUp {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
}

.cart-bar-info {
    display: flex;
    align-items: center;
    gap: 20px;
}

.cart-bar-count {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.95rem;
}

.cart-bar-count i {
    color: #ff6b35;
}

.cart-bar-total {
    font-size: 1.2rem;
    font-weight: 700;
}

.cart-bar-total span {
    color: #ff6b35;
}

.cart-bar-actions {
    display: flex;
    gap: 10px;
}

.btn-cart {
    padding: 10px 20px;
    border-radius: 25px;
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s;
    border: none;
    font-family: 'Poppins', sans-serif;
}

.btn-cart-view {
    background: rgba(255,255,255,0.15);
    color: white;
    border: 1px solid rgba(255,255,255,0.3);
}

.btn-cart-view:hover {
    background: rgba(255,255,255,0.25);
}

.btn-cart-clear {
    background: rgba(255,107,53,0.2);
    color: #ff6b35;
    border: 1px solid #ff6b35;
}

.btn-cart-clear:hover {
    background: #ff6b35;
    color: white;
}

/* ===== CART MODAL ===== */
.cart-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(5px);
    z-index: 2000;
    display: none;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.cart-modal.active {
    display: flex;
}

.cart-modal-content {
    background: white;
    border-radius: 25px;
    max-width: 600px;
    width: 100%;
    max-height: 80vh;
    overflow-y: auto;
    animation: modalSlide 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.cart-modal-header {
    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
    padding: 25px 30px;
    border-radius: 25px 25px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;
}

.cart-modal-header h2 {
    font-size: 1.3rem;
    display: flex;
    align-items: center;
    gap: 10px;
}

.cart-modal-close {
    background: rgba(255,255,255,0.2);
    border: none;
    color: white;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    font-size: 1.2rem;
    cursor: pointer;
    transition: all 0.3s;
}

.cart-modal-close:hover {
    background: rgba(255,255,255,0.4);
}

.cart-modal-body {
    padding: 25px 30px;
}

.cart-item {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px 0;
    border-bottom: 1px solid #eee;
}

.cart-item:last-child {
    border-bottom: none;
}

.cart-item-info {
    flex: 1;
}

.cart-item-name {
    font-weight: 600;
    color: #333;
    font-size: 0.95rem;
    margin-bottom: 4px;
}

.cart-item-price {
    color: #ff6b35;
    font-size: 0.85rem;
}

.cart-item-qty {
    display: flex;
    align-items: center;
    gap: 0;
}

.cart-item-qty button {
    width: 32px;
    height: 32px;
    border: 2px solid #1e3c72;
    background: white;
    color: #1e3c72;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
}

.cart-item-qty button:first-child {
    border-radius: 8px 0 0 8px;
}

.cart-item-qty button:last-child {
    border-radius: 0 8px 8px 0;
}

.cart-item-qty button:hover {
    background: #1e3c72;
    color: white;
}

.cart-item-qty input {
    width: 45px;
    height: 32px;
    border: 2px solid #1e3c72;
    border-left: none;
    border-right: none;
    text-align: center;
    font-size: 0.95rem;
    font-weight: 600;
    font-family: 'Poppins', sans-serif;
}

.cart-item-total {
    font-weight: 700;
    color: #1e3c72;
    font-size: 0.95rem;
    min-width: 80px;
    text-align: right;
}

.cart-item-remove {
    background: none;
    border: none;
    color: #999;
    cursor: pointer;
    padding: 5px;
    transition: color 0.3s;
}

.cart-item-remove:hover {
    color: #f44336;
}

.cart-empty {
    text-align: center;
    padding: 40px;
    color: #888;
}

.cart-empty i {
    font-size: 3rem;
    color: #ddd;
    margin-bottom: 15px;
}

.cart-modal-footer {
    padding: 20px 30px;
    background: #f8f9fa;
    border-radius: 0 0 25px 25px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.cart-modal-total {
    font-size: 1.3rem;
    font-weight: 700;
    color: #1e3c72;
}

.cart-modal-total span {
    color: #ff6b35;
}

/* ===== ORDER PAGE ADJUSTMENTS ===== */
.order-section {
    padding-bottom: 100px; /* Space for cart bar */
}
```

- [ ] **Step 2: Commit**

```bash
git add styles.css
git commit -m "feat: add cart bar and modal styles"
```

---

### Task 3: Add Cart UI to Pedidos Page

**Files:**
- Modify: `pedidos.html`

**Interfaces:**
- Consumes: Cart module from Task 1

- [ ] **Step 1: Add cart.js script to pedidos.html**

Find `<script src="cloud.js"></script>` and add after it:
```html
<script src="cloud.js"></script>
<script src="cart.js"></script>
```

- [ ] **Step 2: Add cart bar HTML before closing body tag**

Add before `<!-- WhatsApp Floating Button -->`:
```html
<!-- Cart Bar -->
<div id="cartBar" class="cart-bar">
    <div class="cart-bar-info">
        <div class="cart-bar-count">
            <i class="fas fa-shopping-cart"></i>
            <span id="cartBarCount">0 items</span>
        </div>
        <div class="cart-bar-total">
            Total: <span id="cartBarTotal">$0</span>
        </div>
    </div>
    <div class="cart-bar-actions">
        <button class="btn-cart btn-cart-clear" onclick="clearCartConfirm()">
            <i class="fas fa-trash"></i> Limpiar
        </button>
        <button class="btn-cart btn-cart-view" onclick="openCartModal()">
            <i class="fas fa-eye"></i> Ver Carrito
        </button>
    </div>
</div>

<!-- Cart Modal -->
<div id="cartModal" class="cart-modal">
    <div class="cart-modal-content">
        <div class="cart-modal-header">
            <h2><i class="fas fa-shopping-cart"></i> Mi Carrito</h2>
            <button class="cart-modal-close" onclick="closeCartModal()">&times;</button>
        </div>
        <div class="cart-modal-body" id="cartModalBody">
            <!-- Dynamic content -->
        </div>
        <div class="cart-modal-footer">
            <div class="cart-modal-total">
                Total: <span id="cartModalTotal">$0</span>
            </div>
            <button class="btn-primary" onclick="closeCartModal()">
                <i class="fas fa-arrow-left"></i> Seguir Comprando
            </button>
        </div>
    </div>
</div>
```

- [ ] **Step 3: Commit**

```bash
git add pedidos.html
git commit -m "feat: add cart bar and modal HTML to pedidos page"
```

---

### Task 4: Integrate Cart with Pedidos.js

**Files:**
- Modify: `pedidos.js`

**Interfaces:**
- Consumes: Cart module from Task 1

- [ ] **Step 1: Update changeQty function to use Cart**

Replace the existing changeQty function:
```javascript
function changeQty(productId, delta) {
    const input = document.getElementById('qty-' + productId);
    let val = parseInt(input.value) || 0;
    val = Math.max(0, val + delta);
    input.value = val;
    
    // Update cart
    var isPasabocas = productId.startsWith('pb-');
    var price = 0;
    var name = '';
    
    if (isPasabocas && dynamicPasabocasProducts[productId]) {
        name = dynamicPasabocasProducts[productId].name;
        price = getPasabocasPrice(name);
    } else if (dynamicTrayProducts[productId]) {
        name = dynamicTrayProducts[productId].name;
        price = dynamicTrayProducts[productId].price;
    } else if (trayProducts[productId]) {
        name = trayProducts[productId].name;
        price = trayProducts[productId].price;
    }
    
    if (val > 0) {
        Cart.addItem({ id: productId, name: name, price: price, isPasabocas: isPasabocas, qty: val });
    } else {
        Cart.removeItem(productId);
    }
    
    updateTotal();
}
```

- [ ] **Step 2: Add cart UI update functions**

Add to the end of pedidos.js:
```javascript
// ===== CART UI FUNCTIONS =====
function updateCartBar() {
    var count = Cart.getCount();
    var total = Cart.getTotal();
    var cartBar = document.getElementById('cartBar');
    
    document.getElementById('cartBarCount').textContent = count + ' items';
    document.getElementById('cartBarTotal').textContent = '$' + total.toLocaleString('es-VE');
    
    if (count > 0) {
        cartBar.classList.add('active');
    } else {
        cartBar.classList.remove('active');
    }
}

function openCartModal() {
    var items = Cart.getItems();
    var modal = document.getElementById('cartModal');
    var body = document.getElementById('cartModalBody');
    
    if (items.length === 0) {
        body.innerHTML = '<div class="cart-empty"><i class="fas fa-shopping-cart"></i><p>Tu carrito esta vacio</p></div>';
    } else {
        var html = '';
        items.forEach(function(item) {
            var itemTotal = item.price * item.qty;
            html += '<div class="cart-item">';
            html += '<div class="cart-item-info">';
            html += '<div class="cart-item-name">' + item.name + '</div>';
            html += '<div class="cart-item-price">$' + item.price.toLocaleString('es-VE') + (item.isPasabocas ? ' c/u' : ' por bandeja') + '</div>';
            html += '</div>';
            html += '<div class="cart-item-qty">';
            html += '<button onclick="updateCartQty(\'' + item.id + '\', ' + (item.qty - 1) + ')">-</button>';
            html += '<input type="number" value="' + item.qty + '" onchange="updateCartQty(\'' + item.id + '\', parseInt(this.value) || 0)">';
            html += '<button onclick="updateCartQty(\'' + item.id + '\', ' + (item.qty + 1) + ')">+</button>';
            html += '</div>';
            html += '<div class="cart-item-total">$' + itemTotal.toLocaleString('es-VE') + '</div>';
            html += '<button class="cart-item-remove" onclick="removeCartItem(\'' + item.id + '\')"><i class="fas fa-trash"></i></button>';
            html += '</div>';
        });
        body.innerHTML = html;
    }
    
    document.getElementById('cartModalTotal').textContent = '$' + Cart.getTotal().toLocaleString('es-VE');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCartModal() {
    document.getElementById('cartModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

function updateCartQty(id, qty) {
    Cart.updateQty(id, qty);
    // Update input on order form
    var input = document.getElementById('qty-' + id);
    if (input) input.value = qty;
    updateCartModal();
    updateTotal();
}

function removeCartItem(id) {
    Cart.removeItem(id);
    // Update input on order form
    var input = document.getElementById('qty-' + id);
    if (input) input.value = 0;
    updateCartModal();
    updateTotal();
}

function updateCartModal() {
    var items = Cart.getItems();
    var body = document.getElementById('cartModalBody');
    
    if (items.length === 0) {
        body.innerHTML = '<div class="cart-empty"><i class="fas fa-shopping-cart"></i><p>Tu carrito esta vacio</p></div>';
    } else {
        var html = '';
        items.forEach(function(item) {
            var itemTotal = item.price * item.qty;
            html += '<div class="cart-item">';
            html += '<div class="cart-item-info">';
            html += '<div class="cart-item-name">' + item.name + '</div>';
            html += '<div class="cart-item-price">$' + item.price.toLocaleString('es-VE') + (item.isPasabocas ? ' c/u' : ' por bandeja') + '</div>';
            html += '</div>';
            html += '<div class="cart-item-qty">';
            html += '<button onclick="updateCartQty(\'' + item.id + '\', ' + (item.qty - 1) + ')">-</button>';
            html += '<input type="number" value="' + item.qty + '" onchange="updateCartQty(\'' + item.id + '\', parseInt(this.value) || 0)">';
            html += '<button onclick="updateCartQty(\'' + item.id + '\', ' + (item.qty + 1) + ')">+</button>';
            html += '</div>';
            html += '<div class="cart-item-total">$' + itemTotal.toLocaleString('es-VE') + '</div>';
            html += '<button class="cart-item-remove" onclick="removeCartItem(\'' + item.id + '\')"><i class="fas fa-trash"></i></button>';
            html += '</div>';
        });
        body.innerHTML = html;
    }
    
    document.getElementById('cartModalTotal').textContent = '$' + Cart.getTotal().toLocaleString('es-VE');
}

function clearCartConfirm() {
    if (confirm('Limpiar todo el carrito?')) {
        Cart.clear();
        // Reset all inputs on form
        document.querySelectorAll('.qty-control input').forEach(function(input) {
            input.value = 0;
        });
        updateTotal();
    }
}

// Listen for cart changes
Cart.onChange(updateCartBar);

// Initialize cart bar on load
document.addEventListener('DOMContentLoaded', function() {
    updateCartBar();
    // Sync form inputs with cart
    syncFormWithCart();
});

function syncFormWithCart() {
    var items = Cart.getItems();
    items.forEach(function(item) {
        var input = document.getElementById('qty-' + item.id);
        if (input) input.value = item.qty;
    });
    updateTotal();
}
```

- [ ] **Step 3: Update form submit to clear cart**

Find the form submit handler and add cart clearing after successful submission. After `alert('Pedido guardado. Se envio el detalle por texto.');` add:
```javascript
// Clear cart after successful order
Cart.clear();
```

- [ ] **Step 4: Commit**

```bash
git add pedidos.js
git commit -m "feat: integrate cart with order form"
```

---

### Task 5: Test Cart Functionality

**Files:**
- Verify: `pedidos.html` with cart

- [ ] **Step 1: Open pedidos.html and test adding products**

1. Open `pedidos.html` in browser
2. Add products using +/- buttons
3. Verify cart bar appears at bottom with count and total
4. Click "Ver Carrito" to open modal
5. Verify products appear in modal with correct quantities

- [ ] **Step 2: Test editing quantities in modal**

1. In cart modal, change quantity using +/- buttons
2. Verify quantity updates on the order form
3. Verify total updates correctly

- [ ] **Step 3: Test persistence**

1. Add products to cart
2. Close browser tab
3. Reopen `pedidos.html`
4. Verify cart still has the products

- [ ] **Step 4: Test cart clearing**

1. Click "Limpiar" button on cart bar
2. Confirm dialog
3. Verify cart is empty and all inputs reset to 0

- [ ] **Step 5: Commit final**

```bash
git add -A
git commit -m "feat: complete shopping cart implementation"
```
