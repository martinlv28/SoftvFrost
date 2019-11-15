'use strict';
angular.module('softvFrostApp').controller('TerminalCtrl', TerminalCtrl);

function TerminalCtrl(terminalFactory, $uibModal, $state, SuscriptorFactory, mapaBeamFactory, nuevoSuscriptorFactory, $stateParams) {
  ///funcion de inicializacion del controlador, obtiene las terminales, los servicios y la lista de beam
  this.$onInit = function () {
    if ($stateParams.idSuscriptor != undefined) {
      vm.idSuscriptor = $stateParams.idSuscriptor;

      SuscriptorFactory.getTerminals($stateParams.idSuscriptor).then(function (data) {
        vm.terminales = data.GetDeepIdSuscriptorResult;
        mapaBeamFactory.GetBeamList().then(function (result) {

          vm.Beams = result.GetBeamListResult;
          terminalFactory.getServicioList().then(function (data) {
            data.GetServicioListResult.unshift({
              'Nombre': 'Todos los Servicios',
              'IdServicio': 0
            });
            vm.servicios = data.GetServicioListResult;
            vm.bservicio = vm.servicios[0];
          });
        });
      });
    } else {

      terminalFactory.getTerminalList().then(function (data) {
        vm.terminales = data.GetTerminalListResult;
        mapaBeamFactory.GetBeamList().then(function (result) {

          vm.Beams = result.GetBeamListResult;
          terminalFactory.getServicioList().then(function (data) {
            data.GetServicioListResult.unshift({
              'Nombre': 'Todos los Servicios',
              'IdServicio': 0
            });
            vm.servicios = data.GetServicioListResult;
            vm.bservicio = vm.servicios[0];
          });
        });
      });
    }

  }
///manda a otra vista ModalGestionTerminal.html
  function GestionTerminal(object) {
    var modalInstance = $uibModal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'views/provision/ModalGestionTerminal.html',
      controller: 'ModalGestionTerminalCtrl',
      controllerAs: 'ctrl',
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
      resolve: {
        terminal: function () {
          return object;
        }
      }
    });

  }
///nos manda al estado indicado 
  function EditarTerminal(obj) {
    $state.go('home.provision.terminalesEdita', {
      'Id': obj.SAN
    });
  }
///cambia valores para el filtro de busqueda 
  function busquedaCambio(x) {
    vm.tipoBusqueda = 0;
    if (x == 1) {
      if (vm.bsan == '') {
        vm.tipoBusqueda = 0;
      } else {
        vm.tipoBusqueda = 1;
        vm.bsus = '';
        vm.bservicio = vm.servicios[0];
      }
    } else if (x == 2) {
      if (vm.bsus == '') {
        vm.tipoBusqueda = 0;
      } else {
        vm.tipoBusqueda = 2;
        vm.bsan = '';
        vm.bservicio = vm.servicios[0];
      }
    } else if (x == 3) {
      if (vm.servicios.IdServicio == 0) {
        vm.tipoBusqueda = 0;
      } else {
        vm.tipoBusqueda = 3;
        vm.bsan = '';
        vm.bsus = '';
      }

    } else if (x == 4) {
      vm.tipoBusqueda = 4;
      vm.bsan = '';
      vm.bsus = '';
    } else if (x == 5) {
      vm.tipoBusqueda = 5;
      vm.bsan = '';
      vm.bsus = '';
    } else if (x == 6) {
      vm.tipoBusqueda = 6;
      vm.bsan = '';
      vm.bsus = '';
    } else if (x == 7) {
      vm.tipoBusqueda = 7;
      vm.bsan = '';
      vm.bsus = '';
    } else if (x == 8) {
      vm.tipoBusqueda = 8;
      vm.bsan = '';
      vm.bsus = '';

    } else {

    }
  }
///revisa el tipo de busqueda y depende de su estdo trae la lista de datos con los filtros aplicados 
  function buscar() {
    if (vm.tipoBusqueda == 1) {
      vm.obj = {
        san: vm.bsan,
        suscriptor: '',
        estatus: '',
        servicio: 0,
        IdBeam: 0,
        ESN: '',
        satelite: '',
        op: 1
      };
    } else if (vm.tipoBusqueda == 2) {
      vm.obj = {
        san: 0,
        suscriptor: vm.bsus,
        estatus: '',
        servicio: 0,
        IdBeam: 0,
        ESN: '',
        satelite: '',
        op: 3
      };
    } else if (vm.tipoBusqueda == 3) {
      vm.obj = {
        san: 0,
        suscriptor: '',
        estatus: '',
        servicio: vm.bservicio.IdServicio,
        IdBeam: 0,
        ESN: '',
        satelite: '',
        op: 4
      };
    } else if (vm.tipoBusqueda == 4) {
      vm.obj = {
        san: 0,
        suscriptor: '',
        estatus: vm.Status.clave,
        servicio: 0,
        IdBeam: 0,
        ESN: '',
        satelite: '',
        op: 2
      };
    } else if (vm.tipoBusqueda == 5) {
      vm.obj = {
        san: 0,
        suscriptor: '',
        estatus: '',
        servicio: 0,
        IdBeam: vm.beam.BeamId,
        ESN: '',
        satelite: '',
        op: 5
      };
    } else if (vm.tipoBusqueda == 6) {
      vm.obj = {
        san: 0,
        suscriptor: '',
        estatus: '',
        servicio: 0,
        ESN: vm.esn,
        IdBeam: 0,
        satelite: '',
        op: 6
      };
    } else if (vm.tipoBusqueda == 7) {
      vm.obj = {
        san: 0,
        suscriptor: '',
        estatus: '',
        servicio: 0,
        ESN: '',
        IdBeam: 0,
        satelite: vm.bsatelite,
        op: 7
      };
    } else if (vm.tipoBusqueda == 8) {
      vm.obj = {
        san: 0,
        suscriptor: vm.BReferencia,
        estatus: '',
        servicio: 0,
        ESN: '',
        IdBeam: 0,
        satelite: '',
        op: 8
      };
    } else {

    }
    if (vm.tipoBusqueda == 0 || vm.tipoBusqueda == undefined) {
      terminalFactory.getTerminalList().then(function (data) {
        vm.terminales = data.GetTerminalListResult;
      });
    } else {
      terminalFactory.buscarTerminal(vm.obj).then(function (data) {
        vm.terminales = data.GetFilterTerminalListResult;
      });
    }
  }
///manda a otra ventana MovimientosTerminales.html
  function verMovimientos(item) {
    var modalInstance = $uibModal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'views/provision/MovimientosTerminales.html',
      controller: 'TerminalMovimientosCtrl',
      controllerAs: 'ctrl',
      backdrop: 'static',
      keyboard: false,
      size: 'md',
      resolve: {
        terminal: function () {
          return item;
        }
      }
    });
  }
///manda a otra ventana ModalHistoricosTerminales.html
  function verHistoricos(item) {
    var modalInstance = $uibModal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'views/provision/ModalHistoricosTerminales.html',
      controller: 'ModalHistoricosTerminalCtrl',
      controllerAs: 'ctrl',
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
      resolve: {
        terminal: function () {
          return item;
        }
      }
    });
  }

  var vm = this;
  vm.GestionTerminal = GestionTerminal;
  vm.EditarTerminal = EditarTerminal;
  vm.titulo = "Terminales";
  vm.busquedaCambio = busquedaCambio;
  vm.buscar = buscar;
  vm.verMovimientos = verMovimientos;
  vm.verHistoricos = verHistoricos;
  vm.idSuscriptor = 0;
  vm.ListaStatus = [{
    'clave': '',
    'Nombre': 'Todos los estatus'
  },
  {
    'clave': 'Pendiente',
    'Nombre': 'Pendiente'
  },
  {
    'clave': 'Activa',
    'Nombre': 'Activa'
  },
  {
    'clave': 'Suspendida',
    'Nombre': 'Suspendida'
  },
  {
    'clave': 'Cancelada',
    'Nombre': 'Cancelada'
  },
  {
    'clave': 'Incompleta',
    'Nombre': 'Incompleta'
  }
  ];
}
