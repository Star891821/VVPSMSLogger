var dataTable
$(document).ready(function () {

    debugger
    var fromDate;
    var toDate;
    $("#fromDate").datepicker({
        onSelect: function (dateText) {
            console.log("Selected date: " + dateText + "; input's current value: " + this.value);
            debugger;
            fromDate = dateText;
            bindDataTable();
            dataTable.draw();
        }
    });
    $("#toDate").datepicker({
        onSelect: function (dateText) {
            console.log("Selected date: " + dateText + "; input's current value: " + this.value);
            toDate = dateText;
            bindDataTable();
            dataTable.draw();
        }
    });

    $("#level").change(function () {
        dataTable.draw();
    });

    $('#reset').click(function () {
        var $dates = $('#fromDate, #toDate').datepicker();
        $dates.datepicker('setDate', null);
        $("select#level").val('');
        dataTable.draw();
    });

    var jsonData = []
    jsonData.push({
        "contact_name": 'hello',
        "company_name": 'hi'
    })
    bindDataTable();

    function bindDataTable() {
        debugger
        dataTable = $("#logTable").DataTable({
            "processing": true,
            "serverSide": true,
            "filter": true,
            bSortable: true,
            bRetrieve: true,
            crossDomain: true,
            "ajax": {
                "url": "https://localhost:7188/api/Logger/LoadData",
                "type": "GET",
                "datatype": "json",
                //"data": { name: fromDate },
                "data": function (d) {
                    debugger
                    d.fromDate = $('#fromDate').val();
                    d.toDate = $('#toDate').val();
                    d.level = $('#level').val();

                },
                "contentType": "application/json; charset=utf-8",
            },
            dom: 'lBfrtip',
            buttons: [
                {
                    extend: 'excelHtml5',
                    title: 'LogExcel',
                    text: 'Export to excel',
                    exportOptions: { orthogonal: 'export' }
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
            info: true,
            "iDisplayLength": 100,
            lengthMenu: [
                [100, 200, 300, -1],
                [100, 200, 300, 'All']
            ],
            order: [[1, 'desc']],
            columnDefs: [
                {
                    render: $.fn.dataTable.render.ellipsis(50),
                    targets: 0
                },
                {
                    render: function (data, type, full, meta) {
                        var date = new Date(data);

                        const padL = (nr, len = 2, chr = `0`) => `${nr}`.padStart(2, chr);

                        return `${padL(date.getMonth() + 1)}/${padL(date.getDate())}/${date.getFullYear()} ${padL(date.getHours())}:${padL(date.getMinutes())}:${padL(date.getSeconds())}`
                       
                    },
                    targets: 1
                },
                {
                    render: $.fn.dataTable.render.ellipsis(50),
                    targets: 3
                },
                {
                    render: $.fn.dataTable.render.ellipsis(50),
                    targets: 4
                },
                {
                    render: $.fn.dataTable.render.ellipsis(50),
                    targets: 5
                },
                {
                    render: $.fn.dataTable.render.ellipsis(50),
                    targets: 6
                },
                {
                    render: $.fn.dataTable.render.ellipsis(50),
                    targets: 7
                }
            ],
            fixedColumns: true,
            "columns": [
                { "data": "id", "name": "Id", width: '30px', style: 'white-space: normal' },
                { "data": "createdOn", "name": "Created On", width: '80px', style: 'white-space: normal' },
                { "data": "level", "name": "Level", width: '30px', style: 'white-space: normal' },
                { "data": "message", "name": "Message", width: '100px', class: 'text-wrap' },
                { "data": "stackTrace", "name": "Stack Trace", width: '100px', class: 'text-wrap', style: 'word-break: break-word;' },
                { "data": "exception", "name": "Exception", width: '100px', class: 'text-wrap' },
                { "data": "logger", "name": "Logger", width: '100px', class: 'text-wrap' },
                { "data": "url", "name": "Url", width: '100px', class: 'text-wrap' }

            ]
        });
    }
});

