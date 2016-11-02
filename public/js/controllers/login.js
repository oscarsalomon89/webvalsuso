angular.module("app")
.controller('loginController', function($http,$location,clientesFactory) {
    var vm = this;
    clientesFactory.getAuth();
    
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
              //window.open("http://localhost/webvalsuso/views/admin", "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=400,height=400");
              $location.url("/usuarios");//admin
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
});