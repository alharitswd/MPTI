const produkData = [
  { nama: "Sayur Bayam", harga: 5000, gambar: "/kentang.jpg" },
  { nama: "Sayur Kangkung ", harga: 7500, gambar: "https://via.placeholder.com/150" },
  { nama: "Sayur Toge", harga: 5000, gambar: "https://via.placeholder.com/150" },
  { nama: "Sayur Asem", harga: 5000, gambar: "https://via.placeholder.com/150" },
  { nama: "Sayur Brokoli", harga: 4000, gambar: "https://via.placeholder.com/150" },
  { nama: "Sayur", harga: 50000, gambar: "https://via.placeholder.com/150" },
];

const produkList = document.getElementById("produkList");
const listKeranjang = document.getElementById("listKeranjang");
let keranjang = {};

produkData.forEach((produk, index) => {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <img src="${produk.gambar}" alt="${produk.nama}" />
    <h4>${produk.nama}</h4>
    <p>Rp ${produk.harga.toLocaleString()}</p>
    <div>
      <button onclick="ubahJumlah(${index}, -1)">−</button>
      <span id="qty-${index}">0</span>
      <button onclick="ubahJumlah(${index}, 1)">+</button>
    </div>
  `;
  produkList.appendChild(card);
});

function ubahJumlah(index, perubahan) {
  const produk = produkData[index];
  const key = produk.nama;

  if (!keranjang[key]) {
    keranjang[key] = { ...produk, qty: 0 };
  }

  keranjang[key].qty += perubahan;
  if (keranjang[key].qty <= 0) delete keranjang[key];

  document.getElementById(`qty-${index}`).innerText = keranjang[key]?.qty || 0;
  renderKeranjang();
}

function renderKeranjang() {
  listKeranjang.innerHTML = "";
  let total = 0;
  const statusBayar = document.getElementById("status").value;

  for (const key in keranjang) {
    const item = keranjang[key];
    const subtotal = item.harga * item.qty;
    total += subtotal;

    const el = document.createElement("p");
    el.innerText = `${item.nama} x ${item.qty} = Rp ${subtotal.toLocaleString()}`;
    listKeranjang.appendChild(el);
  }

  if (total > 0) {
    const totalEl = document.createElement("p");
    totalEl.innerHTML = `<strong>Total: Rp ${total.toLocaleString()}</strong>`;
    listKeranjang.appendChild(totalEl);
  }
}

function toggleUpload() {
  const status = document.getElementById("status").value;
  document.getElementById("upload-bukti").style.display = status === "SUDAH BAYAR" ? "block" : "none";
}

function previewBukti() {
  const preview = document.getElementById("preview");
  const file = document.getElementById("bukti").files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    preview.innerHTML = `<img src="${e.target.result}" style="max-width: 200px; border: 1px solid #ccc;" />`;
  };
  reader.readAsDataURL(file);
}

function kirimWhatsApp() {
    const nomor = "6282398707777"; // Ganti nomor WA admin
    if (Object.keys(keranjang).length === 0) return alert("Keranjang kosong!");
  
    const pelanggan = prompt("Masukkan nama pelanggan:");
    const noNota = "TRX/" + Date.now(); // Atau sistem format sendiri
    const now = new Date();
    const tglMasuk = now.toLocaleString("id-ID");
    const estimasi = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toLocaleString("id-ID"); // +2 hari
  
    let total = 0;
    let detailProduk = "";
  
    for (const key in keranjang) {
      const item = keranjang[key];
      const subtotal = item.harga * item.qty;
      total += subtotal;
      detailProduk += `- ${item.nama}\n${item.qty} x ${item.harga.toLocaleString()} = Rp ${subtotal.toLocaleString()}\n\n`;
    }
  
    const pesan = `
  *NOTA ELEKTRONIK*
  
  Istana Sayur dan Buah (ISB)
  Jl. Trikora Wosi, Wosi, Kec. Manokwari Bar., Kabupaten Manokwari, Papua Bar. 98312
  WA : ${nomor}
  
  =======================
  *No Nota* :
  ${noNota}
  
  *Pelanggan* :
  ${pelanggan || "Tanpa Nama"}
  
  *Tanggal Masuk* : 
  ${tglMasuk}
  
  *Estimasi Selesai* : 
  ${estimasi}
  
  =======================
  ${detailProduk}=======================
  *Status*   : ${statusBayar}
  *Metode* : COD / Transfer
  
  =======================
  *subTotal*  = Rp ${total.toLocaleString()}
  *Diskon*     = Rp 0
  *Total*        = Rp ${total.toLocaleString()}
  
  _Syarat dan Ketentuan:_
  • Barang yang dibeli tidak bisa dikembalikan.
  • Pembayaran dilakukan sebelum pengiriman (Kecuali COD).
  • Dengan berbelanja di Istana Sayur dan Buah (ISB), Anda setuju dengan syarat & ketentuan kami.
  
  Terima kasih telah berbelanja!
  `.trim();
  
    const url = `https://wa.me/${nomor}?text=${encodeURIComponent(pesan)}`;
    window.open(url, "_blank");
  }

