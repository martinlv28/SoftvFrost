'use strict';
angular
  .module("softvFrostApp")
  .controller("nuevamemoriatecnicaServicioCtrl", function (
    $state,
    ngNotify,
    memoriaFactory,
    memoriaServicioFactory,
    usuarioFactory,
    $localStorage,
    $uibModal,
    $filter,
    FileUploader,
    $firebaseArray,
    firebase,
    moment,
    Notification
  ) {
    var vm = this;
    vm.cambios = [];
    vm.notas = [];
    vm.notas_ant = [];
    vm.cambios_eliminados = [];
    vm.aparatosdigitales = [];
    vm.cambioAparato = cambioAparato;
    vm.eliminaaparato = eliminaaparato;
    vm.guardar = guardar;
    vm.BorraImagen = BorraImagen;
    vm.showguardar = false;
    vm.seleccionImagen = true;
    vm.detalle = false;
    vm.validar = validar;
    vm.generafolio = false;
    vm.mensajefolio = "Generar Folio";
    vm.blockgenerafolio = true;
    vm.titulo = "Registro de memoria técnica de reporte";
    vm.addAparatodig = addAparatodig;
    vm.eliminaaparatodig = eliminaaparatodig;
    vm.blockorden = false;
    vm.blockcontrato = false;
    vm.Imagenes_eliminadas = [];
    vm.guardaNota = guardaNota;
    vm.eliminaNota = eliminaNota;
    vm.detalleTecnico = detalleTecnico;
    initialData();
    vm.ActivaFechaActivacion = false;
    vm.CambioDeEquipos = true;
    vm.ActualizarDatosHughes = ActualizarDatosHughes;
    vm.showeliminar = false;
    vm.PowerAttenuations = [
      {
        'IdPower': 4,
        'Descripcion': '1 db'
      },
      {
        'IdPower': 6,
        'Descripcion': '2 db'
      },
      {
        'IdPower': 1,
        'Descripcion': '3 db'
      },
      {
        'IdPower': 3,
        'Descripcion': '4 db'
      },
      {
        'IdPower': 2,
        'Descripcion': '5 db'
      },
      {
        'IdPower': 5,
        'Descripcion': '6 db'
      },
      {
        'IdPower': 7,
        'Descripcion': '7 db'
      },
      {
        'IdPower': 8,
        'Descripcion': '8 db'
      },
      {
        'IdPower': 9,
        'Descripcion': '9 db'
      },
      {
        'IdPower': 10,
        'Descripcion': '10 db'
      },
      {
        'IdPower': 11,
        'Descripcion': 'Mayor > 10 db'
      }
    ];
    vm.EquiposSustituir = [
      {
        'IdEquipo': 4,
        'Nombre': 'STB'
      },
      {
        'IdEquipo': 6,
        'Nombre': 'UPS'
      },
      {
        'IdEquipo': 1,
        'Nombre': 'Modem'
      },
      {
        'IdEquipo': 3,
        'Nombre': 'Router'
      },
      {
        'IdEquipo': 2,
        'Nombre': 'Radio'
      },
      {
        'IdEquipo': 5,
        'Nombre': 'Antena Internet'
      },
      {
        'IdEquipo': 7,
        'Nombre': 'LNB'
      },
      {
        'IdEquipo': 8,
        'Nombre': 'Antena Digital'
      },
    ];
///funcion de inicializacion del controlador,obtiene un listado de todos los tipos de imagen, el tipo de servicio y el estatus 
    function initialData() {
      var fechaHoy = new Date();
      vm.fechasitio = $filter('date')(fechaHoy, 'dd/MM/yyyy');
      vm.horallegada = moment().format('HH:mm');
      vm.usuariosistema = $localStorage.currentUser.usuario;
      vm.permitecheck = $localStorage.currentUser.CheckMemoria;
      memoriaFactory.ObtieneTiposImagenes().then(function (response) {
        vm.tiposresp = [];
        vm.tiposrespValidacion = [];
        var tipos = response.GetObtieneTiposImagenesListResult;
        tipos.forEach(function (item) {
          if (item.ValidacionEnSitio) {
            vm.tiposrespValidacion.push(item);
          }
          else {
            vm.tiposresp.push(item);
          }
        });
        memoriaFactory.GetEstatusTecnico().then(function (estatus) {
          vm.listEstatus = estatus.GetEstatusTecnicoResult;
          memoriaFactory.GetTipoServicio().then(function (tipos) {
            vm.listTiposerv = tipos.GetTipoServicioResult;
          });
        });
      });
    }
///asignacion de valores y llama a la funcion getTecnicos
    function getValidationdata(obj) {
      var results = obj;
      vm.celular = results.Celular;
      vm.cliente = results.Cliente;
      vm.beam = results.Beam;
      vm.contrato = results.Contrato;
      vm.direccion = results.Direccion + '\nCol.' + results.Colonia;
      vm.distribuidor = results.Distribuidor;
      vm.estado = results.Estado;
      vm.latitud = '';
      vm.localidad = results.Localidad;
      vm.longitud = '';
      vm.municipio = results.Municipio;
      vm.plataforma = results.Plataforma;
      vm.contratocompania = results.contratocompania;
      vm.SAN = results.SAN;
      vm.plan = results.Servicio;
      vm.telefono = results.Telefono;
      vm.Combo = false;//results.Combo;
      vm.codigopostal = results.CodigoPostal;
      vm.NoSTB = results.NoSTB;
      vm.modem = results.Modem;
      vm.antena = results.AntenaSerie;
      vm.serierouter = results.Router;
      vm.tamanoantena = results.Antena;
      vm.upsserie = results.UPS;
      vm.serieradio = results.Radio;
      vm.SQFInstalacion = results.SQFInstalacion;
      //console.log('results',results);
      getTecnicos(vm.contratocompania.split('-')[1]);
    }


///valida el numero del reporte, llama a la funcion getValidationdata
    function validar() {
      memoriaServicioFactory.GetObtieneDatosPorOrden(vm.numeroqueja).then(function (result) {
        if (result.GetObtieneDatosPorQuejaResult.length > 0) {
          if (result.GetObtieneDatosPorQuejaResult[0].Error > 0) {
            ngNotify.set(result.GetObtieneDatosPorQuejaResult[0].Msg, "error");
            getValidationdata(result.GetObtieneDatosPorQuejaResult[0]);
          } else {
            getValidationdata(result.GetObtieneDatosPorQuejaResult[0]);
            vm.showguardar = true;
            if (result.GetObtieneDatosPorQuejaResult[0].Proveedor == 'AZ3' || result.GetObtieneDatosPorQuejaResult[0].Proveedor == 'Norte' || result.GetObtieneDatosPorQuejanResult[0].Proveedor == 'AZ5') {
              vm.ActivaFechaActivacion = true;
            }
            else {
              vm.ActivaFechaActivacion = false;
            }

          }
        } else {
          ngNotify.set("El número de reporte ingresado no es válido", "warn");
        }
      });
    }

    vm.uploader = new FileUploader({
      filters: [{
        name: "yourName1", fn: function (item) {
          var count = 0;
          var count2 = 0;
          vm.uploader.queue.forEach(function (f) {
            count += f._file.name === item.name ? 1 : 0;
            count2 += f._file.idtipo === vm.tipoimagen.IdTipo ? 1 : 0;
          });
          if (count > 0) {
            ngNotify.set("Un archivo con ese mismo nombre ya fue seleccionado", "warn");
            return false;
          }
          if (count2 > 1) {
            ngNotify.set("Solo se pueden subir 2 imágenes de un mismo rubro", "warn");
            return false;
          }

          else {
            return true;
          }
        }
      },


      ]
    });

    vm.uploaderVS = new FileUploader({
      filters: [{
        name: "yourName1", fn: function (item) {
          var count = 0;
          var count2 = 0;
          vm.uploaderVS.queue.forEach(function (f) {
            count += f._file.name === item.name ? 1 : 0;
            count2 += f._file.idtipo === vm.tipoimagenValidacion.IdTipo ? 1 : 0;
          });
          if (count > 0) {
            ngNotify.set("Un archivo con ese mismo nombre ya fue seleccionado", "warn");
            return false;
          }
          if (count2 > 1) {
            ngNotify.set("Solo se pueden subir 2 imágenes de un mismo rubro", "warn");
            return false;
          }

          else {
            return true;
          }
        }
      },


      ]
    });
///valida la serie de los aparatos dijitales 
    function validaAparatodig(serie) {
      var count = 0;
      vm.aparatosdigitales.forEach(function (item) { count += (item.SerieAnterior === serie) ? 1 : 0; });
      return (count > 0) ? true : false;
    }
///valida que no este agregado el aparato y el numero maximo de aparatos 
    function addAparatodig() {

      if (vm.aparatosdigitales.length + 1 <= vm.NoSTB) {
        if (!validaAparatodig(vm.DTH.Descripcion)) {
          var obj = {};
          obj.SerieAnterior = vm.DTH.Descripcion;
          obj.IdEquipoSustituir = 0;
          obj.IdMemoriaTecnica = 0;
          obj.paquete = vm.DTH.Servicio;
          obj.Opcion = 1;
          obj.IdUsuario = $localStorage.currentUser.idUsuario;
          obj.Equipo = vm.DTH.Clv_CableModem;
          vm.aparatosdigitales.push(obj);
        } else {
          ngNotify.set('El aparato ya esta seleccionado', 'warn');
        }
      } else {
        ngNotify.set('Solo tiene registrado ' + vm.NoSTB + ' como cantidad máxima de aparatos', 'warn');
      }
    }
///revisa el index y enpalma en aparatos digitales 
    function eliminaaparatodig(index) {
      if (index > -1) {
        vm.aparatosdigitales.splice(index, 1);
      }
    }
///revisa el index y enpalma en notas
    function eliminaNota(index) {
      if (index > -1) {
        vm.notas.splice(index, 1);
      }
    }
///asignacion de valores 
    vm.uploader.onAfterAddingFile = function (fileItem) {
      fileItem.file.idtipo = vm.tipoimagen.IdTipo;
      fileItem.file.tipo = vm.tipoimagen.Nombre;
      fileItem._file.idtipo = vm.tipoimagen.IdTipo;
      fileItem._file.tipo = vm.tipoimagen.Nombre;
      fileItem.IdUsuario = $localStorage.currentUser.idUsuario;
    };
///asignacion de valores 
    vm.uploaderVS.onAfterAddingFile = function (fileItem) {
      fileItem.file.idtipo = vm.tipoimagenValidacion.IdTipo;
      fileItem.file.tipo = vm.tipoimagenValidacion.Nombre;
      fileItem._file.idtipo = vm.tipoimagenValidacion.IdTipo;
      fileItem._file.tipo = vm.tipoimagenValidacion.Nombre;
      fileItem.IdUsuario = $localStorage.currentUser.idUsuario;
    };
///obtiene a la lista de tecnicos 
    function getTecnicos(id) {

      memoriaServicioFactory.GetTecnicosMemoriaTecnica(id, 'N', 0).then(function (tecnicos) {
        vm.listTecnicos = tecnicos.GetTecnicosMemoriaTecnicaServicioResult;
      });
    }
///asignacion de variables y llama a la funcion getAparatos
    function detalleTecnico() {
      vm.listModem = [];
      vm.listRadio = [];
      vm.listRouter = [];
      vm.listSTB = [];
      vm.listAntena = [];
      vm.aparatosdigitales = [];
      vm.AparatosAnterior = [];
      vm.AparatosNuevo = [];
      getApartos();
    }
///valida que este elegido el tecnico y si si trae la lista de aparatos actuales y  tecnicos 
    function getApartos() {
      if (vm.instalador == undefined) {
        ngNotify.set("Es necesario elegir un técnico", "error");
      }
      else {
        memoriaServicioFactory.GetAparatosActuales(vm.EquipoSustituir.IdEquipo, vm.numeroqueja, vm.instalador.IdEntidad, 0).then(function (aparatosActuales) {
          vm.AparatosAnterior = aparatosActuales.GetAparatosActualesServicioResult;
          memoriaServicioFactory.GetAparatosTecnico(vm.EquipoSustituir.IdEquipo, vm.numeroqueja, vm.instalador.IdEntidad, 0).then(function (aparatos) {
            vm.AparatosNuevo = aparatos.GetAparatosTecnicoServicioResult;
          });
        });
      }
    }

///revisa el index y enpalma en cambios
    function BorraImagen(index) {
      if (index > -1) {
        vm.cambios.splice(index, 1);
      }
    }
///revisa el index y enpalma en cambios
    function eliminaaparato(index) {
      if (index > -1) {
        vm.cambios.splice(index, 1);
      }
    }
///hace una serie de validaciones para poder cambiar el numero de serie 
    function cambioAparato() {
      if (vm.AparatoAnterior && vm.EquipoSustituir && vm.AparatoNuevo) {
        if (vm.AparatoAnterior.Descripcion !== vm.AparatoNuevo.Descripcion) {
          var Cambia = true;
          vm.cambios.forEach(function (item) {
            if (item.SerieAnterior == vm.AparatoAnterior.Descripcion) {
              ngNotify.set("La serie del aparato que se trata de cambiar ya está en la lista", "error");
              Cambia = false;
            }
            else if (item.SerieNueva == vm.AparatoNuevo.Descripcion) {
              ngNotify.set("La serie del aparato que se trata de cambiar ya está en la lista", "error");
              Cambia = false;
            }
          });
          if (Cambia) {
            var obj = {};
            obj.SerieAnterior = vm.AparatoAnterior.Descripcion;
            obj.Equipo = vm.EquipoSustituir.Nombre;
            obj.SerieNueva = vm.AparatoNuevo.Descripcion;
            obj.Opcion = 1;
            obj.IdEquipoSustituir = 0;
            obj.IdMemoriaTecnica = 0;
            obj.Opcion = 1;
            obj.IdUsuario = $localStorage.currentUser.idUsuario;
            vm.cambios.push(obj);
            detalleTecnico();
          }
        } else {
          ngNotify.set("Las series no pueden ser iguales", "error");
        }
      } else {
        ngNotify.set("Necesita completar todos los campos", "error");
      }
    }
///devuelve si es valido 
    function isvalid(value) {
      return value !== undefined && value !== "" && value !== null ? true : false;
    }
/// asignacion de valores 
    function guardaNota() {
      var obj = {};
      obj.Observacion = vm.detallenota;
      obj.IdUsuario = $localStorage.currentUser.idUsuario;
      obj.IdObservacion = 0;
      obj.Fecha = moment().format('L');
      obj.Nombre = $localStorage.currentUser.nombre;
      vm.notas.push(obj);
      vm.detallenota = '';
    }
///hace una serie de validacion para que toda la informacion sea correcta, y si es asi guarda
    function guardar() {
      if((vm.PersonaAtiendeSitio == undefined || vm.TelefonoAtiendeSitio == undefined || vm.CelularAtiendeSitio == undefined  || vm.EmailAtiendeSitio == undefined) ||
      (vm.PersonaAtiendeSitio == '' || vm.TelefonoAtiendeSitio == ''|| vm.CelularAtiendeSitio == ''  || vm.EmailAtiendeSitio == ''))
      {
        ngNotify.set("Es necesario capturar los datos de la persona que atiende en sitio para poder continuar", "warning");
        return;
      }

      if (!vm.vcneutrotierra || !vm.vcfasetierra || !vm.vcfaseneutro) {
        Notification({ message: 'Hay información en el apartado de Mediciones Eléctricas que no se han capturado', title: 'Atención' }, 'warning');
      }

      if (!vm.modem || !vm.serieradio || !vm.serierouter || !vm.marcarouter || !vm.tamanoantena || !vm.sqf || !vm.antena
      ) {
        Notification({ message: 'Hay información en el apartado de Datos de equipo y desempeño que no se han capturado', title: 'Atención' }, 'warning');
      }

      if (!vm.Instalacion && !vm.Mantenimiento && !vm.CambioComponentes &&
        !vm.SiteSurvey && !vm.InstalacionDemo && !vm.Reubicacion && !vm.Apuntamiento) {
        Notification({ message: 'Se debe seleccionar por lo menos un tipo de trabajo realizado', title: 'Atención' }, 'warning');
      }
      var tipos_ = vm.tiposresp;
      vm.uploader.queue.forEach(function (f) {
        tipos_.forEach(function (item, index) {
          if (f._file.idtipo === item.IdTipo) {
            if (index > -1) { tipos_.splice(index, 1); }
          }
        })
      });

      if (tipos_.length > 0) {
        Notification({ message: '**No todos los rubros en la carga de imágenes  estan completos', title: 'Atención' }, 'warning');

      }

      var obj = {
        SAN: (vm.SAN) ? vm.SAN : 0,
        Contrato: (vm.contrato) ? vm.contrato : 0,
        Distribuidor: (vm.distribuidor) ? vm.distribuidor : "",

        FechaVisita: (vm.fechasitio) ? $filter("date")(vm.fechasitio, "yyyyMMdd") : "19000101",
        HoraLlegada: (vm.horallegada) ? vm.horallegada : "",
        HoraSalida: (vm.horasalida) ? vm.horasalida : "",
        SiteId: 0,
        Cliente: (vm.cliente) ? vm.cliente : "",
        Estado: (vm.estado) ? vm.estado : "",
        Municipio: (vm.municipio) ? vm.municipio : "",
        Localidad: (vm.localidad) ? vm.localidad : "",
        Direccion: (vm.direccion) ? vm.direccion : "",
        PersonaRecibe: (vm.recibe) ? vm.recibe : "",
        Plataforma: (vm.plataforma) ? vm.plataforma : "",
        Servicio: (vm.plan) ? vm.plan : "",
        TipoServicio: (vm.tiposervicio) ? vm.tiposervicio.Descripcion : "",
        Velocidad: (vm.velocidad) ? vm.velocidad : "",
        DomicilioNotificacion: (vm.domicilionotificacion) ? vm.domicilionotificacion : "",
        CodigoPostal: (vm.codigopostal) ? vm.codigopostal : "",
        Telefono: vm.telefono,
        Celular: vm.celular,
        Latitud: vm.latitud,
        Longitud: vm.longitud,
        Beam: (vm.beam) ? vm.beam : "",
        EstatusTecnico: (vm.estatustecnico) ? vm.estatustecnico.Descripcion : "",
        FechaActivacion: (vm.fechaactivacion) ? $filter("date")(vm.fechaactivacion, "yyyyMMdd") : "19000101",
        VCNeutroTierra: (vm.vcneutrotierra) ? vm.vcneutrotierra : "",
        VCFaseTierra: (vm.vcfasetierra) ? vm.vcfasetierra : "",
        VCFaseNeutro: (vm.vcfaseneutro) ? vm.vcfaseneutro : "",
        VUPSNeutroTierra: (vm.upcneutrotierra) ? vm.upcneutrotierra : "",
        VUPSFaseTierra: (vm.upcfasetierra) ? vm.upcfasetierra : "",
        VUPSFaseNeutro: (vm.upcfaseneutro) ? vm.upcfaseneutro : "",
        Modem: (vm.modem) ? vm.modem : "",
        Antena: (vm.tamanoantena) ? vm.tamanoantena : "",
        SQF: (vm.sqf) ? vm.sqf : "",
        SQFInstalacion: (vm.SQFInstalacion) ? vm.SQFInstalacion : "",
        Radio: (vm.serieradio) ? vm.serieradio : "",
        Router: (vm.serierouter) ? vm.serierouter : "",
        MarcaRouter: (vm.marcarouter) ? vm.marcarouter : "",
        UPS: (vm.upsserie) ? vm.upsserie : "",
        WiFi: "",
        Instalacion: vm.Instalacion,
        InstalacionDemo: vm.InstalacionDemo,
        Apuntamiento: vm.Apuntamiento,
        Reubicacion: vm.Reubicacion,
        CambioComponentes: vm.CambioComponentes,
        Mantenimiento: vm.Mantenimiento,
        SiteSurvey: vm.SiteSurvey,
        Detalles: (vm.detalleinstalacion) ? vm.detalleinstalacion : "",
        Folio: (vm.numerofolio) ? vm.numerofolio : 0,
        Clv_Queja: (vm.numeroqueja) ? vm.numeroqueja : 0,
        IdUsuario: $localStorage.currentUser.idUsuario,
        Instalador: vm.usuariosistema,
        PersonaValidaServicio: vm.PersonaValidaServicio,
        IdEstatusTecnico: (vm.estatustecnico) ? vm.estatustecnico.IdEstatusTecnico : 0,
        IdTipoServicio: (vm.tiposervicio) ? vm.tiposervicio.IdTipoServicio : 0,
        IdTecnico: vm.instalador.IdEntidad,
        AntenaSerie: (vm.antena) ? vm.antena : '',
        CodigoEstado: vm.CodigodeEstado,
        SQFVS: vm.SQFVS,
        TransmitRate: vm.TransmitRate,
        PowerAttenuation: vm.PowerAttenuation ? vm.PowerAttenuation.Descripcion : "",
        PruebaACP: vm.PruebaACP,
        VoltajeComercialNT: vm.VoltajeComercialNT,
        VoltajeComercialFT: vm.VoltajeComercialFT,
        VoltajeComercialFN: vm.VoltajeComercialFN,
        PersonaAtiendeSitio: vm.PersonaAtiendeSitio,
        TelefonoAtiendeSitio: vm.TelefonoAtiendeSitio,
        CelularAtiendeSitio: vm.CelularAtiendeSitio,
        EmailAtiendeSitio: vm.EmailAtiendeSitio
      };

      var file_options = [];
      var files = [];
      var tipos = [];
      vm.uploader.queue.forEach(function (f) {

        var options = {
          IdImagen: 0,
          Accion: 1,
          Tipo: f._file.idtipo,
          Nombre: f._file.name,
          IdUsuario: $localStorage.currentUser.idUsuario
        };
        file_options.push(options);
        tipos.push(f._file.idtipo);
        files.push(f._file);

      });

      //Imagenes de pestaña de Valdiacion en Sitio
      vm.uploaderVS.queue.forEach(function (f) {

        var options = {
          IdImagen: 0,
          Accion: 1,
          Tipo: f._file.idtipo,
          Nombre: f._file.name,
          IdUsuario: $localStorage.currentUser.idUsuario
        };
        file_options.push(options);
        tipos.push(f._file.idtipo);
        files.push(f._file);

      });
      /* 
            vm.uploader.queue.forEach(function (f) {
              var options = {
                IdImagen: 0,
                Accion: 1,
                Tipo: f._file.idtipo,
                Nombre: f._file.name,
                IdUsuario: $localStorage.currentUser.idUsuario
              };
              file_options.push(options);
              tipos.push(f._file.idtipo);
              files.push(f._file);
            });  */


      memoriaServicioFactory.GuardaMemoriaTecnica(obj).then(function (response) {
        vm.IdMemoriaTecnica = response.GetGuardaMemoriaTecnicaListServicioResult[0].IdMemoriaTecnica;

        memoriaServicioFactory.GuardaImagenesMemoriaTecnica(files, vm.IdMemoriaTecnica, file_options, []).then(function (data) {
          ngNotify.set("Las imágenes se han guardado correctamente", "success");
          vm.uploader.clearQueue();

          vm.cambios.forEach(function (item) {
            item.IdMemoriaTecnica = vm.IdMemoriaTecnica;
          });
          vm.aparatosdigitales.forEach(function (item) {
            item.IdMemoriaTecnica = vm.IdMemoriaTecnica;
          });

          memoriaServicioFactory.GuardaEquiposSustituir(vm.cambios).then(function (result) {
            memoriaServicioFactory.GetGuardaEquiposDigital(vm.aparatosdigitales).then(function (data) {

              if (vm.notas.length > 0) {
                vm.notas.forEach(function (item) { item.IdMemoriaTecnica = vm.IdMemoriaTecnica; });
                memoriaServicioFactory.GetGuardaObservacionMemoriaTecnicaList(vm.notas).then(function (resp) { });
              }

              var ref = firebase.database().ref().child("messages");
              vm.messages = $firebaseArray(ref);
              vm.messages.$add({
                Id: vm.IdMemoriaTecnica,
                Fecha: moment().format("L"),
                Hora: moment().format("LT"),
                Mensaje: 'Se ha generado una nueva memoria técnica de reporte',
                Tipo: 1,
                SAN: vm.SAN

              });
              ngNotify.set("La memoria técnica de reporte se ha guardado correctamente", "success");
              $state.go("home.memoria.memoriastecnicasServicio");
            });
          });
        });

      });
    }
///obtiene los datos de hughes
    function ActualizarDatosHughes() {
      var parametros = {};
      parametros.Clv_Queja = vm.numeroqueja;
      memoriaServicioFactory.GetObtieneDatosHughes(parametros).then(function (result) {
        vm.SQFVS = result.GetObtieneDatosHughesServicioResult.SQF;
        vm.CodigodeEstado = result.GetObtieneDatosHughesServicioResult.CodigoEstado;
      });
    }
  });
