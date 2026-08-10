# Table Flow — Product Requirements Document

## Deskripsi Produk

Aplikasi ini memungkinkan pelanggan untuk **memesan dan membayar menu** (melalui QRIS) langsung di tempat mereka duduk, tanpa harus ke kasir. Setelah pelanggan memesan, pesanan akan masuk ke daftar pesanan sehingga barista bisa langsung memproses pesanan tersebut.

## Objective

Mempermudah pelanggan dalam memesan makanan dan minuman di cafe. Dengan aplikasi ini:

- Pelanggan **tidak perlu mengantri** di kasir — cukup scan QR code di meja dan mulai memesan.
- Pelanggan dapat melihat status pesanan 
- Barista dapat **memantau pesanan** secara real-time dan memastikan pesanan dikirim dengan cepat dan akurat.

## Tech Stack

| Layer           | Teknologi        |
| --------------- | ---------------- |
| Database        | PostgreSQL       |
| Backend         | Express.js       |
| Frontend        | React + Vite     |
| Payment Gateway | Midtrans         |

## Success Metrics

### Goal

- Pelanggan bisa memesan menu dan membayar langsung dari aplikasi.
- Kasir (Admin) bisa memperbarui menu.

### Key Metric

Pengguna tidak perlu lagi ke kasir untuk memesan makanan dan membayar pesanan. Semua dapat dilakukan langsung melalui aplikasi, sehingga **menghemat waktu dan tenaga** bagi kasir maupun pelayan.

---

## Requirements

### Epic 1 — Manajemen Menu oleh Kasir (Admin)

| Item              | Detail                                                                                                        |
| ----------------- | ------------------------------------------------------------------------------------------------------------- |
| **User Story**    | Sebagai Kasir (Admin), saya ingin bisa memanipulasi menu, agar dapat memperbarui menu yang tersedia di cafe.   |
| **Priority**      | 🔴 High                                                                                                       |

**Acceptance Criteria:**

- Kasir (Admin) dapat login ke situs web cafe.
- Kasir (Admin) dapat menambahkan menu.
- Kasir (Admin) dapat mengedit menu.
- Kasir (Admin) dapat menghapus menu.

---

### Epic 2 — Pemesanan & Pembayaran oleh Pelanggan

| Item              | Detail                                                                                                                                     |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **User Story**    | Sebagai pelanggan, saya ingin bisa memesan menu dan membayar langsung dari aplikasi, agar tidak perlu lagi datang ke kasir untuk memesan.   |
| **Priority**      | 🔴 High                                                                                                                                    |

**Acceptance Criteria:**

- Pelanggan dapat melihat menu yang tersedia.
- Pelanggan dapat menambahkan menu ke keranjang.
- Pelanggan dapat mengorder menu dan membayar pesanan melalui dynamic QRIS.
- Pelanggan bisa melihat pesanannya ada di urutan ke berapa.

---

### Epic 3 — Pemantauan Pesanan

| Item              | Detail                                                                                                                   |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **User Story**    | Sebagai Kasir (Admin), saya ingin bisa memantau pesanan dari aplikasi, agar dapat memantau pesanan yang masuk.            |
| **Priority**      | 🔴 High                                                                                                                  |

**Acceptance Criteria:**

- Kasir (Admin) dapat login ke situs web cafe.
- Kasir (Admin) dapat melihat daftar pesanan yang masuk melalui halaman dashboard.
- Kasir (Admin) dapat mengubah status pesanan menjadi "selesai".
- Pelanggan dapat memantau status pesanan.