var CsvToHtmlTable = CsvToHtmlTable || {}; 

CsvToHtmlTable = { 
    init: function (options) { 
        options = options || {}; 
        var csv_path = options.csv_path || ""; 
        var el = options.element || "table-container"; 
        var csv_options = options.csv_options || {}; 
        var datatables_options = options.datatables_options || {}; 
        var custom_formatting = options.custom_formatting || []; 
        var customTemplates = {}; 
        $.each(custom_formatting, function (i, v) { 
            customTemplates[v[0]] = v[1]; 
        }); 

        var $containerElement = $("#" + el); 
        $containerElement.empty(); 
        

        var $loadingMsg = $("<div style='text-align:center; padding: 20px; font-weight: bold;'>Cargando datos, por favor espere...</div>"); 
        $containerElement.append($loadingMsg); 

        Papa.parse(csv_path, { 
            delimiter: csv_options.separator || ",", 
            download: true, 
            worker: true,
            skipEmptyLines: true, 
            complete: function (results) { 
                $loadingMsg.remove(); 
                var csvData = results.data; 
                
                if (!csvData || csvData.length === 0) {
                    $containerElement.html("<p>El archivo CSV está vacío.</p>");
                    return;
                }

                var csvHeaderRow = csvData[0]; 
                var tableData = csvData.slice(1); // Los datos sin la cabecera

                // 1. Construimos la estructura básica de la tabla (vacía)
                var $table = $("<table class='display' style='width:100%'></table>"); 
                var $tableHead = $("<thead></thead>"); 
                var $tableHeadRow = $("<tr></tr>"); 

                // Creamos los <th> (tus anchos se aplicarán desde custom.css)
                for (var headerIdx = 0; headerIdx < csvHeaderRow.length; headerIdx++) { 
                    $tableHeadRow.append($("<th></th>").text(csvHeaderRow[headerIdx])); 
                } 
                $tableHead.append($tableHeadRow); 
                $table.append($tableHead); 
                
                var $tableBody = $("<tbody></tbody>"); 
                $table.append($tableBody); 
                $containerElement.append($table); 

                // 2. Preparamos las columnas para DataTables con los formatos personalizados
                var columnDefs = [];
                Object.keys(customTemplates).forEach(function(colIndex) {
                    columnDefs.push({
                        targets: parseInt(colIndex),
                        render: function(data) {
                            return customTemplates[colIndex](data);
                        }
                    });
                });
                
                var finalOptions = $.extend({}, datatables_options, {
                    data: tableData, 
                    columnDefs: columnDefs 
                });

                $table.DataTable(finalOptions); 
            }, 
            error: function(error) { 
                $loadingMsg.text("Hubo un error al cargar los datos. Por favor, recargue la página."); 
                console.error("Error al cargar CSV:", error); 
            } 
        }); 
    } 
};
