'use strict';
angular
  .module('softvFrostApp')
  .controller('AtencionNuevaCtrl', function ($uibModal, atencionFactory, ngNotify, $rootScope, $state, $stateParams, $filter) {
    ///funcion de inicializacion del controlador, llama a la funcion del serviciosNuevo de atencionFactory
    ///asignacion de valores y llama a otras dos funciones 
    function initialData() {

      atencionFactory.serviciosNuevo().then(function (data) {
        vm.servicios = data.GetMuestraTipSerPrincipal2ListResult;
        vm.selectedServicio = vm.servicios[0];
        MuestraTrabajos(vm.selectedServicio.Clv_TipSerPrincipal);
        GetClasificacionProblemas();
      });
    }
///llama a la funcion del GetClasificacionProblemas de atencionFactory que obtiene la clasificacion de los problemas 
    function GetClasificacionProblemas() {
      atencionFactory.GetClasificacionProblemas().then(function (data) {
        vm.clasificacionProblemas = data.GetuspConsultaTblClasificacionProblemasListResult;
      });
    }
///llama a la funcion del getclasificacionQuejas de atencionFactory que obtiene la clasificacion de las quejas 
    function GetclasificacionQuejas() {
      atencionFactory.getclasificacionQuejas().then(function (data) {
        vm.Departamentos = data.GetMUESTRACLASIFICACIONQUEJASListResult;
      });
    }
///llama a la funcion del GetprioridadQueja de atencionFactory que obtiene la prioridad de las quejas  

    function GetprioridadQueja() {
      atencionFactory.GetprioridadQueja().then(function (data) {
        vm.Prioridades = data.GetSoftv_GetPrioridadQuejaListResult;
      });
    }
///llama a la funcion del MuestraTrabajos de atencionFactory que obtiene los trabajos
    function MuestraTrabajos(tipo) {
      atencionFactory.MuestraTrabajos(tipo).then(function (data) {
        vm.Trabajos = data.GetMUESTRATRABAJOSQUEJASListResult;
      });
    }
///llama a la funciones Limpia informacion y MuestraTrabajos 
    function CambioServicio(servicio) {
      LimpiaInformacion();
      MuestraTrabajos(servicio.Clv_TipSerPrincipal);
    }
///verifica si se puede obtener la informacion de pago del cliente , si puede llama a la vista modalTickets.html
    function abrirPagos() {
      if (vm.GlobalContrato == null) {
        ngNotify.set('Establezca el contrato del cliente para obtener la información', 'error');
        return;
      }
      var modalInstance = $uibModal.open({
        animation: vm.animationsEnabled,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'views/procesos/modalTickets.html',
        controller: 'ModalTicketsCtrl',
        controllerAs: 'ctrl',
        backdrop: 'static',
        keyboard: false,
        size: 'lg',
        resolve: {
          contrato: function () {
            return vm.GlobalContrato;
          }
        }
      });
    }

///verifica si se puede obtener la informacion de detalle del cobro del cliente , si puede llama a la vista ModalDetalleCobro.html
    function abrirDetalleCobro() {
      if (vm.GlobalContrato == null) {
        ngNotify.set('Establezca el contrato del cliente para obtener la información', 'error');
        return;
      }
      var modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'views/procesos/ModalDetalleCobro.html',
        controller: 'ModalDetalleCobroCtrl',
        controllerAs: 'ctrl',
        backdrop: 'static',
        keyboard: false,
        size: "lg",
        resolve: {
          contrato: function () {
            return vm.GlobalContrato;
          }
        }
      });
    }
///hace asignaciones de valores y despues llama a la vista ModalAgenda.html
    function abrirAgenda() {
      var options = {};
      options.Contrato = vm.GlobalContrato;
      options.CLV_TIPSER = vm.selectedServicio.Clv_TipSerPrincipal;
      options.Descripcion = vm.DescripcionProblema;
      options.Solucion = vm.DescripcionSolucion;
      options.Clv_Trabajo = (vm.Trabajo == undefined || vm.Trabajo == null) ? 0 : vm.Trabajo.CLV_TRABAJO;
      options.clvPrioridadQueja = vm.Prioridad.clvPrioridadQueja;
      options.clv_llamada = vm.NumeroLlamada;
      options.clvProblema = (vm.Problema == undefined || vm.Problema == null) ? 0 : vm.Problema.clvProblema;
      options.clv_queja = 0;
      var modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'views/procesos/ModalAgenda.html',
        controller: 'ModalAgendaCtrl',
        controllerAs: 'ctrl',
        backdrop: 'static',
        keyboard: false,
        size: "sm",
        resolve: {
          options: function () {
            return options;
          }
        }
      });
    }
///llama a otra vista: ModalBuscaCliente.html
    function ModalClientes() {
      var options = {};
      options.CLV_TIPSER = vm.selectedServicio.Clv_TipSerPrincipal;
      var modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'views/procesos/ModalBuscaCliente.html',
        controller: 'ModalBuscaClienteCtrl',
        controllerAs: 'ctrl',
        backdrop: 'static',
        keyboard: false,
        size: "lg",
        resolve: {
          options: function () {
            return options;
          }
        }
      });
    }

///en base a una validacion llama a una funcion o a otra funcion 
    function abrirBusquedaCliente() {
      if (vm.GlobalContrato != null) {
        PreguntaAtencion(2);
      } else {
        ModalClientes();
      }
    }
///llama a otra vista: ModalPreguntaAtencion.html
    function PreguntaAtencion(opcion) {
      var detalle = {};
      detalle.Modulo = 'Atencion';
      detalle.Clv = vm.NumeroLlamada;
      detalle.Op = opcion;
      var modalInstance = $uibModal.open({
        animation: vm.animationsEnabled,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'views/procesos/ModalPreguntaAtencion.html',
        controller: 'ModalPreguntaAtencionCtrl',
        controllerAs: '$ctrl',
        backdrop: 'static',
        keyboard: false,
        size: 'md',
        resolve: {
          detalle: function () {
            return detalle;;
          }
        }
      });
    }
///llama a la vista: ModalStatusCliente.html
    function muestraModalStatus(status) {
      var modalInstance = $uibModal.open({
        animation: vm.animationsEnabled,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'views/procesos/ModalStatusCliente.html',
        controller: 'ModalStatusClienteCtrl',
        controllerAs: 'ctrl',
        backdrop: 'static',
        keyboard: false,
        size: 'sm',
        resolve: {
          status: function () {
            return status;
          }
        }
      });

    }

///verifica si el contrato no es nulo, si no lo es llama a la vista modalReportes.html
    function openHistorial() {
      if (vm.GlobalContrato == null) {
        ngNotify.set('Establezca el contrato del cliente para obtener la información', 'error');
        return;
      }
      var modalInstance = $uibModal.open({
        animation: vm.animationsEnabled,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'views/procesos/modalReportes.html',
        controller: 'ModalReportesCtrl',
        controllerAs: 'ctrl',
        backdrop: 'static',
        keyboard: false,
        size: 'lg',
        resolve: {
          contrato: function () {
            return vm.GlobalContrato;;
          }
        }
      });
    }

///deja en blanco los campos de la paguina 
    function LimpiaInformacion() {
      vm.NombreCliente = '';
      vm.Calle = '';
      vm.Numero = '';
      vm.Colonia = '';
      vm.Ciudad = '';
      vm.Telefono = '';
      vm.GlobalContrato = null;
      vm.ServiciosCliente = '';
      vm.MuestraMensajeQueja = false;
      vm.GlobalContrato = null;
      vm.NombreCliente = 'No especificado';
      vm.DireccionCliente = 'No especificado';
      vm.ServiciosCliente = '';
      vm.PanelCaptura = false;
      vm.NumeroLlamada = '';
      vm.DescripcionProblema = '';
      vm.DescripcionSolucion = '';
      vm.Hora = $filter('date')(new Date(), 'HH:mm:ss');
    }

///varifica si se puede añadir una llamada, llama a varias funciones contenidas en atencionFactory
    function AddLLamadasdeInternet(showDetails) {
      var atencion = (vm.tipoAtencion == 'S') ? 'S' : 'T';
      var trabajo = (vm.Trabajo == undefined) ? 0 : vm.Trabajo.CLV_TRABAJO;
      var solucion = (vm.DescripcionSolucion == undefined) ? '' : vm.DescripcionSolucion;
      var parametros = {
        'Contrato': vm.GlobalContrato,
        'Descripcion': vm.DescripcionProblema,
        'Solucion': solucion,
        'Clv_trabajo': trabajo,
        'clv_queja': 0,
        'CLV_TIPSER': vm.selectedServicio.Clv_TipSerPrincipal,
        'TipoAtencion': atencion,
        'ClvProblema': vm.Problema.clvProblema
      }

      atencionFactory.AddLLamadasdeInternet(parametros).then(function (data) {
        vm.NumeroLlamada = data.AddLLamadasdeInternetResult;
        if (showDetails == true) {
          $state.go('home.procesos.atencion');
          ngNotify.set('Se ha guardado la llamada, número de atención telefónica #' + vm.NumeroLlamada, {
            position: 'bottom',
            sticky: true
          });
        }
      });
    }

    $rootScope.$on('cliente_seleccionado', function (e, detalle) {

      var contrato = detalle.ContratoBueno;
      vm.GlobalContrato = contrato;
      vm.contrato = detalle.CONTRATO;
      vm.contratoSelected = detalle.CONTRATO;
      vm.NombreCliente = detalle.Nombre + detalle.Apellido_Paterno + " " + detalle.Apellido_Materno;
      vm.Calle = detalle.CALLE;
      vm.Numero = detalle.NUMERO;
      vm.Colonia = detalle.COLONIA;
      vm.Ciudad = detalle.CIUDAD;
      atencionFactory.GetBuscaSiTieneQueja(vm.selectedServicio.Clv_TipSerPrincipal, vm.GlobalContrato).then(function (result) {
        if (result.GetBuscaSiTieneQuejaResult.Res == 1) {
          vm.MuestraMensajeQueja = true;
          vm.MensajeQueja = result.GetBuscaSiTieneQuejaResult.Msg;
        } else {
          vm.MuestraMensajeQueja = false;
        }
      });
      atencionFactory.GetConAtenTelCte(vm.GlobalContrato).then(function (data) {
        vm.Telefono = data.GetConAtenTelCteResult.Telefono;
      });
      //vm.DireccionCliente = "Calle:" + detalle.CALLE + " #" + detalle.NUMERO + " Colonia: " + detalle.COLONIA + " Ciudad:" + detalle.CIUDAD;
      atencionFactory.getServiciosCliente(contrato).then(function (data) {
        vm.ServiciosCliente = data.GetDameSerDelCliFacListResult;
        atencionFactory.GetuspContratoServQueja(vm.GlobalContrato, vm.selectedServicio.Clv_TipSerPrincipal).then(function (data_ser) {
          if (data_ser.GetuspContratoServQuejaResult.status !== 'N') {
            muestraModalStatus(data_ser.GetuspContratoServQuejaResult.status);
          }

        })
      });
      vm.tipoAtencion = 'T';
      vm.Problema = vm.Problema[0];
      vm.DescripcionProblema = "";
      vm.Trabajo = vm.Trabajo[0];
      vm.DescripcionSolucion = "";
    })
///cambia el valor de una variable y asigna un mensaje 
    function MuestraMensajeQueja() {
      vm.MuestraMensajeQueja = true;
      vm.MensajeQueja = "El cliente cuenta con un Reporte pendiente"
    }
///verifica si se coloco un contrato valido, y obtiene la informacion del contrato 
    function DetalleContrato() {


      if (vm.contratoSelected == null || vm.contratoSelected == '' || !(/^\d{1,9}-\d{1,9}$/.test(vm.contratoSelected))) {
        ngNotify.set('Coloque un contrato válido ej. 15-1', 'error');
        return;
      }
      var res = vm.contratoSelected.split("-");
      if (res.length == 1) {
        ngNotify.set('Coloque un contrato válido ej. 15-1', 'error');
        return;
      }
      LimpiaInformacion();
      var param = {};
      param.contrato = vm.contratoSelected;
      param.servicio = vm.selectedServicio.Clv_TipSerPrincipal;
      param.op = 0;
      atencionFactory.buscarCliente(param).then(function (data) {

        if (data.GetuspBuscaContratoSeparado2ListResult.length === 0) {
          ngNotify.set('El cliente no tiene contratado el servicio, seleccione otro tipo por favor.', 'error');

          return;
        }


        var detalle = data.GetuspBuscaContratoSeparado2ListResult[0];
        var contrato = detalle.ContratoBueno;
        vm.GlobalContrato = contrato;
        atencionFactory.ValidaContrato(vm.GlobalContrato, vm.selectedServicio.Clv_TipSerPrincipal).then(function (data) {

          if (data.GetuspContratoServListResult[0].Pasa === true) {
            vm.NombreCliente = detalle.Nombre + detalle.Apellido_Paterno + " " + detalle.Apellido_Materno;
            vm.Calle = detalle.CALLE;
            vm.Numero = detalle.NUMERO;
            vm.Colonia = detalle.COLONIA;
            vm.Ciudad = detalle.CIUDAD;
            atencionFactory.GetBuscaSiTieneQueja(vm.selectedServicio.Clv_TipSerPrincipal, vm.GlobalContrato).then(function (result) {
              if (result.GetBuscaSiTieneQuejaResult.Res == 1) {
                vm.MuestraMensajeQueja = true;
                vm.MensajeQueja = result.GetBuscaSiTieneQuejaResult.Msg;
              } else {
                vm.MuestraMensajeQueja = false;
              }

              atencionFactory.getServiciosCliente(contrato).then(function (data) {
                vm.ServiciosCliente = data.GetDameSerDelCliFacListResult;
                atencionFactory.GetConAtenTelCte(vm.GlobalContrato).then(function (data) {
                  vm.Telefono = data.GetConAtenTelCteResult.Telefono;

                  atencionFactory.GetuspContratoServQueja(vm.GlobalContrato, vm.selectedServicio.Clv_TipSerPrincipal).then(function (data_ser) {
                    if (data_ser.GetuspContratoServQuejaResult.status !== 'N') {
                      muestraModalStatus(data_ser.GetuspContratoServQuejaResult.status);
                    }

                  });
                });

              });
            });



          } else {

            LimpiaInformacion();
            ngNotify.set('El cliente no tiene contratado el servicio, seleccione otro tipo por favor.', 'error');
          }
        });






      });

    }
///detecta la precencia de un enter y hace validaciones para la accion del enter 
    function EnterContrato(event) {
      if (event.keyCode == 13) {
        if (vm.selectedServicio == null) {
          ngNotify.set('Seleccione el servicio que tiene el cliente', 'error');
          return;
        }
        if (vm.GlobalContrato != null) {
          PreguntaAtencion(1);
        } else {
          DetalleContrato();
        }
      }
    }

    $rootScope.$on('generarAtencion', function () {
      GuardarLlamada();
    });

    $rootScope.$on('verDetalle', function () {
      DetalleContrato();
    });


    $rootScope.$on('verContratos', function () {
      LimpiaInformacion();
      ModalClientes();

    });



///hace validaciones depende de ellas lanza una notificacion, despues llama a la funcion AddLLamadasdeInternet
    function GuardarLlamada() {
      if (vm.GlobalContrato == null) {
        ngNotify.set('Establezca el contrato del cliente para generar un reporte.', 'error');
        return;
      }
      if (vm.DescripcionProblema == null || vm.DescripcionProblema == '') {
        ngNotify.set('Redacte la descripción del problema', 'error');
        return;
      }
      if (vm.Problema == null) {
        ngNotify.set('Seleccione la clasificación del problema', 'error');
        return;
      }

      AddLLamadasdeInternet(true);
    }
///hace validaciones depende de ellas lanza una notificacion, despues hace asignaciones y despues llama a varias funciones 
    function generaReporte() {

      if (vm.GlobalContrato === null) {
        ngNotify.set('Establezca el contrato del cliente para generar un reporte .', 'error');
        return;
      }
      if (vm.DescripcionProblema === null || vm.DescripcionProblema === '') {
        ngNotify.set('Redacte la descripción del problema', 'error');
        return;
      }
      if (vm.Problema == null) {
        ngNotify.set('Seleccione la clasificación del problema', 'error');
        return;
      }
      vm.BloquearElementos = true;
      vm.MostrarGuardar = false;
      vm.PanelCaptura = true;
      GetclasificacionQuejas();
      GetprioridadQueja();
      AddLLamadasdeInternet(false);

    }
///llama a la funcion ConsultaLLamada contenida en atencionFactory 
    function DetalleLlamada(llamada) {

      atencionFactory.ConsultaLLamada(llamada).then(function (data) {

      });
    }
///llama a la funcion ValidaOrdenQuejas contenida en atencionFactory 
    function ValidaOrdenQuejas() {
      atencionFactory.ValidaOrdenQuejas(vm.GlobalContrato, vm.selectedServicio.Clv_TipSerPrincipal)
        .then(function (data) {

          if (data.GetDeepVALIDAOrdenQuejaResult.Msg == null) {
            abrirAgenda();
          } else {
            ngNotify.set(data.GetDeepVALIDAOrdenQuejaResult.Msg, 'error');
          }
        });
    }
///lanza un mensaje
    function CancelaReporte() {
      $state.go('home.procesos.atencion');
      ngNotify.set('Se ha guardado la llamada, número de atención telefónica #' + vm.NumeroLlamada, {
        position: 'bottom',
        sticky: true
      });
    }

    var vm = this;
    initialData();
    vm.abrirPagos = abrirPagos;
    vm.tipoAtencion = 'T';
    vm.ShowDetalle = true;
    vm.showDatosCliente = true;
    vm.ShowDetalleOnly = false;
    vm.EnterContrato = EnterContrato;
    vm.CambioServicio = CambioServicio;
    vm.generaReporte = generaReporte;
    vm.ValidaOrdenQuejas = ValidaOrdenQuejas;
    vm.BuscaCliente = abrirBusquedaCliente;
    vm.openHistorial = openHistorial;
    vm.abrirDetalleCobro = abrirDetalleCobro;
    vm.PanelCaptura = false;
    vm.MuestraMensajeQueja = false;
    vm.GuardarLlamada = GuardarLlamada;
    vm.DetalleLlamada = DetalleLlamada;
    vm.titulo = "Nueva atención telefónica";
    vm.bloquearContrato = false;
    vm.MostrarGuardar = true;
    vm.MostrarEditar = false;
    vm.Fechas = new Date();
    vm.Hora = $filter('date')(new Date(), 'HH:mm:ss');
    vm.Fecha = $filter('date')(new Date(), 'dd-MM-yyyy');
    vm.CancelaReporte = CancelaReporte;
    vm.BloquearElementos = false;
    vm.cliente_seleccionado = true;

    LimpiaInformacion();
  });
