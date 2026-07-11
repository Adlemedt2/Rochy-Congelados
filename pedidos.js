// ===== CONFIGURABLE PRICES =====
let config = {
    deliveryCost: 3000,
    containerCost: 2000,
    fryingCost: 500,
    fryingType: 'unit',
    pasabocasPriceType: 'same',
    pasabocasSame: 800,
    pasabocasDeditos: 800,
    pasabocasEmpanadas: 900,
    pasabocasOjos: 1000
};

// Load config from cloud
async function loadConfigFromCloud() {
    var cloudConfig = await fetchConfig();
    if (cloudConfig && Object.keys(cloudConfig).length > 0) {
        config = {
            deliveryCost: cloudConfig.deliveryCost || 3000,
            containerCost: cloudConfig.containerCost || 2000,
            fryingCost: cloudConfig.fryingCost || 500,
            fryingType: cloudConfig.fryingType || 'unit',
            pasabocasPriceType: cloudConfig.pasabocasPriceType || 'same',
            pasabocasSame: cloudConfig.pasabocasSame || 800,
            pasabocasDeditos: cloudConfig.pasabocasDeditos || 800,
            pasabocasEmpanadas: cloudConfig.pasabocasEmpanadas || 900,
            pasabocasOjos: cloudConfig.pasabocasOjos || 1000
        };
    }
    // Update UI
    updatePasabocasPricesFromConfig();
    updateDelivery();
}

function getPasabocasPrice(productName) {
    if (config.pasabocasPriceType === 'same') {
        return config.pasabocasSame;
    }
    var name = productName.toLowerCase();
    if (name.includes('dedito')) return config.pasabocasDeditos;
    if (name.includes('empanada')) return config.pasabocasEmpanadas;
    if (name.includes('ojos') || name.includes('buey')) return config.pasabocasOjos;
    return config.pasabocasSame;
}

function updatePasabocasPricesFromConfig() {
    document.querySelectorAll('.order-product-price-unit').forEach(function(el) {
        var productName = el.closest('.order-product').querySelector('.order-product-name').textContent;
        var price = getPasabocasPrice(productName);
        el.textContent = '$' + price.toLocaleString('es-VE') + ' c/u';
    });
}

// ===== PRODUCT PRICES =====
const trayProducts = {
    'deditos-queso':           { name: 'Deditos de Queso (x10)', price: 12000, qty: 10 },
    'deditos-bocadillo':       { name: 'Deditos de Bocadillo (x10)', price: 12000, qty: 10 },
    'deditos-especiales':      { name: 'Deditos Especiales (x10)', price: 12000, qty: 10 },
    'empanadas-pollo':         { name: 'Empanadas de Pollo (x6)', price: 10000, qty: 6 },
    'empanadas-hawaianas':     { name: 'Empanadas Hawaianas (x6)', price: 10000, qty: 6 },
    'empanadas-jamon-queso':   { name: 'Empanadas Jamon Queso (x6)', price: 10000, qty: 6 },
    'empanadas-especiales':    { name: 'Empanadas Especiales (x6)', price: 10000, qty: 6 },
    'panzerottis':             { name: 'Panzerottis (x5)', price: 25000, qty: 5 },
    'pastelitos-pollo':        { name: 'Pastelitos de Pollo (x6)', price: 10000, qty: 6 },
    'pastelitos-jamon-queso':  { name: 'Pastelitos Jamon Queso (x6)', price: 10000, qty: 6 },
    'pastelitos-especiales':   { name: 'Pastelitos Especiales (x6)', price: 10000, qty: 6 },
    'pastelitos-hawaianos':    { name: 'Pastelitos Hawaianos (x6)', price: 10000, qty: 6 }
};

const pasabocasProducts = {
    'pb-deditos-queso':          { name: 'Deditos Mini Queso', pricePerUnit: true },
    'pb-deditos-bocadillo':      { name: 'Deditos Mini Bocadillo', pricePerUnit: true },
    'pb-deditos-especiales':     { name: 'Deditos Mini Especiales', pricePerUnit: true },
    'pb-empanadas-pollo':        { name: 'Empanaditas Mini Pollo', pricePerUnit: true },
    'pb-empanadas-hawaianas':    { name: 'Empanaditas Mini Hawaianas', pricePerUnit: true },
    'pb-empanadas-jamon-queso':  { name: 'Empanaditas Mini Jamon Queso', pricePerUnit: true },
    'pb-empanadas-especiales':   { name: 'Empanaditas Mini Especiales', pricePerUnit: true },
    'pb-ojos':                   { name: 'Ojos de Buey', pricePerUnit: true }
};

// ===== INIT =====
document.addEventListener('DOMContentLoaded', function() {
    // Set min date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('deliveryDate').min = today;

    // Load config from cloud
    loadConfigFromCloud();
});

// ===== QUANTITY CONTROLS =====
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

// ===== DELIVERY =====
function updateDelivery() {
    const method = document.querySelector('input[name="deliveryMethod"]:checked').value;
    const addressGroup = document.getElementById('addressGroup');
    const deliveryLine = document.getElementById('deliveryLine');
    const containerLine = document.getElementById('containerLine');
    const fryingSection = document.getElementById('fryingSection');

    if (method === 'delivery') {
        addressGroup.style.display = 'block';
        document.getElementById('deliveryAddress').required = true;
        deliveryLine.style.display = 'flex';
        containerLine.style.display = 'flex';
        fryingSection.style.display = 'block';
        document.getElementById('deliveryCostLabel').textContent = 'Costo: $' + config.deliveryCost.toLocaleString('es-VE');
    } else {
        addressGroup.style.display = 'none';
        document.getElementById('deliveryAddress').required = false;
        deliveryLine.style.display = 'none';
        containerLine.style.display = 'none';
        fryingSection.style.display = 'none';
        document.getElementById('fryingService').checked = false;
    }
    updateTotal();
}

// ===== TOTAL CALCULATION =====
function updateTotal() {
    let subtotal = 0;
    let totalTrays = 0;
    let totalPasabocas = 0;
    const summaryItems = [];
    const method = document.querySelector('input[name="deliveryMethod"]:checked').value;

    // Tray products
    for (const [id, product] of Object.entries(trayProducts)) {
        const input = document.getElementById('qty-' + id);
        const qty = parseInt(input.value) || 0;
        if (qty > 0) {
            const lineTotal = qty * product.price;
            subtotal += lineTotal;
            totalTrays += qty * product.qty;
            summaryItems.push({
                name: product.name,
                unitPrice: product.price,
                qty: qty,
                total: lineTotal
            });
        }
    }

    // Pasabocas
    for (const [id, product] of Object.entries(pasabocasProducts)) {
        const input = document.getElementById('qty-' + id);
        const qty = parseInt(input.value) || 0;
        if (qty > 0) {
            const unitPrice = getPasabocasPrice(product.name);
            const lineTotal = qty * unitPrice;
            subtotal += lineTotal;
            totalPasabocas += qty;
            summaryItems.push({
                name: product.name,
                unitPrice: unitPrice,
                qty: qty,
                total: lineTotal
            });
        }
    }

    // Frying cost
    let fryingTotal = 0;
    const fryingLine = document.getElementById('fryingLine');
    if (method === 'delivery' && document.getElementById('fryingService').checked && totalPasabocas > 0) {
        if (config.fryingType === 'general') {
            fryingTotal = config.fryingCost;
        } else {
            fryingTotal = totalPasabocas * config.fryingCost;
        }
        fryingLine.style.display = 'flex';
        document.getElementById('fryingCost').textContent = '$' + fryingTotal.toLocaleString('es-VE');
    } else {
        fryingLine.style.display = 'none';
    }

    // Delivery & container
    let deliveryTotal = method === 'delivery' ? config.deliveryCost : 0;
    let containerTotal = method === 'delivery' ? config.containerCost : 0;

    document.getElementById('deliveryCost').textContent = '$' + deliveryTotal.toLocaleString('es-VE');
    document.getElementById('containerCost').textContent = '$' + containerTotal.toLocaleString('es-VE');

    // Grand total
    const grandTotal = subtotal + fryingTotal + deliveryTotal + containerTotal;

    // Update summary as table
    const summaryEl = document.getElementById('orderSummary');
    if (summaryItems.length === 0) {
        summaryEl.innerHTML = '<p class="empty-order">No has seleccionado ningun producto aun.</p>';
    } else {
        summaryEl.innerHTML = `
            <table class="summary-table">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>V. Unitario</th>
                        <th>Cant.</th>
                        <th>V. Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${summaryItems.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td>$${item.unitPrice.toLocaleString('es-VE')}</td>
                            <td>${item.qty}</td>
                            <td>$${item.total.toLocaleString('es-VE')}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    document.getElementById('subtotalProducts').textContent = '$' + subtotal.toLocaleString('es-VE');
    document.getElementById('grandTotal').textContent = '$' + grandTotal.toLocaleString('es-VE');
}

// ===== FORM SUBMIT =====
document.getElementById('orderForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('customerName').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();
    const email = document.getElementById('customerEmail').value.trim();
    const date = document.getElementById('deliveryDate').value;
    const method = document.querySelector('input[name="deliveryMethod"]:checked').value;
    const address = document.getElementById('deliveryAddress').value.trim();
    const notes = document.getElementById('orderNotes').value.trim();

    if (!name || !phone || !date) {
        alert('Por favor completa todos los campos obligatorios.');
        return;
    }

    if (method === 'delivery' && !address) {
        alert('Por favor ingresa la direccion de entrega.');
        return;
    }

    // Collect items
    let subtotal = 0;
    let totalPasabocas = 0;
    const items = [];

    for (const [id, product] of Object.entries(trayProducts)) {
        const input = document.getElementById('qty-' + id);
        const qty = parseInt(input.value) || 0;
        if (qty > 0) {
            const lineTotal = qty * product.price;
            subtotal += lineTotal;
            items.push({ name: product.name, unitPrice: product.price, qty: qty, total: lineTotal });
        }
    }

    for (const [id, product] of Object.entries(pasabocasProducts)) {
        const input = document.getElementById('qty-' + id);
        const qty = parseInt(input.value) || 0;
        if (qty > 0) {
            const unitPrice = getPasabocasPrice(product.name);
            const lineTotal = qty * unitPrice;
            subtotal += lineTotal;
            totalPasabocas += qty;
            items.push({ name: product.name, unitPrice: unitPrice, qty: qty, total: lineTotal });
        }
    }

    if (items.length === 0) {
        alert('Selecciona al menos un producto.');
        return;
    }

    // Frying
    let fryingTotal = 0;
    if (method === 'delivery' && document.getElementById('fryingService').checked && totalPasabocas > 0) {
        if (config.fryingType === 'general') {
            fryingTotal = config.fryingCost;
        } else {
            fryingTotal = totalPasabocas * config.fryingCost;
        }
    }

    let deliveryTotal = method === 'delivery' ? config.deliveryCost : 0;
    let containerTotal = method === 'delivery' ? config.containerCost : 0;
    const grandTotal = subtotal + fryingTotal + deliveryTotal + containerTotal;

    // Format date nicely
    const dateObj = new Date(date + 'T12:00:00');
    const dateFormatted = dateObj.toLocaleDateString('es-VE', { day: '2-digit', month: 'long', year: 'numeric' });

    // Fill invoice div
    document.getElementById('inv-name').textContent = name;
    document.getElementById('inv-phone').textContent = phone;
    document.getElementById('inv-date').textContent = dateFormatted;
    document.getElementById('inv-method').textContent = method === 'delivery' ? 'Domicilio' : 'Recoger en tienda';

    document.getElementById('inv-email-row').style.display = email ? 'flex' : 'none';
    document.getElementById('inv-email').textContent = email;

    document.getElementById('inv-address-row').style.display = method === 'delivery' ? 'flex' : 'none';
    document.getElementById('inv-address').textContent = address;

    // Items table
    const itemsHtml = items.map(item => `
        <tr>
            <td>${item.name}</td>
            <td>$${item.unitPrice.toLocaleString('es-VE')}</td>
            <td>${item.qty}</td>
            <td>$${item.total.toLocaleString('es-VE')}</td>
        </tr>
    `).join('');
    document.getElementById('inv-items').innerHTML = itemsHtml;

    // Totals
    document.getElementById('inv-subtotal').textContent = '$' + subtotal.toLocaleString('es-VE');

    document.getElementById('inv-frying-row').style.display = fryingTotal > 0 ? 'flex' : 'none';
    document.getElementById('inv-frying').textContent = '$' + fryingTotal.toLocaleString('es-VE');

    document.getElementById('inv-delivery-row').style.display = deliveryTotal > 0 ? 'flex' : 'none';
    document.getElementById('inv-delivery').textContent = '$' + deliveryTotal.toLocaleString('es-VE');

    document.getElementById('inv-container-row').style.display = containerTotal > 0 ? 'flex' : 'none';
    document.getElementById('inv-container').textContent = '$' + containerTotal.toLocaleString('es-VE');

    document.getElementById('inv-total').textContent = '$' + grandTotal.toLocaleString('es-VE');

    document.getElementById('inv-notes-row').style.display = notes ? 'block' : 'none';
    document.getElementById('inv-notes').textContent = notes;

    // Save order to cloud
    const orderId = 'PED-' + Date.now();
    const order = {
        id: orderId,
        name: name,
        phone: phone,
        email: email,
        date: date,
        dateFormatted: dateFormatted,
        method: method,
        address: address,
        items: items,
        subtotal: subtotal,
        fryingTotal: fryingTotal,
        deliveryTotal: deliveryTotal,
        containerTotal: containerTotal,
        grandTotal: grandTotal,
        notes: notes,
        status: 'pendiente',
        createdAt: new Date().toISOString()
    };

    // Fetch current orders, add new one, save back
    fetchOrders().then(function(existingOrders) {
        existingOrders.unshift(order);
        saveOrdersToCloud(existingOrders);
    });

    // Play notification sound for admin
    try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACAf39/f3+AgICAgICAgH9/f39/gICAgICAgIB/f39/f4CAgICAgICAf39/f3+AgICAgICA');
        audio.volume = 0.5;
        audio.play().catch(function(){});
    } catch(e) {}

    // Generate invoice image with html2canvas
    const invoiceEl = document.getElementById('invoiceCapture');
    invoiceEl.style.left = '0';
    invoiceEl.style.position = 'absolute';

    html2canvas(invoiceEl.querySelector('.invoice-paper'), {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
    }).then(function(canvas) {
        invoiceEl.style.left = '-9999px';
        invoiceEl.style.position = 'fixed';

        const whatsappNumber = '573117795937';
        const msg = 'Hola! Adjunto mi pedido de Congelados Rochy. Fecha de entrega: ' + dateFormatted;

        canvas.toBlob(function(blob) {
            const file = new File([blob], 'pedido-congelados-rochy.png', { type: 'image/png' });

            // Try Web Share API (works on mobile to share directly to WhatsApp)
            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                navigator.share({
                    title: 'Pedido Congelados Rochy',
                    text: msg,
                    files: [file]
                }).catch(function(err) {
                    downloadAndOpenWhatsApp(canvas, msg, whatsappNumber);
                });
            } else {
                downloadAndOpenWhatsApp(canvas, msg, whatsappNumber);
            }
        }, 'image/png');
    }).catch(function(err) {
        // Fallback: send text if html2canvas fails
        var orderText = '*Pedido - Congelados Rochy*\n\n';
        orderText += '*Datos:*\nNombre: ' + name + '\nTelefono: ' + phone + '\n';
        orderText += 'Fecha: ' + dateFormatted + '\nEntrega: ' + (method === 'delivery' ? 'Domicilio' : 'Recoger en tienda') + '\n';
        if (method === 'delivery') orderText += 'Direccion: ' + address + '\n';
        orderText += '\n*Productos:*\n';
        items.forEach(function(item) {
            orderText += '- ' + item.name + ' x' + item.qty + ' = $' + item.total.toLocaleString('es-VE') + '\n';
        });
        orderText += '\n*TOTAL: $' + grandTotal.toLocaleString('es-VE') + '*\n';
        window.open('https://wa.me/' + whatsappNumber + '?text=' + encodeURIComponent(orderText), '_blank');
        alert('Pedido guardado. Se envio el detalle por texto.');
        Cart.clear();
    });
});

function downloadAndOpenWhatsApp(canvas, msg, whatsappNumber) {
    // Convert canvas to blob and try to share directly
    canvas.toBlob(function(blob) {
        const file = new File([blob], 'pedido-congelados-rochy.png', { type: 'image/png' });

        // Try Web Share API first (works on mobile)
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
            navigator.share({
                title: 'Pedido Congelados Rochy',
                text: msg,
                files: [file]
            }).catch(function() {
                // If share fails, open WhatsApp with text
                window.open('https://wa.me/' + whatsappNumber + '?text=' + encodeURIComponent(msg), '_blank');
                alert('Se abrio WhatsApp. La imagen se guardo en tu dispositivo para que la adjuntes.');
            });
        } else {
            // Desktop: download and open WhatsApp
            const link = document.createElement('a');
            link.download = 'pedido-congelados-rochy.png';
            link.href = canvas.toDataURL('image/png');
            link.click();

            setTimeout(function() {
                window.open('https://wa.me/' + whatsappNumber + '?text=' + encodeURIComponent(msg), '_blank');
                alert('Se descargo la imagen. Adjuntala en el chat de WhatsApp.');
            }, 500);
        }
    }, 'image/png');
}

// ===== MOBILE MENU (same as index) =====
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
if (menuToggle && nav) {
    menuToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
    });
}

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
        var trayProductsList = products.filter(function(p) { return !p.isPasabocas && p.active !== false; });
        var pasabocasProductsList = products.filter(function(p) { return p.isPasabocas && p.active !== false; });
        
        // Render tray products
        var trayHtml = '';
        activeCategories.forEach(function(cat) {
            var catProducts = trayProductsList.filter(function(p) { return p.categoryId === cat.id; });
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
    var input = document.getElementById('qty-' + id);
    if (input) input.value = qty;
    updateCartModal();
    updateTotal();
}

function removeCartItem(id) {
    Cart.removeItem(id);
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
        document.querySelectorAll('.qty-control input').forEach(function(input) {
            input.value = 0;
        });
        updateTotal();
    }
}

Cart.onChange(updateCartBar);

document.addEventListener('DOMContentLoaded', function() {
    updateCartBar();
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
