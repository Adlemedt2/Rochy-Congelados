// ===== CLOUD CONFIG =====
const JSONBIN_API_KEY = '$2a$10$Lze98Tu5N9fGvctlOMLSAOm.VvyI9llQdZeO3Bnv1kLJmdigqDHHu';
const JSONBIN_BIN_ID = '6a4c1292da38895dfe376c91';
const JSONBIN_URL = 'https://api.jsonbin.io/v3/b/' + JSONBIN_BIN_ID;

// ===== LOCAL STORAGE HELPERS =====
function getLocalData(key, defaultValue) {
    try {
        var data = localStorage.getItem('rochy_' + key);
        return data ? JSON.parse(data) : defaultValue;
    } catch(e) {
        return defaultValue;
    }
}

function setLocalData(key, value) {
    try {
        localStorage.setItem('rochy_' + key, JSON.stringify(value));
        return true;
    } catch(e) {
        console.error('Error saving to localStorage:', e);
        return false;
    }
}

// ===== GENERIC FETCH/SAVE (JSONBin) =====
async function fetchAll() {
    try {
        const res = await fetch(JSONBIN_URL + '/latest', {
            headers: { 'X-Master-Key': JSONBIN_API_KEY }
        });
        const data = await res.json();
        return data.record || {};
    } catch(e) {
        console.error('Error fetching data:', e);
        return {};
    }
}

async function saveAll(data) {
    try {
        const res = await fetch(JSONBIN_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': JSONBIN_API_KEY
            },
            body: JSON.stringify(data)
        });
        const result = await res.json();
        if (res.ok) {
            return true;
        } else {
            console.error('Save failed:', result);
            return false;
        }
    } catch(e) {
        console.error('Error saving data:', e);
        return false;
    }
}

// ===== ORDERS (JSONBin - synced) =====
async function fetchOrders() {
    const data = await fetchAll();
    return data.orders || [];
}

async function saveOrdersToCloud(orders) {
    const data = await fetchAll();
    data.orders = orders;
    return await saveAll(data);
}

// ===== CAROUSEL (JSONBin - synced) =====
async function fetchCarousel() {
    const data = await fetchAll();
    return data.carousel || [];
}

async function saveCarousel(carousel) {
    const data = await fetchAll();
    data.carousel = carousel;
    return await saveAll(data);
}

// ===== PROMOTIONS (JSONBin - synced) =====
async function fetchPromotions() {
    const data = await fetchAll();
    return data.promotions || [];
}

async function savePromotions(promotions) {
    const data = await fetchAll();
    data.promotions = promotions;
    return await saveAll(data);
}

// ===== CONFIG (JSONBin - synced) =====
async function fetchConfig() {
    const data = await fetchAll();
    return data.config || {};
}

async function saveConfigToCloud(config) {
    const data = await fetchAll();
    data.config = config;
    return await saveAll(data);
}

// ===== CATEGORIES (localStorage - local) =====
async function fetchCategories() {
    return getLocalData('categories', []);
}

async function saveCategories(categories) {
    return setLocalData('categories', categories);
}

// ===== PRODUCTS (localStorage - local) =====
async function fetchProducts() {
    return getLocalData('products', []);
}

async function saveProducts(products) {
    return setLocalData('products', products);
}

// ===== MIGRATION: Move data from JSONBin to localStorage =====
async function migrateToLocal() {
    console.log('Starting migration from JSONBin to localStorage...');
    
    var data = await fetchAll();
    
    // Move categories to localStorage
    if (data.categories && data.categories.length > 0) {
        setLocalData('categories', data.categories);
        console.log('Migrated ' + data.categories.length + ' categories to localStorage');
    }
    
    // Move products to localStorage
    if (data.products && data.products.length > 0) {
        setLocalData('products', data.products);
        console.log('Migrated ' + data.products.length + ' products to localStorage');
    }
    
    // Remove categories and products from JSONBin to reduce size
    delete data.categories;
    delete data.products;
    
    var result = await saveAll(data);
    console.log('JSONBin cleanup result:', result);
    
    alert('Migracion completada! Los productos y categorias ahora se guardan localmente.');
    return true;
}

// ===== IMGBB UPLOAD =====
const IMGBB_API_KEY = 'YOUR_IMGBB_API_KEY'; // Replace with real key

async function uploadImageToImgBB(file) {
    const formData = new FormData();
    formData.append('image', file);

    try {
        const res = await fetch('https://api.imgbb.com/1/upload?key=' + IMGBB_API_KEY, {
            method: 'POST',
            body: formData
        });
        const data = await res.json();
        if (data.success) {
            return data.data.url;
        }
        return null;
    } catch(e) {
        console.error('Error uploading image:', e);
        return null;
    }
}

async function uploadBase64ToImgBB(base64Data) {
    try {
        const res = await fetch('https://api.imgbb.com/1/upload?key=' + IMGBB_API_KEY, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'image=' + encodeURIComponent(base64Data)
        });
        const data = await res.json();
        if (data.success) {
            return data.data.url;
        }
        return null;
    } catch(e) {
        console.error('Error uploading image:', e);
        return null;
    }
}
