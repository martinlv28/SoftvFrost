'use strict';
angular
  .module('softvFrostApp')
  .controller('ModalDescargaMaterialCtrl', function ($uibModalInstance, $uibModal, options, DescargarMaterialFactory, $rootScope, ngNotify, $localStorage, $state) {

//////funcion de inicializacion del controlador, obtiene los datos y revisa si tiene bitacora 
    function initialData(objDesMat) {
      vm.articulos_ = [];
      DescargarMaterialFactory.GetMuestra_Detalle_Bitacora(objDesMat.SctTecnico.CLV_TECNICO, vm.IAlma).then(function (data) {
        vm.Material = data.GetMuestra_Detalle_Bitacora_2ListResult;
        DescargarMaterialFactory.GetSoftv_GetDescargaMaterialEstaPagado(objDesMat.ClvOrden, objDesMat.Tipo_Descargar).then(function (data) {
          vm.pagado = data.GetSoftv_GetDescargaMaterialEstaPagadoResult.Pagado
          DescargarMaterialFactory.GetSoftv_DimeSiTieneBitacora(objDesMat.ClvOrden, objDesMat.Tipo_Descargar).then(function (data) {
            if (data.GetSoftv_DimeSiTieneBitacoraResult == null) {} else {
              vm.No_Bitacora = data.GetSoftv_DimeSiTieneBitacoraResult.NoBitacora;
              DescargarMaterialFactory.GetDescargaMaterialArticulosByIdClvOrden(objDesMat.ClvOrden, objDesMat.Tipo_Descargar).then(function (data) {
                var art = data.GetGetDescargaMaterialArticulosByIdClvOrdenListResult;
                var ObjDescargaMat = {};
                ObjDescargaMat.IdTecnico = options.SctTecnico.CLV_TECNICO;
                ObjDescargaMat.ClvOrden = options.ClvOrden;
                ObjDescargaMat.IdAlmacen = vm.IAlma;
                ObjDescargaMat.Accion = (vm.No_Bitacora == 0) ? 'Agregar' : 'Modificar';
                ObjDescargaMat.IdBitacora = vm.No_Bitacora;
                ObjDescargaMat.TipoDescarga = options.Tipo_Descargar;

                for (var a = 0; a < art.length; a++) {
                  var Articulos = {};
                  Articulos.NoArticulo = art[a].NOARTICULO;
                  Articulos.Cantidad = art[a].CANTIDADUTILIZADA;
                  Articulos.EsCable = art[a].ESCABLE;
                  Articulos.MetrajeInicio = art[a].METRAJEINICIO;
                  Articulos.MetrajeFin = art[a].METRAJEFIN;
                  Articulos.MetrajeInicioExt = art[a].METRAJEINICIOEXTERIOR;
                  Articulos.MetrajeFinExt = art[a].METRAJEFINEXTERIOR;
                  vm.articulos_.push(Articulos);
                }

                DescargarMaterialFactory.GetDescargaMaterialArt(ObjDescargaMat, vm.articulos_).then(function (data) {
                  vm.DesMatArt = data.GetDescargaMaterialArtResult;
                })
              });
            }
          });

        });

      });
    }
///ontiene informacion del articulo mientras haya, cambia propiedades de elementos de la vista 
    function BuscarNombreArticulo() {
      if (vm.SlctMaterial.catTipoArticuloClave > 0) {
        DescargarMaterialFactory.GetMuestra_Descripcion_Articulo_2List(options.SctTecnico.CLV_TECNICO, vm.SlctMaterial.catTipoArticuloClave, vm.IAlma).then(function (data) {
          vm.DescripcionArticulo = data.GetMuestra_Descripcion_Articulo_2ListResult;
          vm.SlctArticulo.IdArticulo = "";
          vm.MostrarCD = false;
          vm.MostrarMII = false;
          vm.MostrarMIE = false;
          vm.MostrarMFI = false;
          vm.MostrarMFE = false;
          vm.MostrarTM = false;
        });

      }
    }
///obtiene el tipo de material y depende de el resultado si cambia propiedades de elementos de la vista 
    function BuscarTipoArticulo() {
      DescargarMaterialFactory.GetSoftv_ObtenTipoMaterial(catUnidadClave, Tipo, Articulo, vm.SlctArticulo.IdArticulo).then(function (data) {
        vm.TipoArticulo = data.GetSoftv_ObtenTipoMaterialResult.Tipo;
        if (vm.TipoArticulo == 'Metros') {
          if(vm.TipoMetraje == 'I'){
            vm.MostrarCD = false;
            vm.MostrarMII = true;
            vm.MostrarMIE = false;
            vm.MostrarMFI = true;
            vm.MostrarMFE = false;
            vm.MostrarTM = true;
          }else if(vm.TipoMetraje == 'E'){
            vm.MostrarCD = false;
            vm.MostrarMII = false;
            vm.MostrarMIE = true;
            vm.MostrarMFI = false;
            vm.MostrarMFE = true;
            vm.MostrarTM = true;
          }
        } else if (vm.TipoArticulo == 'Piezas') {
          vm.MostrarCD = true;
          vm.MostrarMII = false;
          vm.MostrarMIE = false;
          vm.MostrarMFI = false;
          vm.MostrarMFE = false;
          vm.MostrarTM = false;
        }

        CantidadArticulo = 0;
        vm.CantidadDescarga = "";
        vm.MetrajeII = "";
        vm.MetrajeIE = "";
        vm.MetrajeFI = "";
        vm.MetrajeFE = "";
      });
    }
///obtiene informacion del articulo y verifica si puede agregar o modificar la cantidad del articulo 
    function AgregarArticulo() {
      if (vm.SlctArticulo != undefined && vm.SlctArticulo.IdArticulo > 0) {
        DescargarMaterialFactory.GetSoftv_ExistenciasTecnico(vm.SlctArticulo.IdArticulo, options.SctTecnico.CLV_TECNICO, vm.IAlma).then(function (data) {
          vm.Existe = data.GetSoftv_ExistenciasTecnicoResult.Existe;
          DescargarMaterialFactory.GetSoftv_ObtenTipoMaterial(catUnidadClave, Tipo, Articulo, vm.SlctArticulo.IdArticulo).then(function (data) {
            vm.TipoArticulo = data.GetSoftv_ObtenTipoMaterialResult.Tipo;
            var vCD = 0;
            var vMII = 0;
            var vMIE = 0;
            var vMFI = 0;
            var vMFE = 0;
            var TArt = false;

            if (vm.TipoArticulo == 'Metros') {
              if ((vm.MetrajeII != undefined && vm.MetrajeII > 0 &&
                vm.MetrajeFI != undefined && vm.MetrajeFI > 0 ) ||
                (vm.MetrajeIE != undefined && vm.MetrajeIE > 0 &&
                vm.MetrajeFE != undefined && vm.MetrajeFE > 0)) {
                

                if (vm.MetrajeFI > vm.MetrajeII || vm.MetrajeFE > vm.MetrajeIE) {

                    if(vm.TipoMetraje == 'I'){
                      vMII = vm.MetrajeII;
                      vMFI = vm.MetrajeFI;
                      vMIE = 0;
                      vMFE = 0;
                      CantidadArticulo = (vMFI - vMII);
                    }else if(vm.TipoMetraje == 'E'){
                      vMII = 0;
                      vMFI = 0;
                      vMIE = vm.MetrajeIE;
                      vMFE = vm.MetrajeFE;
                      CantidadArticulo = (vMFE - vMIE);
                    }
                    vCD = 0;
                    TArt = true;

                } else {
                  CantidadArticulo = 0;
                  ngNotify.set('El metraje final tiene que ser mayor al de inicio.', 'error');
                }


              } else {
                CantidadArticulo = 0;
                ngNotify.set('Ingresa el metraje del artículo.', 'error');
              }


            } else if (vm.TipoArticulo == 'Piezas') {

              if (vm.CantidadDescarga != undefined && vm.CantidadDescarga > 0) {

                vCD = vm.CantidadDescarga;
                vMII = 0;
                vMIE = 0;
                vMFI = 0;
                vMFE = 0;
                CantidadArticulo = vCD;
                TArt = false;

              } else {
                CantidadArticulo = 0;
                ngNotify.set('Ingresa la cantidad del artículo.', 'error');
              }
            }

            vm.CantidadDescarga = "";
            vm.MetrajeII = "";
            vm.MetrajeIE = "";
            vm.MetrajeFI = "";
            vm.MetrajeFE = "";

            if (CantidadArticulo > 0) {
              if (CantidadArticulo <= vm.SlctArticulo.Cantidad) {

                var ObjDescargaMat = {};
                ObjDescargaMat.IdTecnico = options.SctTecnico.CLV_TECNICO;
                ObjDescargaMat.ClvOrden = options.ClvOrden;
                ObjDescargaMat.IdAlmacen = vm.IAlma;
                ObjDescargaMat.Accion = (vm.No_Bitacora == 0) ? 'Agregar' : 'Modificar';
                ObjDescargaMat.IdBitacora = vm.No_Bitacora;
                ObjDescargaMat.TipoDescarga = options.Tipo_Descargar;

                var Articulos = {};
                Articulos.NoArticulo = vm.SlctArticulo.IdInventario;
                Articulos.Cantidad = CantidadArticulo;
                Articulos.EsCable = TArt;
                Articulos.MetrajeInicio = vMII;
                Articulos.MetrajeFin = vMFI;
                Articulos.MetrajeInicioExt = vMIE;
                Articulos.MetrajeFinExt = vMFE;
                if (ExisteArticulo(Articulos.NoArticulo) == false) {
                  vm.articulos_.push(Articulos);
                  DescargarMaterialFactory.GetDescargaMaterialArt(ObjDescargaMat, vm.articulos_).then(function (data) {
                    vm.DesMatArt = data.GetDescargaMaterialArtResult;
                  });

                } else {
                  ngNotify.set('El artículo ya fue agregado', 'warn');
                  return;
                }
              } else {
                ngNotify.set('No tiene material suficiente, solo cuenta con: ' + vm.SlctArticulo.Cantidad + ' pzs.', 'error');
              }
            }

          });

        });
      } else {
        ngNotify.set('Selecciona un artículo.', 'error');
      }
    }
///valida que se pueda agregar la bitacora sin problemas 
    function ok() {
      if (vm.articulos_.length > 0) {
        var ObjDescargaMat = {};
        ObjDescargaMat.IdTecnico = options.SctTecnico.CLV_TECNICO;
        ObjDescargaMat.ClvOrden = options.ClvOrden;
        ObjDescargaMat.IdAlmacen = vm.IAlma;
        ObjDescargaMat.Accion = (vm.No_Bitacora == 0) ? 'Agregar' : 'Modificar';
        ObjDescargaMat.IdBitacora = vm.No_Bitacora;
        ObjDescargaMat.TipoDescarga = options.Tipo_Descargar;
        DescargarMaterialFactory.GetAddDescargaMaterialArt(ObjDescargaMat, vm.articulos_).then(function (data) {
          console.log(data);
          DescargarMaterialFactory.GetchecaBitacoraTecnico(options.ClvOrden, options.Tipo_Descargar).then(function(data){ 
              vm.DesMatRes = data.GetchecaBitacoraTecnicoResult; 
              ngNotify.set('Se guardó exitosamente la bitácora #' + vm.DesMatRes.idBitacora + ' para ' + msj + ' #' + options.ClvOrden,'success'); 
              cancel(); 
            }); 
        });
      } else {
        ngNotify.set('Necesita agregar un artículo primero.', 'error');
      }

    }
///busca el numero del articulo y cuando lo encuentra lo elimina de la lista 
    function EliminarArticulo(clave) {
      for (var i = 0; i < vm.articulos_.length; i++)
        if (vm.articulos_[i].NoArticulo === clave) {
          vm.articulos_.splice(i, 1);
          break;
        }

      var ObjDescargaMat = {};
      ObjDescargaMat.IdTecnico = options.SctTecnico.CLV_TECNICO;
      ObjDescargaMat.ClvOrden = options.ClvOrden;
      ObjDescargaMat.IdAlmacen = vm.IAlma;
      ObjDescargaMat.Accion = (vm.No_Bitacora == 0) ? 'Agregar' : 'Modificar';
      ObjDescargaMat.IdBitacora = vm.No_Bitacora;
      ObjDescargaMat.TipoDescarga = options.Tipo_Descargar;

      DescargarMaterialFactory.GetDescargaMaterialArt(ObjDescargaMat, vm.articulos_).then(function (data) {
        vm.DesMatArt = data.GetDescargaMaterialArtResult;
      });
    }

///recorre la lista en busca de si hay al menos uno y manda cierto o falso depende cual sea el caso 
    function ExisteArticulo(IdInventario) {
      var count = 0;
      for (var a = 0; a < vm.articulos_.length; a++) {
        if (vm.articulos_[a].NoArticulo == IdInventario) {
          count = count + 1;
        }
      }
      return (count > 0) ? true : false;
    }
    //////Se puede usar para descartar un modal
    function cancel() {
      $uibModalInstance.dismiss('cancel');
    }
///depende del tipo de metraje, puede cambiar propiedades de elementos de la ventana 
    function SlctTipoMetraje(){
      if(vm.TipoMetraje == 'I'){
        vm.MostrarMFE = false;
        vm.MostrarMIE = false;
        vm.MostrarMII = true;
        vm.MostrarMFI = true;
      }else if(vm.TipoMetraje == 'E'){
        vm.MostrarMII = false;
        vm.MostrarMFI = false;
        vm.MostrarMIE = true;
        vm.MostrarMFE = true;
      }
    }

    var IdArticulo = "";
    var catUnidadClave = 0;
    var Tipo = "";
    var Articulo = "";
    var CantidadArticulo = 0;
    var vm = this;
    vm.cancel = cancel;
    vm.ok = ok;
    vm.BuscarNombreArticulo = BuscarNombreArticulo;
    vm.AgregarArticulo = AgregarArticulo;
    vm.BuscarTipoArticulo = BuscarTipoArticulo;
    vm.EliminarArticulo = EliminarArticulo;
    vm.SlctTipoMetraje = SlctTipoMetraje;
    vm.IAlma = 0;
    vm.MostrarCD = false;
    vm.MostrarMII = false;
    vm.MostrarMIE = false;
    vm.MostrarMFI = false;
    vm.MostrarMFE = false;
    vm.MostrarTM = false;
    vm.articulos_ = [];
    vm.Detalle = options.Detalle;
    if(options.Tipo_Descargar == 'Q'){ 
      var msj = 'el Reporte';
    }else if(options.Tipo_Descargar == 'O'){
      var msj = 'la Orden'
    }
    vm.TipoMetraje = 'I';
    //vm.Tipo = options.Tipo_Descargar;
    initialData(options);


  });
