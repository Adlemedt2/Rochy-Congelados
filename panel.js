// ===== STATS =====
async function updateStats() {
    const orders = await fetchOrders();
    const pendientes = orders.filter(o => o.status === 'pendiente').length;
    const completados = orders.filter(o => o.status === 'completado').length;
    const cancelados = orders.filter(o => o.status === 'cancelado').length;
    const ventas = orders
        .filter(o => o.status === 'completado')
        .reduce((sum, o) => sum + o.grandTotal, 0);

    document.getElementById('statPendientes').textContent = pendientes;
    document.getElementById('statCompletados').textContent = completados;
    document.getElementById('statCancelados').textContent = cancelados;
    document.getElementById('statVentas').textContent = '$' + ventas.toLocaleString('es-VE');

    // Notification for new pendientes
    const lastCount = parseInt(localStorage.getItem('rochyLastPendientes') || '0');
    if (pendientes > lastCount && lastCount > 0) {
        showNotification('Tienes ' + (pendientes - lastCount) + ' nuevo(s) pedido(s) pendiente(s)!');
    }
    localStorage.setItem('rochyLastPendientes', String(pendientes));
}

// ===== RENDER ORDERS =====
async function renderOrders() {
    const orders = await fetchOrders();
    const filter = document.getElementById('filterStatus').value;
    const search = document.getElementById('searchInput').value.toLowerCase();

    let filtered = orders;

    if (filter !== 'todos') {
        filtered = filtered.filter(o => o.status === filter);
    }

    if (search) {
        filtered = filtered.filter(o =>
            o.name.toLowerCase().includes(search) ||
            o.phone.includes(search) ||
            o.id.toLowerCase().includes(search)
        );
    }

    const container = document.getElementById('ordersList');

    if (filtered.length === 0) {
        container.innerHTML = '<p class="empty-orders">No hay pedidos con este filtro.</p>';
        updateStats();
        return;
    }

    container.innerHTML = filtered.map(order => {
        const statusClass = 'status-' + order.status;
        const statusLabel = order.status.charAt(0).toUpperCase() + order.status.slice(1);
        const itemsSummary = order.items.map(i => i.name + ' x' + i.qty).join(', ');
        const date = new Date(order.createdAt).toLocaleDateString('es-VE') + ' ' + new Date(order.createdAt).toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' });

        return `
            <div class="order-card ${statusClass}">
                <div class="order-card-header">
                    <div class="order-id">${order.id}</div>
                    <span class="order-status ${statusClass}">${statusLabel}</span>
                </div>
                <div class="order-card-body">
                    <div class="order-info">
                        <p><strong><i class="fas fa-user"></i> ${order.name}</strong></p>
                        <p><i class="fas fa-phone"></i> ${order.phone}</p>
                        <p><i class="fas fa-calendar"></i> Entrega: ${order.dateFormatted}</p>
                        <p><i class="fas fa-truck"></i> ${order.method === 'delivery' ? 'Domicilio' : 'Recoger en tienda'}</p>
                        <p class="order-items-text"><i class="fas fa-box"></i> ${itemsSummary}</p>
                    </div>
                    <div class="order-total">
                        $${order.grandTotal.toLocaleString('es-VE')}
                    </div>
                </div>
                <div class="order-card-footer">
                    <span class="order-date"><i class="fas fa-clock"></i> ${date}</span>
                    <div class="order-actions">
                        <button class="btn-sm btn-view" onclick="viewOrder('${order.id}')">
                            <i class="fas fa-eye"></i> Ver
                        </button>
                        ${order.status === 'pendiente' ? `
                            <button class="btn-sm btn-complete" onclick="changeStatus('${order.id}', 'completado')">
                                <i class="fas fa-check"></i> Completar
                            </button>
                            <button class="btn-sm btn-cancel" onclick="changeStatus('${order.id}', 'cancelado')">
                                <i class="fas fa-times"></i> Cancelar
                            </button>
                        ` : ''}
                        ${order.status === 'cancelado' ? `
                            <button class="btn-sm btn-complete" onclick="changeStatus('${order.id}', 'completado')">
                                <i class="fas fa-check"></i> Reactivar
                            </button>
                        ` : ''}
                        <button class="btn-sm btn-delete" onclick="deleteOrder('${order.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    updateStats();
}

// ===== ACTIONS =====
async function changeStatus(orderId, newStatus) {
    const orders = await fetchOrders();
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx !== -1) {
        orders[idx].status = newStatus;
        await saveOrdersToCloud(orders);
        renderOrders();
    }
}

async function deleteOrder(orderId) {
    if (!confirm('Eliminar este pedido permanentemente?')) return;
    let orders = await fetchOrders();
    orders = orders.filter(o => o.id !== orderId);
    await saveOrdersToCloud(orders);
    renderOrders();
}

async function clearAllOrders() {
    if (!confirm('Eliminar TODOS los pedidos? Esta accion no se puede deshacer.')) return;
    await saveOrdersToCloud([]);
    renderOrders();
}

function viewOrder(orderId) {
    fetchOrders().then(function(orders) {
        const order = orders.find(o => o.id === orderId);
        if (!order) return;

        document.getElementById('modalOrderId').textContent = 'Pedido ' + order.id;

        let html = `
            <div class="detail-section">
                <h3><i class="fas fa-user"></i> Datos del Cliente</h3>
                <p><strong>Nombre:</strong> ${order.name}</p>
                <p><strong>Telefono:</strong> ${order.phone}</p>
                ${order.email ? `<p><strong>Email:</strong> ${order.email}</p>` : ''}
                <p><strong>Fecha entrega:</strong> ${order.dateFormatted}</p>
                <p><strong>Entrega:</strong> ${order.method === 'delivery' ? 'Domicilio' : 'Recoger en tienda'}</p>
                ${order.method === 'delivery' ? `<p><strong>Direccion:</strong> ${order.address}</p>` : ''}
            </div>
            <div class="detail-section">
                <h3><i class="fas fa-box"></i> Productos</h3>
                <table class="detail-table">
                    <thead>
                        <tr><th>Producto</th><th>V.Unit</th><th>Cant</th><th>V.Total</th></tr>
                    </thead>
                    <tbody>
                        ${order.items.map(i => `
                            <tr>
                                <td>${i.name}</td>
                                <td>$${i.unitPrice.toLocaleString('es-VE')}</td>
                                <td>${i.qty}</td>
                                <td>$${i.total.toLocaleString('es-VE')}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            <div class="detail-section">
                <h3><i class="fas fa-calculator"></i> Totales</h3>
                <p><strong>Subtotal:</strong> $${order.subtotal.toLocaleString('es-VE')}</p>
                ${order.fryingTotal > 0 ? `<p><strong>Fritada:</strong> $${order.fryingTotal.toLocaleString('es-VE')}</p>` : ''}
                ${order.deliveryTotal > 0 ? `<p><strong>Domicilio:</strong> $${order.deliveryTotal.toLocaleString('es-VE')}</p>` : ''}
                ${order.containerTotal > 0 ? `<p><strong>Recipiente:</strong> $${order.containerTotal.toLocaleString('es-VE')}</p>` : ''}
                <p class="detail-grand-total"><strong>TOTAL:</strong> $${order.grandTotal.toLocaleString('es-VE')}</p>
            </div>
            ${order.notes ? `
                <div class="detail-section">
                    <h3><i class="fas fa-comment"></i> Notas</h3>
                    <p>${order.notes}</p>
                </div>
            ` : ''}
            <div class="detail-actions">
                <a href="https://wa.me/573117795937?text=${encodeURIComponent('Pedido ' + order.id + ' - ' + order.name)}" target="_blank" class="btn-primary btn-whatsapp">
                    <i class="fab fa-whatsapp"></i> Contactar por WhatsApp
                </a>
            </div>
        `;

        document.getElementById('modalOrderBody').innerHTML = html;
        document.getElementById('orderModal').classList.add('active');
        document.body.style.overflow = 'hidden';
    });
}

function closeOrderModal() {
    document.getElementById('orderModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

// ===== NOTIFICATIONS =====
function showNotification(text) {
    const banner = document.getElementById('notifBanner');
    document.getElementById('notifText').textContent = text;
    banner.style.display = 'flex';

    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Congelados Rochy - Nuevo Pedido', { body: text });
    } else if ('Notification' in window && Notification.permission !== 'denied') {
        Notification.requestPermission();
    }

    try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACAf39/f3+AgICAgICAgH9/f39/gICAgICAgIB/f39/f4CAgICAgICAf39/f3+AgICAgICA');
        audio.volume = 0.5;
        audio.play().catch(function(){});
    } catch(e) {}
}

function dismissNotif() {
    document.getElementById('notifBanner').style.display = 'none';
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', function() {
    renderOrders();

    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }

    // Auto-refresh every 10 seconds
    setInterval(renderOrders, 10000);
});

// Close modal on outside click
document.getElementById('orderModal').addEventListener('click', function(e) {
    if (e.target === this) closeOrderModal();
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeOrderModal();
});

// ===== CONTENT MANAGEMENT: TABS =====
function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(function(el) { el.style.display = 'none'; });
    document.querySelectorAll('.tab-btn').forEach(function(el) { el.classList.remove('active'); });
    document.getElementById('tab-' + tabName).style.display = 'block';
    event.target.classList.add('active');

    if (tabName === 'carousel') renderCarouselList();
    if (tabName === 'promotions') renderPromotionsList();
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function previewImage(input, previewId) {
    var preview = document.getElementById(previewId);
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// ===== CAROUSEL MANAGEMENT =====
async function renderCarouselList() {
    var items = await fetchCarousel();
    var container = document.getElementById('carouselList');

    if (items.length === 0) {
        container.innerHTML = '<p class="empty-orders">No hay imagenes en la marquesina.</p>';
        return;
    }

    items.sort(function(a, b) { return a.order - b.order; });

    container.innerHTML = items.map(function(item) {
        return '<div class="content-card">' +
            '<img src="' + (item.imageUrl || '') + '" alt="' + (item.title || '') + '">' +
            '<div class="content-card-info">' +
                '<h4>' + (item.title || 'Sin titulo') + '</h4>' +
                '<p>' + (item.link || 'Sin link') + ' | Orden: ' + item.order + '</p>' +
                '<span class="' + (item.active ? 'status-active' : 'status-inactive') + '">' + (item.active ? 'Activa' : 'Inactiva') + '</span>' +
            '</div>' +
            '<div class="content-card-actions">' +
                '<button class="btn-sm btn-view" onclick="toggleCarouselItem(\'' + item.id + '\', ' + !item.active + ')"><i class="fas fa-eye"></i></button>' +
                '<button class="btn-sm btn-complete" onclick="editCarouselItem(\'' + item.id + '\')"><i class="fas fa-edit"></i></button>' +
                '<button class="btn-sm btn-delete" onclick="deleteCarouselItem(\'' + item.id + '\')"><i class="fas fa-trash"></i></button>' +
            '</div>' +
        '</div>';
    }).join('');
}

function showAddCarouselModal() {
    document.getElementById('carouselTitle').value = '';
    document.getElementById('carouselImageUrl').value = '';
    document.getElementById('carouselLink').value = '';
    document.getElementById('carouselOrder').value = '1';
    document.getElementById('carouselEditId').value = '';
    document.getElementById('carouselPreview').style.display = 'none';
    document.getElementById('carouselModal').classList.add('active');
}

async function editCarouselItem(id) {
    var items = await fetchCarousel();
    var item = items.find(function(i) { return i.id === id; });
    if (!item) return;

    document.getElementById('carouselTitle').value = item.title || '';
    document.getElementById('carouselImageUrl').value = item.imageUrl || '';
    document.getElementById('carouselLink').value = item.link || '';
    document.getElementById('carouselOrder').value = item.order || 1;
    document.getElementById('carouselEditId').value = item.id;
    document.getElementById('carouselPreview').src = item.imageUrl || '';
    document.getElementById('carouselPreview').style.display = item.imageUrl ? 'block' : 'none';
    document.getElementById('carouselModal').classList.add('active');
}

async function saveCarouselItem(e) {
    e.preventDefault();
    var items = await fetchCarousel();
    var editId = document.getElementById('carouselEditId').value;
    var imageUrl = document.getElementById('carouselImageUrl').value;

    // If file selected, use preview as base64
    var fileInput = document.getElementById('carouselImageFile');
    if (fileInput.files && fileInput.files[0]) {
        var preview = document.getElementById('carouselPreview');
        imageUrl = preview.src;
    }

    var newItem = {
        id: editId || 'c-' + Date.now(),
        title: document.getElementById('carouselTitle').value,
        imageUrl: imageUrl,
        link: document.getElementById('carouselLink').value,
        order: parseInt(document.getElementById('carouselOrder').value) || 1,
        active: true
    };

    if (editId) {
        var idx = items.findIndex(function(i) { return i.id === editId; });
        if (idx !== -1) items[idx] = newItem;
    } else {
        items.push(newItem);
    }

    await saveCarousel(items);
    closeModal('carouselModal');
    renderCarouselList();
}

async function toggleCarouselItem(id, newActive) {
    var items = await fetchCarousel();
    var idx = items.findIndex(function(i) { return i.id === id; });
    if (idx !== -1) {
        items[idx].active = newActive;
        await saveCarousel(items);
        renderCarouselList();
    }
}

async function deleteCarouselItem(id) {
    if (!confirm('Eliminar esta imagen de la marquesina?')) return;
    var items = await fetchCarousel();
    items = items.filter(function(i) { return i.id !== id; });
    await saveCarousel(items);
    renderCarouselList();
}

// ===== PROMOTIONS MANAGEMENT =====
async function renderPromotionsList() {
    var items = await fetchPromotions();
    var container = document.getElementById('promotionsList');

    if (items.length === 0) {
        container.innerHTML = '<p class="empty-orders">No hay promociones activas.</p>';
        return;
    }

    container.innerHTML = items.map(function(item) {
        var validity = item.validUntil ? new Date(item.validUntil).toLocaleDateString('es-VE') : 'Sin fecha';
        return '<div class="content-card">' +
            (item.imageUrl ? '<img src="' + item.imageUrl + '" alt="' + item.title + '">' : '') +
            '<div class="content-card-info">' +
                '<h4>' + item.title + '</h4>' +
                '<p>' + (item.discount || '') + ' | Valido hasta: ' + validity + '</p>' +
                '<span class="' + (item.active ? 'status-active' : 'status-inactive') + '">' + (item.active ? 'Activa' : 'Inactiva') + '</span>' +
            '</div>' +
            '<div class="content-card-actions">' +
                '<button class="btn-sm btn-view" onclick="togglePromoItem(\'' + item.id + '\', ' + !item.active + ')"><i class="fas fa-eye"></i></button>' +
                '<button class="btn-sm btn-complete" onclick="editPromoItem(\'' + item.id + '\')"><i class="fas fa-edit"></i></button>' +
                '<button class="btn-sm btn-delete" onclick="deletePromoItem(\'' + item.id + '\')"><i class="fas fa-trash"></i></button>' +
            '</div>' +
        '</div>';
    }).join('');
}

function showAddPromoModal() {
    document.getElementById('promoTitle').value = '';
    document.getElementById('promoDescription').value = '';
    document.getElementById('promoDiscount').value = '';
    document.getElementById('promoImageUrl').value = '';
    document.getElementById('promoValidUntil').value = '';
    document.getElementById('promoEditId').value = '';
    document.getElementById('promoPreview').style.display = 'none';
    document.getElementById('promoModal').classList.add('active');
}

async function editPromoItem(id) {
    var items = await fetchPromotions();
    var item = items.find(function(i) { return i.id === id; });
    if (!item) return;

    document.getElementById('promoTitle').value = item.title || '';
    document.getElementById('promoDescription').value = item.description || '';
    document.getElementById('promoDiscount').value = item.discount || '';
    document.getElementById('promoImageUrl').value = item.imageUrl || '';
    document.getElementById('promoValidUntil').value = item.validUntil || '';
    document.getElementById('promoEditId').value = item.id;
    document.getElementById('promoPreview').src = item.imageUrl || '';
    document.getElementById('promoPreview').style.display = item.imageUrl ? 'block' : 'none';
    document.getElementById('promoModal').classList.add('active');
}

async function savePromotionItem(e) {
    e.preventDefault();
    var items = await fetchPromotions();
    var editId = document.getElementById('promoEditId').value;
    var imageUrl = document.getElementById('promoImageUrl').value;

    var fileInput = document.getElementById('promoImageFile');
    if (fileInput.files && fileInput.files[0]) {
        var preview = document.getElementById('promoPreview');
        imageUrl = preview.src;
    }

    var newItem = {
        id: editId || 'p-' + Date.now(),
        title: document.getElementById('promoTitle').value,
        description: document.getElementById('promoDescription').value,
        discount: document.getElementById('promoDiscount').value,
        imageUrl: imageUrl,
        validUntil: document.getElementById('promoValidUntil').value,
        active: true
    };

    if (editId) {
        var idx = items.findIndex(function(i) { return i.id === editId; });
        if (idx !== -1) items[idx] = newItem;
    } else {
        items.push(newItem);
    }

    await savePromotions(items);
    closeModal('promoModal');
    renderPromotionsList();
}

async function togglePromoItem(id, newActive) {
    var items = await fetchPromotions();
    var idx = items.findIndex(function(i) { return i.id === id; });
    if (idx !== -1) {
        items[idx].active = newActive;
        await savePromotions(items);
        renderPromotionsList();
    }
}

async function deletePromoItem(id) {
    if (!confirm('Eliminar esta promocion?')) return;
    var items = await fetchPromotions();
    items = items.filter(function(i) { return i.id !== id; });
    await savePromotions(items);
    renderPromotionsList();
}

// Load content on panel load
document.addEventListener('DOMContentLoaded', function() {
    renderCarouselList();
    renderPromotionsList();
});
