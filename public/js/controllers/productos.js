angular.module("app")
.controller('productosController', function() {
    //class="current"
    var vm = this;
    $("#prod").addClass( "current" );
    $("#ini").removeClass( "current" );
    $("#ubi").removeClass( "current" );
    $("#cont").removeClass( "current" );
    $("#cli").removeClass( "current" );
    vm.urlAdmin = 'web/repuestos.html'

    vm.cargarVista = function(vista){
	  if(vista == 1){
	  	  $("#rep").blur();
	      $("#rep").addClass("activo");
	      $("#hid").removeClass(" activo");
	      vm.urlAdmin = 'web/repuestos.html';
	  }else{
	  		$("#hid").blur();
	      $("#hid").addClass(" activo");
	      $("#rep").removeClass("activo");
	      vm.urlAdmin = 'web/hidraulica.html';
	  }
	}
});