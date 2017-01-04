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
          '<input style="display:initial;" name="photo[]" multiple type="file" name="file" id="fotoProd" />'+
          '<input type="hidden" name="codigo" id="codigo" value="'+cod+'"/></form>',
        showCloseButton: true,
        showCancelButton: true,
        showLoaderOnConfirm: true,
        confirmButtonText: 'Subir',
        cancelButtonText: 'Cancelar',
        preConfirm: function () {
        return new Promise(function (resolve) {
          var files = document.getElementById('fotoProd').files;
          var codigo = document.getElementById('codigo').value;
          //obtengo la extension del archivo cargado
          var extension = files[0]['type'].split('/').pop();
          if(extension == 'jpg' || extension == 'jpeg'){
              resizeAndUpload(files[0],codigo);
          }else{
            swal(
                'Error!',
                'Extension no permitida!',
                'error'
              );
          }
                    
        })}
      })
  };
  
function resizeAndUpload(file,codigo){
  var reader = new FileReader();
  reader.onloadend = function() {
    var tempImg = new Image();
    tempImg.onload = function() {
      // Comprobamos con el aspect cómo será la reducción
      // MAX_IMAGE_SIZE_PROCESS es la N que definimos como máxima
      var MAX_WIDTH = 600;
      var MAX_HEIGHT = 800;
      var tempW = tempImg.width;
      var tempH = tempImg.height;
      if (tempW > tempH) {
        if (tempW > MAX_WIDTH) {
          tempH *= MAX_WIDTH / tempW;
          tempW = MAX_WIDTH;
        }
      } else {
        if (tempH > MAX_HEIGHT) {
          tempW *= MAX_HEIGHT / tempH;
          tempH = MAX_HEIGHT;
        }
      }
      // Creamos un canvas para la imagen reducida y la dibujamos
      var resizedCanvas = document.createElement('canvas');
      resizedCanvas.width = tempW;
      resizedCanvas.height = tempH;
      var ctx = resizedCanvas.getContext("2d");
      ctx.drawImage(this, 0, 0, tempW, tempH);
      var dataURL = resizedCanvas.toDataURL("image/jpeg");

      // Pasamos la dataURL que nos devuelve Canvas a objeto Blob
      // Envíamos por Ajax el objeto Blob
      // Cogiendo el valor de photo (nombre del input file)
      var file = dataURLtoBlob(dataURL);
      var fd = new FormData();
      fd.append("photo",file);
      fd.append("codigo",codigo);
      
      var ajax = new XMLHttpRequest();
      ajax.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          swal(
              'Exito!',
              'La foto se subió correctamente!',
              'success'
            )
            vm.obtenerProductos();
        }
      };
      ajax.open("POST","controllers/fotoUpload.php",true);
      ajax.send(fd);
    };
    tempImg.src = reader.result;
  }
  reader.readAsDataURL(file);
}

  function dataURLtoBlob(dataURL){
  // Decodifica dataURL
  var binary = atob(dataURL.split(',')[1]);
  // Se transfiere a un array de 8-bit unsigned
  var array = [];
  var length = binary.length;
  for(var i = 0; i < length; i++) {
    array.push(binary.charCodeAt(i));
  }
  // Retorna el objeto Blob
  return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
} 

  vm.abrirImagen = function(cod,desc,codOriginal){
    swal({
        title: 'Cargando...',
        showConfirmButton: false,
        timer: 2000
      }).done();
    $http({
         method: 'POST',
         url: 'controllers/verFoto.php',
         data: {
            carpeta: cod
         }
      }).
      success(function(data) {
        swal({
            html:
              '<img src="public/images/productos/'+cod+'/'+data+'" alt="">' +
              '<br><b>'+codOriginal+' - '+desc+'</b>' +
              '<br><i style="font-size:12px;">Imagen a modo ilustrativo</i>',
            showCloseButton: true,
            showConfirmButton: false
          }).done();
      }).
      error(function() {
         alert('Error al intentar cargar la foto.');
      });   
  }

  vm.abrirImagenNoDisponible = function(){
     swal({
        text: '<i>Vista previa no disponible</i>',
        imageUrl: '/webvalsuso/public/images/iconos/vistaPrevia.png',
        imageWidth: 400,
        imageHeight: 400,
        animation: false,
        showCloseButton: true,
        showConfirmButton: false
      })
  }

});