
'use strict';
angular.module('softvFrostApp')
.controller('Reportes_reporteGeneralCtrl', ['$http', 'reportesFactory','$timeout', 'ngNotify','$state', function ( $http, reportesFactory, $timeout, ngNotify, $state){


    var vm = this;
    vm.filename = "Reporte_general";
    var reportHeaderPdf = "Reporte General";
    var fechaInicioYMD;
    var fechaFinYMD; 
    var idAux = 1;  
    vm.csvUnoHide = true; 
    vm.csvDosHide = true;    
    var img = new Image();
    img.crossOrigin = "";  

///funcion de inicializacion del controlador, llama a otras dos funciones 
    this.$onInit = function() {

        getImageDataURL();
        getReporteConsumo();  
    }
///actualiza 
    function reloadRoute() {
        $state.reload(); 
    };

///asigna nulo a la fecha de inicio y llama a la funcion reloadRoute
    vm.limpiarFiltros = limpiarFiltros;
    function limpiarFiltros(){
        vm.fechaInicio = null;
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
    vm.getReporteConsumo = getReporteConsumo;
    ///valida la fecha de inicio, llama a mostrarReporteConsumo y asigna valores
    function getReporteConsumo()
    {                     
            getFechas();        

                if (vm.fechaInicio > vm.fechaFin){
                    ngNotify.set('La fecha de inicio debe ser anterior a la fecha fin', {
                        type: 'error'
                    });  
                }      

            reportesFactory.mostrarReporteConsumo(idAux, fechaInicioYMD).then(function(data) {
             
                arrayTokens = data.GetReporte_GeneralListResult; 
                vm.itemsByPage = 5; 
                vm.rowCollection4 = arrayTokens;  
            });
    }

///obtiene la fecha en un formato espesifico 
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
    }



    //CSV 
    vm.order = [ 'SAN', 'ESN', 'PlanDeServicio', 'Beam', 'VelocidadBajada', 'VelocidadSubida', 'Suscriptor','Referencia','Estatus',
                 'Latitud', 'Longitud','IpNateada','Fap','FechaJovian','Estado','Municipio','Direccion'];

    // CREAR CSV
    vm.crearVisibleAsCsv = crearVisibleAsCsv;
    /// Crea el csv
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
    ///Crea csv
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


    vm.order = [ 'SAN', 'ESN', 'PlanDeServicio', 'Beam', 'VelocidadBajada', 'VelocidadSubida', 'Suscriptor', 'Referencia', 'Estatus',
                 'Latitud', 'Longitud','IpNateada','Fap','FechaJovian','Estado','Municipio','Direccion'];

///Los encabezados 
    function initArray (){
      vm.arrayReporte = []; 
         
        vm.arrayReporte =     [{
                "SAN": "SAN",              
                "ESN": "ESN",
                "PlanDeServicio": "Plan de Servicio",
                "Beam": "Beam",
                "VelocidadBajada": "Velocidad Bajada",
                "VelocidadSubida": "Velocidad Subida",
                "Suscriptor":"Suscriptor",
                "Referencia":"Referencia",
                "Estatus": "Estatus",          
                "Latitud": "Latitud",
                "Longitud": "Longitud", 
                "IpNateada": "Ip Nateada",
                "Fap":"Fap",
                "FechaJovian":"Fecha JOVIAN",
                "Estado":"Estado",
                "Municipio":"Municipio",
                "Direccion":"Direccion"
                }];
    } 

// Create TABLE PDF  
vm.createPdfTodo = createPdfTodo;
///Crea la tabla para el pdf 
function createPdfTodo(pdfAcrear){

    var rows = [ [0] ];
   
    var r = 1; 
    var c = 0; 

    var ro = 0; 
      if ( pdfAcrear =='todo')
        { ro = vm.rowCollection4.length; }
        else 
        { ro = vm.displayedCollection4.length; }


    var cols = 18;
    var columns = ["SAN","ESN","Plan de Servicio","Beam","Velocidad Bajada","V Subida","Suscriptor","Ref.","Estatus","Latitud","Longitud","Ip Nateada",
    "Fap","Fecha JOVIAN","Estado","Municipio","Dirección"];
   
    for( var i=r; i<ro; i++ ) {         
      rows.push( [] );
    }


    for (var i = 0; i < ro; i++)
    {    
        if ( pdfAcrear =='todo') 
        {   
            rows[i][0] = vm.rowCollection4[i].SAN;          
            rows[i][1] = vm.rowCollection4[i].ESN;
            rows[i][2] = vm.rowCollection4[i].PlanDeServicio;         
            rows[i][3] = vm.rowCollection4[i].Beam;
            rows[i][4] = vm.rowCollection4[i].VelocidadBajada;
            rows[i][5] = vm.rowCollection4[i].VelocidadSubida;
            rows[i][6] = vm.rowCollection4[i].Suscriptor;
            rows[i][7] = vm.rowCollection4[i].Referencia;
            rows[i][8] = vm.rowCollection4[i].Estatus;
            rows[i][9] = vm.rowCollection4[i].Latitud;
            rows[i][10] = vm.rowCollection4[i].Longitud;  
            rows[i][11] = vm.rowCollection4[i].IpNateada;  
            rows[i][12] = vm.rowCollection4[i].Fap;          
            rows[i][13] = vm.rowCollection4[i].FechaJovian;
            rows[i][14] = vm.rowCollection4[i].Estado;
            rows[i][15] = vm.rowCollection4[i].Municipio;
            rows[i][16] = vm.rowCollection4[i].Direccion;
        }else 
        {               
            rows[i][0] = vm.displayedCollection4[i].SAN;          
            rows[i][1] = vm.displayedCollection4[i].ESN;
            rows[i][2] = vm.displayedCollection4[i].PlanDeServicio;     
            rows[i][3] = vm.displayedCollection4[i].Beam;
            rows[i][4] = vm.displayedCollection4[i].VelocidadBajada;
            rows[i][5] = vm.displayedCollection4[i].VelocidadSubida;
            rows[i][6] = vm.displayedCollection4[i].Suscriptor;
            rows[i][7] = vm.displayedCollection4[i].Referencia;
            rows[i][8] = vm.displayedCollection4[i].Estatus;
            rows[i][9] = vm.displayedCollection4[i].Latitud;
            rows[i][10] = vm.displayedCollection4[i].Longitud;  
            rows[i][11] = vm.displayedCollection4[i].IpNateada;  
            rows[i][12] = vm.displayedCollection4[i].Fap;          
            rows[i][13] = vm.displayedCollection4[i].FechaJovian;
            rows[i][14] = vm.displayedCollection4[i].Estado;
            rows[i][15] = vm.displayedCollection4[i].Municipio;
            rows[i][16] = vm.displayedCollection4[i].Direccion;
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
            doc.text(doc.internal.pageSize.width - 28 , doc.internal.pageSize.height - 10, str); 
              
        };
 
                      
       
        doc.addImage(img, 'jpeg', 5, 5, 40, 15); 

        // Encabezado 
        doc.setFontSize(14); 
        doc.setFontType("bold");
        var fontSize = doc.internal.getFontSize(); 
        var pageWidth = doc.internal.pageSize.width; 
        var txtWidth = doc.getStringUnitWidth(reportHeaderPdf) * fontSize / doc.internal.scaleFactor;
        var x = ( pageWidth - txtWidth ) / 2;      
        doc.text(reportHeaderPdf, x, 14);   

      
        var laFechaHoy = reportesFactory.obtenerFechaHoy();
        doc.setFontSize(11);   
        doc.setFontType("normal");
        doc.text(doc.internal.pageSize.width - 45 , 20, laFechaHoy); 
        
        doc.setPage(1); 


       

        // Custom table 
        jsPDF.autoTableSetDefaults({
            headerStyles: 
            {   
                fontSize: 7.3,       
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
                0: {columnWidth: 8},
                3: {columnWidth: 10},
                4: {columnWidth: 15},
                5: {columnWidth: 12},
                7: {columnWidth: 12},
                9: {columnWidth: 15},
                10: {columnWidth: 15},
                12: {columnWidth: 15},
                13: {columnWidth: 15},
            //    2: {columnWidth: 15}// plan de ser  
            //     3: {columnWidth: 18},// plan actual  
            //     5: {columnWidth: 16},// v bajada       
            //     6: {columnWidth: 16}, //v subida
            //     7: {columnWidth: 20}, //v subida
            //     9: {columnWidth: 16}, //lat
            //     10: {columnWidth: 16}, //long
            //     13: {columnWidth: 16}, //long
             },                      
            
             margin: {top: 16, right: 5, bottom: 16, left: 5},
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