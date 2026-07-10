// Product Data
const products = {
    'deditos-queso': {
        name: 'Deditos de Queso',
        icon: 'fas fa-cheese',
        description: 'Nuestros deditos de queso son elaborados con masa crujiente por fuera y queso fundido por dentro. Perfectos para picar entre comidas o como aperitivo en reuniones familiares.',
        features: [
            'Masa crujiente y dorada',
            'Relleno generoso de queso derretido',
            'Sin conservantes artificiales',
            'Congelados rapidamente para conservar frescura',
            'Ideales para toda la familia'
        ],
        prices: [
            { presentation: 'Bandeja x 10 unidades', price: '$12.000' }
        ],
        preparation: 'Hornear a 180°C por 15-20 minutos hasta que esten dorados. También se pueden freir en aceite caliente por 3-4 minutos.'
    },
    'deditos-bocadillo': {
        name: 'Deditos de Bocadillo',
        icon: 'fas fa-bread-slice',
        description: 'Deliciosos deditos rellenos de bocadillo, una combinacion perfecta de masa crocante y relleno sabroso. Ideales para los mas chicos de la casa y para toda la familia.',
        features: [
            'Relleno cremoso de bocadillo',
            'Masa ligera y crujiente',
            'Porcion perfecta para picar',
            'Congelados para mantener su frescura',
            'Faciles de preparar'
        ],
        prices: [
            { presentation: 'Bandeja x 10 unidades', price: '$12.000' }
        ],
        preparation: 'Hornear a 180°C por 15-20 minutos. Pueden freirse en aceite caliente por 3-4 minutos hasta lograr un dorado uniforme.'
    },
    'deditos-especiales': {
        name: 'Deditos Especiales (Queso - Bocadillo)',
        icon: 'fas fa-layer-group',
        description: 'Surteido especial de deditos con queso y bocadillo. La combinacion perfecta para quienes quieren disfrutar de ambas variedades en una sola bandeja.',
        features: [
            'Mezcla de queso y bocadillo',
            'Variedad en cada bandeja',
            'Masa crocante y dorada',
            'Ideal para reuniones y fiestas',
            'Congelados para conservar calidad'
        ],
        prices: [
            { presentation: 'Bandeja x 10 unidades (surteido)', price: '$12.000' }
        ],
        preparation: 'Hornear a 180°C por 15-20 minutos o freir en aceite caliente por 3-4 minutos hasta dorar.'
    },
    'empanadas-pollo': {
        name: 'Empanadas de Pollo',
        icon: 'fas fa-drumstick-bite',
        description: 'Empanadas rellenas de pollo sazonado con nuestra receta secreta. El pollo se desmecha finamente y se mezcla con especias seleccionadas para lograr un sabor unico.',
        features: [
            'Pollo desmechado y sazonado',
            'Masa fina y crocante',
            'Receta tradicional de la casa',
            'Generoso relleno en cada empanada',
            'Ideal para el almuerzo o merienda'
        ],
        prices: [
            { presentation: 'Bandeja x 6 unidades', price: '$10.000' }
        ],
        preparation: 'Hornear a 200°C por 20-25 minutos hasta que la masa este dorada y crocante.'
    },
    'empanadas-hawaianas': {
        name: 'Empanadas Hawaianas',
        icon: 'fas fa-umbrella-beach',
        description: 'La combinacion tropical perfecta: jamon y piña envueltas en una masa deliciosa. Un toque fresco y diferente que conquista a todos.',
        features: [
            'Combinacion de jamon y piña',
            'Masa crocante y sabrosa',
            'Toque tropical y fresco',
            'Perfectas para paladares aventureros',
            'Congeladas para mantener frescura'
        ],
        prices: [
            { presentation: 'Bandeja x 6 unidades', price: '$10.000' }
        ],
        preparation: 'Hornear a 200°C por 20-25 minutos. Se recomienda colocar sobre bandeja con papel manteca.'
    },
    'empanadas-jamon-queso': {
        name: 'Empanadas de Jamon y Queso',
        icon: 'fas fa-cheese',
        description: 'La combinacion clasica que nunca falla: jamon de buena calidad y queso derretido envueltos en masa crocante. Un clasico que siempre conquista.',
        features: [
            'Combinacion clasica de jamon y queso',
            'Queso que se derrite perfectamente',
            'Masa crocante y dorada',
            'Porcion ideal para cada ocasion',
            'Congelados para mantener calidad'
        ],
        prices: [
            { presentation: 'Bandeja x 6 unidades', price: '$10.000' }
        ],
        preparation: 'Hornear a 200°C por 20-25 minutos. El queso debe quedar completamente derretido.'
    },
    'empanadas-especiales': {
        name: 'Empanadas Especiales',
        icon: 'fas fa-star',
        description: 'Nuestra empanada especial de la casa, elaborada con ingredientes premium y una combinacion de sabores que no encontraras en otro lugar.',
        features: [
            'Receta exclusiva de la casa',
            'Ingredientes premium seleccionados',
            'Relleno generoso y aromatico',
            'Masa artesanal y crocante',
            'El favorito de nuestros clientes'
        ],
        prices: [
            { presentation: 'Bandeja x 6 unidades', price: '$10.000' }
        ],
        preparation: 'Hornear a 200°C por 20-25 minutos. Para mayor crocancia, rociar con un poco de aceite antes de hornear.'
    },
    'pastelitos-pollo': {
        name: 'Pastelitos de Pollo',
        icon: 'fas fa-drumstick-bite',
        description: 'Pastelitos rellenos de pollo desmechado con nuestra sazon especial. La masa es ligera y crujiente, perfecta para acompañar el delicioso relleno.',
        features: [
            'Pollo desmechado y sazonado',
            'Masa ligera y crocante',
            'Tamaño perfecto para picar',
            'Ideal para meriendas y fiestas',
            'Congelados para mayor frescura'
        ],
        prices: [
            { presentation: 'Bandeja x 6 unidades', price: '$10.000' }
        ],
        preparation: 'Hornear a 190°C por 18-22 minutos hasta que esten dorados. También se pueden freir.'
    },
    'pastelitos-jamon-queso': {
        name: 'Pastelitos de Jamon y Queso',
        icon: 'fas fa-cheese',
        description: 'La combinacion clasica que nunca falla: jamon de buena calidad y queso derretido envueltos en masa crujiente.',
        features: [
            'Combinacion clasica de jamon y queso',
            'Queso que se derrite perfectamente',
            'Masa crocante y dorada',
            'Porcion ideal para cada ocasion',
            'Congelados para mantener calidad'
        ],
        prices: [
            { presentation: 'Bandeja x 6 unidades', price: '$10.000' }
        ],
        preparation: 'Hornear a 190°C por 18-22 minutos. El queso debe quedar completamente derretido.'
    },
    'pastelitos-especiales': {
        name: 'Pastelitos Especiales',
        icon: 'fas fa-star',
        description: 'Nuestra seleccion premium de pastelitos con ingredientes de primera calidad y una combinacion de sabores que los hace unicos.',
        features: [
            'Ingredientes premium seleccionados',
            'Receta exclusiva de la casa',
            'Relleno generoso y aromatico',
            'Masa artesanal de calidad superior',
            'Para ocasiones especiales'
        ],
        prices: [
            { presentation: 'Bandeja x 6 unidades', price: '$10.000' }
        ],
        preparation: 'Hornear a 190°C por 18-22 minutos. Se recomienda hornear de a pocos para mejor resultado.'
    },
    'pastelitos-hawaianos': {
        name: 'Pastelitos Hawaianos',
        icon: 'fas fa-umbrella-beach',
        description: 'Tropical mezcla de jamon, queso y piña en una masa crujiente. El toque dulce de la piña equilibra perfectamente el sabor salado.',
        features: [
            'Combinacion tropical unica',
            'Piña fresca y jamon de calidad',
            'Queso que se funde con la piña',
            'Masa crocante y dorada',
            'Sabor fresco y diferente'
        ],
        prices: [
            { presentation: 'Bandeja x 6 unidades', price: '$10.000' }
        ],
        preparation: 'Hornear a 190°C por 18-22 minutos. La piña debe quedar tierna pero con textura.'
    },
    'panzerottis': {
        name: 'Panzerottis',
        icon: 'fas fa-pizza-slice',
        description: 'Los panzerottis al estilo italiano, con masa gruesa y esponjosa rellena de ingredientes frescos. Una delicia que te transportara a Italia con cada bocado.',
        features: [
            'Masa al estilo italiano, esponjosa',
            'Relleno de mozzarella y tomate',
            'Elaboracion artesanal',
            'Tamaño ideal para una porcion',
            'Congelados para mantener textura'
        ],
        prices: [
            { presentation: 'Bandeja x 5 unidades', price: '$25.000' }
        ],
        preparation: 'Hornear a 190°C por 22-28 minutos hasta que la masa este dorada y esponjosa.'
    }
};

// Modal Functions
function openModal(productId) {
    const product = products[productId];
    const modal = document.getElementById('productModal');

    // Update modal content
    document.getElementById('modal-icon').innerHTML = `<i class="${product.icon}"></i>`;
    document.getElementById('modal-title').textContent = product.name;
    document.getElementById('modal-description').textContent = product.description;

    // Features
    const featuresList = document.getElementById('modal-features');
    featuresList.innerHTML = product.features.map(f => `<li>${f}</li>`).join('');

    // Prices
    const pricesContainer = document.getElementById('modal-prices');
    pricesContainer.innerHTML = `
        <table class="price-table">
            <thead>
                <tr>
                    <th>Presentacion</th>
                    <th>Precio</th>
                </tr>
            </thead>
            <tbody>
                ${product.prices.map(p => `
                    <tr>
                        <td>${p.presentation}</td>
                        <td>${p.price}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    // Preparation
    document.getElementById('modal-preparation-text').textContent = product.preparation;

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('productModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Close modal on outside click
document.getElementById('productModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

menuToggle.addEventListener('click', function() {
    nav.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', function() {
        nav.classList.remove('active');
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== SCROLL ANIMATIONS =====

// Header shrink on scroll
const header = document.querySelector('.header');
const hero = document.querySelector('.hero');
let lastScroll = 0;

window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;

    // Header effect
    if (currentScroll > 50) {
        header.classList.add('header-scrolled');
    } else {
        header.classList.remove('header-scrolled');
    }

    // Parallax effect on hero
    if (hero && currentScroll < window.innerHeight) {
        hero.style.backgroundPositionY = (currentScroll * 0.5) + 'px';
    }

    lastScroll = currentScroll;
});

// Intersection Observer for section animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe all animatable elements
document.addEventListener('DOMContentLoaded', function() {
    const animatables = document.querySelectorAll(
        '.category, .pasabocas-card, .pasabocas-banner, .about-content, .contact-card, .product-card'
    );
    animatables.forEach(function(el) {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });

    // Active nav link highlight
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav a[href^="#"]');

    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(function(section) {
            const sectionTop = section.offsetTop - 150;
            if (window.pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(function(link) {
            link.classList.remove('nav-active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('nav-active');
            }
        });
    });
});

// ===== DYNAMIC CONTENT: CAROUSEL =====
async function loadCarousel() {
    const track = document.getElementById('marqueeTrack');
    if (!track) return;

    const items = await fetchCarousel();
    const activeItems = items.filter(function(item) { return item.active; }).sort(function(a, b) { return a.order - b.order; });

    if (activeItems.length === 0) {
        track.innerHTML = '<div class="marquee-item"><span>Congelados Rochy - Los mejores productos congelados</span></div>';
        return;
    }

    // Duplicate items for infinite scroll effect
    var html = '';
    var allItems = activeItems.concat(activeItems);
    allItems.forEach(function(item) {
        html += '<div class="marquee-item">';
        if (item.imageUrl) {
            html += '<img src="' + item.imageUrl + '" alt="' + (item.title || '') + '">';
        }
        if (item.title) {
            html += '<span>' + item.title + '</span>';
        }
        html += '</div>';
    });
    track.innerHTML = html;
}

// ===== DYNAMIC CONTENT: PROMOTIONS =====
async function loadPromotions() {
    var grid = document.getElementById('promotionsGrid');
    if (!grid) return;

    var promos = await fetchPromotions();
    var activePromos = promos.filter(function(p) { return p.active; });

    if (activePromos.length === 0) {
        document.getElementById('promociones').style.display = 'none';
        return;
    }

    var html = '';
    activePromos.forEach(function(promo) {
        html += '<div class="promotion-card">';
        if (promo.imageUrl) {
            html += '<div class="promo-image"><img src="' + promo.imageUrl + '" alt="' + promo.title + '">';
            if (promo.discount) {
                html += '<span class="promo-badge">' + promo.discount + '</span>';
            }
            html += '</div>';
        }
        html += '<div class="promo-content">';
        html += '<h3>' + promo.title + '</h3>';
        if (promo.description) {
            html += '<p>' + promo.description + '</p>';
        }
        if (promo.validUntil) {
            var date = new Date(promo.validUntil + 'T12:00:00');
            var dateStr = date.toLocaleDateString('es-VE', { day: '2-digit', month: 'long', year: 'numeric' });
            html += '<span class="promo-validity">Valido hasta: ' + dateStr + '</span>';
        }
        var promoMsg = encodeURIComponent('Hola! Quiero aprovechar la promocion: ' + promo.title + (promo.discount ? ' (' + promo.discount + ')' : ''));
        html += '<a href="https://wa.me/573117795937?text=' + promoMsg + '" target="_blank" class="btn-primary promo-order-btn"><i class="fab fa-whatsapp"></i> Pedir Ahora</a>';
        html += '</div></div>';
    });
    grid.innerHTML = html;
}

// ===== DYNAMIC CONTENT: PASABOCAS PRICES =====
async function loadPasabocasPrices() {
    var config = await fetchConfig();
    var priceType = config.pasabocasPriceType || 'same';
    var prices = {
        deditos: config.pasabocasSame || 800,
        empanadas: config.pasabocasSame || 800,
        ojos: config.pasabocasSame || 800
    };

    if (priceType === 'different') {
        prices.deditos = config.pasabocasDeditos || 800;
        prices.empanadas = config.pasabocasEmpanadas || 900;
        prices.ojos = config.pasabocasOjos || 1000;
    }

    document.querySelectorAll('.pasabocas-price').forEach(function(el) {
        var type = el.getAttribute('data-price-type');
        if (prices[type]) {
            el.textContent = '$' + prices[type].toLocaleString('es-VE') + ' c/u';
        }
    });
}

// Load dynamic content on page load
document.addEventListener('DOMContentLoaded', function() {
    loadCarousel();
    loadPromotions();
    loadPasabocasPrices();
    loadDynamicProducts();
});

// ===== DYNAMIC PRODUCTS FROM CLOUD =====
var cloudProducts = {};

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
                html += '<div class="product-card" onclick="openCloudModal(\'' + prod.id + '\')">';
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
                
                // Store product data for modal
                cloudProducts[prod.id] = {
                    name: prod.name,
                    icon: prod.icon || 'fas fa-box',
                    description: prod.description || '',
                    features: prod.features || [],
                    prices: prod.price > 0 ? [{ presentation: 'Bandeja x ' + prod.qtyPerTray + ' unidades', price: '$' + prod.price.toLocaleString('es-VE') }] : [],
                    preparation: prod.preparation || ''
                };
            });
            
            html += '</div></div>';
        });
        
        container.innerHTML = html;
    } catch(e) {
        container.innerHTML = '<p style="text-align:center; color:#888;">Error al cargar productos.</p>';
    }
}

function openCloudModal(productId) {
    var product = cloudProducts[productId];
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
