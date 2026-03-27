/* --- 1. DATA PRODUK (SESUAIKAN NAMA FILE GAMBAR DI FOLDER 'img') --- */
let products = [
  { id: 1, name: 'kasual_tassel', price: 350000, image: 'img/kasual_tassel.jpg', quantity: 0 },
  { id: 2, name: 'kasual_polos', price: 320000, image: 'img/kasual_polos.jpg', quantity: 0 },
  { id: 3, name: 'Lofers', price: 380000, image: 'img/lofers.jpg', quantity: 0 },
  { id: 4, name: 'docmart_tinggi', price: 450000, image: 'img/docmart_tinggi.jpg', quantity: 0 },
  { id: 5, name: 'kasual_wing_shiny', price: 370000, image: 'img/kasual_wingtip.jpg', quantity: 0 },
  { id: 6, name: 'penny_loaf', price: 360000, image: 'img/penny_loafers.jpg', quantity: 0 },
  { id: 7, name: 'docmart_utip', price: 430000, image: 'img/docmart_utip.jpg', quantity: 0 },
  { id: 8, name: 'lofers_tassel', price: 390000, image: 'img/loafers_tassel.jpg', quantity: 0 },
  { id: 9, name: 'docmart_polos', price: 410000, image: 'img/docmart_polos.jpg', quantity: 0 },
];

let isReturMode = false;
let searchQuery = '';

/* --- 2. FUNGSI RENDER (MENAMPILKAN BARANG) --- */
function renderProducts() {
  const container = document.getElementById('product-list');
  if (!container) return;

  // Bersihkan layar sebelum gambar ulang
  container.innerHTML = '';

  // Filter berdasarkan apa yang diketik Tian di Search Bar
  const filtered = products.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  filtered.forEach((p) => {
    // Note: class 'product-img' di bawah ini yang bikin gambar gak meledak (nyambung ke CSS)
    container.innerHTML += `
  <div class="product-card">
    <div class="product-left">
      <img src="${p.image}" class="product-img" alt="${p.name}">
      <div class="product-info">
        <h3>${p.name.replace(/_/g, ' ')}</h3>
        <p>Rp ${p.price.toLocaleString()}</p>
      </div>
    </div>
    <div class="qty-control">
      <button onclick="updateQty(${p.id}, -1)">-</button>
      <span>${p.quantity}</span>
      <button onclick="updateQty(${p.id}, 1)">+</button>
    </div>
  </div>
`;
  });

  // Update angka badge di header
  updateBadge();
}

/* --- 3. FUNGSI UPDATE QUANTITY (+ / -) --- */
window.updateQty = (id, change) => {
  const product = products.find((p) => p.id === id);
  if (product) {
    product.quantity = Math.max(0, product.quantity + change);
    renderProducts();
  }
};

/* --- 4. FUNGSI SEARCH (NYARING BARANG) --- */
window.handleSearch = () => {
  searchQuery = document.getElementById('search-input').value;
  renderProducts();
};

/* --- 5. FUNGSI TOGGLE MODE (JUAL / RETUR) --- */
window.toggleMode = () => {
  isReturMode = !isReturMode;
  const btn = document.getElementById('modeBtn');

  if (isReturMode) {
    btn.innerText = 'MODE: RETUR';
    btn.classList.replace('mode-jualan', 'mode-retur');
  } else {
    btn.innerText = 'MODE: JUALAN';
    btn.classList.replace('mode-retur', 'mode-jualan');
  }
};

/* --- 6. UPDATE BADGE (JUMLAH ITEM) --- */
function updateBadge() {
  const total = products.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.getElementById('item-counter');
  if (badge) badge.innerText = `${total} Item`;
}

/* --- 7. KIRIM LAPORAN KE MAKE.COM (ARRAY FORMAT) --- */
window.kirimLaporan = () => {
  // 1. AMBIL CHAT ID DARI SISTEM TELEGRAM
  // Kita ambil otomatis dari WebApp, kalau gak ada kita kasih default ID lu
  const tg = window.Telegram.WebApp;
  const userChatId = tg.initDataUnsafe.user ? tg.initDataUnsafe.user.id : '7610888727';

  // Ambil cuma barang yang jumlahnya lebih dari 0
  const itemsToSubmit = products
    .filter((p) => p.quantity > 0)
    .map((p) => ({
      nama_produk: p.name,
      jumlah: isReturMode ? p.quantity * -1 : p.quantity,
      harga: p.price,
      total: isReturMode ? p.quantity * p.price * -1 : p.quantity * p.price,
      status: isReturMode ? 'RETUR' : 'Sukses',
    }));

  if (itemsToSubmit.length === 0) {
    alert('Pilih produk dulu, Bill!');
    return;
  }

  // URL Webhook Make.com Lu
  const webhookUrl = 'https://hook.us2.make.com/o5mo7wka21nuwnz6y1dsgi5cpp6s91w6';

  // Tampilkan loading simpel di tombol
  const btnSubmit = document.getElementById('btn-submit');
  btnSubmit.innerText = 'Mengirim...';
  btnSubmit.disabled = true;

  fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user: 'Tian',
      chatId: userChatId,
      items: itemsToSubmit, // INI YANG BAKAL DIBACA ITERATOR
    }),
  })
    .then((res) => {
      if (res.ok) {
        alert('Laporan Berhasil Terkirim!');
        // Reset semua jumlah jadi 0 setelah sukses
        products.forEach((p) => (p.quantity = 0));
        renderProducts();
      } else {
        alert('Gagal kirim ke server!');
      }
    })
    .catch((err) => {
      console.error(err);
      alert('Koneksi Error!');
    })
    .finally(() => {
      btnSubmit.innerText = 'Kirim Laporan';
      btnSubmit.disabled = false;
    });
};

/* --- INISIALISASI PERTAMA KALI --- */
window.onload = () => {
  renderProducts();
};
