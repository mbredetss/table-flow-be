# Produk yang Akan Dibuat
Aplikasi ini adalah memesan dan membayar menu (melalui QRIS) langsung di tempat mereka duduk tanpa harus ke kasir untuk memesan makanan. Setelah pelanggan memesan makanan, akan masuk ke daftar pesanan sehingga barista bisa langsung membuat pesanan yang dipesan.

# Objective
Aplikasi ini bertujuan untuk mempermudah pelanggan untuk memesan makanan dan minuman di cafe. Dengan adanya aplikasi ini, pelanggan tidak perlu lagi mengantri di kasir untuk memesan makanan, cukup scan QR code yang ada di meja dan mulai memesan. Selain itu, aplikasi ini juga memudahkan barista dalam memantau pesanan dan memastikan bahwa pesanan dikirim ke pelanggan dengan cepat dan akurat.

# Tech Stack
- Database: PostgreSQL
- Backend: Express.js
- Frontend: React + Vite
- Payment Gateway: Midtrans

# Success Metrik
Goal: [
    - Pelanggan bisa memesan menu dan membayar langsung dari aplikasi
    - Kasir (Admin) bisa memperbarui menu
]

Metric: Pengguna tidak perlu lagi ke kasir untuk memesan makanan dan membayar pesanan, namun memesan dan membayar bisa dilakukan langsung melalui aplikasi, sehingga menghemat waktu dan tenaga bagi kasir dan juga pelayan.

# Requirement
Epic: Kasir (Admin) bisa memperbarui menu
User Story: Sebagai Kasir (Admin), saya ingin bisa memanipulasi menu, agar dapat memperbarui menu yang tersedia di cafe.
Importance/Status: High
Acceptance Criteria: [
    - Kasir (Admin) dapat login ke situs web cafe. 
    - Kasir (Admin) dapat menambahkan menu.
    - Kasir (Admin) dapat mengedit menu.
    - Kasir (Admin) dapat menghapus menu.
]

Epic: Pelanggan bisa memesan menu dan membayar langsung dari aplikasi
User Story: Sebagai seorang pelanggan, saya ingin bisa memesan menu dan membayar langsung dari aplikasi, agar tidak perlu lagi datang ke kasir untuk memesan menu.
Importance/Status: High
Acceptance Criteria: [
    - Pelanggan dapat melihat daftar meja yang tersedia yang ada di cafe secara online.
    - Pelanggan dapat melihat menu yang tersedia.
    - Pelanggan dapat menambahkan menu ke keranjang.
    - Pelanggan dapat mengorder menu.
    - Pelanggan dapat membayar pesanan melalui dynamic QRIS.
    - Pelanggan bisa melihat pesanannya ada di urutan ke berapa.
]

Epic: Kasir (Admin) bisa memantau pesanan dari aplikasi.
User Story: Sebagai Kasir (Admin), saya ingin bisa memantau pesanan dari aplikasi, agar dapat memantau pesanan yang masuk.
Importance/Status: High
Acceptance Criteria: [
    - Kasir (Admin) dapat login ke situs web cafe.
    - Kasir (Admin) dapat melihat daftar pesanan yang masuk melalui halaman dashboard.
    - Kasir (Admin) dapat mengubah status pesanan menjadi 'selesai'.
]