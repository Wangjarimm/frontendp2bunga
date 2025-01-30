<div class="container-fluid">
  <!-- DataTales Example -->
  <div class="card shadow mb-4">
    <div class="card-header py-3">
      <h6 class="m-0 font-weight-bold text-primary">Tambah Layanan</h6>
    </div>
    <div class="card-body">
      <div class="table-responsive">
        <div class="body">
          <form method="POST" enctype="multipart/form-data">
            <label for="nama_service">Nama Layanan</label>
            <div class="form-group">
              <div class="form-line">
                <input type="text" name="nama_service" id="nama_service" class="form-control" required />
              </div>
            </div>

            <label for="harga">Harga</label>
            <div class="form-group">
              <div class="form-line">
                <input type="text" name="harga" id="harga" class="form-control" oninput="formatRupiah(this)" required />
              </div>
            </div>

            <label for="deskripsi">Deskripsi</label>
            <div class="form-group">
              <div class="form-line">
                <textarea name="deskripsi" id="deskripsi" class="form-control" rows="4" required></textarea>
              </div>
            </div>

            <label for="foto">Foto</label>
            <div class="form-group">
              <div class="form-line">
                <input type="file" name="foto" id="foto" class="form-control" accept="image/*" required />
              </div>
            </div>

            <script type="text/javascript">
              function formatRupiah(input) {
                var numberString = input.value.replace(/[^,\d]/g, '').toString();
                var split = numberString.split(',');
                var remainder = split[0].length % 3;
                var rupiah = split[0].substr(0, remainder);
                var thousand = split[0].substr(remainder).match(/\d{3}/gi);

                if (thousand) {
                  var separator = remainder ? '.' : '';
                  rupiah += separator + thousand.join('.');
                }

                input.value = split[1] !== undefined ? 'Rp. ' + rupiah + ',' + split[1] : 'Rp. ' + rupiah;
              }
            </script>

            <input type="submit" name="simpan" value="Simpan" class="btn btn-primary" />
          </form>

          <?php
          if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['simpan'])) {
              $nama_service = htmlspecialchars($_POST['nama_service']);
              $harga = preg_replace('/[^0-9]/', '', $_POST['harga']);
              $deskripsi = htmlspecialchars($_POST['deskripsi']);

              if (isset($_FILES['foto']) && $_FILES['foto']['error'] === UPLOAD_ERR_OK) {
                  $foto = $_FILES['foto'];
                  $ext = pathinfo($foto['name'], PATHINFO_EXTENSION);
                  $valid_ext = ['jpg', 'jpeg', 'png', 'gif'];

                  if (in_array(strtolower($ext), $valid_ext)) {
                      $folder = "img/";
                      $newName = uniqid('service_', true) . '.' . $ext;

                      if (move_uploaded_file($foto['tmp_name'], $folder . $newName)) {
                          $stmt = $koneksi->prepare("INSERT INTO services (nama_service, harga, deskripsi, foto) VALUES (?, ?, ?, ?)");
                          $stmt->bind_param("siss", $nama_service, $harga, $deskripsi, $newName);

                          if ($stmt->execute()) {
                              echo '<script>alert("Data Berhasil Disimpan"); window.location.href = "?page=services";</script>';
                          } else {
                              echo '<div class="alert alert-danger">Gagal menyimpan data ke database.</div>';
                          }

                          $stmt->close();
                      } else {
                          echo '<div class="alert alert-danger">Gagal mengunggah foto. Pastikan folder memiliki izin yang sesuai.</div>';
                      }
                  } else {
                      echo '<div class="alert alert-danger">Format file tidak valid. Harap unggah file dengan format jpg, jpeg, png, atau gif.</div>';
                  }
              } else {
                  echo '<div class="alert alert-warning">Harap unggah foto layanan.</div>';
              }
          }
          ?>
        </div>
      </div>
    </div>
  </div>
</div>
