angular.module("app")
.controller('clienteController', function($http,$location,clientesFactory) {
    var vm = this;
    vm.productos = [];
    vm.pageSize = 10;
    vm.texto = '';

    clientesFactory.getAuth();    
    $("#cli").addClass( "current" );
    $("#ini").removeClass( "current" );
    $("#ubi").removeClass( "current" );
    $("#cont").removeClass( "current" );
    $("#prod").removeClass( "current" );
    $("#serv").removeClass( "current" );

    vm.autenticarUsuario = function(){
      $http({
         method: 'POST', 
         url: 'controllers/login.php', 
         data: {
            name: vm.name,
            password: vm.password,
            auth: 1           
        }
      }).
      success(function(data) {
         if(typeof(data) == 'object'){
            if(data['rol'] == 1){
              $location.url("/admin");
            }else{
              $location.url("/usuarios");
            }            
         }else{
            alert(data);
         }
      }).
      error(function() {
         alert('Error al intentar recuperar los clientes.');
      });
   };

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

   vm.enterProd = function(keyEvent) {
    if (keyEvent.which === 13)
      vm.cargarProductos();
  }

   vm.cargarProductos = function(){
      var tipoBusqueda = 0;
      var textoFallo = '';
      if($("#busqCodigo").is(':checked')) {  
             tipoBusqueda = 1; 
             textoFallo = 'Escriba el código para realizar la busqueda';
        } else {  
            if($("#busqNombre").is(':checked')) {  
             tipoBusqueda = 2; 
             textoFallo = 'Escriba la descripción para realizar la busqueda';
          }else{
            swal(
                'Error!',
                'Debe seleccionar un tipo de busqueda (código o descripción)!',
                'error'
              )
            return;
          }  
        }
        //alert(vm.texto);
      if(vm.texto == ''){
        swal(
            'Error!',
             textoFallo,
            'error'
          )
          return;
      }
 
      $http({
         method: 'POST', 
         url: 'controllers/productos.php',
         data: {
            auth: 2,
            tipo: tipoBusqueda,
            valor: vm.texto      
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