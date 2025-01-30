<?php
include_once 'koneksibarang.php';
if (isset($_GET['id'])) {
    $id_jenis_barang = $_GET['id'];
    $sql2 = $koneksi->query("SELECT * FROM kategori_barang WHERE id = '$id_jenis_barang'");
    $tampil = $sql2->fetch_assoc();
} 
?>

<div class="container-fluid">
    <!-- DataTales Example -->
    <div class="card shadow mb-4">
        <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">Ubah Kategori Barang</h6>
        </div>
        <div class="card-body">
            <div class="table-responsive">
                <div class="body">
                    <form method="POST" enctype="multipart/form-data">

                        <!-- Tidak perlu menampilkan input untuk ID Jenis Barang -->

                        <label for="">Kategori Barang</label>
                        <div class="form-group">
                            <div class="form-line">
                                <input type="text" name="kategori_barang" value="<?php echo $tampil['kategori_barang']; ?>" class="form-control" />
                            </div>
                        </div>

                        <input type="submit" name="simpan" value="Simpan" class="btn btn-primary">

                    </form>

                    <?php
                    if (isset($_POST['simpan'])) {
                        $kategori_barang = $_POST['kategori_barang'];

                        $sql = $koneksi->query("UPDATE kategori_barang SET kategori_barang='$kategori_barang' WHERE id='$id_jenis_barang'");

                        if ($sql) {
                            ?>
                            <script type="text/javascript">
                                alert("Data Berhasil Diubah");
                                window.location.href="?page=kategoribarang";
                            </script>
                        <?php
                        }
                    }
                    ?>
                </div>
            </div>
        </div>
    </div>
</div>
