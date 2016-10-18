angular.module("app")
.controller('clienteController', function($http,$location,clientesFactory) {
    var vm = this;
    vm.productos = [];

    clientesFactory.getAuth();    
    $("#cli").addClass( "current" );
    $("#ini").removeClass( "current" );
    $("#ubi").removeClass( "current" );
    $("#cont").removeClass( "current" );
    $("#prod").removeClass( "current" );

    vm.autenticarUsuario = function(){
      $http({
         method: 'POST', 
         url: '../controllers/login.php', 
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
              $location.url("/clientes");
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
         url: '../controllers/login.php', 
         data: {
            auth: 2           
        }
      }).
      success(function(data) {
         if(data){
            $location.url("/login");
         }else{
            alert(data);
         }
      }).
      error(function() {
         alert('Error al intentar recuperar los clientes.');
      });
   };

   vm.cargarProductos = function(){
      $http({
         method: 'POST', 
         url: '../controllers/productos.php',
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

});