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
            info: true,
            columnDefs: [
                {
                    render: function (data, type, full, meta) {
                        var date = new Date(data);
                        var month = date.getMonth() + 1;
                        return (month.toString().length > 1 ? month : "0" + month) + "/" + date.getDate() + "/" + date.getFullYear();
                    },
                    targets: 1
                },
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
    }
});  

