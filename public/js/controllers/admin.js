angular.module("app")
.controller('adminController', function($http,$location,clientesFactory,fileUpload) {
   var vm = this;
   vm._id = null;
   vm.name = '';
   vm.password = '';
   vm.users = [];
   vm.productos = [];
   vm.pageSize = 10;
   vm.urlAdmin = 'views/admin/clientes.html';
   vm.cargando = 0;

clientesFactory.getAuth();    

vm.cargarVista = function(vista){
  if(vista == 1){
      $("#produc").removeClass("activo");
      $("#client").addClass(" activo");
      $("#search").focus();
      vm.urlAdmin = 'views/admin/clientes.html';
      vm.cargarUsuarios();
  }else{
      $("#search").focus();
      $("#produc").addClass(" activo");
      $("#client").removeClass("activo");
      vm.urlAdmin = 'views/admin/productos.html';
      vm.obtenerProductos();
  }
}

vm.uploadFile = function() {
    var file = vm.file;    

    if(file != null && file != ''){
      vm.cargando = 1;
      var fd = new FormData();
     fd.append('file', file);
     $http.post("controllers/fileUpload.php", 
                fd, {
                  transformRequest: angular.identity,
                  headers: {'Content-Type': undefined}
               })            
         .success(function(result){
            swal(
                  'Exito!',
                  'El Archivo se subió correctamente!',
                  'success'
                );
            $('#fileMobile').val('');
            vm.cargando = 0;
            vm.obtenerProductos();
            return;
         })            
         .error(function(){
            $('#fileMobile').val('');
            vm.cargando = 0;
            return false;
         });
       }else{
        swal(
              'Error!',
              'Debe seleccionar un archivo para subir',
              'warning'
            );
       }   
    }

    vm.salir = function(){
      $http({
         method: 'POST', 
         url: 'controllers/login.php', 
         data: {
            auth: 2           
        }
      }).
      success(function(data) {
         if(data){
            $location.url("/clientes");
         }else{
            alert(data);
         }
      }).
      error(function() {
         alert('Error al intentar recuperar los clientes.');
      });
   };

   vm.pageChangeHandler = function(num) {
    console.log('going to page ' + num);
  };
  
   vm.cargarUsuarios = function(){
      $http({
         method: 'POST', 
         url: 'controllers/clientes.php',
         data: {
            auth: 1        
        }
      }).
      success(function(data) {
         if(typeof(data) == 'object'){
            vm.users = data;
         }else{            
            alert('Error al intentar recuperar los clientes.');
         }
      }).
      error(function() {
         alert('Error al intentar recuperar los clientes.');
      });
   };

   vm.obtenerProductos = function(){      
      $http({
         method: 'POST', 
         url: 'controllers/productos.php',
         data: {
            auth: 1        
        }
      }).
      success(function(data) {
         if(typeof(data) == 'object'){
            vm.productos = data;
         }else{            
            alert('Error al intentar recuperar los clientes.');
         }
      }).
      error(function() {
         alert('Error al intentar recuperar los clientes.');
      });
   };

   vm.guardarUsuario = function() {
      $http({
         method: 'POST',
         url: 'controllers/clientes.php',
         data: {
            name: vm.name,
            password: vm.password,
            id: vm._id,
            auth : 2
         }
      }).
      success(function(data) {
         if(data == true){ 
            if(vm._id){
              var mensaje = 'El usuario se edito correctamente.';
            }else{
              var mensaje = 'El usuario fue creado con exito.';
            }            
            swal(
              'Exito!',
              mensaje,
              'success'
            )
            vm.limpiarDatos();
            vm.cargarUsuarios();
         }else{
            console.log(data);
            //alert('Error al intentar guardar el cliente.');
         }
      }).
      error(function() {
         alert('Error al intentar guardar el cliente.');
      });
   };

   vm.recuperarUsuario = function(indice) {
      $http({
         method: 'POST',
         url: 'controllers/clientes.php',
         data: {
            id: indice,
            auth : 3
         }
      }).
      success(function(data) {
         if(typeof(data) == 'object'){            
            vm._id = data.id;
            vm.name = data.name;
            swal({
              title: '<strong>Editar usuario</strong>',
              html:
                '<label>Nombre cliente</label>'+
                '<input id="user" type="text" value="'+vm.name+'" class="form-control" placeholder="Nombre de usuario">' +
                '<label>Contraseña</label>' +
                '<input type="password" id="password" value="" class="form-control" placeholder="Contraseña">',
              showCloseButton: true,
              showCancelButton: true,
              confirmButtonText: 'Grabar',
              cancelButtonText: 'Cancelar'
            }).then(function() {
                vm.name = document.getElementById('user').value;
                vm.password = document.getElementById('password').value;
                vm.guardarUsuario();        
            })
         }else{
            console.log(data);
            alert('Error al intentar recuperar el cliente.');
         } 
      }).
      error(function() {
         alert('Error al intentar recuperar el cliente.');
      });
   };

   vm.eliminarUsuario = function(indice) {
      swal({
        title: 'Esta seguro?',
        text: "Si elimina el usuario no puede volver atras!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, eliminar!'
      }).then(function() {
         $http({
         method: 'POST',
         url: 'controllers/clientes.php',
         data: {
            id: indice,
            auth: 4
         }
      }).
      success(function(data) {
         if(data){
            swal(
                'Eliminado!',
                'El cliente se elimino correctamente.',
                'success'
              );
            vm.limpiarDatos();
            vm.cargarUsuarios();
         }else{
            alert('Error al intentar eliminar el cliente.');
         } 
      }).
      error(function() {
         alert('Error al intentar eliminar el cliente.');
      })        
      })     
   };

   vm.limpiarDatos = function() {
      vm._id = null;
      vm.user = '';
      vm.password = '';
   };

   vm.nuevoUsuario = function() {
      vm._id = null;
      swal({
        title: '<strong>Nuevo usuario</strong>',
        html:
          '<label>Nombre cliente</label>'+
          '<input id="user" type="text" value="" class="form-control" placeholder="Nombre de usuario">' +
          '<label>Contraseña</label>' +
          '<input type="password" id="password" value="" class="form-control" placeholder="Contraseña">',
        showCloseButton: true,
        showCancelButton: true,
        confirmButtonText: 'Grabar',
        cancelButtonText: 'Cancelar'
      }).then(function() {
          vm.name = document.getElementById('user').value;
          vm.password = document.getElementById('password').value;
          vm.guardarUsuario();        
      })
  }

  vm.cargarVistaImagen = function(cod,existe) {
      vm._id = null;
      swal({
        title: '<strong>Carga Imagen</strong>',
        html:'<form enctype="multipart/form-data" id="formuploadajax" method="post">'+
          '<input style="display:initial;" type="file" name="file" id="fotoProd" />'+
          '<input type="hidden" name="codigo" id="codigo" value="'+cod+'"/></form>',
        showCloseButton: true,
        showCancelButton: true,
        confirmButtonText: 'Subir',
        cancelButtonText: 'Cancelar'
      }).then(function() { 
            var formData = new FormData(document.getElementById("formuploadajax"));
            formData.append("dato", "valor");
            //
            var fd = new FormData(document.getElementById("formuploadajax"));
            fd.append("dato", "valor");
            $http.post("controllers/fotoUpload.php", 
                fd, {
                  transformRequest: angular.identity,
                  headers: {'Content-Type': undefined}
               })
            .success(function(res){
                    if(res == 'exito'){
                      swal(
                        'Exito!',
                        'La foto se subió correctamente!',
                        'success'
                      )
                      vm.obtenerProductos();
                    }else{
                      swal(
                        'Error!',
                        res
                      )
                    }                    
                }); 
      })
  }

  vm.abrirImagen = function(cod,desc){
    $http({
         method: 'POST',
         url: 'controllers/verFoto.php',
         data: {
            carpeta: cod
         }
      }).
      success(function(data) {
         swal({
            text: cod+' - '+desc,
            imageUrl: '/webvalsuso/public/images/productos/'+cod+'/'+data,
            imageWidth: 400,
            imageHeight: 400,
            animation: false,
            showCloseButton: true,
            showConfirmButton: false
          })
      }).
      error(function() {
         alert('Error al intentar cargar la foto.');
      });   
  }

});