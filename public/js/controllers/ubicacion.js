angular.module("app")
.controller('ubicacionController', function() {
    //class="current"
    var vm = this;
    $("#ubi").addClass( "current" );
    $("#ini").removeClass( "current" );
    $("#serv").removeClass( "current" );
    $("#cont").removeClass( "current" );
    $("#cli").removeClass( "current" );
    $("#prod").removeClass( "current" );
});