angular.module("app")
.controller('adminController', function($http,$location,clientesFactory,fileUpload) {
   var vm = this;
   vm._id = null;
   vm.name = '';
   vm.password = '';
   vm.users = [];

    clientesFactory.getAuth();    

vm.uploadFile = function() {
    var file = vm.file;
     
     var uploadUrl = "../controllers/fileUpload.php";
     var resul = fileUpload.uploadFileToUrl(file, uploadUrl);
     alert(resul);
     if(resul){
        alert('El archivo se subio correctamente');
        vm.file = null;
     }
     
    }

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

   vm.pageChangeHandler = function(num) {
    console.log('going to page ' + num);
  };
  
   vm.cargarUsuarios = function(){
      $http({
         method: 'POST', 
         url: '../controllers/clientes.php',
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

   vm.guardarUsuario = function() {
      $http({
         method: 'POST',
         url: '../controllers/clientes.php',
         data: {
            name: vm.name,
            password: vm.password,
            _id: vm._id,
            auth : 2
         }
      }).
      success(function(data) {
         if(data == true){
            vm.limpiarDatos();
            vm.cargarUsuarios(); 
            $('#myModal').modal('toggle');
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
         url: '../controllers/clientes.php',
         data: {
            id: indice,
            auth : 3
         }
      }).
      success(function(data) {
         if(typeof(data) == 'object'){
            $('#myModal').modal();
            vm._id = data._id;
            vm.name = data.name;
            vm.password = data.password;
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
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then(function() {
         $http({
         method: 'POST',
         url: '/eliminar',
         data: {
            _id: indice
         }
      }).
      success(function(data) {
         if(data.error == false){
            swal(
                'Deleted!',
                'Your file has been deleted.',
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
      vm.username = '';
      vm.password = '';
   };

   vm.nuevoUsuario = function() {
      vm._id = null;
      swal.withFormAsync({
        title: 'Cool Swal-Forms example',
        text: 'Any text that you consider useful for the form',
        showCancelButton: true,
        confirmButtonColor: '#DD6B55',
        confirmButtonText: 'Get form data!',
        closeOnConfirm: true,
        formFields: [
          { id: 'name', placeholder: 'Name Field', required: true },
          { id: 'nickname', placeholder: 'Add a cool nickname' }
        ]
      }, function (isConfirm) {
        // do whatever you want with the form data
        console.log(this.swalForm) // { name: 'user name', nickname: 'what the user sends' }
      })
  }

});