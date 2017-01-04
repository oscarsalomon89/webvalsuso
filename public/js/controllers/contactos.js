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

    vm.nombre == '';
    vm.mensaje == '';
    vm.mail == '';
    
    vm.enviarCorreo = function(){
      if(vm.nombre == '' || vm.mail == '' || vm.mensaje == '' ||
         vm.nombre == null || vm.mail == null || vm.mensaje == null){
        swal(
              'Datos incompletos!',
              'Faltan completar datos',
              'warning'
            );
        return;
      }

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
               swal(
                'Exito!',
                data,
                'success'
              );
               vm.nombre = '';
               vm.mail = '';
               vm.mensaje = '';
         }else{
            alert(data);
         }
      }).
      error(function() {
         alert('Error');
      });
   };
});