'use strict';

function SuscriptorCtrl(SuscriptorFactory, $uibModal, $state, $localStorage) {
///funcion de inicializacion del controlador,obtiene un listado de todos los suscriptores 
  this.$onInit = function () {
    SuscriptorFactory.getSuscriptorList().then(function (data) {
     
      vm.suscriptores = data.GetSuscriptorListResult;
    });
  }
///llama a otra vista con su controlador 
  function DetalleSuscriptor(object) {
    vm.animationsEnabled = true;
    var modalInstance = $uibModal.open({
      animation: vm.animationsEnabled,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'views/provision/ModalDetalleSuscriptor.html',
      controller: 'ModalDetalleSuscriptorCtrl',
      controllerAs: '$ctrl',
      backdrop: 'static',
      keyboard: false,
      size: 'md',
      resolve: {
        suscriptor: function () {
          return object;
        }
      }
    });
  }
///nos envia a suscriptoresEditar con un parametro espesifico
  function editarSuscriptor(item) {
    $state.go('home.provision.suscriptoresEditar', {
      params: {
        suscriptor: item
      }
    });
  }
///cambia variables y propiedades de elementos de la vista para el tipo de dato de busqueda 
  function cambiarBusqueda(id) {
    vm.tipoBusqueda = 0;
    if (id == 1) {
      if (vm.bsan == '') {
        vm.tipoBusqueda = 0;
      } else {
        vm.bnombre = '';
        vm.brefe = '';
        vm.tipoBusqueda = 1;
      }
    } else if (id == 2) {
      if ((vm.bnombre == ''||vm.bnombre ==undefined) &&( vm.bApellidos==''||vm.bApellidos==undefined)) {
        vm.tipoBusqueda = 0;
      } else {
        vm.bsan = '';
        vm.brefe = '';
        vm.tipoBusqueda = 2;
      }
    } else if (id == 3) {
      if ((vm.Calle == undefined || vm.Calle == '') &&
        (vm.Numero == undefined || vm.Numero == '') &&
        (vm.Colonia == undefined || vm.Colonia == '') &&
        (vm.Ciudad == undefined || vm.Ciudad == '')) {
        vm.tipoBusqueda = 0
      } else {
        vm.tipoBusqueda = 3;
      }


    } else if (id == 4) {
       if ((vm.bnombre == ''||vm.bnombre ==undefined) 
       &&( vm.bApellidos==''||vm.bApellidos==undefined)
       &&( vm.brefe==''|| vm.brefe==undefined)
       ) {
        vm.tipoBusqueda = 0;
      } else {
        vm.bsan = '';
        vm.tipoBusqueda = 4;
      }
    } else {
      vm.tipoBusqueda = 0;
    }
  }
///cambia los objetos de busqueda y depende de validaciones trae la lista con los filtros de busqueda aplicados 
  function buscar() {

    if (vm.tipoBusqueda == 1) {
      vm.busObj = {
        'IdSuscriptor': vm.bsan,
        'Nombre': '',
        'Apellido': '',
        'Telefono': '',
        'Email': '',
        'Calle': '',
        'Numero': '',
        'Colonia': '',
        'Ciudad': '',
        'Referencia': '',
        'Op': 1,
        'IdUsuario':$localStorage.currentUser.idUsuario
      };
    } else if (vm.tipoBusqueda == 2) {
      vm.busObj = {
        'IdSuscriptor': 0,
        'Nombre': vm.bnombre,
        'Apellido': vm.bApellidos,
        'Telefono': '',
        'Email': '',
        'Calle': '',
        'Numero': '',
        'Colonia': '',
        'Ciudad': '',
        'Referencia': '',
        'Op': 2,
        'IdUsuario':$localStorage.currentUser.idUsuario
      };

    } else if (vm.tipoBusqueda == 3) {
      vm.busObj = {
        'IdSuscriptor': 0,
        'Nombre': '',
        'Apellido': '',
        'Telefono': '',
        'Email': '',
        'Calle': (vm.Calle == undefined) ? '' : vm.Calle,
        'Numero': (vm.Numero == undefined) ? '' : vm.Numero,
        'Colonia': (vm.Colonia == undefined) ? '' : vm.Colonia,
        'Ciudad': (vm.Ciudad == undefined) ? '' : vm.Ciudad,
        'Referencia': '',
        'Op': 3,
        'IdUsuario':$localStorage.currentUser.idUsuario
      };
    } else if (vm.tipoBusqueda == 4) {

      vm.busObj = {
        'IdSuscriptor': 0,
        'Nombre': '',
        'Apellido': '',
        'Telefono': '',
        'Email': '',
        'Calle': '',
        'Numero': '',
        'Colonia': '',
        'Ciudad': '',
        'Referencia': vm.brefe,
        'Op': 4,
        'IdUsuario':$localStorage.currentUser.idUsuario
      };
    } else {
      vm.busObj = {
        'IdSuscriptor': 0,
        'Nombre': '',
        'Apellido': '',
        'Telefono': '',
        'Email': '',
        'Calle': '',
        'Numero': '',
        'Colonia': '',
        'Ciudad': '',
        'Referencia': '',
        'Op': 0,
        'IdUsuario':$localStorage.currentUser.idUsuario
      };
    }

   if (vm.tipoBusqueda == undefined || vm.tipoBusqueda == 0) {
      SuscriptorFactory.getSuscriptorList().then(function (data) {
        vm.suscriptores = data.GetSuscriptorListResult;
        $('.buscarSuscriptor').collapse('hide');
      });
    } else {
      SuscriptorFactory.buscarSuscriptor(vm.busObj).then(function (data) {
        vm.suscriptores = data.GetFilterSuscriptorListResult;
        $('.buscarSuscriptor').collapse('hide');
      });
    }
  }


  var vm = this;
  vm.DetalleSuscriptor = DetalleSuscriptor;
  vm.editarSuscriptor = editarSuscriptor;
  vm.cambiarBusqueda = cambiarBusqueda;
  vm.buscar = buscar;

}
angular.module('softvFrostApp').controller('SuscriptorCtrl', SuscriptorCtrl);
