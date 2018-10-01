'use strict';
angular.module('softvFrostApp').config(function ($stateProvider) {
  var states = [{
      name: 'home.memoria',
      abstract: true,
      template: '<div ui-view></div>'
    },
    {
      name: 'home.memoria.memoriastecnicasServicio',
      data: {
        pageTitle: 'SOFTV | MEMORIA TECNICA SERVICIO',
        permissions: {
          //only: ['memoriaSelect'],
          options: {
            reload: false
          }
        }
      },
      url: '/memoriastecnicasServicio',
      templateUrl: 'views/memorias/memoriasServicio.html',
      controller: 'memoriatecnicaServicioCtrl',
      controllerAs: '$ctrl'
    },

    {
      name: 'home.memoria.nuevamemoriaServicio',
      data: {
        pageTitle: 'SOFTV | NUEVA MEMORIA SERVICIO',
      },
      url: '/memoriastecnicasServicio/nuevamemoria',
      templateUrl: 'views/memorias/nuevamemoriatecnicaServicio.html',
      controller: 'nuevamemoriatecnicaServicioCtrl',
      controllerAs: '$ctrl'
    },
    {
      name: 'home.memoria.detallememoriaServicio',
      data: {
        pageTitle: 'SOFTV | DETALLE MEMORIA TECNICA SERVICIO',
      },
      url: '/memoriastecnicasServicio/detalle/:id',
      templateUrl: 'views/memorias/nuevamemoriatecnicaServicio.html',
      controller: 'detallememoriatecnicaServicioCtrl',
      controllerAs: '$ctrl'
    },
    {
      name: 'home.memoria.editarmemoriaServicio',
      data: {
        pageTitle: 'SOFTV | EDITAR MEMORIA TECNICA SERVICIO',
      },
      url: '/memoriastecnicasServicio/edit/:id',
      templateUrl: 'views/memorias/nuevamemoriatecnicaServicio.html',
      controller: 'editamemoriatecnicaServicioCtrl',
      controllerAs: '$ctrl'
    },
    {
      name: 'home.memoria.bitacoraServicio',
      data: {
        pageTitle: 'SOFTV | BITACORA SERVICIO',
      },
      url: '/bitacora',
      templateUrl: 'views/memorias/bitacoraServicio.html',
      controller: 'bitacoraServicioCtrl',
      controllerAs: '$ctrl'
    },
    {
      name: 'home.memoria.reporteServicio',
      data: {
        pageTitle: 'SOFTV | REPORTE',
      },
      url: '/reportememoriaServicio',
      templateUrl: 'views/memorias/reporteMemoriaServicio.html',
      controller: 'reporteMemoriaServicioCtrl',
      controllerAs: '$ctrl'
    }


    
  ];

  states.forEach(function (state) {
    $stateProvider.state(state);
  });
});