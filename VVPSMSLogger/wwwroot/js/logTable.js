$(document).ready(function () {
    $("#logTable").DataTable({
        "processing": true,
        "serverSide": true,
        "filter": true,
        bSortable: true,
        bRetrieve: true,
        crossDomain: true,
        "ajax": {
            "url": "https://projects.sustainedgeconsulting.com/VVPSMS/V0/VVPSMSAPI/api/Logger/LoadData",
            "type": "GET",
            "datatype": "json"
        },
        dom: 'lBfrtip',
        buttons: [
            {
                extend: 'excelHtml5',
                title: 'LogExcel',
                text: 'Export to excel'
                //Columns to export
                //exportOptions: {
                //     columns: [0, 1, 2, 3,4,5,6]
                // }
            }
        ],
        deferRender: true,
        scrollX: true,
        scrollY: 500,
        scrollCollapse: true,
        scroller: true,
        searching: true,
        paging: true,
        info: false,
        columnDefs: [
            {
                render: function (data, type, full, meta) {
                    return "<div class='text-wrap width-200'>" + data + "</div>";
                },
                targets: 3
            },
            {
                render: function (data, type, full, meta) {
                    return "<div class='text-wrap width-200'>" + data + "</div>";
                },
                targets: 4
            },
            {
                render: function (data, type, full, meta) {
                    return "<div class='text-wrap width-200'>" + data + "</div>";
                },
                targets: 7
            }
        ],
        fixedColumns: true,
        "columns": [
            { "data": "id", "name": "Id" },
            { "data": "createdOn", "name": "Created On" },
            { "data": "level", "name": "Level" },
            { "data": "message", "name": "Message" },
            { "data": "stackTrace", "name": "Stack Trace" },
            { "data": "exception", "name": "Exception" },
            { "data": "logger", "name": "Logger" },
            { "data": "url", "name": "Url" }
            
        ]
    });
});  

