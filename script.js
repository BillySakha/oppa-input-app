// 1. Inisialisasi Telegram Web App
const tg = window.Telegram.WebApp;
tg.expand();

// Ambil ID User buat alamat kirim di Make.com
const userId = tg.initDataUnsafe?.user?.id || '';

// 2. Data Produk Tian (Versi Folder Lokal img/)
// Proxy dihapus karena gambar sudah satu rumah di GitHub
const products = [
  { id: 'kasual_tassel', name: 'Sepatu Formal Kasual (Tassel Glossy)', cat: 'sepatu', img: 'img/kasual_tassel.jpg' },
  { id: 'kasual_polos', name: 'Sepatu Formal Kasual (Polosan)', cat: 'sepatu', img: 'img/kasual_polos.jpg' },
  { id: 'Lofers', name: 'Sepatu Formal Lofers Pria', cat: 'sepatu', img: 'img/loafers_polos.jpg' },
  { id: 'docmart_tinggi', name: 'Sepatu Docmart Hak Tinggi 4cm', cat: 'sepatu', img: 'img/docmart_tinggi.jpg' },
  { id: 'kasual_wing_shiny', name: 'Sepatu Formal Shiny Wingtip', cat: 'sepatu', img: 'img/kasual_wingtip.jpg' },
  { id: 'penny_loaf', name: 'Sepatu Penny Loafers Dokmart', cat: 'sepatu', img: 'img/penny_loafers.jpg' },
  { id: 'docmart_utip', name: 'Sepatu Docmart U-Tip Kasual', cat: 'sepatu', img: 'img/docmart_utip.jpg' },
  { id: 'lofers_tassel', name: 'Sepatu Loafers Matte Tassel', cat: 'sepatu', img: 'img/loafers_tassel.jpg' },
  { id: 'doc_polos', name: 'Sepatu Docmart Polos Kasual', cat: 'sepatu', img: 'img/docmart_polos.jpg' },
  { id: 'sdl_jepit_010', name: 'Sandal Jepit Kulit Sapi 010', cat: 'sandal', img: 'img/sandal_jepit_010.jpg' },
  { id: 'sdl_001_drk', name: 'Sandal Kulit Sapi 001 Dark', cat: 'sandal', img: 'img/sandal_001_dark.jpg' },
  { id: 'sdl_008_blk', name: 'Sandal Kulit Sapi 008 Black', cat: 'sandal', img: 'img/sandal_008_black.jpg' },
  { id: 'sdl_008_tan', name: 'Sandal Kulit Sapi 008 Tan', cat: 'sandal', img: 'img/sandal_008_tan.jpg' },
  { id: 'sdl_gesper_004', name: 'Sandal Gesper Kulit Sapi 004', cat: 'sandal', img: 'img/sandal_gesper_004.jpg' },
];

let cart = {};

// 3. Render Produk ke Layar
function renderProducts() {
  const listSepatu = document.getElementById('list-sepatu');
  const listSandal = document.getElementById('list-sandal');
  listSepatu.innerHTML = '';
  listSandal.innerHTML = '';

  products.forEach((p) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-name', p.name.toLowerCase());
    card.innerHTML = `
      <img src="${p.img}" class="product-img" onerror="this.src='https://via.placeholder.com/105?text=TianShoes'">
      <div class="product-info">
        <h3>${p.name}</h3>
        <p>${p.id}</p>
        <div class="stepper">
          <button class="step-btn" onclick="updateQty('${p.id}', -1)">-</button>
          <span class="qty-val" id="qty-${p.id}">0</span>
          <button class="step-btn" onclick="updateQty('${p.id}', 1)">+</button>
        </div>
      </div>
    `;
    if (p.cat === 'sepatu') {
      listSepatu.appendChild(card);
    } else {
      listSandal.appendChild(card);
    }
  });
}

// 4. Update Qty & Counter
window.updateQty = function (id, delta) {
  if (!cart[id]) cart[id] = 0;
  cart[id] += delta;
  if (cart[id] <= 0) {
    cart[id] = 0;
    delete cart[id];
  }
  document.getElementById(`qty-${id}`).innerText = cart[id] || 0;
  updateCounter();
};

function updateCounter() {
  const total = Object.values(cart).reduce((a, b) => a + b, 0);
  document.getElementById('item-counter').innerText = `${total} Item`;
  const btnSubmit = document.getElementById('btn-submit');
  if (btnSubmit) btnSubmit.disabled = total === 0;
}

// 5. Kirim Data Sekaligus
window.sendData = async function () {
  const webhookUrl = 'https://hook.us2.make.com/o5mo7wka21nuwnz6y1dsgi5cpp6s91w6';

  const summary = Object.entries(cart)
    .map(([id, qty]) => `${id}, ${qty}`)
    .join('\n');

  const btnSubmit = document.getElementById('btn-submit');
  btnSubmit.innerText = 'Mengirim...';
  btnSubmit.disabled = true;

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: userId,
        text: summary,
      }),
    });

    tg.showPopup(
      {
        title: 'Berhasil!',
        message: 'Laporan jualan masuk ke Sheets Tian.',
        buttons: [{ type: 'ok' }],
      },
      () => {
        tg.close();
      },
    );
  } catch (error) {
    alert('Gagal kirim! Cek koneksi.');
    btnSubmit.innerText = 'Kirim ke Laporan';
    btnSubmit.disabled = false;
  }
};

// 6. Fitur Search
const searchInput = document.getElementById('search-input');
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    const val = e.target.value.toLowerCase();
    const cards = document.querySelectorAll('.product-card');
    cards.forEach((card) => {
      const name = card.getAttribute('data-name');
      card.style.display = name.includes(val) ? 'flex' : 'none';
    });
  });
}

renderProducts();
tg.ready();
