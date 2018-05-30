angular.module("app")
.controller('clienteController', function($http,$location,clientesFactory) {
    var vm = this;
    vm.productos = [];
    vm.pageSize = 10;
    vm.texto = '';
    vm.ordenamiento = '';
    vm.recordar = true;

    clientesFactory.getAuth();    
    $("#cli").addClass( "current" );
    $("#ini").removeClass( "current" );
    $("#ubi").removeClass( "current" );
    $("#cont").removeClass( "current" );
    $("#prod").removeClass( "current" );
    $("#serv").removeClass( "current" );

    $("#navbar").removeClass( "in" );

    vm.imprimirCatalogo = function(){    
      swal({
        title: 'Detalle de catálogo',
        input: 'select',
        inputOptions: {
          '1': 'Solo productos con imagenes',
          '2': 'Todos los productos'
        },
        inputPlaceholder: 'Seleccionar',
        showCancelButton: true,
        inputValidator: function (value) {
          return new Promise(function (resolve, reject) {
            if (value !== '') {
              resolve();
            } else {
              reject('Debe seleccionar un tipo de catalogo');
            }
          });
        }
      }).then(function (result) {
          swal.close();
          var form = document.createElement("form");
          form.setAttribute("method", "post");
          form.setAttribute("action", 'views/catalogo/index.php');
          form.setAttribute("target", 'catalogo');

          var input = document.createElement('input');
          input.type = 'hidden';
          input.name = 'tipo';
          input.value = result;
          form.appendChild(input);
          document.body.appendChild(form);

          window.open("views/catalogo/", 'catalogo');            
          form.submit();
          document.body.removeChild(form);

          //window.open('views/catalogo/index.php?tipo='+result);
      }); 
   };

    vm.descargarLista = function() {
        $http({
         method: 'POST', 
         url: 'controllers/lista.php'
      }).
      success(function(data) {
         if(data != ''){
            document.location = 'controllers/files/'+data;
         }else{
            swal(
                  'Error!',
                   'Archivo no disponible.',
                  'error'
                );
         }         
      }).
      error(function() {
         alert('Error al intentar descargar la lista.');
      });
    }

    vm.enterLogin = function(keyEvent) {
      if (keyEvent.which === 13)
        vm.autenticarUsuario();
    }

    vm.autenticarUsuario = function(){
      $http({
         method: 'POST', 
         url: 'controllers/login.php', 
         data: {
            name: vm.name,
            password: vm.password,
            recordar: vm.recordar,
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
            swal(
                  'Error en los datos!',
                   data,
                  'error'
                );
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
      var cualquierParte = 0;
      var textoFallo = '';
      var tipoOrden = '';

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

        if(vm.ordenamiento != ''){
          tipoOrden = 'ASC'; 

          if($("#criterioDes").is(':checked')) {
            tipoOrden = 'DESC'; 
          }
        }
        
      if(vm.texto == ''){
        swal(
            'Error!',
             textoFallo,
            'error'
          )
          return;
      }
 
      if( $('#cualqParte').is(':checked') ) {
          cualquierParte = 1;
      }

      $http({
         method: 'POST', 
         url: 'controllers/productos.php',
         data: {
            auth: 2,
            tipo: tipoBusqueda,
            parte: cualquierParte,
            valor: vm.texto,
            campoOrden: vm.ordenamiento,
            tipoOrden: tipoOrden     
        }
      }).
      success(function(data) {
         if(typeof(data) == 'object'){
            vm.productos = data;
         }else{            
            alert('Error en la busqueda.');
         }
      }).
      error(function() {
         alert('Error en la busqueda.');
      });
   };

   vm.abrirImagen = function(cod,desc,codOriginal){ 
    swal({
        title: 'Cargando...',
        imageUrl: '',
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
          title: '<b style="font-size:14px;">'+codOriginal+' - '+desc+'</b>',
          text: '<i style="font-size:12px;">Imagen a modo ilustrativo</i>',
          imageUrl: 'public/images/productos/'+cod+'/'+data,
          imageWidth: 300,
          imageHeight: 150,
          animation: false,
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
      }).done();  
  }

});