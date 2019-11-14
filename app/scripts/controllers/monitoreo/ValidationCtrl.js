'use strict';

angular.module('softvFrostApp')
  .controller('ValidationCtrl', function (NgMap, OVTFactory, $uibModal,mapaBeamFactory, ngNotify, diagnosticFactory,terminalFactory,globalService) {
///valida si se tiene acceso a la informacion, si es que lo tiene accede a toda la informacion 
    function validate() {
      terminalFactory.GetValidaSANUsuario(vm.SAN).then(function(data){
        if(data.GetValidaSANUsuarioResult===true){
          var credentials = {};
          credentials.userId = 'televera';
          credentials.password = 'televera';
          credentials.san = vm.SAN;
          terminalFactory.getTerminalById(vm.SAN).then(function (data) {
          
            if (data.GetByTerminalResult.SatellitedID ===""||data.GetByTerminalResult.SatellitedID===null) {
             
              ngNotify.set('This SAN has not a satellite ID assigned', 'error');
              return;
            } else {
            
              if (data.GetByTerminalResult.SatellitedID === "EchoStar 19") {
                credentials.satellite = "JUPITER2";
              } else {
                credentials.satellite = "E65W";
              }
    
              OVTFactory.OVTToken(credentials).then(function (data) {
            vm.datasend = data[0].DataSend;
            var token = JSON.parse(data[0].token);
            var Jdata = JSON.parse(data[0].DataSend);
            vm.OVTToken = token.token;
            var obj = {};
            obj.token = vm.OVTToken;
            obj.url = 'confirmation.json';
            obj.Jdata = JSON.stringify(Jdata);
            obj.method = 'OVTGET';
            OVTFactory.DataOVT(obj).then(function (data) {
              var detallecb = JSON.parse(data);
              vm.Details = detallecb;
              var obj = {};
              obj.token = vm.OVTToken;
              obj.url = 'antennas/list.json';
              obj.Jdata = '';
              obj.method = 'OVTGET';
              OVTFactory.DataOVT(obj).then(function (data) {
                var antennas = JSON.parse(data);
                vm.antennas = antennas;
    
                var objmount = {};
                objmount.token = vm.OVTToken;
                objmount.url = 'mounts/list.json';
                objmount.Jdata = '';
                objmount.method = 'OVTGET';
                OVTFactory.DataOVT(objmount).then(function (datamount) {
    
                  var mounts = JSON.parse(datamount);
                  vm.mounts = mounts;    
                });
              });    
            });    
          });   
        }
    
    
          });
        }else{
          ngNotify.set("Lo sentimos, no cuentas con acceso a esta información", "warn");
        }
      });

     
     
      
    }
///rellena de ceros a la izquierda y regresa el tipo del globalService mas la cadena que se le pusierton ceros 
    function hughesGetSanCompuesto(obj) {
      var a = obj.toString();
      var i;
      for (i = a.length; i < 9; i++) {
        a = '0' + a;
      }
      return globalService.getType() + a;
    };
///hace una llamada a un ping 
    function getPing() {
      var obj = {};
      obj.token = vm.OVTToken;
      obj.url = 'terminal/ping.json';
      obj.Jdata = '';
      obj.method = 'OVTGET';
      OVTFactory.DataOVT(obj).then(function (data) {
        var det = JSON.parse(data);
        ngNotify.set('Ip Address:' +
          det.ipAddress + ' Terminal Status:' + det.terminalStatus);

      });
    }
///actualiza la configuracion 
    function getRefresh() {
      var obj = {};
      obj.token = vm.OVTToken;
      obj.url = 'refresh_confirmation.json';
      obj.Jdata = '';
      obj.method = 'OVTGET';
      OVTFactory.DataOVT(obj).then(function (data) {
        ngNotify.set('Refresh success');

      });
    }


///abre la vista SignOff
    function abrirSignOff() {
   
      var modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'views/monitoreo/SignOff.html',
        controller: 'OVTSingOffCtrl',
        controllerAs: 'ctrl',
        backdrop: 'static',
        keyboard: false,
        size: "lg",
        resolve: {
          token: function () {
            return vm.OVTToken;
          }
        }
      });
    }


///valida que toda la informacione sea correcta 
    function Procced() {
      if (vm.antenna === undefined || vm.mount === undefined) {
        ngNotify.set('Complete step two and step three.', 'error');
      } else {
        vm.OVT1 = false;
        vm.OVT2 = true;
        var auxMount = vm.mount.substring(0, vm.mount.length - 1);
        var d = "{" +
          '"antennaSize"' +
          ':' +
          vm.antenna +
          ',"mountType"' +
          ':' +
          '"' + auxMount + '"' +
          '}';
        var obj = {};
        obj.token = vm.OVTToken;
        obj.url = 'validate_antenna_mount.json';
        obj.Jdata = d;
        obj.method = 'OVTPOST';
        OVTFactory.DataOVT(obj).then(function (data) {
          var result = JSON.parse(data);
          if (result.valid === true) {
            vm.OVT1 = false;
            vm.OVT2 = true;
            var objv = {};
            objv.token = vm.OVTToken;
            objv.url = 'validation.json';
            objv.Jdata = '';
            objv.method = 'OVTGET';
            OVTFactory.DataOVT(objv).then(function (data) {


             


              var DetailsOVT = JSON.parse(data);
              vm.DetailsOVT2 = DetailsOVT;
              vm.points = {
                "name": "SATV",
                "latitude": vm.DetailsOVT2.terminal.location.latitude,
                "longitude": vm.DetailsOVT2.terminal.location.longitude
              };


              vm.customIcon = {
                "scaledSize": [32, 32],
                "url": "http://icons.iconarchive.com/icons/paomedia/small-n-flat/24/map-marker-icon.png"
              };
              NgMap.getMap().then(function (map) {
                var latlng = new google.maps.LatLng(vm.DetailsOVT2.terminal.location.latitude, vm.DetailsOVT2.terminal.location.longitude);
                map.setCenter(latlng);
                vm.map = map;
                google.maps.event.trigger(vm.map, 'resize');
              });
              vm.RecomendedDiag = vm.DetailsOVT2.diagnosis.recommendedAction.name;
              vm.IdDiagnosis = vm.DetailsOVT2.diagnosis.recommendedAction.recommActionId;
              
            
              
              diagnosticFactory.getLoginUid().then(function(data) {
               var token = data[0].loginuuid;
                var sanData = {
                  token: token,
                  san: vm.SAN
                };
                diagnosticFactory.getCommand(sanData).then(function(dataCommand) {
                  var datos = JSON.parse(dataCommand);
                  vm.diagnosticData = datos[0];                 
                });
              });
            });
          } else {
            ngNotify.set('The antenna size and Mount is not valid', 'error');
            vm.OVT1 = true;
            vm.OVT2 = false;
          }
        });
      }
    }
///obtiene el estado actual 
    function GetCurrentStats() {
      var objv = {};
      objv.token = vm.OVTToken;
      objv.url = 'current_stats_validation.json';
      objv.Jdata = '';
      objv.method = 'OVTGET';
      OVTFactory.DataOVT(objv).then(function (data) {
        ngNotify.set('The information has been updated', 'success');
        var DetailsOVT = JSON.parse(data);
        vm.DetailsOVT2 = DetailsOVT;
        vm.RecomendedDiag = vm.DetailsOVT2.diagnosis.recommendedAction.name;
      });
    }
///revisa si se efectuo el método del rango de fuerza
    function ForceRange() {
      var objv = {};
      objv.token = vm.OVTToken;
      objv.url = 'terminal/force_range.json';
      objv.Jdata = '';
      objv.method = 'OVTPUT';
      OVTFactory.DataOVT(objv).then(function (data) {

        if (data === "ERROR") {
          ngNotify.set('The force range method cannot be performed', 'error');
        } else if (data === "") {

          ngNotify.set('The force range  method has been permormed successful', 'success');
        } else {
          var error = JSON.parse(data);
          ngNotify.set(data, 'grimace');
        }
      });
    }
///revisa si se efectuo el método de limpiesa de estados 
    function ClearTerminal() {
      var objv = {};
      objv.token = vm.OVTToken;
      objv.url = 'terminal/clear_stats.json';
      objv.Jdata = '';
      objv.method = 'OVTPUT';
      OVTFactory.DataOVT(objv).then(function (data) {

        if (data === "ERROR") {
          ngNotify.set('The clear stats method cannot be performed', 'error');
        } else if (data === "") {

          ngNotify.set('The clear stats method has been permormed successful', 'success');
        } else {
          var error = JSON.parse(data);
          ngNotify.set(error.errors[0], 'grimace');
        }


      });
    }
///revisa si se efectuo el método de recarga de tamblas
    function ReloadTables() {
      var objv = {};
      objv.token = vm.OVTToken;
      objv.url = 'terminal/reload_tables.json';
      objv.Jdata = '';
      objv.method = 'OVTPUT';
      OVTFactory.DataOVT(objv).then(function (data) {
        if (data === "ERROR") {
          ngNotify.set('The reload tables method cannot be performed', 'error');
        } else if (data === "") {

          ngNotify.set('The reload tables method has been permormed successful', 'success');
        } else {
          var error = JSON.parse(data);
          ngNotify.set(error.errors[0], 'grimace');
        }

      });


    }
///revisa si se efectuo el método de retroceso forzoso 
    function ForceFallBack() {
      var objv = {};
      objv.token = vm.OVTToken;
      objv.url = 'terminal/force_fallback.json';
      objv.Jdata = '';
      objv.method = 'OVTPUT';
      OVTFactory.DataOVT(objv).then(function (data) {
        if (data === "ERROR") {
          ngNotify.set('The force fallback method cannot be performed', 'error');
        } else if (data === "") {
          ngNotify.set('The force fallback method has been  permormed successful', 'success');
        } else {
          var error = JSON.parse(data);

          ngNotify.set(error.errors[0], 'grimace');
        }

      });
    }
///revisa si se efectuo el método de reinicio 
    function Reboot() {
      var objv = {};
      objv.token = vm.OVTToken;
      objv.url = 'terminal/terminal/reboot.json';
      objv.Jdata = '';
      objv.method = 'OVTPUT';
      OVTFactory.DataOVT(objv).then(function (data) {
        if (data === "ERROR") {
          ngNotify.set('The force reboot method cannot be performed', 'error');
        } else if (data === "") {
          ngNotify.set('The reboot method has been  permormed successful', 'success');
        } else {
          var error = JSON.parse(data);

          ngNotify.set(error.errors[0], 'grimace');
        }

      });
    }
///revisa si se efectuo el método de completar accion 
    function CompleteAction() {
      var objv = {};
      objv.token = vm.OVTToken;
      objv.url = 'complete_action.json';
      objv.Jdata = '{"actionId" : ' + vm.IdDiagnosis + '}';
      objv.method = 'OVTPOST';
      OVTFactory.DataOVT(objv).then(function (data) {

        if (data === "ERROR") {
          ngNotify.set('The completed action method cannot be performed', 'error');
        } else if (data === "") {
          ngNotify.set('The completed action method has been  permormed successful', 'success');
        } else {
          var error = JSON.parse(data);

          ngNotify.set(error.errors[0], 'grimace');
        }

      });
    }

    var vm = this;
    vm.getPing = getPing;
    vm.getRefresh = getRefresh;
    vm.Procced = Procced;
    vm.OVT1 = true;
    vm.showmapa = false;
    vm.abrirSignOff = abrirSignOff;
    vm.GetCurrentStats = GetCurrentStats;
    vm.ForceRange = ForceRange;
    vm.ClearTerminal = ClearTerminal;
    vm.ReloadTables = ReloadTables;
    vm.ForceFallBack = ForceFallBack;
    vm.Reboot = Reboot;
    vm.CompleteAction = CompleteAction;
    vm.validate = validate;


  });
