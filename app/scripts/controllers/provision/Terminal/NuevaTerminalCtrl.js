'use strict';
angular.module('softvFrostApp').controller('NuevaTerminalCtrl', NuevaTerminalCtrl);

function NuevaTerminalCtrl(terminalFactory, SuscriptorFactory, $uibModal, $rootScope, ngNotify, $state, $filter, $stateParams,globalService) {
	var vm = this;
	vm.titulo = 'Nueva Terminal';
	vm.HabilitaEmpresarial = true;
	vm.BuscaSuscriptor = BuscaSuscriptor;
	vm.ValidarServicio = ValidarServicio;
	vm.BuscaLatLong = BuscaLatLong;
	vm.GuardaTerminal = GuardaTerminal;
	vm.ObtieneSubredes = ObtieneSubredes;
	vm.FechaAlta = new Date();
	vm.AlertaSubred = false;
	vm.Empresarial = true;
	vm.ListaStatus = [{
		'clave': 'Pendiente',
		'Nombre': 'Pendiente'
	},
	{
		'clave': 'Activa',
		'Nombre': 'Activa'
	},
	{
		'clave': 'Suspendida',
		'Nombre': 'Suspendida'
	},
	{
		'clave': 'Cancelada',
		'Nombre': 'Cancelada'
	},
	{
		'clave': 'Incompleta',
		'Nombre': 'Incompleta'
	}
	];
///funcion de inicializacion del controlador,coloca los datos del suscriptor 
	this.$onInit = function () {
		if ($stateParams.idSuscriptor != undefined) {
			var busObj = {
				'IdSuscriptor': $stateParams.idSuscriptor,
				'Nombre': '',
				'Apellido': '',
				'Telefono': '',
				'Email': '',
				'Calle': '',
				'Numero': '',
				'Colonia': '',
				'Ciudad': '',
				'Op': 1
			};
			SuscriptorFactory.buscarSuscriptor(busObj).then(function (data) {
				vm.datosSus = data.GetFilterSuscriptorListResult[0];
				vm.IdSuscriptor = vm.datosSus.IdSuscriptor;
				vm.NombreSuscriptor = vm.datosSus.Nombre + ' ' + vm.datosSus.Apellido;
				vm.FirstNameSuscriptor = vm.datosSus.Nombre;
				vm.LastNameSuscriptor = vm.datosSus.Apellido;
				vm.Calle = vm.datosSus.Calle;
				vm.Numero = vm.datosSus.Numero;
				vm.Ciudad = vm.datosSus.Ciudad;
				vm.IdEstado = vm.datosSus.IdEstado;
				vm.CP = vm.datosSus.CP;
				vm.Telefono = vm.datosSus.Telefono;
				vm.Email = vm.datosSus.Email;
			});
		}
		/*terminalFactory.getServicioListByProgramCode('TEVPGCD').then(function (dataServicios) {
			vm.Servicios = dataServicios.GetServicioListByProgramCodeResult;
		});*/
	}
///nos manda a la vista ModalBusquedaSuscriptor.html
	function BuscaSuscriptor() {
		var modalInstance = $uibModal.open({
			animation: true,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: 'views/provision/ModalBusquedaSuscriptor.html',
			controller: 'ModalBusquedaSuscriptorCtrl',
			controllerAs: 'ctrl',
			backdrop: 'static',
			keyboard: false,
			size: 'lg'
		});
	}
///valida si el servicio se encuetra dentro de las coordenadas 
	function ValidarServicio() {
		if((vm.Latitud != '' && vm.Longitud != '') && (vm.Latitud != null && vm.Latitud != null))
		{
			if(vm.Servicio != null)
			{
				var parametros = new Object();
				//Obtiene el código del estado para hughes
				terminalFactory.getEstadoById(vm.IdEstado).then(function (data) {				
					vm.estado = data.GetEstadoResult;
					parametros.servicio = vm.Servicio.Nombre;
					parametros.latitud = vm.Latitud;
					parametros.longitud = vm.Longuitud;
					//Obtiene el nombre del frupo de servicios disponibles en esa área
					terminalFactory.hughesValidaServicio(parametros).then(function (hughesData) {
					
						if (hughesData.soapEnvelope.soapBody.ServicePrequalificationResponseMsg.AvailabilityFlag != 'true') {
							ngNotify.set('Sin área de cobertura', 'error');
						} else {
							ngNotify.set('Dentro del área de cobertura','success');
							vm.BeamID = hughesData.soapEnvelope.soapBody.ServicePrequalificationResponseMsg.BeamID;
							vm.SatelliteID = hughesData.soapEnvelope.soapBody.ServicePrequalificationResponseMsg.SatellitedID;
							vm.Polarization = hughesData.soapEnvelope.soapBody.ServicePrequalificationResponseMsg.Polarization;

							//Habilitamos el check de empresarial
							//vm.HabilitaEmpresarial = false;

							//Nos traemos las subredes del servicio y beam
							var parametros2 = {};
							parametros2.IdServicio = vm.Servicio.IdServicio;
							parametros2.Beam = vm.BeamID;
							terminalFactory.obtienePoolsServicioBeam(parametros2).then(function(hughesData) {
								
								vm.SubRedes = hughesData.GetObtienePoolsBeamServicioResult;
								vm.SubRed = vm.SubRedes[0];
								if (vm.SubRedes.length === 0){
									vm.AlertaSubred = true;
								}
								else{
									vm.AlertaSubred = false;
								}
							});

							
						}
					});
				});
			}
			else{
				ngNotify.set('Es necesario seleccionar un servicio para validar el servicio','info');
			}
		}
		else{
			ngNotify.set('Es necesario capturar las coordenadas para validar el servicio','info');
		}
	}
///revisa el elemento Empresarial y si es true obtiene los pools del servicio Beam
	function ObtieneSubredes(){
		if (vm.Empresarial === true)
		{
			var parametros = {};
			parametros.IdServicio = vm.Servicio.IdServicio;
			parametros.Beam = vm.BeamID;
			terminalFactory.obtienePoolsServicioBeam(parametros).then(function (hughesData) {				
				vm.SubRedes = hughesData.GetObtienePoolsBeamServicioResult;
			});
		}
	}
///añade ceros a la izquierda 
	function hughesGetSanCompuesto(obj) {
		var a = obj.toString();
		var i;
		for (i = a.length; i < 9; i++) {
			a = '0' + a;
		}

		return globalService.getType() + a;

	};
///manda a otra vista ModalGetLatLong.html
	function BuscaLatLong() {
		var obj = {
			lat: 23.96617587126503,
			long: -101.953125
		};
		var modalInstance = $uibModal.open({
			animation: true,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: 'views/provision/ModalGetLatLong.html',
			controller: 'ModalGetLatLongCtrl',
			controllerAs: 'ctrl',
			backdrop: 'static',
			keyboard: false,
			size: 'lg',
			resolve: {
				datosGis: function () {
					return obj;
				}
			}
		});
	}
	$rootScope.$on('cliente_seleccionado', function (e, detalle) {
		vm.IdSuscriptor = detalle.IdSuscriptor;
		vm.NombreSuscriptor = detalle.Nombre + ' ' + detalle.Apellido;

		vm.FirstNameSuscriptor = detalle.Nombre;
		vm.LastNameSuscriptor = detalle.Apellido;
		vm.Calle = detalle.Calle;
		vm.Numero = detalle.Numero;
		vm.Ciudad = detalle.Ciudad;
		vm.IdEstado = detalle.IdEstado;
		vm.CP = detalle.CP;
		vm.Telefono = detalle.Telefono;
		vm.Email = detalle.Email;
		vm.Referencia = detalle.Referencia;

		//Nos traemos los servicios dependiendo de la referencia del suscriptor seleccionado
		var parametros = {};
		parametros.IdSuscriptor = vm.IdSuscriptor;
		terminalFactory.GetServiciosPorSucriptor(parametros).then(function (dataServicios) {
			vm.Servicios = dataServicios.GetServiciosPorSucriptorResult;
			if(vm.Servicios.length == 1){
				vm.Servicio = vm.Servicios[0];
			}
		});
		
	});

	$rootScope.$on('get_LatLong', function (e, detalle) {
		vm.Latitud = detalle[0];
		vm.Longuitud = detalle[1];
	});
///valida que este definido el suscriptor, 
	function GuardaTerminal() {
		if (vm.IdSuscriptor == null || vm.IdSuscriptor == undefined) {
			ngNotify.set('No se ha definido un suscriptor para la terminal', 'error');
			return;
		}

		var parametros = {
			'IdSuscriptor': vm.IdSuscriptor,
			'IdServicio': vm.Servicio.IdServicio,
			'Latitud': vm.Latitud,
			'Longitud': vm.Longuitud,
			'Estatus': vm.Status.clave,
			'FechaAlta': vm.FechaAlta,
			'FechaSuspension': '',
			'ESN': vm.ESN,
			'Comentarios': vm.Comentarios
		};
		//Si es empersarial ponemos los datos de la IP
		if (vm.SubRedes.length > 0 && vm.SubRed != undefined){
			//Guarda la terminal en la base y obtiene el SAN
			terminalFactory.GuardaTerminal(parametros).then(function (data) {
				var obj = {};
				//Crea la terminal en la plataforma de Hughes
				terminalFactory.getSequenceId().then(function (Sequence) {
					obj.transactionSequenceId = Sequence.GetSequenceIdResult.TransactionSequenceId;
					obj.SAN = data.AddTerminalResult.SANCompleto;
					obj.nombre = vm.FirstNameSuscriptor;
					obj.apellido = vm.LastNameSuscriptor;
					obj.direccion = vm.Calle + ' ' + vm.Numero;
					obj.ciudad = vm.Ciudad;
					obj.estado = vm.estado.Codigo;
					obj.codigoPostal = vm.CP;
					obj.latitud = vm.Latitud;
					obj.longitud = vm.Longuitud;
					obj.telefono = vm.Telefono;
					obj.email = vm.Email;
					obj.servicio = vm.Servicio.Nombre;
					//Los nuevos de IP
					obj.IPv4SubnetMask = vm.SubRed.MascaraRed4Terminal;
		            obj.VlanID = 1;
		            obj.MappedIPv4Subnet = vm.SubRed.IPTerminal;
		            obj.IPv6PrefixLen = vm.SubRed.MascaraRed6Terminal;
		            obj.MappedIPv6Prefix = vm.SubRed.IPv6Terminal;//vm.SubRed.MascaraIPv6;
		            obj.MappedIPv4Prefix = vm.SubRed.MascaraRed4Terminal;
					//alert(JSON.stringify(obj));
					terminalFactory.hughesCrearTerminalIP(obj).then(function (hughesData) {
					
						var Obj2 = new Object();
						Obj2.objMovimiento = new Object();
						Obj2.objMovimiento.SAN = data.AddTerminalResult.SAN;
						Obj2.objMovimiento.IdComando = 1;//Hardcodeado a la tabla de Comando
						Obj2.objMovimiento.IdUsuario = 0;
						Obj2.objMovimiento.IdTicket = 0;
						Obj2.objMovimiento.OrderId = hughesData.StandardResponse.OrderId;
						vm.fechaAuxiliar = new Date();
						Obj2.objMovimiento.Fecha = $filter('date')(vm.fechaAuxiliar, 'dd/MM/yyyy HH:mm:ss');
						Obj2.objMovimiento.Mensaje = hughesData.StandardResponse.Message;
						Obj2.objMovimiento.IdOrigen = 2;//Hardcodeado a la tabla de OrigenMovimiento
						Obj2.objMovimiento.Detalle1 = '';
						Obj2.objMovimiento.Detalle2 = '';

						if (hughesData.StandardResponse.Code!='5') {
								//----------------------------------
							var Obj3=new Object();
							Obj3.objTerminal=new Object();
							Obj3.objTerminal.SAN=data.AddTerminalResult.SAN;
							Obj3.objTerminal.IdSuscriptor=vm.IdSuscriptor;
							Obj3.objTerminal.IdServicio=vm.Servicio.IdServicio;

							Obj3.objTerminal.Latitud = vm.Latitud;
							Obj3.objTerminal.Longitud = vm.Longuitud;
							Obj3.objTerminal.Estatus = 'Incompleta';
							Obj3.objTerminal.FechaAlta = vm.FechaAlta;
							Obj3.objTerminal.FechaSuspension = '';
							Obj3.objTerminal.ESN = vm.ESN;
							Obj3.objTerminal.Comentarios = vm.Comentarios;
							terminalFactory.updateTerminal(Obj3).then(function (data) {
								ngNotify.set('Error al crear la terminal en la plataforma.', 'error');
							});
							//--------------------------------------------------

							//Ponemos el movimiento como no exitoso
							Obj2.objMovimiento.Exitoso=0;

						} else {
							//Objeto para actualizar el SatelliteId y BeamId a la terminal
							var Obj4 = new Object();
							Obj4.objTerminal = new Object();
							Obj4.objTerminal.SatellitedID = vm.SatelliteID;
							Obj4.objTerminal.BeamID = vm.BeamID;
							Obj4.objTerminal.Polarization = vm.Polarization;
							Obj4.objTerminal.SAN = data.AddTerminalResult.SAN;
							Obj4.objTerminal.Clv_IP = vm.SubRed.Clv_IP;
							Obj4.objTerminal.Clv_IP6 = vm.SubRed.Clv_IP6;
							//Actualizamos información adicional de la terminal
						
							terminalFactory.agregaInfoTerminal(Obj4).then(function (obj) {
							});
							ngNotify.set('La terminal se ha guardado correctamente', 'success');
							//Ponemos el movimiento como  exitoso
							Obj2.objMovimiento.Exitoso=1;
						}

						terminalFactory.addMovimiento(Obj2).then(function (dataMovimiento) {
						});
						$state.go('home.provision.terminales');
					});
				});
			});
		}
		else{
			//Guarda la terminal en la base y obtiene el SAN
			terminalFactory.GuardaTerminal(parametros).then(function (data) {
				//console.log(data);
				var obj = new Object();
				//Crea la terminal en la plataforma de Hughes
				terminalFactory.getSequenceId().then(function (Sequence) {
					obj.transactionSequenceId = Sequence.GetSequenceIdResult.TransactionSequenceId;
					obj.SAN = data.AddTerminalResult.SANCompleto;//hughesGetSanCompuesto(data.AddTerminalResult);
					obj.nombre = vm.FirstNameSuscriptor;
					obj.apellido = vm.LastNameSuscriptor;
					obj.direccion = vm.Calle + ' ' + vm.Numero;
					obj.ciudad = vm.Ciudad;
					obj.estado = vm.estado.Codigo;
					obj.codigoPostal = vm.CP;
					obj.latitud = vm.Latitud;
					obj.longitud = vm.Longuitud;
					obj.telefono = vm.Telefono;
					obj.email = vm.Email;
					obj.servicio = vm.Servicio.Nombre;
					//alert(JSON.stringify(obj));
					terminalFactory.hughesCrearTerminal(obj).then(function (hughesData) {
					
						var Obj2 = new Object();
						Obj2.objMovimiento = new Object();
						Obj2.objMovimiento.SAN = data.AddTerminalResult.SAN;
						Obj2.objMovimiento.IdComando = 1;//Hardcodeado a la tabla de Comando
						Obj2.objMovimiento.IdUsuario = 0;
						Obj2.objMovimiento.IdTicket = 0;
						Obj2.objMovimiento.OrderId = hughesData.StandardResponse.OrderId;
						vm.fechaAuxiliar = new Date();
						Obj2.objMovimiento.Fecha = $filter('date')(vm.fechaAuxiliar, 'dd/MM/yyyy HH:mm:ss');
						Obj2.objMovimiento.Mensaje = hughesData.StandardResponse.Message;
						Obj2.objMovimiento.IdOrigen = 2;//Hardcodeado a la tabla de OrigenMovimiento
						Obj2.objMovimiento.Detalle1 = '';
						Obj2.objMovimiento.Detalle2 = '';

						if (hughesData.StandardResponse.Code!='5') {
								//----------------------------------
							var Obj3=new Object();
							Obj3.objTerminal=new Object();
							Obj3.objTerminal.SAN=data.AddTerminalResult.SAN;
							Obj3.objTerminal.IdSuscriptor=vm.IdSuscriptor;
							Obj3.objTerminal.IdServicio=vm.Servicio.IdServicio;

							Obj3.objTerminal.Latitud = vm.Latitud;
							Obj3.objTerminal.Longitud = vm.Longuitud;
							Obj3.objTerminal.Estatus = 'Incompleta';
							Obj3.objTerminal.FechaAlta = vm.FechaAlta;
							Obj3.objTerminal.FechaSuspension = '';
							Obj3.objTerminal.ESN = vm.ESN;
							Obj3.objTerminal.Comentarios = vm.Comentarios;
							terminalFactory.updateTerminal(Obj3).then(function (data) {
								ngNotify.set('Error al crear la terminal en la plataforma.', 'error');
							});
							//--------------------------------------------------

							//Ponemos el movimiento como no exitoso
							Obj2.objMovimiento.Exitoso=0;

						} else {
							//Objeto para actualizar el SatelliteId y BeamId a la terminal
							var Obj4 = new Object();
							Obj4.objTerminal = new Object();
							Obj4.objTerminal.SatellitedID = vm.SatelliteID;
							Obj4.objTerminal.BeamID = vm.BeamID;
							Obj4.objTerminal.Polarization = vm.Polarization;
							Obj4.objTerminal.SAN = data.AddTerminalResult.SAN;
							Obj4.objTerminal.Clv_IP = 0;
							Obj4.objTerminal.Clv_IP6 = 0;
							//Actualizamos información adicional de la terminal
						
							terminalFactory.agregaInfoTerminal(Obj4).then(function (obj) {
							});
							ngNotify.set('La terminal se ha guardado correctamente', 'success');
							//Ponemos el movimiento como  exitoso
							Obj2.objMovimiento.Exitoso=1;
						}

						terminalFactory.addMovimiento(Obj2).then(function (dataMovimiento) {
						});
						$state.go('home.provision.terminales');
					});
				});
			});
		}
	}

}
