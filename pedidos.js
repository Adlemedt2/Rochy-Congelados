// ===== CONFIGURABLE PRICES =====
let config = {
    deliveryCost: 3000,      // Costo domicilio
    containerCost: 2000,     // Costo recipiente
    fryingCostPerUnit: 500   // Costo fritada por unidad de pasabocas
};

// Load saved config
const savedConfig = localStorage.getItem('rochyConfig');
if (savedConfig) {
    config = JSON.parse(savedConfig);
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
    'pb-empanadas-especiales':   { name: 'Empanaditas Mini Especiales', pricePerUnit: true }
};

// ===== INIT =====
document.addEventListener('DOMContentLoaded', function() {
    // Set min date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('deliveryDate').min = today;

    // Only show config panel if URL has ?admin
    const isAdmin = window.location.search.includes('admin');
    const configBar = document.querySelector('.config-bar');
    if (configBar) {
        configBar.style.display = isAdmin ? 'block' : 'none';
    }

    // Pasabocas price input: readonly for client, editable for admin
    const pbPriceInput = document.getElementById('pasabocasPrice');
    if (pbPriceInput) {
        pbPriceInput.readOnly = !isAdmin;
        if (!isAdmin) {
            pbPriceInput.style.background = '#f0f0f0';
            pbPriceInput.style.cursor = 'not-allowed';
        }
    }

    // Load config into inputs
    document.getElementById('cfgDelivery').value = config.deliveryCost;
    document.getElementById('cfgContainer').value = config.containerCost;
    document.getElementById('cfgFrying').value = config.fryingCostPerUnit;

    updatePasabocasPrices();
    updateDelivery();
});

// ===== CONFIG =====
function toggleConfig() {
    const panel = document.getElementById('configPanel');
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
}

function saveConfig() {
    config.deliveryCost = parseInt(document.getElementById('cfgDelivery').value) || 0;
    config.containerCost = parseInt(document.getElementById('cfgContainer').value) || 0;
    config.fryingCostPerUnit = parseInt(document.getElementById('cfgFrying').value) || 0;
    localStorage.setItem('rochyConfig', JSON.stringify(config));
    updateDelivery();
    updatePasabocasPrices();
    updateTotal();
}

function updatePasabocasPrices() {
    const pricePerUnit = parseInt(document.getElementById('pasabocasPrice').value) || 0;
    document.querySelectorAll('.order-product-price-unit').forEach(el => {
        el.textContent = '$' + pricePerUnit.toLocaleString('es-VE') + ' c/u';
    });
}

// ===== QUANTITY CONTROLS =====
function changeQty(productId, delta) {
    const input = document.getElementById('qty-' + productId);
    let val = parseInt(input.value) || 0;
    val = Math.max(0, val + delta);
    input.value = val;
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
    const pricePerUnit = parseInt(document.getElementById('pasabocasPrice').value) || 0;

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
            const lineTotal = qty * pricePerUnit;
            subtotal += lineTotal;
            totalPasabocas += qty;
            summaryItems.push({
                name: product.name,
                unitPrice: pricePerUnit,
                qty: qty,
                total: lineTotal
            });
        }
    }

    // Frying cost
    let fryingTotal = 0;
    const fryingLine = document.getElementById('fryingLine');
    if (method === 'delivery' && document.getElementById('fryingService').checked && totalPasabocas > 0) {
        fryingTotal = totalPasabocas * config.fryingCostPerUnit;
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
    const pricePerUnit = parseInt(document.getElementById('pasabocasPrice').value) || 0;

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
            const lineTotal = qty * pricePerUnit;
            subtotal += lineTotal;
            totalPasabocas += qty;
            items.push({ name: product.name, unitPrice: pricePerUnit, qty: qty, total: lineTotal });
        }
    }

    if (items.length === 0) {
        alert('Selecciona al menos un producto.');
        return;
    }

    // Frying
    let fryingTotal = 0;
    if (method === 'delivery' && document.getElementById('fryingService').checked && totalPasabocas > 0) {
        fryingTotal = totalPasabocas * config.fryingCostPerUnit;
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

    // Generate image with html2canvas
    const invoiceEl = document.getElementById('invoiceCapture');
    invoiceEl.style.left = '0';
    invoiceEl.style.position = 'absolute';

    html2canvas(invoiceEl.querySelector('.invoice-paper'), {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
    }).then(canvas => {
        invoiceEl.style.left = '-9999px';
        invoiceEl.style.position = 'fixed';

        canvas.toBlob(function(blob) {
            const file = new File([blob], 'pedido-congelados-rochy.png', { type: 'image/png' });
            const whatsappNumber = '573117795937';
            const msg = 'Hola! Adjunto mi pedido de Congelados Rochy. Fecha de entrega: ' + dateFormatted;

            // Try Web Share API (works on mobile to share directly to WhatsApp)
            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                navigator.share({
                    title: 'Pedido Congelados Rochy',
                    text: msg,
                    files: [file]
                }).catch(function(err) {
                    // User cancelled or error - fallback to download
                    downloadAndOpenWhatsApp(canvas, msg, whatsappNumber);
                });
            } else {
                // Desktop fallback - download image and open WhatsApp
                downloadAndOpenWhatsApp(canvas, msg, whatsappNumber);
            }
        }, 'image/png');
    });
});

function downloadAndOpenWhatsApp(canvas, msg, whatsappNumber) {
    // Download the image
    const link = document.createElement('a');
    link.download = 'pedido-congelados-rochy.png';
    link.href = canvas.toDataURL('image/png');
    link.click();

    // Open WhatsApp
    setTimeout(function() {
        window.open('https://wa.me/' + whatsappNumber + '?text=' + encodeURIComponent(msg), '_blank');
        alert('Se descargo la imagen de tu pedido. Adjuntala en el chat de WhatsApp.');
    }, 500);
}

// ===== MOBILE MENU (same as index) =====
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
if (menuToggle && nav) {
    menuToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
    });
}
