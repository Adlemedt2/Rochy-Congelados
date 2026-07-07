// ===== CLOUD CONFIG =====
const JSONBIN_API_KEY = '$2a$10$Lze98Tu5N9fGvctlOMLSAOm.VvyI9llQdZeO3Bnv1kLJmdigqDHHu';
const JSONBIN_BIN_ID = '6a4c1292da38895dfe376c91';
const JSONBIN_URL = 'https://api.jsonbin.io/v3/b/' + JSONBIN_BIN_ID;

// ===== GENERIC FETCH/SAVE =====
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
        await fetch(JSONBIN_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': JSONBIN_API_KEY
            },
            body: JSON.stringify(data)
        });
        return true;
    } catch(e) {
        console.error('Error saving data:', e);
        return false;
    }
}

// ===== ORDERS =====
async function fetchOrders() {
    const data = await fetchAll();
    return data.orders || [];
}

async function saveOrdersToCloud(orders) {
    const data = await fetchAll();
    data.orders = orders;
    return await saveAll(data);
}

// ===== CAROUSEL =====
async function fetchCarousel() {
    const data = await fetchAll();
    return data.carousel || [];
}

async function saveCarousel(carousel) {
    const data = await fetchAll();
    data.carousel = carousel;
    return await saveAll(data);
}

// ===== PROMOTIONS =====
async function fetchPromotions() {
    const data = await fetchAll();
    return data.promotions || [];
}

async function savePromotions(promotions) {
    const data = await fetchAll();
    data.promotions = promotions;
    return await saveAll(data);
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
