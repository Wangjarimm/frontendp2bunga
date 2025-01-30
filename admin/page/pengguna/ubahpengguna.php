

<?php
 $id = $_GET['id'];
 $sql2 = $koneksi->query("select * from users where id = '$id'");
 $tampil = $sql2->fetch_assoc();
 
 $level = $tampil['level'];

 
 
 
 ?>
 
  <div class="container-fluid">

          <!-- DataTales Example -->
          <div class="card shadow mb-4">
            <div class="card-header py-3">
              <h6 class="m-0 font-weight-bold text-primary">Ubah User</h6>
            </div>
            <div class="card-body">
              <div class="table-responsive">
							
							
							<div class="body">

							<form method="POST" enctype="multipart/form-data">
							
							<label for="">Nama</label>
                            <div class="form-group">
                               <div class="form-line">
                                <input type="text" name="nama" value="<?php echo $tampil['name']; ?>" class="form-control" />
	 
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
                                <input type="number" name="telepon" value="<?php echo $tampil['phone']; ?>" class="form-control" />
	 
							</div>
                            </div>
							
							<label for="">Alamat</label>
                            <div class="form-group">
                               <div class="form-line">
                                <input type="text" name="alamat" value="<?php echo $tampil['address']; ?>" class="form-control" />
	 
							</div>
                            </div>
							
							<label for="">Username</label>
                            <div class="form-group">
                               <div class="form-line">
                                <input type="text" name="username" value="<?php echo $tampil['username']; ?>" class="form-control" />
                          	 
								</div>
                            </div>
							
							<label for="">Password</label>
                            <div class="form-group">
                               <div class="form-line">
                                <input type="text" name="password" value="<?php echo $tampil['password']; ?>" class="form-control" />
                          	 
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
								
								
		
								
								
								$sql = $koneksi->query("update users set name='$nama', gender='$gender', phone='$telepon', address='$alamat', username='$username',  password='$password' where id='$id'"); 
								
								if ($sql) {
									?>
									
										<script type="text/javascript">
										alert("Data Berhasil Diubah");
										window.location.href="?page=pengguna";
										</script>
										
										<?php
								}
							
								
								
								else {
									
									$sql = $koneksi->query("update users set name='$nama', gender='$gender', phone='$telepon', address='$alamat', username='$username',  password='$password' where id='$id'"); 
								
									if ($sql) {
										?>
										
											<script type="text/javascript">
											alert("Data Berhasil Diubah");
											window.location.href="?page=pengguna";
											</script>
											
											<?php
									}
								
									}
							
							}
							?>
										
										
										
								
								
								
								
								
