'use strict';
angular.module('softvFrostApp').controller('ServicioCtrl', ServicioCtrl);

function ServicioCtrl(terminalFactory, $state, ngNotify) {
	var vm = this;
	vm.Busca = Busca;
///funcion de inicializacion del controlador,
	this.$onInit = function () {
		terminalFactory.getServicioList().then(function (data) {
			vm.Servicios = data.GetServicioListResult;
			vm.ServiciosOriginal = vm.Servicios;
		});
	}

///busca un servicio espesifico 
	function Busca() {
		vm.Servicios = [];
		var NombreAux = vm.Nombre.toLowerCase();
		vm.ServiciosOriginal.forEach(function (item) {
			if (item.Nombre.toLowerCase().includes(NombreAux)){
				vm.Servicios.push(item);
			}
		});
	}
}
