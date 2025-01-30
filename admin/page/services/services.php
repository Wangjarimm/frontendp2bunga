<!-- Begin Page Content -->
<div class="container-fluid">

  <!-- DataTales Example -->
  <div class="card shadow mb-4">
    <div class="card-header py-3">
      <h6 class="m-0 font-weight-bold text-primary">Services</h6>
    </div>
    <div class="card-body">
      <div class="table-responsive">
        <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Layanan</th>
              <th>Harga</th>
              <th>Deskripsi</th>
              <th>Foto</th>
              <th>Pengaturan</th>
            </tr>
          </thead>
          <tbody>
            <?php 
            $no = 1;
            $sql = $koneksi->query("SELECT * FROM services");
            while ($data = $sql->fetch_assoc()) {
            ?>
              <tr>
                <td><?php echo $no++; ?></td>
                <td><?php echo htmlspecialchars($data['nama_service']); ?></td>
                <td>Rp. <?php echo number_format($data['harga'], 0, ',', '.'); ?></td>
                <td><?php echo htmlspecialchars($data['deskripsi']); ?></td>
                <td><img src="img/<?php echo $data['foto'] ?>"width="50" height="50" alt=""> </td>
                <td>
                  <a href="?page=services&aksi=ubahservices&id=<?php echo $data['id'] ?>" class="btn btn-success">Ubah</a>
                  <a onclick="return confirm('Apakah anda yakin akan menghapus data ini?')" href="?page=services&aksi=hapusservices&id=<?php echo $data['id'] ?>" class="btn btn-danger">Hapus</a>
                </td>
              </tr>
            <?php } ?>
          </tbody>
        </table>
        <a href="?page=services&aksi=tambahservices" class="btn btn-primary">Tambah</a>
      </div>
    </div>
  </div>

</div>
