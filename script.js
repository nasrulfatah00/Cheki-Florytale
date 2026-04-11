// =================================================================================
// KONFIGURASI KEAMANAN & SAKLAR
// =================================================================================
// 1. Ganti tulisan di dalam tanda kutip ini dengan PIN/Password yang kamu mau!
const PASSWORD_KASIR = "chekift123"; 

// 2. Ubah menjadi 'true' jika Cassie hadir di event.
const isCassieActive = false; 
if (isCassieActive) { document.body.classList.add('cassie-active'); }
// =================================================================================

// GANTI DENGAN URL WEB APP APPS SCRIPT KAMU
const scriptURL = 'https://script.google.com/macros/s/AKfycbyq0a5uoGHu6OAldX7tZpMZ1ghxlLA9jQb8KokT3XtW09q2zuNPiIozMEbThrk_jIMx2Q/exec'; 

// KONFIGURASI MEMBER & HARGA
const catalog = [
    { id: 'devi', name: 'Devi', price: 30000, img: 'img/devi.jpg' },
    { id: 'risma', name: 'Risma', price: 30000, img: 'img/risma.jpg' },
    { id: 'tiara', name: 'Tiara', price: 30000, img: 'img/tiara.jpg' },
    { id: 'ziella', name: 'Ziella', price: 30000, img: 'img/ziella.jpg' },
    { id: 'caca', name: 'Caca', price: 30000, img: 'img/caca.jpg' },
    { id: 'diva', name: 'Diva', price: 30000, img: 'img/diva.jpg' },
    { id: 'cassie', name: 'Cassie', price: 30000, img: 'img/cassie.jpg' },
    { id: 'group', name: 'Group', price: 35000, img: 'img/group.jpg' }
];

let cart = {};

const formatRp = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

// Generate Card Member dengan Fredoka Font
const container = document.getElementById('member-container');
catalog.forEach(item => {
    cart[item.id] = 0; 
    const card = document.createElement('div');
    card.className = 'member-card';
    card.id = `card-${item.id}`;
    card.innerHTML = `
        <div class="checkmark">✓</div>
        <img src="${item.img}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/150/f0f0f0/999?text=${item.name}'">
        <div class="member-name ft-title">${item.name}</div>
        <div class="counter-box">
            <button type="button" class="counter-btn ft-title" onclick="updateQty('${item.id}', -1)">-</button>
            <span class="counter-val ft-title" id="qty-${item.id}">0</span>
            <button type="button" class="counter-btn ft-title" onclick="updateQty('${item.id}', 1)">+</button>
        </div>
    `;
    container.appendChild(card);
});

// === LOGIKA KASIR ===
function updateQty(id, change) {
    if (cart[id] + change >= 0) {
        cart[id] += change;
        document.getElementById(`qty-${id}`).innerText = cart[id];
        
        const card = document.getElementById(`card-${id}`);
        if (cart[id] > 0) { card.classList.add('selected'); } 
        else { card.classList.remove('selected'); }

        renderSummary();
    }
}

function renderSummary() {
    const summaryContainer = document.getElementById('summary-items');
    const totalDisplay = document.getElementById('total-price');
    let html = '';
    let grandTotal = 0;
    let count = 0;

    catalog.forEach(item => {
        if (cart[item.id] > 0) {
            const sub = cart[item.id] * item.price;
            grandTotal += sub;
            count++;
            html += `
                <div class="summary-item ft-title">
                    <span>${item.name} (x${cart[item.id]})</span>
                    <span>${formatRp(sub)}</span>
                </div>
            `;
        }
    });

    if (count === 0) {
        summaryContainer.innerHTML = '<div class="empty-state ft-title">Belum ada member yang dipilih</div>';
    } else {
        summaryContainer.innerHTML = html;
    }
    
    totalDisplay.innerText = formatRp(grandTotal);
    document.getElementById('form-transaksi').dataset.total = grandTotal;
}

// === LOGIKA ROUTING (LOGIN -> SETUP -> KASIR) ===
window.onload = () => {
    // Cek apakah perangkat sudah pernah login
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (isLoggedIn === 'true') {
        // Jika sudah login, sembunyikan layar login
        document.getElementById('login-screen').style.display = 'none';
        
        // Cek apakah event sudah diset
        const savedEvent = localStorage.getItem('activeEvent');
        if (savedEvent) {
            showCashier(savedEvent);
        } else {
            // Jika belum ada event, munculkan setup event
            document.getElementById('setup-screen').style.display = 'block';
        }
    }
    // Jika belum login, biarkan login-screen tampil secara default
};

function loginKasir() {
    const inputPass = document.getElementById('input-password').value;
    
    if (inputPass === PASSWORD_KASIR) {
        // Tandai sebagai login di memori HP
        localStorage.setItem('isLoggedIn', 'true');
        
        // Sembunyikan layar login
        document.getElementById('login-screen').style.display = 'none';
        
        // Arahkan ke layar setup atau kasir
        const savedEvent = localStorage.getItem('activeEvent');
        if (savedEvent) {
            showCashier(savedEvent);
        } else {
            document.getElementById('setup-screen').style.display = 'block';
        }
    } else {
        alert("PIN / Password Salah!");
        document.getElementById('input-password').value = ''; // Kosongkan kolom
    }
}

function logoutKasir() {
    if (confirm("Yakin ingin keluar (logout) dari sistem kasir?")) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('activeEvent');
        location.reload(); // Refresh akan mengembalikan ke layar login
    }
}

function startEvent() {
    const eventName = document.getElementById('input-event').value;
    if (eventName) {
        localStorage.setItem('activeEvent', eventName);
        showCashier(eventName);
    } else {
        alert("Nama event tidak boleh kosong!");
    }
}

function showCashier(name) {
    document.getElementById('display-event').innerText = name;
    document.getElementById('setup-screen').style.display = 'none';
    document.getElementById('cashier-screen').style.display = 'block';
}

function resetEvent() {
    if (confirm("Ganti sesi event? Data event saat ini akan ditutup dari layar kasir.")) {
        localStorage.removeItem('activeEvent');
        location.reload(); 
    }
}

// === FORM SUBMIT KE GOOGLEAPPSCRIPT ===
document.getElementById('form-transaksi').addEventListener('submit', e => {
    e.preventDefault();
    const total = parseInt(e.target.dataset.total) || 0;
    if (total == 0) return alert("Pilih minimal 1 member!");

    const btn = document.getElementById('btn-submit');
    btn.innerText = "Mengirim...";
    btn.disabled = true;

    let rincianText = [];
    catalog.forEach(item => {
        if(cart[item.id] > 0) { rincianText.push(`${item.name} (x${cart[item.id]})`); }
    });

    const formData = new FormData(e.target);
    formData.append('nama_event', localStorage.getItem('activeEvent'));
    formData.append('rincian_order', rincianText.join(', '));
    formData.append('total_harga', total);

    fetch(scriptURL, { method: 'POST', body: formData })
    .then(response => {
        document.getElementById('form-transaksi').reset();
        catalog.forEach(item => {
            cart[item.id] = 0;
            document.getElementById(`qty-${item.id}`).innerText = 0;
            document.getElementById(`card-${item.id}`).classList.remove('selected');
        });
        renderSummary();

        document.getElementById('cashier-screen').style.display = 'none';
        document.getElementById('success-screen').style.display = 'block';
        window.scrollTo(0, 0);

        btn.disabled = false;
        btn.innerText = "Proses Order";
    })
    .catch(error => {
        alert('Gagal! Periksa koneksi internet.');
        btn.disabled = false;
        btn.innerText = "Proses Order";
    });
});

// === FUNGSI KEMBALI DARI LAYAR SUKSES ===
function backToForm() {
    document.getElementById('success-screen').style.display = 'none';
    document.getElementById('cashier-screen').style.display = 'block';
    document.getElementById('customer').focus(); 
}
