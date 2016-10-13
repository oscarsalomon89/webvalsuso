angular.module("app")
.controller('clienteController', function($http,$location,clientesFactory) {
    var vm = this;
    clientesFactory.getAuth();    

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

});