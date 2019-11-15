'use strict';
angular.module('softvFrostApp')
.controller('Reportes_TokenCtrl', ['$http', 'reportesFactory','$timeout', 'ngNotify', '$state', function ( $http, reportesFactory, $timeout, ngNotify, $state){

 





	var vm = this;
    vm.filename = "Reporte_de_tokens";
    var reportHeaderPdf = "Reporte de Tokens";
    var fechaInicioYMD;
    var fechaFinYMD; 
    var idAux = 1;  
    vm.csvUnoHide = true; 
    vm.csvDosHide = true; 	
    var img = new Image();
    img.crossOrigin = "";  

///funcion de inicializacion del controlador, llama a dos funciones 
    this.$onInit = function() {
        getImageDataURL();
        getReporteTokens();   

    }
    ///Actualiza 

    function reloadRoute() {
        $state.reload(); 
    };

    vm.limpiarFiltros = limpiarFiltros;
    ///Limpia las fehcas y llama a la funcion reloadRoute
    function limpiarFiltros(){
        vm.fechaInicio = null;
        vm.fechaFin = null;
        reloadRoute();
    }

///obtiene la imagen en un url
    function getImageDataURL() 
    {             
      
        var url = document.getElementById("pdflogoimage").src;  
        var data, canvas, ctx;

        img.onload = function()
        {
            // Create the canvas element.
            canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            // Get '2d' context and draw the image.
            ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            // Get canvas data URL
            data = canvas.toDataURL();   
           
        }
            // Load image URL.    
        img.src = url;  
    }




    var arrayTokens = [];   
    vm.getReporteTokens = getReporteTokens;
    ///valida las fechas, donde si estan bien llama a mostrarReporteTokens
    function getReporteTokens()
    {                     
        getFechas();  
        if (vm.fechaFin == null){ vm.fechaFin = undefined; }
        if (vm.fechaInicio > vm.fechaFin){
            ngNotify.set('La fecha de inicio debe ser anterior a la fecha fin', {
                type: 'error'
            });  
        }       

        else {
            reportesFactory.mostrarReporteTokens(idAux, fechaInicioYMD, fechaFinYMD).then(function(data) {
     
                arrayTokens = data.GetReporte_TokensListResult;
                vm.itemsByPage = 5; 
                vm.rowCollection4 = arrayTokens; 
            });
        }  
    }

///valida las fechas y depende a las validaciones las asigna con un formato definido 
    function getFechas(){
        if ( vm.fechaInicio == null ){
                fechaInicioYMD = null;
        }
        else {                
                var D1 = vm.fechaInicio; 
                var month = D1.getUTCMonth() + 1;
                var day = D1.getUTCDate();
                var year = D1.getUTCFullYear();
                fechaInicioYMD = year + "/" + month + "/" + day;
        }
        if ( vm.fechaFin == null ){
                fechaFinYMD = null;
        }else{
                var D2 = vm.fechaFin; 
                var month = D2.getUTCMonth() + 1; 
                var day = D2.getUTCDate();
                var year = D2.getUTCFullYear();
                fechaFinYMD = year + "/" + month + "/" + day;
        }
    }

    vm.clearInicio = clearInicio;
    ///limpia la deha de inicio 
    function clearInicio(){
        fechaInicioYMD = null;
        vm.fechaInicio = fechaInicioYMD;        
  
    }

    vm.clearFin = clearFin;
    ///limpia la fecha de fin      
    function clearFin(){
        vm.fechaFin = null;
        fechaFinYMD = null; 
    }



    //CSV 
    vm.order = [ 'SAN', 'Beam', 'SatellitedID', 'Suscriptor',  'PlanServ', 'ESN', 'Detalle1', 'FechaIngreso', 'Latitud', 'Longitud', 'FechaAlta','Usuario'];

    // CREAR CSV 
    vm.crearVisibleAsCsv = crearVisibleAsCsv;
    ///crea csv
    function crearVisibleAsCsv() {
        $timeout(function() {

        
        for (var i = 0; i < vm.displayedCollection4.length; i++) 
            { 
                delete vm.displayedCollection4[i].BaseIdUser;
                delete vm.displayedCollection4[i].BaseRemoteIp;
                delete vm.displayedCollection4[i].$$hashKey;
            } 

            initArray();
       
          for (var i = 0; i < vm.displayedCollection4.length; i++) 
            {   
                vm.arrayReporte.push(vm.displayedCollection4[i]);   
            } 
          
        angular.element('#csvUno').triggerHandler('click'); 
      });
    };


    // CREAR CSV 
    vm.crearTodoAsCsv = crearTodoAsCsv;
    ///crea csv
    function crearTodoAsCsv() {
      $timeout(function() {

      
        for (var i = 0; i < vm.rowCollection4.length; i++) 
            { 
                delete vm.rowCollection4[i].BaseIdUser;
                delete vm.rowCollection4[i].BaseRemoteIp;
                delete vm.rowCollection4[i].$$hashKey;
            } 

            initArray();
       
          for (var i = 0; i < vm.rowCollection4.length; i++) 
            {   
                vm.arrayReporte.push(vm.rowCollection4[i]);  
            } 
           
        angular.element('#csvDos').triggerHandler('click'); 
      });
    };

///Listado de los encabezados de la tabla
    function initArray (){
      vm.arrayReporte = [];  
         // ENCABEZADOS
        vm.arrayReporte =     [{
                "SAN": "SAN",
                "Beam": "Beam",
                "SatellitedID":"Satellite",
                "Suscriptor": "Suscriptor",                
                "PlanServ": "Plan de Servicio",
                "ESN": "ESN",
                "Detalle1": "Token (MB)",
                "FechaIngreso": "Fecha Ingreso Token",            
                "Latitud": "Latitud",
                "Longitud": "Longitud", 
                "FechaAlta": "Fecha Alta",               
                "Usuario": "Usuario"
                }];
    } 


// Create TABLE PDF 
vm.createPdfTodo = createPdfTodo;
///crea la tabla que tendra el pdf 
function createPdfTodo(pdfAcrear){

    var rows = [ [0,0,0,0,0,0,0,0,0,0,0,0] ]; 
   
    var r = 1; 
    var c = 0; 

    var ro = 0; 
      if ( pdfAcrear =='todo')
        { ro = vm.rowCollection4.length; }
        else 
        { ro = vm.displayedCollection4.length; }


    var cols = 12; 
    var columns = [ "SAN", "Beam", "Satellite","Suscriptor", "Plan de Servicio", "ESN", "Token (MB)", "Fecha Ingreso Token", "Latitud", "Longitud", "Fecha Alta", "Usuario"];

   
    for( var i=r; i<ro; i++ ) {         
      rows.push( [] );
    }

    
    for (var i = 0; i < ro; i++)
    {    
        if ( pdfAcrear =='todo') 
        {  
            rows[i][0] = vm.rowCollection4[i].SAN;
            rows[i][1] = vm.rowCollection4[i].Beam;
            rows[i][2] = vm.rowCollection4[i].SatellitedID;
            rows[i][3] = vm.rowCollection4[i].Suscriptor;            
            rows[i][4] = vm.rowCollection4[i].PlanServ;
            rows[i][5] = vm.rowCollection4[i].ESN;
            rows[i][6] = vm.rowCollection4[i].Detalle1;
            rows[i][7] = vm.rowCollection4[i].FechaIngreso;
            rows[i][8] = vm.rowCollection4[i].Latitud;
            rows[i][9] = vm.rowCollection4[i].Longitud;
            rows[i][10] = vm.rowCollection4[i].FechaAlta;
            rows[i][11] = vm.rowCollection4[i].Usuario;  
        }else 
        {           
            rows[i][0] = vm.displayedCollection4[i].SAN;
            rows[i][1] = vm.displayedCollection4[i].Beam;
            rows[i][2] = vm.displayedCollection4[i].SatellitedID;
            rows[i][3] = vm.displayedCollection4[i].Suscriptor;            
            rows[i][4] = vm.displayedCollection4[i].PlanServ;
            rows[i][5] = vm.displayedCollection4[i].ESN;
            rows[i][6] = vm.displayedCollection4[i].Detalle1;
            rows[i][7] = vm.displayedCollection4[i].FechaIngreso;
            rows[i][8] = vm.displayedCollection4[i].Latitud;
            rows[i][9] = vm.displayedCollection4[i].Longitud;
            rows[i][10] = vm.displayedCollection4[i].FechaAlta;
            rows[i][11] = vm.displayedCollection4[i].Usuario;   
        } 
    } 


    // Create document
    var doc = new jsPDF({
        orientation: 'landscape',
        format: 'A4'
    });

         //Page number 
    var totalPagesExp = "{total_pages_count_string}";
    var pageContent = function (data) {    
        // FOOTER
        var str = "Page " + data.pageCount;
        
        if (typeof doc.putTotalPages === 'function') {
            str = str + " of " + totalPagesExp;
        }
        doc.setFontSize(9);
      
        doc.text(doc.internal.pageSize.width - 28 , doc.internal.pageSize.height - 8, str); 
              
    };
     






    doc.addImage(img, 'jpeg', 5, 5, 40, 15); 


    // Encabezado 
    doc.setFontSize(14); 
    doc.setFontType("bold");
    var fontSize = doc.internal.getFontSize(); // Get current font size
    var pageWidth = doc.internal.pageSize.width; 
    var txtWidth = doc.getStringUnitWidth(reportHeaderPdf) * fontSize / doc.internal.scaleFactor;
    var x = ( pageWidth - txtWidth ) / 2;    // Calculate text's x coordinate    
    doc.text(reportHeaderPdf, x, 14);   // Posición text at x,y

        
    var laFechaHoy = reportesFactory.obtenerFechaHoy();
    doc.setFontSize(11);   
    doc.setFontType("normal");
    doc.text(doc.internal.pageSize.width - 45 , 20, laFechaHoy);   
        
    doc.setPage(1);


       

    // Custom table 
    jsPDF.autoTableSetDefaults({
        headerStyles: 
        {   
            fontSize: 7.2,       
        },
        bodyStyles: {        
            fontSize: 6.4 
        }
    });

    doc.autoTable( columns, rows, {
        startY:27,    
        theme: 'plain',
       
       
        styles:{
            overflow: 'linebreak',   
        },
            
                  
                
         
        margin: {top: 10, right: 5, bottom: 16, left: 5},
        addPageContent: pageContent //page number
    });
    // Total page number plugin only available in jspdf v1.0+
    if (typeof doc.putTotalPages === 'function') {
        doc.putTotalPages( totalPagesExp);
    }

        doc.save(vm.filename+'.pdf');    
    }

      



    }

]);