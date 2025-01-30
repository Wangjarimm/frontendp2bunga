<div class="container-fluid">

    <!-- DataTales Example -->
    <div class="card shadow mb-4">
        <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">Tambah User</h6>
        </div>
        <div class="card-body">
            <div class="table-responsive">

                <div class="body">

                    <form method="POST" enctype="multipart/form-data">

                        <label for="">Nama</label>
                        <div class="form-group">
                            <div class="form-line">
                                <input type="text" name="nama" class="form-control" />
                            </div>
                        </div>

                        <label for="gender">Jenis Kelamin</label>
                        <div class="form-group">
                            <div class="form-line">
                                <input type="radio" id="laki_laki" name="gender" value="Laki-Laki" />
                                <label for="laki_laki">Laki-Laki</label>
                                <input type="radio" id="perempuan" name="gender" value="Perempuan" />
                                <label for="perempuan">Perempuan</label>
                            </div>
                        </div>

                        <label for="">Telepon</label>
                        <div class="form-group">
                            <div class="form-line">
                                <input type="number" name="telepon" class="form-control" />
                            </div>
                        </div>

                        <label for="">Alamat</label>
                        <div class="form-group">
                            <div class="form-line">
                                <input type="text" name="alamat" class="form-control" />
                            </div>
                        </div>

                        <label for="">Username</label>
                        <div class="form-group">
                            <div class="form-line">
                                <input type="text" name="username" class="form-control" />
                            </div>
                        </div>

                        <label for="">Password</label>
                        <div class="form-group">
                            <div class="form-line">
                                <input type="password" name="password" class="form-control" />
                            </div>
                        </div>

                        <input type="submit" name="simpan" value="Simpan" class="btn btn-primary">

                    </form>

                    <?php
                    if (isset($_POST['simpan'])) {
                        $nama = $_POST['nama']; // Perbaiki penamaan variabel
                        $gender = $_POST['gender'];
                        $telepon = $_POST['telepon']; // Perbaiki penamaan variabel
                        $alamat = $_POST['alamat'];
                        $username = $_POST['username'];
                        $password = md5($_POST['password']);

                        // Menambahkan pengecekan jika semua field sudah diisi
                        if ($nama && $gender && $telepon && $alamat && $username && $password) {
                            // Sesuaikan nama tabel dan kolom pada query SQL
                            $sql = $koneksi->query("INSERT INTO users (name, gender, phone, address, username, password, role) 
                                                   VALUES ('$nama', '$gender', '$telepon', '$alamat', '$username', '$password', 'customer')");

                            if ($sql) {
                                ?>
                                <script type="text/javascript">
                                    alert("Data Berhasil Disimpan");
                                    window.location.href="?page=pelanggan";
                                </script>
                                <?php
                            }
                        } else {
                            echo "<script>alert('Tolong isi semua field!');</script>";
                        }
                    }
                    ?>
                </div>
            </div>
        </div>
    </div>
</div>
