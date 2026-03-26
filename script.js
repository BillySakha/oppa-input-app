// 1. Inisialisasi Telegram Web App
const tg = window.Telegram.WebApp;
tg.expand(); // Biar tampilan langsung full screen

// 2. Data Produk Tian
const products = [
  { id: 'kasual_tassel', name: 'Sepatu Formal Kasual Kantoran Pria Kulit Sintetis (Tassel Glossy)', cat: 'sepatu', img: 'https://i.postimg.cc/nVDgKBmN/Screenshot-2026-03-26-11-05-36-350-com-ss-android-ugc-trill-edit.jpg' },
  { id: 'kasual_polos', name: 'Sepatu Formal Kasual Kantoran Pria Kulit Sintetis (Polosan)', cat: 'sepatu', img: 'https://i.postimg.cc/tT0t9ZgB/Screenshot-2026-03-26-11-05-53-209-com-ss-android-ugc-trill-edit.jpg' },
  { id: 'Lofers', name: 'Sepatu Formal Lofers Pria Kulit Sintetis', cat: 'sepatu', img: 'https://i.postimg.cc/fy89SJMF/Screenshot-2026-03-26-11-10-15-941-com-ss-android-ugc-trill-edit.jpg' },
  { id: 'docmart_tinggi', name: 'Sepatu Ala Dockmart Hak Tinggi 4cm Kulit Sintetis', cat: 'sepatu', img: 'https://i.postimg.cc/fW8tKSh2/Screenshot-2026-03-26-11-11-15-289-com-ss-android-ugc-trill-edit.jpg' },
  { id: 'kasual_wing_shiny', name: 'Sepatu Formal Kasual Pria Kulit Sintetis (Shiny Wingtip)', cat: 'sepatu', img: 'https://i.postimg.cc/9f1ChT1c/Screenshot-2026-03-26-11-12-18-443-com-ss-android-ugc-trill-edit.jpg' },
  { id: 'penny_loaf', name: 'Sepatu Penny Loafers (Dokmart Pantovel)', cat: 'sepatu', img: 'https://i.postimg.cc/CxgRMGC0/Screenshot-2026-03-26-11-06-32-754-com-ss-android-ugc-trill-edit.jpg' },
  { id: 'docmart_utip', name: 'Sepatu Docmart Pria Kasual Formal Kulit Sintetis (U-Tip)', cat: 'sepatu', img: 'https://i.postimg.cc/d1ksj3mM/Screenshot-2026-03-26-11-11-55-515-com-ss-android-ugc-trill-edit.jpg' },
  { id: 'lofers_tassel', name: 'Sepatu Formal Loafers Pria Kulit Sintetis (Matte Tassel)', cat: 'sepatu', img: 'https://i.postimg.cc/BQs3XMzk/Screenshot-2026-03-26-11-10-49-838-com-ss-android-ugc-trill-edit.jpg' },
  { id: 'doc_polos', name: 'Sepatu Docmart Pria Kasual Formal Kulit Sintetis (Polos)', cat: 'sepatu', img: 'https://i.postimg.cc/4dzMGTXx/Screenshot-2026-03-26-11-11-36-292-com-ss-android-ugc-trill-edit.jpg' },
  { id: 'sdl_jepit_010', name: 'Sandal Pria Kulit Sapi Asli 010 (Jepit)', cat: 'sandal', img: 'https://i.postimg.cc/0ybBQS8R/Screenshot-2026-03-26-11-13-47-843-com-ss-android-ugc-trill-edit.jpg' },
  { id: 'sdl_001_drk', name: 'Sandal Pria Kulit Sapi Asli 001 (Dark)', cat: 'sandal', img: 'https://i.postimg.cc/RFzsXbwx/Screenshot-2026-03-26-11-13-30-749-com-ss-android-ugc-trill-edit.jpg' },
  { id: 'sdl_008_blk', name: 'Sandal Pria Kulit Sapi Asli 008 (Black)', cat: 'sandal', img: 'https://i.postimg.cc/15zWCFVZ/Screenshot-2026-03-26-11-12-54-445-com-ss-android-ugc-trill-edit.jpg' },
  { id: 'sdl_008_tan', name: 'Sandal Pria Kulit Sapi Asli 008 (Tan)', cat: 'sandal', img: 'https://i.postimg.cc/k5Ww6Fzw/Screenshot-2026-03-26-11-12-36-054-com-ss-android-ugc-trill-edit.jpg' },
  { id: 'sdl_gesper_004', name: 'Sandal Pria Kulit Sapi Asli 004 (Gesper)', cat: 'sandal', img: 'https://i.postimg.cc/RhZTYrFX/Screenshot-2026-03-26-11-13-12-855-com-ss-android-ugc-trill-edit.jpg' },
];

let cart = {};

// 3. Fungsi buat nampilin Produk ke layar
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
            <img src="${p.img}" class="product-img" onerror="this.src='https://via.placeholder.com/70?text=Shoe'">
            <div class="product-info">
                <h3>${p.name}</h3>
                <p>${p.id}</p>
            </div>
            <div class="stepper">
                <button class="step-btn" onclick="updateQty('${p.id}', -1)">-</button>
                <span class="qty-val" id="qty-${p.id}">0</span>
                <button class="step-btn" onclick="updateQty('${p.id}', 1)">+</button>
            </div>
        `;

    if (p.cat === 'sepatu') {
      listSepatu.appendChild(card);
    } else {
      listSandal.appendChild(card);
    }
  });
}

// 4. Fungsi Update Jumlah (Qty)
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

// 5. Update Counter Badge & Tombol
function updateCounter() {
  const total = Object.values(cart).reduce((a, b) => a + b, 0);
  document.getElementById('item-counter').innerText = `${total} Item`;
  const btnSubmit = document.getElementById('btn-submit');
  if (btnSubmit) btnSubmit.disabled = total === 0;
}

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

// 7. Kirim Data ke Make.com
window.sendData = async function () {
  const webhookUrl = 'URL_WEBHOOK_MAKE_LU_DI_SINI'; // GANTI PAKE URL WEBHOOK LU
  const items = Object.entries(cart);

  const btnSubmit = document.getElementById('btn-submit');
  btnSubmit.innerText = 'Mengirim...';
  btnSubmit.disabled = true;

  try {
    for (const [id, qty] of items) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: `${id}, ${qty}` }),
      });
    }
    tg.showPopup(
      {
        title: 'Berhasil!',
        message: 'Data jualan masuk ke Sheets Tian.',
        buttons: [{ type: 'ok' }],
      },
      () => {
        tg.close();
      },
    );
  } catch (error) {
    alert('Gagal kirim data!');
    btnSubmit.innerText = 'Kirim ke Laporan';
    btnSubmit.disabled = false;
  }
};

// --- BAGIAN KERAMAT: INI YANG BIKIN JALAN! ---
renderProducts(); // Panggil fungsi buat nampilin gambar
tg.ready(); // Kasih tau Telegram aplikasinya siap
