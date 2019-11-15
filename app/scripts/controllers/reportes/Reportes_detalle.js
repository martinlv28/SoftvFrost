'use strict';
angular.module('softvFrostApp')
.controller('Reportes_DetalleCtrl', ['$http', 'reportesFactory','$timeout', 'ngNotify','$state', function ( $http, reportesFactory, $timeout, ngNotify, $state){

 

	var vm = this;
    vm.filename = "Reporte_detalle_de_terminales";
    var reportHeaderPdf = "Reporte Detalle de Terminales";
    var idAux = 1;  	
    vm.csvUnoHide = true; 
    vm.csvDosHide = true; 
    vm.divExportar = true; 
    var img = new Image();
    img.crossOrigin = "";  
///funcion de inicializacion del controlador,llama a varias funciones 
    this.$onInit = function() {

        getImageDataURL();
        
        getBeam();
        getPlan(); 
        getEstado();  
    }

///actualiza 
    function reloadRoute() {
        $state.reload(); 
    };
  ///obtiene el listado de beams 
    function getBeam() { 
        reportesFactory.mostrarBeam().then(function(data) {   
            vm.listaBeam = [{"BeamId":"Todos"}];
            for (var i = 0; i < data.GetBeam_reporteResult.length; i++)
                {
                    vm.listaBeam.push(data.GetBeam_reporteResult[i]);
                }         
           vm.beam_input = vm.listaBeam[0];         
        });
    }

    vm.getPlan = getPlan; 
    ///obtiene el listado de planes
    function getPlan() 
    {            
        reportesFactory.mostrarPlan().then(function(data) {    
            vm.listaPlan = [{"IdServicio":0, "Nombre":"Todos"}];
            for (var i = 0; i < data.GetPlanByBeam_reporteResult.length; i++)
                {
                    vm.listaPlan.push(data.GetPlanByBeam_reporteResult[i]);
                }         
           vm.plan_input = vm.listaPlan[0];         
        });

    }
///delclaracion de el id de los estados 
    function getEstado() {
            vm.listaEstado = [{"IdEstado":0, "Nombre":"Todos"},{"IdEstado": 1, "Nombre":"Activa"}, {"IdEstado": 2, "Nombre":"Cancelada"},
            {"IdEstado": 3, "Nombre":"Incompleta"},{"IdEstado": 4, "Nombre":"Pendiente"},{"IdEstado": 5, "Nombre":"Suspendida"} ];
            vm.estado_input = vm.listaEstado[0];
    }



    var arrayDetalle = [];
    vm.getReporteDetalleT = getReporteDetalleT; 
    ///hace validaciones donde depende de ellas cambia valores, despues llama a mostrarReporteDetTerminales
    function getReporteDetalleT() 
        {                   
            vm.divExportar = false;          
            var beam =  vm.beam_input.BeamId;  
            var plan = vm.plan_input.IdServicio;  
            var estado = vm.estado_input.Nombre; 
            var noSerie = null; 
            var idSus = null; 
            var siteId = null;  
      
            if (vm.san_input != null) 
            {
                noSerie = vm.san_input;
                if (vm.san_input == '' ) {
                noSerie = null;
                }
            }

            if (vm.idSuscriptor_input != null)
            {
                idSus = vm.idSuscriptor_input; 
                if (vm.idSuscriptor_input == '' ) {
                idSus = null;
                }
            }

            if (vm.siteId_input != null)
            {
                siteId = vm.siteId_input;
                if (vm.siteId_input == '' ) {
                    siteId = null;
                }
            }    

            if(beam == "Todos"){
                beam = -1;
            }   

            reportesFactory.mostrarReporteDetTerminales( idAux, beam, plan, estado, noSerie, idSus, siteId ).then(function(data) {
                    arrayDetalle = data.GetReporte_DetalleTerminalListResult;
                    vm.itemsByPage = 5; 
                    vm.rowCollection4 = arrayDetalle;  
                   
            });
        }

    vm.limpiarFiltros = limpiarFiltros;
    ///reestablece elementos de la vista y llama a la funcion reloadRoute
    function limpiarFiltros(){
      
        vm.san_input = null;
        vm.idSuscriptor_input = null;
        vm.siteId_input = null;
     
        vm.beam_input = vm.listaBeam[0];
        vm.plan_input = vm.listaPlan[0];
        vm.estado_input = vm.listaEstado[0];
        reloadRoute();
   


    }
    //////obtiene la imagen en un url
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



    //CSV 
    vm.order = [ 'SAN', 'Estado', 'Beam', 'SatellitedID', 'PlanServ', 'ESN', 'IdSuscriptor', 'EstadoFap', 'Ipv4', 'Ipv6', 'AssocTime', 'Latitud','Longitud', 'AvailTokens','TxBytes','RxBytes','DiaRelleno'];

    // CREAR CSV 
    vm.crearVisibleAsCsv = crearVisibleAsCsv;
    ///CREAR CSV 
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
    ///CREAR CSV 
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

///los encabezados que llevara el reporte 
    function initArray (){
      vm.arrayReporte = []; 
         // ENCABEZADOS
        vm.arrayReporte =     [{
            "SAN": "SAN",
            "Estado": "Estado",          
            "Beam": "Beam",
            "SatellitedID" : "Satellite",
            "PlanServ": "Plan de Servicio",
            "ESN": "ESN",
            "IdSuscriptor": "Id Suscriptor",
            "EstadoFap": "Estado FAP",   
            "Ipv4": "IPV4",
            "Ipv6": "IPV6",               
            "AssocTime": "Assoc Time",          
            "Latitud": "Latitud",
            "Longitud": "Longitud", 
            "AvailTokens": "Avail Tokens",               
            "TxBytes": "TXBytes",
            "RxBytes": "RXBytes",
            "DiaRelleno": "Día de Relleno"
            }];
    } 


// Create TABLE PDF 
vm.createPdfTodo = createPdfTodo;
///Crea la tabla que llevara el reporte 
function createPdfTodo(pdfAcrear){
  

    var rows = [ [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] ]; 
    
    var r = 1; 
    var c = 0; 

    var ro = 0; 
      if ( pdfAcrear =='todo')
        { ro = vm.rowCollection4.length; }
        else 
        { ro = vm.displayedCollection4.length; }


    var cols = 16; 
    var columns = ["SAN", "Estado", "Beam", "Satellite", "Plan de Servicio", "ESN", "Id Suscriptor", "Estado FAP", "IPV4", "IPV6", 
                    "Assoc Time", "Latitud", "Longitud", "Avail Tokens", "TXBytes", "RXBytes", "Día de Relleno"];

   
    for( var i=r; i<ro; i++ ) {         
      rows.push( [] );
    }

    
    for (var i = 0; i < ro; i++)
    {    
        if ( pdfAcrear =='todo') 
        {  
            rows[i][0] = vm.rowCollection4[i].SAN;
            rows[i][1] = vm.rowCollection4[i].Estado;
            rows[i][2] = vm.rowCollection4[i].Beam;
            rows[i][3] = vm.rowCollection4[i].SatellitedID;
            rows[i][4] = vm.rowCollection4[i].PlanServ;
            rows[i][5] = vm.rowCollection4[i].ESN;
            rows[i][6] = vm.rowCollection4[i].IdSuscriptor;
            rows[i][7] = vm.rowCollection4[i].EstadoFap;
            rows[i][8] = vm.rowCollection4[i].Ipv4;
            rows[i][9] = vm.rowCollection4[i].Ipv6;
            rows[i][10] = vm.rowCollection4[i].AssocTime;
            rows[i][11] = vm.rowCollection4[i].Latitud;  
            rows[i][12] = vm.rowCollection4[i].Longitud;
            rows[i][13] = vm.rowCollection4[i].AvailTokens;
            rows[i][14] = vm.rowCollection4[i].TxBytes;
            rows[i][15] = vm.rowCollection4[i].RxBytes;  
            rows[i][16] = vm.rowCollection4[i].DiaRelleno;  
        }else //VISIBLE DATA
        {           
            rows[i][0] = vm.displayedCollection4[i].SAN;
            rows[i][1] = vm.displayedCollection4[i].Estado;
            rows[i][2] = vm.displayedCollection4[i].Beam;
            rows[i][3] = vm.displayedCollection4[i].SatellitedID;
            rows[i][4] = vm.displayedCollection4[i].PlanServ;
            rows[i][5] = vm.displayedCollection4[i].ESN;
            rows[i][6] = vm.displayedCollection4[i].IdSuscriptor;
            rows[i][7] = vm.displayedCollection4[i].EstadoFap;
            rows[i][8] = vm.displayedCollection4[i].Ipv4;
            rows[i][9] = vm.displayedCollection4[i].Ipv6;
            rows[i][10] = vm.displayedCollection4[i].AssocTime;
            rows[i][11] = vm.displayedCollection4[i].Latitud;  
            rows[i][12] = vm.displayedCollection4[i].Longitud;
            rows[i][13] = vm.displayedCollection4[i].AvailTokens;
            rows[i][14] = vm.displayedCollection4[i].TxBytes;
            rows[i][15] = vm.displayedCollection4[i].RxBytes;    
            rows[i][16] = vm.displayedCollection4[i].DiaRelleno;  
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
                fontSize: 7.1,       
            },
            bodyStyles: {        
                fontSize: 6.6 
            }
        });

        doc.autoTable( columns, rows, {
            startY:27,      
            theme: 'plain',
         
         
            styles:{
                overflow: 'linebreak',   
            },
            columnStyles: { 
                  4: {columnWidth: 16},     
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

        //-------------------------------------------

    }

]);