angular.module("app")
.controller('productosController', function() {
    //class="current"
    var vm = this;
    $("#prod").addClass( "current" );
    $("#ini").removeClass( "current" );
    $("#ubi").removeClass( "current" );
    $("#cont").removeClass( "current" );
    $("#cli").removeClass( "current" );
    $("#serv").removeClass( "current" );

    $("#navbar").removeClass( "in" );
    
    vm.urlAdmin = 'views/web/repuestos.html'

    vm.cargarVista = function(vista){
	  if(vista == 1){
	  	  $("#rep").blur();
	      $("#rep").addClass("activo");
	      $("#hid").removeClass(" activo");
	      vm.urlAdmin = 'views/web/repuestos.html';
	  }else{
	  		$("#hid").blur();
	      $("#hid").addClass(" activo");
	      $("#rep").removeClass("activo");
	      vm.urlAdmin = 'views/web/hidraulica.html';
	  }
	}

	vm.abrirImagenProductos = function(img){
		swal({
            text: img,
            imageUrl: 'public/images/productos/'+img+'.jpg',
            imageWidth: 400,
            imageHeight: 400,
            animation: false,
            showCloseButton: true,
            showConfirmButton: false
          })
	}
});