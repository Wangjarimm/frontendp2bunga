<?php
include_once 'koneksibarang.php';
if (isset($_GET['id'])) {
    $id_satuan_barang = $_GET['id'];
    $sql2 = $koneksi->query("SELECT * FROM satuan WHERE id = '$id_satuan_barang'");
    $tampil = $sql2->fetch_assoc();
} 
?>

<div class="container-fluid">
    <!-- DataTales Example -->
    <div class="card shadow mb-4">
        <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">Ubah satuan Barang</h6>
        </div>
        <div class="card-body">
            <div class="table-responsive">
                <div class="body">
                    <form method="POST" enctype="multipart/form-data">

                        <!-- Tidak perlu menampilkan input untuk ID Jenis Barang -->

                        <label for="">satuan Barang</label>
                        <div class="form-group">
                            <div class="form-line">
                                <input type="text" name="satuan" value="<?php echo $tampil['satuan']; ?>" class="form-control" />
                            </div>
                        </div>

                        <input type="submit" name="simpan" value="Simpan" class="btn btn-primary">

                    </form>

                    <?php
                    if (isset($_POST['simpan'])) {
                        $satuan = $_POST['satuan'];

                        $sql = $koneksi->query("UPDATE satuan SET satuan='$satuan' WHERE id='$id_satuan_barang'");

                        if ($sql) {
                            ?>
                            <script type="text/javascript">
                                alert("Data Berhasil Diubah");
                                window.location.href="?page=satuanbarang";
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
