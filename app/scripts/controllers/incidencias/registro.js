'use strict';

function RegistroCtrl(ngNotify, incidenciasFactory, $state, $filter) {
	///funcion de inicializacion del controlador,obtiene el listado de motivoticket, sintoma, tipocontacto y mediocomunicacion
	function initial() {
		incidenciasFactory.getMotivo().then(function(data) {
			vm.motivo = data.GetMotivoTicketListResult;
		});
		incidenciasFactory.getSintoma().then(function(data) {
			vm.sintoma = data.GetSintomaListResult;
		});
		incidenciasFactory.getTipoContrato().then(function(data) {
			vm.tipoContacto = data.GetTipoContactoListResult;
		});
		incidenciasFactory.getMedio().then(function(data) {
			vm.medioComun = data.GetMedioComunicacionListResult;
		});
	}
///valida que todos los campos esten correctos, asigna lo obtenido con variables locales para despues añadir el ticket 
	function guardar() {
		if (vm.san == undefined) {
			ngNotify.set('Inserte todos los campos para generar el ticket.', 'error');
		}else {
			vm.fechaRegistro = new Date();
			vm.auxFecha = $filter('date')(vm.fechaRegistro, 'yyyy/MM/dd H:mm:ss');
			var addTi = {
				san: vm.san,
				fecha: vm.auxFecha,
				sintoma: vm.selectedSintoma.IdSintoma,
				motivo: vm.selectedMotivo.IdMotivoTicket,
				prioridad: vm.prioridad,
				descripcion: vm.descripcion,
				tipoContacto: vm.selectedTipoContacto.IdTipoContacto,
				nombreContacto: vm.nombreContacto,
				medioComun: vm.selectedMedioComun.IdMedioComunicacion,
				numeroContacto: vm.numeroContacto
			};
			incidenciasFactory.addTicket(addTi).then(function(data) {
				if (data.AddTicketResult > 0) {
					ngNotify.set('Suscriptor agregado correctamente.', 'success');
					$state.go('home.incidencias.registro');
				} else {
					ngNotify.set('Error al agregar el suscriptor.', 'error');
				}
			});
		}
	}
///obtiene los datos de la terminal
	function getTerminal() {
		if (vm.san == undefined || vm.san == '') {
			ngNotify.set('Inserte número de terminal.', 'error');
		}else {
			incidenciasFactory.getTerminal(vm.san).then(function(data) {
				if (data.GetByTerminalResult == null) {
					vm.busqueda = false;
					ngNotify.set('No se encontro registro.', 'error');
				}else {
					vm.busqueda = true;
					vm.terminalDatos = data.GetByTerminalResult;
				}
			});
		}
	}

	var vm = this;
	vm.guardar = guardar;
	vm.getTerminal = getTerminal;
	initial();
}
angular.module('softvFrostApp').controller('RegistroCtrl', RegistroCtrl);
