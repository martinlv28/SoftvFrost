'use strict';

function ModalSingleNotaCtrl($uibModalInstance, cajasFactory, factura) {
	///funcion de inicializacion del controlador, obtiene las notas con los conceptos 
	this.$onInit = function() {
		cajasFactory.getNota(factura).then(function(data) {
			vm.nota = data.GetCrearNotaCreditoListResult[0];
		});
		cajasFactory.getNotaconceptos(factura).then(function(data) {
			vm.notaconceptos = data.GetConceptosTicketNotasCreditoListResult;
		});
	}
///Se puede usar para descartar un modal
	function cancel() {
		$uibModalInstance.dismiss('cancel');
	}

	var vm = this;
	vm.cancel = cancel;
}

angular.module('softvFrostApp').controller('ModalSingleNotaCtrl', ModalSingleNotaCtrl);
