let products = [
  { id: 1, name: 'kasual_tassel', price: 350000, image: 'img/kasual_tassel.jpg', quantity: 0 },
  { id: 2, name: 'kasual_polos', price: 320000, image: 'img/kasual_polos.jpg', quantity: 0 },
  { id: 3, name: 'Lofers', price: 380000, image: 'img/lofers.jpg', quantity: 0 },
  { id: 4, name: 'docmart_tinggi', price: 450000, image: 'img/docmart_tinggi.jpg', quantity: 0 },
  { id: 5, name: 'kasual_wing_shiny', price: 370000, image: 'img/kasual_wing_shiny.jpg', quantity: 0 },
  { id: 6, name: 'penny_loaf', price: 360000, image: 'img/penny_loaf.jpg', quantity: 0 },
  { id: 7, name: 'docmart_utip', price: 430000, image: 'img/docmart_utip.jpg', quantity: 0 },
  { id: 8, name: 'lofers_tassel', price: 390000, image: 'img/loafers_tassel.jpg', quantity: 0 },
  { id: 9, name: 'docmart_polos', price: 410000, image: 'img/docmart_polos.jpg', quantity: 0 },
];

let isReturMode = false;

function renderProducts() {
  const container = document.getElementById('product-list');
  if (!container) return; // Mencegah error kalau ID tidak ketemu

  container.innerHTML = '';
  products.forEach((p) => {
    container.innerHTML += `
      <div class="product-card">
        <img src="${p.image}" alt="${p.name}">
        <h3>${p.name.replace(/_/g, ' ')}</h3>
        <p>Rp ${p.price.toLocaleString()}</p>
        <div class="qty-control">
          <button onclick="updateQty(${p.id}, -1)">-</button>
          <span>${p.quantity}</span>
          <button onclick="updateQty(${p.id}, 1)">+</button>
        </div>
      </div>
    `;
  });

  // Update Badge Jumlah Item di Header
  const totalItems = products.reduce((acc, curr) => acc + curr.quantity, 0);
  document.getElementById('item-counter').innerText = `${totalItems} Item`;
}

function updateQty(id, change) {
  const product = products.find((p) => p.id === id);
  if (product) {
    product.quantity = Math.max(0, product.quantity + change);
    renderProducts();
  }
}

function toggleMode() {
  isReturMode = !isReturMode;
  const btn = document.getElementById('modeBtn');
  if (isReturMode) {
    btn.innerText = 'MODE: RETUR';
    btn.style.backgroundColor = '#ff4444'; // Merah pas retur
  } else {
    btn.innerText = 'MODE: JUALAN';
    btn.style.backgroundColor = '#2ecc71'; // Hijau pas jualan
  }
}

function kirimLaporan() {
  const pesanan = products
    .filter((p) => p.quantity > 0)
    .map((p) => {
      return {
        nama_produk: p.name,
        jumlah: isReturMode ? p.quantity * -1 : p.quantity,
        harga: p.price,
        total: isReturMode ? p.quantity * p.price * -1 : p.quantity * p.price,
        status: isReturMode ? 'RETUR' : 'Sukses',
      };
    });

  if (pesanan.length === 0) {
    alert('Pilih barang dulu, Bill!');
    return;
  }

  // ISI URL WEBHOOK MAKE LU DI SINI
  const webhookUrl = 'https://hook.us2.make.com/o5mo7wka21nuwnz6y1dsgi5cpp6s91w6';

  fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user: 'Tian',
      items: pesanan,
    }),
  })
    .then((response) => {
      if (response.ok) {
        alert('Laporan Berhasil Terkirim!');
        products.forEach((p) => (p.quantity = 0));
        renderProducts();
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('Gagal kirim, cek koneksi!');
    });
}

// Inisialisasi awal
renderProducts();
