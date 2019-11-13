'use strict';
angular.module('softvFrostApp').controller('PermisosCtrl', PermisosCtrl);

function PermisosCtrl(permisoFactory, rolFactory, ngNotify) {
	///funcion de inicializacion del controlador, obtiene un listado de roles y modulos 
	function Init() {
		rolFactory.GetRoleList().then(function(data) {
			vm.Roles = data.GetRoleListResult;
			vm.Rol = vm.Roles[0];
			GetModuleList();
		});
	}
/// obtiene la lista de los modulos
	function GetModuleList() {
		permisoFactory.GetModulopermiso(vm.Rol.IdRol).then(function(data) {						
			vm.Modules=	data.GetModulos_PermisosResult;
		});
	}


///llama a la funcion GetModuleList
	function ObtenPermisos() {
		GetModuleList();
	}
///valida si el rol es nulo y asigna el permiso 
	function Guardar() {
		if (vm.Rol == null) {
			ngNotify.set('Selecciona algún rol para continuar.', 'error');
			return;
		}
		permisoFactory.GuardaPermisos(vm.Rol.IdRol, vm.Modules).then(function(data) {
			ngNotify.set('Los permisos se establecieron correctamente', 'success');

		});

	}
	var vm = this;
	Init();
	vm.ObtenPermisos = ObtenPermisos;
	vm.Guardar = Guardar;
}
