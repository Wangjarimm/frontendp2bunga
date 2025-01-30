




 <!-- Begin Page Content -->
        <div class="container-fluid">

          <!-- DataTales Example -->
          <div class="card shadow mb-4">
            <div class="card-header py-3">
              <h6 class="m-0 font-weight-bold text-primary">Data Pelanggan</h6>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                <thead>
                                        <tr>
                                        <th>No</th>
              <th>Nama</th>
              <th>Jenis Kelamin</th>
              <th>Telepon</th>
              <th>Alamat</th>
              <th>Username</th>
              <th>Password</th>
              <th>Aksi</th>
											
                                        </tr>
										</thead>
										
               
                  <tbody>
                  <?php 
              $no = 1;
              $sql = $koneksi->query("SELECT * FROM users WHERE role = 'customer'");
              while ($data = $sql->fetch_assoc()) {
            ?>
									
                                        <tr>
                                            <td><?php echo $no++; ?></td>
											<td><?php echo $data['name'] ?></td>
											<td><?php echo $data['gender'] ?></td>
                      <td><?php echo $data['phone'] ?></td>
											<td><?php echo $data['address'] ?></td>
											<td><?php echo $data['username'] ?></td>
                                            <td><?php echo $data['password'] ?></td>
										
											<td>
											<a href="?page=pelanggan&aksi=ubahpelanggan&id=<?php echo $data['id'] ?>" class="btn btn-success" >Ubah</a>
											<a onclick="return confirm('Apakah anda yakin akan menghapus data ini?')" href="?page=pelanggan&aksi=hapuspelanggan&id=<?php echo $data['id'] ?>" class="btn btn-danger" >Hapus</a>
											</td>
                                        </tr>
									<?php }?>

										   </tbody>
                                </table>
								<a href="?page=pelanggan&aksi=tambahpelanggan" class="btn btn-primary" >Tambah</a>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>












