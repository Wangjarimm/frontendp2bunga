<?php
session_start();

// Cek jika user belum login atau bukan admin
if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin') {
?>
  <script>
    alert("!!!! Maaf Anda Harus Login Sebagai Admin.");
    window.location.assign('login.php');
  </script>
<?php
  exit();
}
?>

<!-- Begin Page Content -->
<div class="container-fluid">

  <!-- Data Booking -->
  <div class="card shadow mb-4">
    <div class="card-header py-3">
      <h6 class="m-0 font-weight-bold text-primary">Data Booking</h6>
    </div>
    <div class="card-body">
      <div class="table-responsive">
        <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
          <thead>
            <tr>
              <th>No</th>
              <th>ID Booking</th>
              <th>Nama Pelanggan</th>
              <th>Nomor Telepon</th>
              <th>Email</th>
              <th>Service</th>
              <th>Tanggal Booking</th>
              <th>Status Pembayaran</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <?php 
              $no = 1;
              $sql = $koneksi->query("SELECT bookings.booking_id AS booking_id, bookings.tanggal_booking, bookings.status_pembayaran, users.name AS nama_pelanggan, users.phone, users.email, GROUP_CONCAT(services.nama_service SEPARATOR ', ') AS services FROM bookings JOIN users ON bookings.customer_id = users.id JOIN booking_services ON bookings.booking_id = booking_services.booking_id JOIN services ON booking_services.service_id = services.id GROUP BY bookings.booking_id");
              while ($data = $sql->fetch_assoc()) {
            ?>
              <tr>
                <td><?php echo $no++; ?></td>
                <td><?php echo $data['booking_id']; ?></td>
                <td><?php echo htmlspecialchars($data['nama_pelanggan']); ?></td>
                <td><?php echo htmlspecialchars($data['telepon']); ?></td>
                <td><?php echo htmlspecialchars($data['email']); ?></td>
                <td><?php echo htmlspecialchars($data['services']); ?></td>
                <td><?php echo htmlspecialchars($data['tanggal_booking']); ?></td>
                <td><?php echo htmlspecialchars($data['status_pembayaran']); ?></td>
                <td>
                  <a onclick="return confirm('Apakah anda yakin akan menghapus data ini?')" href="?page=booking&aksi=hapus&id=<?php echo $data['booking_id']; ?>" class="btn btn-danger">Hapus</a>
                </td>
              </tr>
            <?php } ?>
          </tbody>
        </table>
      </div>
    </div>
  </div>

</div>