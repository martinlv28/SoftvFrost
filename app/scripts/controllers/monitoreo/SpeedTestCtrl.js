'use strict';
angular
	.module('softvFrostApp')
	.controller('SpeedTestCtrl', function($state, ngNotify, $location, displayFactory,items, $uibModalInstance, diagnosticFactory) {
		///Se puede usar para descartar un modal
		function cancel() {
			$uibModalInstance.dismiss('cancel');
		}

		var vm = this;
		vm.cancel = cancel;
		vm.test = items.TDD_STR;
	
	});
