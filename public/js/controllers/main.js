angular.module("app", ["ngRoute",'angularUtils.directives.dirPagination'])
.directive('fileModel', ['$parse', function ($parse) {
            return {
               restrict: 'A',
               link: function(scope, element, attrs) {
                  var model = $parse(attrs.fileModel);
                  var modelSetter = model.assign;
                  
                  element.bind('change', function(){
                     scope.$apply(function(){
                        modelSetter(scope, element[0].files[0]);
                     });
                  });
               }
            };
         }])
.service('fileUpload', ['$http', function ($http) {
            this.uploadFileToUrl = function(file, uploadUrl){
               var fd = new FormData();
               fd.append('file', file);
               var res;

               $http.post(uploadUrl, fd, {
                  transformRequest: angular.identity,
                  headers: {'Content-Type': undefined}
               })            
               .success(function(result){
                  console.log(result);
                  return true;
               })            
               .error(function(){
                  return false;
               });               
            }
         }])
    .config(function($routeProvider,$locationProvider){
      //$locationProvider.html5Mode(true);

        $routeProvider
            .when("/", {
                controller: "mainController",
                controllerAs: "vm",
                templateUrl: "web/inicio.html"
            })
            .when("/productos", {
                controller: "productosController",
                controllerAs: "vm",
                templateUrl: "web/productos.html"
            })
            .when("/ubicacion", {
                controller: "mainController",
                controllerAs: "vm",
                templateUrl: "web/ubicacion.html"
            })
            .when("/contactos", {
                controller: "mainController",
                controllerAs: "vm",
                templateUrl: "web/contactos.html"
            })
            .when("/login", {
                controller: "loginController",
                controllerAs: "vm",
                templateUrl: "clientes/login/index.html"
            })
            .when("/clientes", {
                controller: "clienteController",
                controllerAs: "vm",
                templateUrl: "web/clientes.html"
            })
            .when("/usuarios", {
                controller: "clienteController",
                controllerAs: "vm",
                templateUrl: "clientes/productos/index.html"
            })
            .when("/admin", {
                controller: "adminController",
                controllerAs: "vm",
                templateUrl: "admin/index.html"
            })
            .when("/categorias", {
                controller: "categoryController",
                controllerAs: "vm",
                templateUrl: "categorias"
            });
    })
    .factory("clientesFactory", function($http,$location){

        var interfaz = {
            getAuth: function(){
                $http({
                 method: 'POST', 
                 url: '../controllers/login.php',
                 data: {
                    auth: 0          
                }
              })
            .success(function(respuesta){
                    $location.url("/"+respuesta);
            }).
              error(function() {
                 return false;
              });
            }
        }

     return interfaz;                    
    })
    .controller('mainController', function($http,clientesFactory) {
        var vm = this;

        $("#ini").addClass( "current" );
        $("#prod").removeClass( "current" );
        $("#ubi").removeClass( "current" );
        $("#cont").removeClass( "current" );
        $("#cli").removeClass( "current" );
        $(document).ready(function(){
          $('.mp-slider')._TMS({
            show:0,
            pauseOnHover:false,
            prevBu:'.mp-prev',
            nextBu:'.mp-next',
            duration:1000,
            preset:'simpleFade',
            pagination:false,//'.pagination',true,'<ul></ul>'
            pagNums:false,
            slideshow:7000,
            numStatus:false,
            banners:'fade',// fromLeft, fromRight, fromTop, fromBottom
            waitBannerAnimation:false
          })    
       });

      vm.openPicture = function(image) {
        swal({
          imageUrl: '../public/images/'+image,
          text: 'Modal with a custom image.',
          imageWidth: 400,
          imageHeight: 200,
          showCloseButton: true,
          showConfirmButton: false
        })         
        }

       vm     
    });  
    