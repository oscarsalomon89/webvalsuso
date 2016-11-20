angular.module("app")
.controller('contactosController', function($http) {
    //class="current"
    var vm = this;
    $("#cont").addClass( "current" );
    $("#ini").removeClass( "current" );
    $("#ubi").removeClass( "current" );
    $("#prod").removeClass( "current" );
    $("#cli").removeClass( "current" );
    $("#serv").removeClass( "current" );

    vm.enviarCorreo = function(){
      $http({
         method: 'POST', 
         url: 'controllers/envioCorreo.php', 
         data: {
            name: vm.nombre,
            remitente: vm.mail,
            mensaje: vm.mensaje          
        }
      }).
      success(function(data) {
         if(data){
               alert('envio correcto');
               vm.nombre = '';
               vm.mail = '';
               vm.mensaje = '';
         }else{
            alert(data);
         }
      }).
      error(function() {
         alert('Error al intentar recuperar los clientes.');
      });
   };
});