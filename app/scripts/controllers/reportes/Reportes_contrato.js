'use strict';
angular.module('softvFrostApp')
.controller('Reportes_ContratoCtrl', ['$http', 'reportesFactory','$timeout', 'ngNotify','$state', function ( $http, reportesFactory, $timeout, ngNotify, $state){


 
	var vm = this;
    vm.filename = "Reporte_contrato";
    var reportHeaderPdf = "Reporte Contrato";
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
        getReporteContrato();  

    }
///actualiza 
    function reloadRoute() {
        $state.reload(); 
    };
///limpia las fechas de inicio y din y llama a la funcion reloadRoute

    vm.limpiarFiltros = limpiarFiltros;
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

    var arrayContrato = [];   
    vm.getReporteContrato = getReporteContrato;
    ///trae el reporte del contrato 
    function getReporteContrato()
    {                   
        reportesFactory.mostrarReporteContrato(idAux).then(function(data) {

            arrayContrato = data.GetReporte_ContratoResult;
            vm.itemsByPage = 5; 
            vm.rowCollection4 = arrayContrato;  
        });
    }    


    //CSV 
    vm.order = [ 'SAN', 'Referencia', 'IdSuscriptor', 'Suscriptor', 'Beam', 'Servicio', 'Fap'];

    // CREAR CSV 
    vm.crearVisibleAsCsv = crearVisibleAsCsv;
    ///borra y pone la coleccion 
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



///los encabezados 
    function initArray (){
        vm.arrayReporte = [];          // ENCABEZADOS
        vm.arrayReporte =     [{
            "SAN": "SAN",
            "Referencia":"Referencia",
            "IdSuscriptor": "Id Suscriptor",
            "Suscriptor": "Suscriptor", 
            "Beam": "Beam",
            "Servicio": "Servicio",
            "Fap": "Fap" 
            }];
    } 


    // Create TABLE PDF
    vm.createPdfTodo = createPdfTodo;
    ///crea la tabla que tendra el reporte 
    function createPdfTodo(pdfAcrear){

    var rows = [ [0,0,0,0,0,0,0] ]; 
    
    var r = 1; 
    var c = 0; 

    var ro = 0;
      if ( pdfAcrear =='todo')
        { ro = vm.rowCollection4.length; }
        else 
        { ro = vm.displayedCollection4.length; }


    var cols = 9; 
    var columns = ["SAN","Referencia", "Id Suscriptor", "Suscriptor", "Beam", "Servicio", "Fap"];

 
    for( var i=r; i<ro; i++ ) {         
      rows.push( [] );
    }

   
    for (var i = 0; i < ro; i++)
    {    
        if ( pdfAcrear =='todo') 
        {   
            rows[i][0] = vm.rowCollection4[i].SAN;
            rows[i][1] = vm.rowCollection4[i].Referencia;
            rows[i][2] = vm.rowCollection4[i].IdSuscriptor;
            rows[i][3] = vm.rowCollection4[i].Suscriptor;
            rows[i][4] = vm.rowCollection4[i].Beam;
            rows[i][5] = vm.rowCollection4[i].Servicio;
            rows[i][6] = vm.rowCollection4[i].Fap;         
        }else 
        {                              
            rows[i][0] = vm.displayedCollection4[i].SAN;
            rows[i][1] = vm.displayedCollection4[i].Referencia;
            rows[i][2] = vm.displayedCollection4[i].IdSuscriptor;
            rows[i][3] = vm.displayedCollection4[i].Suscriptor;
            rows[i][4] = vm.displayedCollection4[i].Beam;
            rows[i][5] = vm.displayedCollection4[i].Servicio;
            rows[i][6] = vm.displayedCollection4[i].Fap;          
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
            //x , y 
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
                fontSize: 8.5,       
            },
            bodyStyles: {        
                fontSize: 8 
            }
        });

        doc.autoTable( columns, rows, {
            startY:27,    
            theme: 'plain',
   
     
            styles:{
                overflow: 'linebreak', 
            },    
            margin: {top: 10, right: 20, bottom: 16, left: 20},
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