const Cart = (() => {
  const STORAGE_KEY = 'rochy_cart';
  const listeners = [];

  function load() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { items: [], updatedAt: null };
    try {
      return JSON.parse(raw);
    } catch {
      return { items: [], updatedAt: null };
    }
  }

  function save(cart) {
    cart.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    notifyListeners(cart.items);
  }

  function notifyListeners(items) {
    listeners.forEach(cb => cb(items));
  }

  return {
    getItems() {
      return load().items;
    },

    addItem(product) {
      const cart = load();
      const idx = cart.items.findIndex(i => i.id === product.id);
      if (idx >= 0) {
        cart.items[idx].qty += 1;
      } else {
        cart.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          isPasabocas: !!product.isPasabocas,
          qty: product.qty || 1
        });
      }
      save(cart);
    },

    removeItem(id) {
      const cart = load();
      cart.items = cart.items.filter(i => i.id !== id);
      save(cart);
    },

    updateQty(id, qty) {
      const cart = load();
      if (qty <= 0) {
        cart.items = cart.items.filter(i => i.id !== id);
      } else {
        const item = cart.items.find(i => i.id === id);
        if (item) item.qty = qty;
      }
      save(cart);
    },

    clear() {
      save({ items: [], updatedAt: null });
    },

    getTotal() {
      return load().items.reduce((sum, i) => sum + i.price * i.qty, 0);
    },

    getCount() {
      return load().items.reduce((sum, i) => sum + i.qty, 0);
    },

    onChange(callback) {
      listeners.push(callback);
    }
  };
})();
