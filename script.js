/* ==========================================================================
   1. DATA PRODUK (STRUKTUR DINAMIS)
   ========================================================================== */
let products = [
  {
    id: 'kasual_tassel',
    name: 'Sepatu Kasual Tassel',
    image: 'img/kasual_tassel.jpg', // Ganti dengan link foto asli
    sizePrices: {
      38: 148500,
      39: 148500,
      40: 148500,
      41: 148500,
      42: 148500,
      43: 174900,
      44: 174900,
      45: 174900,
    },
    colors: ['Black Doff', 'Black Glossy'],
    stitchings: ['Kuning', 'Hitam'],
    // Default Pilihan
    selectedSize: '41',
    selectedColor: 'Black Doff',
    selectedStitching: 'Kuning',
    quantity: 0,
  },
  // Tambahkan produk lain dengan format yang sama di sini
];

let isReturMode = false;
let searchQuery = '';

/* ==========================================================================
   2. FUNGSI RENDER (TAMPILAN)
   ========================================================================== */
function renderProducts() {
  const container = document.getElementById('product-list');
  if (!container) return;

  container.innerHTML = '';

  const filtered = products.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  filtered.forEach((p) => {
    const currentPrice = p.sizePrices[p.selectedSize];

    // Generate Buttons
    const sizesHtml = Object.keys(p.sizePrices)
      .map(
        (size) => `
  <button class="size-btn ${String(p.selectedSize) === String(size) ? 'active' : ''}" 
          onclick="selectVariant('${p.id}', 'size', '${size}')">${size}</button>
`,
      )
      .join('');

    const colorsHtml = p.colors
      .map(
        (color) => `
      <button class="size-btn ${p.selectedColor === color ? 'active' : ''}" 
              onclick="selectVariant('${p.id}', 'color', '${color}')">${color}</button>
    `,
      )
      .join('');

    const stitchingHtml = p.stitchings
      .map(
        (stitch) => `
      <button class="size-btn ${p.selectedStitching === stitch ? 'active' : ''}" 
              onclick="selectVariant('${p.id}', 'stitching', '${stitch}')">${stitch}</button>
    `,
      )
      .join('');

    container.innerHTML += `
  <div class="product-card">
    <div class="product-header">
      <img src="${p.image}" class="product-img" alt="${p.name}">
      <div class="product-info">
        <h3>${p.name.replace(/_/g, ' ')}</h3>
        <p class="price-display">Rp ${currentPrice.toLocaleString('id-ID')}</p>
      </div>
    </div>

    <div class="product-variants">
      <label class="variant-label">Pilih Ukuran</label>
      <div class="size-container">${sizesHtml}</div>

      <label class="variant-label">Pilih Warna</label>
      <div class="size-container">${colorsHtml}</div>

      <label class="variant-label">Jahitan Outsole</label>
      <div class="size-container">${stitchingHtml}</div>
    </div>

    <div class="qty-section">
      <span>Jumlah Item</span>
      <div class="qty-control">
        <button onclick="updateQty('${p.id}', -1)">-</button>
        <span class="qty-number">${p.quantity}</span>
        <button onclick="updateQty('${p.id}', 1)">+</button>
      </div>
    </div>
  </div>
`;
  });

  updateBadge();
}

/* ==========================================================================
   3. LOGIKA INTERAKSI (VARIANT & QTY)
   ========================================================================== */
window.selectVariant = (productId, type, value) => {
  const product = products.find((p) => p.id === productId);
  if (product) {
    if (type === 'size') product.selectedSize = value;
    if (type === 'color') product.selectedColor = value;
    if (type === 'stitching') product.selectedStitching = value;
    renderProducts();
  }
};

window.updateQty = (productId, change) => {
  const product = products.find((p) => p.id === productId);
  if (product) {
    product.quantity = Math.max(0, product.quantity + change);
    renderProducts();
  }
};

window.handleSearch = () => {
  searchQuery = document.getElementById('search-input').value;
  renderProducts();
};

window.toggleMode = () => {
  isReturMode = !isReturMode;
  const btn = document.getElementById('modeBtn');
  if (btn) {
    btn.innerText = isReturMode ? 'MODE: RETUR' : 'MODE: JUALAN';
    btn.className = isReturMode ? 'btn-mode mode-retur' : 'btn-mode mode-jualan';
  }
  renderProducts(); // Refresh warna card kalau mode ganti
};

function updateBadge() {
  const total = products.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.getElementById('item-counter');
  if (badge) badge.innerText = `${total} Item`;
}

/* ==========================================================================
   4. PENGIRIMAN DATA (FIXED MAPPING)
   ========================================================================== */
window.kirimLaporan = () => {
  const tg = window.Telegram.WebApp;
  const userChatId = tg.initDataUnsafe.user ? tg.initDataUnsafe.user.id : '7610888727';

  // Pastiin cuma ngirim barang yang jumlahnya > 0
  const itemsToSubmit = products
    .filter((p) => p.quantity > 0)
    .map((p) => {
      // 1. Ambil harga sesuai ukuran yang dipilih (38-45)
      const fixedPrice = p.sizePrices[p.selectedSize];

      // 2. Hitung Omzet (Harga x Jumlah)
      const hitungOmzet = p.quantity * fixedPrice;

      return {
        nama_produk: p.id.trim().toLowerCase(), // ID buat nyari di Master
        nama_asli: p.name,
        ukuran: p.selectedSize,
        warna: p.selectedColor,
        jahitan: p.selectedStitching,

        // Jumlah: Jadi negatif kalau MODE RETUR
        jumlah: isReturMode ? p.quantity * -1 : p.quantity,

        harga_satuan: fixedPrice,

        // INI VARIABEL OMZET KOTOR (Untuk Kolom G)
        // Kalau RETUR, angkanya otomatis jadi MINUS
        omzet_kotor: isReturMode ? hitungOmzet * -1 : hitungOmzet,

        status: isReturMode ? 'RETUR' : 'Sukses',
      };
    });

  if (itemsToSubmit.length === 0) {
    alert('Pilih produk dulu, Bill!');
    return;
  }

  const webhookUrl = 'https://hook.us2.make.com/o5mo7wka21nuwnz6y1dsgi5cpp6s91w6';
  const btnSubmit = document.getElementById('btn-submit');

  btnSubmit.innerText = 'Mengirim...';
  btnSubmit.disabled = true;

  fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user: 'Tian',
      chatId: userChatId,
      items: itemsToSubmit,
    }),
  })
    .then((res) => {
      if (res.ok) {
        alert('Laporan Berhasil Terkirim!');
        // Reset qty jadi 0 lagi
        products.forEach((p) => (p.quantity = 0));
        renderProducts();
      } else {
        alert('Gagal kirim ke server! Cek koneksi.');
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

window.onload = () => {
  renderProducts();
};
