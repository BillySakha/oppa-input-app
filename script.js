// 1. DAFTAR PRODUK (Sesuaikan dengan data sepatu Tian)
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

// 2. FUNGSI RENDER (Tampilan Produk)
function renderProducts() {
  const container = document.getElementById('product-list');
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
}

// 3. UPDATE JUMLAH
function updateQty(id, change) {
  const product = products.find((p) => p.id === id);
  if (product) {
    product.quantity = Math.max(0, product.quantity + change);
    renderProducts();
  }
}

// 4. SWITCH MODE (JUALAN / RETUR)
function toggleMode() {
  isReturMode = !isReturMode;
  const btn = document.getElementById('modeBtn');
  if (isReturMode) {
    btn.innerText = 'MODE: RETUR';
    btn.classList.add('btn-retur'); // Pastikan ada CSS .btn-retur warna merah
  } else {
    btn.innerText = 'MODE: JUALAN';
    btn.classList.remove('btn-retur');
  }
}

// 5. KIRIM LAPORAN (LOGIKA FIX 3 BARANG MASUK 1)
function kirimLaporan() {
  // Filter hanya barang yang ada jumlahnya
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

  // Ganti URL ini dengan Webhook Make.com lu yang aktif
  const webhookUrl = 'URL_WEBHOOK_LU_DI_SINI';

  fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user: 'Tian',
      items: pesanan, // Data dikirim sebagai DAFTAR (Array)
    }),
  })
    .then((response) => {
      if (response.ok) {
        alert('Laporan Berhasil Terkirim!');
        // Reset keranjang setelah sukses
        products.forEach((p) => (p.quantity = 0));
        renderProducts();
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('Gagal kirim, cek koneksi internet!');
    });
}

// Inisialisasi awal
renderProducts();
