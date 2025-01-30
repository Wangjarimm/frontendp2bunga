  <div class="container-fluid">

          <!-- DataTales Example -->
          <div class="card shadow mb-4">
            <div class="card-header py-3">
              <h6 class="m-0 font-weight-bold text-primary">Tambah Kategori Barang</h6>
            </div>
            <div class="card-body">
              <div class="table-responsive">
							
							
							<div class="body">
							
							<form method="POST" enctype="multipart/form-data">
							

							<label for="">Kategori Barang</label>
                            <div class="form-group">
                               <div class="form-line">
                                <input type="text" name="kategori_barang" class="form-control" />	 
							</div>
                            </div>
					
							
						
								<input type="submit" name="simpan" value="Simpan" class="btn btn-primary">
							
							</form>
						
							
							
							
							<?php
							
							if (isset($_POST['simpan'])) {
								$kategori_barang= $_POST['kategori_barang'];
								
								
					
			
								
								$sql = $koneksi->query("insert into kategori_barang (kategori_barang) values('$kategori_barang')");
								
								if ($sql) {
									?>
									
										<script type="text/javascript">
										alert("Data Berhasil Disimpan");
										window.location.href="?page=kategoribarang";
										</script>
										
										<?php
								}
								}
							
							
							?>
										
										
										
								
								
								
								
								
