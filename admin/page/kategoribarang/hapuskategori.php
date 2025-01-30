<?php
// ...

if(isset($_GET['aksi']) && $_GET['aksi'] == 'hapuskategori' && isset($_GET['id'])) {
    // Mendapatkan ID yang akan dihapus
    $id_to_delete = $_GET['id'];

    // Query untuk menghapus data berdasarkan ID
    $hapus_data = $koneksi->query("DELETE FROM kategori_barang WHERE id = '$id_to_delete'");

    // Cek apakah proses hapus berhasil
    if($hapus_data) {
        // Jika berhasil, tampilkan pesan sukses dengan JavaScript dan arahkan kembali ke halaman jenisbarang
        echo '<script type="text/javascript">
                alert("Data Berhasil Dihapus");
                window.location.href="?page=kategoribarang";
              </script>';
    } else {
        // Jika gagal, tampilkan pesan error atau lakukan penanganan kesalahan lainnya
        echo "Gagal menghapus data. Silakan coba lagi.";
    }
}

// ...
?>
