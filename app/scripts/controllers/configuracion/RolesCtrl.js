'use strict';
angular.module('softvFrostApp').controller('RolesCtrl', RolesCtrl);

function RolesCtrl(rolFactory, $state) {
///funcion de inicializacion del controlador, obtiene la lista de los roles
  function Init() {
  
    rolFactory.GetRoleList().then(function(data) {
      vm.Roles = data.GetRoleListResult;
    });
  }
///para editar el rol, llama a editarol
  function EditaRol(x) {
    $state.go('home.provision.editarol', {
      obj: x
    });
  }
  var vm = this;
  Init();
  vm.EditaRol = EditaRol;
}
