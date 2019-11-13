'use strict';

function BandejaCtrl($uibModal,incidenciasFactory) {
	///funcion de inicializacion del controlador, obtiene la lista de tickets
	function initial() {
		incidenciasFactory.getTickets().then(function(data) {
			vm.tickets = data.GetTicketListResult;
		});
	}
///muestra el detalle de un ticket
	function verDetalle(ticket) {
		vm.animationsEnabled = true;
		var modalInstance = $uibModal.open({
			animation: vm.animationsEnabled,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: 'views/incidencias/modalDetalleTicket.html',
			controller: 'DetalleTicketCtrl',
			controllerAs: '$ctrl',
			backdrop: 'static',
			keyboard: false,
			size: 'lg',
			resolve: {
				ticket: function() {
					return ticket;
				}
			}
		});
	}

	var vm = this;
	vm.verDetalle = verDetalle;
	initial();
}

angular.module('softvFrostApp').controller('BandejaCtrl', BandejaCtrl);
