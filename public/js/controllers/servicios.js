angular.module("app")
.controller('serviciosController', function() {
    //class="current"
    var vm = this;
    $("#serv").addClass( "current" );
    $("#ini").removeClass( "current" );
    $("#ubi").removeClass( "current" );
    $("#cont").removeClass( "current" );
    $("#cli").removeClass( "current" );
    $("#prod").removeClass( "current" );
});