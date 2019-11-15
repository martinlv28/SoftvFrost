'use strict';
angular.module('softvFrostApp').controller('ModalGetLatLongCtrl', function ($uibModalInstance, $uibModal, SuscriptorFactory, $rootScope, ngNotify, NgMap, datosGis) {
	var vm = this;
	vm.cancel = cancel;
	vm.ok = ok;
	vm.getpos = getpos;
///funcion de inicializacion del controlador,para poder obtener las coordenadas 
	this.$onInit = function () {
		NgMap.getMap().then(function (map) {
			vm.latlng = [parseFloat(datosGis.lat), parseFloat(datosGis.long)];
			vm.map = map;
			google.maps.event.trigger(vm.map, 'resize');
		});
	}
///Se puede usar para descartar un modal y y lanza el evento get_LatLong solo a los oyentes 
	function ok() {
		$uibModalInstance.dismiss('cancel');
		$rootScope.$emit('get_LatLong', vm.latlng);
	}
///asigna la latitud y la longitud
	function getpos(event) {
		vm.latlng = [event.latLng.lat(), event.latLng.lng()];
	}


///Se puede usar para descartar un modal
	function cancel() {
		$uibModalInstance.dismiss('cancel');
	}
});
