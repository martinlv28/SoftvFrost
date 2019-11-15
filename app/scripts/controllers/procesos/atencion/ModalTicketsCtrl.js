'use strict';
angular
	.module('softvFrostApp')
	.controller('ModalTicketsCtrl', function($uibModal, $uibModalInstance, cajasFactory, contrato) {
//////funcion de inicializacion del controlador, obtiene un listado del historial de las facturas 
		function initialData() {
			cajasFactory.dameHistorialServicios(contrato).then(function(data) {
				vm.tickets = data.GetBuscaFacturasHistorialListResult;
				console.log(vm.tickets);
			});
		}
///llama a otra vista con otro control 
		function dameFactura(factura) {
			var modalInstance = $uibModal.open({
				animation: true,
				ariaLabelledBy: 'modal-title',
				ariaDescribedBy: 'modal-body',
				templateUrl: 'views/procesos/modalSingleTicket.html',
				controller: 'ModalSingleTicketCtrl',
				controllerAs: 'ctrl',
				backdrop: 'static',
				keyboard: false,
				size: 'sm',
				resolve: {
					factura: function() {
						return factura;
					},
					imprimir: function() {
						return false;
					}
				}
			});
		}
///llama a la vista modalSingleNota.html con otro controlador 
		function dameNota(factura) {
			var modalInstance = $uibModal.open({
				animation: true,
				ariaLabelledBy: 'modal-title',
				ariaDescribedBy: 'modal-body',
				templateUrl: 'views/facturacion/modalSingleNota.html',
				controller: 'ModalSingleNotaCtrl',
				controllerAs: 'ctrl',
				backdrop: 'static',
				keyboard: false,
				size: 'sm',
				resolve: {
					factura: function() {
						return factura;
					}
				}
			});
		}
///Se puede usar para descartar un modal
		function cancel() {
			$uibModalInstance.dismiss('cancel');
		}

		var vm = this;
		vm.cancel = cancel;
		vm.dameFactura = dameFactura;
		vm.dameNota = dameNota;
		initialData();

	});
