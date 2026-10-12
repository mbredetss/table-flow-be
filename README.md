# Table Flow API
Projek ini dibuat karena permasalahan yang ada di rumah makan atau cafe. Setiap pelanggan ingin memesan menu, pelanggan perlu ke kasir terlebih dahulu, memilih menu yang diinginkan dan membayarnya. Bagaimana kalau antriannya panjang? Bukan hanya pelanggan yang kesusahan, melainkan juga karyawan rumah makan/cafe yang bertugas sebagai kasir yang perlu melayani pelanggan yaitu mencatat pesanan dan pembayaran pelanggan.

Dengan Table-Flow, pelanggan sekarang tidak perlu lagi pergi ke kasir untuk memesan menu. Pelanggan bisa langsung memesan dan membayar menu dari meja tempat mereka duduk untuk memesan. Selain itu, kasir dapat memantau pesanan secara realtime.

Fitur Utama:
- Pantau pesanan secara realtime.
- Pesan dan Bayar melalui aplikasi.

Saat saya mengembangkan API ini, saya memiliki problem yang dimana saya hanya memahami RESTful API. Saya bingung bagaimana supaya pesanan ini dapat terpantau secara realtime. Satu-satunya cara yang terpikir kan oleh saya saat itu adalah melakukan hit ke endpoint pesanan setiap beberapa detik. Akan tetapi cara ini menurut saya tidak efisien meskipun jumlah user nantinya hanya sedikit (hanya 1, yaitu kasir). Jadi saya bertanya ke AI (Claude), bagaimana yah mengatasi ini? Claude memperkenalkan saya "Server-Sent Event (SSE)", sehingga sekarang pesanan dapat di pantau secara realtime berkat SSE.

## Tech Stack
- Node.js (javascript)
- Expressjs
- Joi
- Postgresql
- Payment gateway: Midtrans