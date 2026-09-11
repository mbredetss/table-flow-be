# Tidak ada Authorization

## Status 
Accepted

## Konteks
Tidak ada role selain admin pada sistem ini.

## Keputusan
Tidak ada skenario pengujian untuk mengecek role dari user.

## Konsekuensi
kode jadi lebih simple, tapi jika ada penambahan fitur untuk menambahkan role baru, maka ada banyak services yang perlu di update.

# Admin tidak dapat mengubah jumlah meja

## Status
Accepted

## Konteks
Jumlah meja yang ada pada cafe atau rumah makan jarang berubah jumlahnya.

## Keputusan
Tidak ada services untuk mengubah jumlah meja

## Konsekuensi
menerapkan prinsip YAGNI