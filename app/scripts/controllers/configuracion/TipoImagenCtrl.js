'use strict';
angular.module('softvFrostApp').controller('TipoImagenCtrl', TipoImagenCtrl);

function TipoImagenCtrl(catalogosMemoriaFactory, $state, ngNotify) {

  function Init() {
    vm.TiposEliminar = [];
    catalogosMemoriaFactory.GetObtieneTipoImagenesCatalogo().then(function (data) {
      vm.Tipos = data.GetObtieneTipoImagenesCatalogoResult;
    });
  }

  function Agregar() {
    var tipoAux = {};
    var Agrega = true;
    vm.Tipos.forEach(function (item, index) {
      if (item.Nombre == vm.NombreNuevo) {
        ngNotify.set('Ya existe un tipo de imagen con el mismo nombre', 'warn');
        Agrega = false;
      }
    });
    if (Agrega == true) {
      tipoAux.Nombre = vm.NombreNuevo;
      tipoAux.Activo = true;
      tipoAux.IdTipo = 0;
      tipoAux.ExisteImagen = false;
      vm.Tipos.push(tipoAux);
      vm.NombreNuevo = '';
    }
  }

  function ElimnarTipo(Tipo) {
    if (Tipo.IdTipo > 0 && Tipo.ExisteImagen == true) {
      ngNotify.set('Ya se ha cargado una imagen de este tipo, no se puede eliminar', 'warn');
    }
    else {
      var indexEliminar = 0
      vm.Tipos.forEach(function (item, index) {
        if (item.IdTipo == Tipo.IdTipo && item.Nombre == Tipo.Nombre) {
          indexEliminar = index;
          if (item.IdTipo > 0) {
            vm.TiposEliminar.push(item.IdTipo);
          }
        }
      });
      vm.Tipos.splice(indexEliminar, 1);
    }
  }

  function Guardar() {
    var parametros = {};
    parametros.TiposImagenes = vm.Tipos;
    catalogosMemoriaFactory.GetGuardaTipoImagen(parametros).then(function (data) {
      if (vm.TiposEliminar.length > 0) {
        var parametrosEliminar = {};
        parametrosEliminar.IdTipos = vm.TiposEliminar;
        catalogosMemoriaFactory.GetEliminaTipoImagen(parametrosEliminar).then(function (data) {
          catalogosMemoriaFactory.GetObtieneTipoImagenesCatalogo().then(function (data) {
            vm.Tipos = data.GetObtieneTipoImagenesCatalogoResult;
            ngNotify.set('Tipos de imagen actualizados exitosamente', 'success');
            vm.TiposEliminar = [];
          });
        });
      }
      else {
        catalogosMemoriaFactory.GetObtieneTipoImagenesCatalogo().then(function (data) {
          vm.Tipos = data.GetObtieneTipoImagenesCatalogoResult;
          ngNotify.set('Tipos de imagen actualizados exitosamente', 'success');
        });
      }
    });
  }

  var vm = this;
  Init();
  vm.Agregar = Agregar;
  vm.ElimnarTipo = ElimnarTipo;
  vm.Guardar = Guardar;
}