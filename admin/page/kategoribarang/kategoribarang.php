<?php

include_once("koneksibarang.php");
?>

 <!-- Begin Page Content -->
 <div class="container-fluid">

<!-- DataTales Example -->
<div class="card shadow mb-4">
  <div class="card-header py-3">
    <h6 class="m-0 font-weight-bold text-primary">Kategori Barang</h6>
  </div>
  <div class="card-body">
    <div class="table-responsive">
      <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
      <thead>
                              <tr>
            <th>No</th>
            <th>Kategori Barang</th>
            <th>Pengaturan</th>
            
          </thead>
          
     
        <tbody>
          <?php 
        
        $no = 1;
        $sql = $koneksi->query("select * from kategori_barang");
        while ($data = $sql->fetch_assoc()) {
          
        ?>

        
        
                              <tr>
                                  <td><?php echo $no++; ?></td>
            <td><?php echo $data['kategori_barang'] ?></td>

            <td>
											<a href="?page=kategoribarang&aksi=ubahkategori&id=<?php echo $data['id'] ?>" class="btn btn-success" >Ubah</a>
											<a onclick="return confirm('Apakah anda yakin akan menghapus data ini?')" href="?page=kategoribarang&aksi=hapuskategori&id=<?php echo $data['id'] ?>" class="btn btn-danger" >Hapus</a>
											</td>
                                      
                                        </tr>
                                    
        <?php }?>

             </tbody>
                      </table>
      <a href="?page=kategoribarang&aksi=tambahkategori" class="btn btn-primary" >Tambah</a>
        </tbody>
      </table>
    </div>
  </div>
</div>

</div>












