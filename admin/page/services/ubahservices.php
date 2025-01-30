<?php
if (isset($_GET['id'])) {
    $id_services = $_GET['id'];
    $sql2 = $koneksi->query("SELECT * FROM services WHERE id = '$id_services'");
    $tampil = $sql2->fetch_assoc();
}
?>

<div class="container-fluid">
    <!-- DataTales Example -->
    <div class="card shadow mb-4">
        <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">Ubah Layanan</h6>
        </div>
        <div class="card-body">
            <div class="table-responsive">
                <div class="body">
                    <form method="POST" enctype="multipart/form-data">

                        <label for="">Nama Layanan</label>
                        <div class="form-group">
                            <div class="form-line">
                                <input type="text" name="nama_service" value="<?php echo $tampil['nama_service']; ?>" class="form-control" />
                            </div>
                        </div>

                        <label for="">Harga</label>
                        <div class="form-group">
                            <div class="form-line">
                                <input type="text" name="harga" id="harga" value="<?php echo $tampil['harga']; ?>" class="form-control" oninput="formatRupiah(this)" />
                            </div>
                        </div>

                        <label for="">Deskripsi</label>
                        <div class="form-group">
                            <div class="form-line">
                                <textarea name="deskripsi" class="form-control" rows="4"><?php echo $tampil['deskripsi']; ?></textarea>
                            </div>
                        </div>

                        <label for="">Foto</label>
                        <div class="form-group">
                            <div class="form-line">
                                <input type="file" name="foto" class="form-control" />
                            </div>
                            <p>Foto saat ini: <br>
                                <img src="img/<?php echo $tampil['foto']; ?>" alt="Foto Layanan" width="150px">
                            </p>
                        </div>

                        <script type="text/javascript">
                            function formatRupiah(angka) {
                                var number_string = angka.value.replace(/[^,\d]/g, '').toString(),
                                    split = number_string.split(','),
                                    remainder = split[0].length % 3,
                                    rupiah = split[0].substr(0, remainder),
                                    thousand = split[0].substr(remainder).match(/\d{3}/gi);

                                if (thousand) {
                                    separator = remainder ? '.' : '';
                                    rupiah += separator + thousand.join('.');
                                }

                                rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
                                angka.value = rupiah ? 'Rp. ' + rupiah : '';
                            }
                        </script>

                        <input type="submit" name="simpan" value="Simpan" class="btn btn-primary">

                    </form>

                    <?php
                    if (isset($_POST['simpan'])) {
                        $nama_service = $_POST['nama_service'];
                        $harga = str_replace(['Rp. ', '.'], '', $_POST['harga']); // Menghapus simbol Rp. dan titik
                        $deskripsi = $_POST['deskripsi'];

                        // Proses upload foto
                        $foto_baru = $_FILES['foto']['name'];
                        $lokasi = $_FILES['foto']['tmp_name'];
                        $folder = "img/";

                        if (!empty($foto_baru)) {
                            $upload = move_uploaded_file($lokasi, $folder . $foto_baru);
                            $foto_query = ", foto='$foto_baru'";
                        } else {
                            $foto_query = "";
                        }

                        $sql = $koneksi->query("UPDATE services SET nama_service='$nama_service', harga='$harga', deskripsi='$deskripsi' $foto_query WHERE id='$id_services'");

                        if ($sql) {
                            ?>
                            <script type="text/javascript">
                                alert("Data Berhasil Diubah");
                                window.location.href = "?page=services";
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
