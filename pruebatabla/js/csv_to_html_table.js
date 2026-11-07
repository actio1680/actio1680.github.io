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

        var $table = $("<table class='table table-striped table-condensed' id='" + el + "-table' style='width:100%'></table>");
        var $containerElement = $("#" + el);
        $containerElement.empty().append($table);
     
        var $loadingMsg = $("<p id='csv-loading' style='font-weight:bold; color:#007bff;'><i class='fas fa-spinner fa-spin'></i> Cargando datos, por favor espere...</p>");
        $containerElement.prepend($loadingMsg);

        Papa.parse(csv_path, {
            delimiter: csv_options.separator || ",",
            download: true,
            worker: true,
            skipEmptyLines: true,
            complete: function (results) {
                $loadingMsg.remove();
                
                var csvData = results.data;
                var $tableHead = $("<thead></thead>");
                var csvHeaderRow = csvData[0];
                var $tableHeadRow = $("<tr></tr>");
                
                for (var headerIdx = 0; headerIdx < csvHeaderRow.length; headerIdx++) {
                    $tableHeadRow.append($("<th></th>").text(csvHeaderRow[headerIdx]));
                }
                $tableHead.append($tableHeadRow);
                $table.append($tableHead);
                
                var $tableBody = $("<tbody></tbody>");

                for (var rowIdx = 1; rowIdx < csvData.length; rowIdx++) {
                    var $tableBodyRow = $("<tr></tr>");
                    for (var colIdx = 0; colIdx < csvData[rowIdx].length; colIdx++) {
                        var $tableBodyRowTd = $("<td></td>");
                        var cellTemplateFunc = customTemplates[colIdx];
                        if (cellTemplateFunc) {
                            $tableBodyRowTd.html(cellTemplateFunc(csvData[rowIdx][colIdx]));
                        } else {
                            $tableBodyRowTd.text(csvData[rowIdx][colIdx]);
                        }
                        $tableBodyRow.append($tableBodyRowTd);
                    }
                    $tableBody.append($tableBodyRow);
                }
                $table.append($tableBody);         
                $table.DataTable(datatables_options);
            },
            error: function(error) {
                $loadingMsg.text("Hubo un error al cargar los datos. Por favor, recargue la página.");
                console.error("Error al cargar CSV:", error);
            }
        });
    }
};
