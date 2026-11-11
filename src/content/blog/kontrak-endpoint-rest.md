---
title: "Kontrak endpoint REST yang mudah dipahami"
description: "Catatan singkat tentang penamaan resource, bentuk response, dan konsistensi saat merancang endpoint API."
pubDate: 2026-11-10
category: Backend
---

API menjadi batas yang dipakai bersama oleh frontend, aplikasi lain, dan layanan backend. Karena itu, endpoint sebaiknya punya kontrak yang mudah dipahami tanpa menebak-nebak perilakunya.

## Mulai dari resource

Gunakan kata benda untuk resource, lalu biarkan HTTP method menjelaskan tindakan. Contohnya, daftar pesanan dapat diakses lewat `GET /orders`, sedangkan satu pesanan lewat `GET /orders/{id}`.

```http
GET /api/v1/orders/ord_123
```

Nama resource yang konsisten membantu pembaca memahami pola API dari satu endpoint ke endpoint berikutnya.

## Buat response konsisten

Response yang bentuknya stabil lebih mudah ditangani oleh client. Misalnya, satu pesanan selalu memiliki `id`, `status`, dan `createdAt`. Jika data tidak ditemukan, kembalikan status HTTP yang sesuai dan pesan yang menjelaskan masalahnya.

```json
{
  "data": {
    "id": "ord_123",
    "status": "paid",
    "createdAt": "2026-11-10T09:00:00Z"
  }
}
```

Contoh ini hanya menunjukkan bentuk kontrak. Nama field dan format akhirnya tetap perlu mengikuti kebutuhan produk yang memakai API tersebut.

## Tentukan perilaku sebelum implementasi

Sebelum menulis handler, sepakati beberapa hal dengan client API: field wajib, format error, aturan pagination, dan perubahan yang mungkin terjadi di versi berikutnya. Keputusan itu bisa dicatat di dokumentasi OpenAPI atau contoh request dan response.

Dengan kontrak yang eksplisit, implementasi backend dan integrasi client punya acuan yang sama. Endpoint pun lebih mudah dipelihara ketika kebutuhan berubah.
