'use strict';
angular
  .module('softvFrostApp')
  .controller('ModalAvancesCtrl', function ($uibModalInstance, $uibModal, $rootScope, $sce, quejasFactory, ngNotify, $localStorage, $state, options, globalService) {
///funcion de inicializacion del controlador, obtiene los avances de quejas 
    function initialData() {
      console.log(options);
      quejasFactory.ObtieneAvancesQueja(options.ClvOrden).then(function (data) {
        vm.lista = data.GetDeepObtieneAvancesQuejaResult;
      });
    }
///obtiene los archivos de avance de queja 
    function GetFileAvanceQueja(x) {
      console.log(x);
      if (x.TipoArchivo === 'Imagen') {
        vm.showimg = true;
        vm.showpdf = false;
        quejasFactory.GetFileAvanceQueja(x.Clv_Avance, x.TipoArchivo).then(function (data) {
          vm.Imagesrc = globalService.getUrlReportes() + '/Reportes/' + data.GetFileAvanceQuejaResult.Observaciones;
        });
      } else {
        vm.showimg = false;
        vm.showpdf = true;
        quejasFactory.GetFileAvanceQueja(x.Clv_Avance, x.TipoArchivo).then(function (data) {
          vm.Pdfsrc = $sce.trustAsResourceUrl(globalService.getUrlReportes() + '/Reportes/' + data.GetFileAvanceQuejaResult.Observaciones);
        });
      }

    }
///Se puede usar para descartar un modal
    function ok() {
      $uibModalInstance.dismiss('cancel');
    }
///Se puede usar para descartar un modal
    function cancel() {
      $uibModalInstance.dismiss('cancel');
    }
///verifica que el archivo este correcto y si asi es lo actualiza 
    function ValidaArchivo() {
      var files = $('#file').get(0).files;
      if (files.length === 0) {
        ngNotify.set('Se necesita seleccionar un archivo válido', 'error');
        return;
      } else if (vm.descripcion == null || vm.descripcion == undefined) {
        ngNotify.set('Se necesita especificar el avance', 'error');
        return;
      } else {



        quejasFactory.UploadFile(files, vm.descripcion, options.ClvOrden).then(function (data) {
          ngNotify.set('El archivo se guardo correctamente', 'success');
          quejasFactory.ObtieneAvancesQueja(options.ClvOrden).then(function (data) {
            vm.lista = data.GetDeepObtieneAvancesQuejaResult;
          });
        })
      }

    }

    var vm = this;
    vm.cancel = cancel;
    vm.ok = ok;
    vm.ValidaArchivo = ValidaArchivo;
    vm.GetFileAvanceQueja = GetFileAvanceQueja;
    vm.showimg = true;
    vm.showpdf = false;
    initialData();
  });
