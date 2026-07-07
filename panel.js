// ===== JSONBIN CONFIG =====
const JSONBIN_API_KEY = '$2a$10$Lze98Tu5N9fGvctl0MLSA0m.VvyI9llQdZe03Bnv1kLJmdigqDHHu';
const JSONBIN_BIN_ID = '6a4c1292da38895dfe376c91';
const JSONBIN_URL = 'https://api.jsonbin.io/v3/b/' + JSONBIN_BIN_ID;

// ===== CLOUD FUNCTIONS =====
async function fetchOrders() {
    try {
        const res = await fetch(JSONBIN_URL + '/latest', {
            headers: { 'X-Master-Key': JSONBIN_API_KEY }
        });
        const data = await res.json();
        return data.record.orders || [];
    } catch(e) {
        console.error('Error fetching orders:', e);
        return [];
    }
}

async function saveOrdersToCloud(orders) {
    try {
        await fetch(JSONBIN_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': JSONBIN_API_KEY
            },
            body: JSON.stringify({ orders: orders })
        });
    } catch(e) {
        console.error('Error saving orders:', e);
    }
}

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
