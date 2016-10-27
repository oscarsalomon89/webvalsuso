angular.module("app")
.controller('contactosController', function() {
    //class="current"
    var vm = this;
    $("#cont").addClass( "current" );
    $("#ini").removeClass( "current" );
    $("#ubi").removeClass( "current" );
    $("#prod").removeClass( "current" );
    $("#cli").removeClass( "current" );

});