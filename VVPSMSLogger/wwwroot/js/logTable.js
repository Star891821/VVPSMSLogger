var dataTable
$(document).ready(function () {

    //debugger
    var fromDate;
    var toDate;
    $("#fromDate").datepicker({
        onSelect: function (dateText) {
            console.log("Selected date: " + dateText + "; input's current value: " + this.value);
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

   
    bindDataTable();

    // Show more/less functionality
    $('#logTable').on('click', '.more-link', function (e) {
        e.preventDefault();
        var $moreLink = $(this);
        var $moreContent = $moreLink.prev('.more-content');
        var $ellipsis = $moreLink.prev('.more');

        if ($moreLink.text() === '...More') {
            $moreLink.text(' Less');
            $moreContent.show();
            $ellipsis.hide();
        } else {
            $moreLink.text('...More');
            $moreContent.hide();
            $ellipsis.show();
        }
    });

    function getFormattedDateTime() {
        const padL = (nr, len = 2, chr = `0`) => `${nr}`.padStart(len, chr);
        const date = new Date();
        const year = date.getFullYear();
        const month = padL(date.getMonth() + 1);
        const day = padL(date.getDate());
        const hours = padL(date.getHours());
        const minutes = padL(date.getMinutes());
        const seconds = padL(date.getSeconds());

        return `logfile_${year}${month}${day}${hours}${minutes}${seconds}`;
    }

    function createEllipsisRenderConfig(target, maxLength = 50) {
        return {
            targets: target,
            render: $.fn.dataTable.render.ellipsis(maxLength)
        };
    }

    function createDateTimeRenderConfig(target) {
        return {
            targets: target,
            render: function (data, type, full, meta) {
                var date = new Date(data);
                const padL = (nr, len = 2, chr = `0`) => `${nr}`.padStart(len, chr);
                return `${padL(date.getDate())}/${padL(date.getMonth() + 1)}/${date.getFullYear()} ${padL(date.getHours())}:${padL(date.getMinutes())}:${padL(date.getSeconds())}`;
            }
        };
    }
    function createShowMoreRenderConfig(target, showChar = 100) {
        return {
            targets: target,
            render: function (data, type, row) {
                if (data.length > showChar) {
                    var content = data.substr(0, showChar);
                    var hiddenContent = '<span class="more-content" style="display:none;">' + data.substr(showChar, data.length - showChar) + '</span>';
                    var moreLink = '<a href="#" class="more-link">...More</a>';
                    return '<span class="more">' + content + '</span>' + hiddenContent + moreLink;
                } else {
                    return data;
                }
            }
        };
    }

    function bindDataTable() {
        dataTable = $("#logTable").DataTable({
            "processing": true,
            "serverSide": true,
            "filter": true,
            bSortable: true,
            bRetrieve: true,
            crossDomain: true,
            "ajax": {
                "url": "https://projects.sustainedgeconsulting.com/VVPSMS/V0/VVPSMSAPI/api/Logger/LoadData",
                "type": "GET",
                "datatype": "json",
                //"data": { name: fromDate },
                "data": function (d) {
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
                    title: getFormattedDateTime(),
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
                [100, 200, 300],
                [100, 200, 300]
            ],
            order: [[1, 'desc']],
            columnDefs: [
                createEllipsisRenderConfig(0, 50),
                createDateTimeRenderConfig(1),
                createShowMoreRenderConfig(3, 50), 
                createShowMoreRenderConfig(4, 100), 
                createShowMoreRenderConfig(5, 100), 
                createEllipsisRenderConfig(6, 50),
                {
                    targets: 7,
                    render: function (data) {
                        // Find the index of "/api/" in the URL
                        const apiUrlIndex = data.indexOf('/api/');
                        if (apiUrlIndex !== -1) {
                            data = data.substring(apiUrlIndex + 5); // Get the part of the URL after "/api/"
                        }
                       // return data; // Return original data if "/api/" is not found
                        var showChar = 10;
                        if (data.length > showChar) {
                            var content = data.substr(0, showChar);
                            var hiddenContent = '<span class="more-content" style="display:none;">' + data.substr(showChar, data.length - showChar) + '</span>';
                            var moreLink = '<a href="#" class="more-link">...More</a>';
                            return '<span class="more">' + content + '</span>' + hiddenContent + moreLink;
                        } else {
                            return data;
                        }
                    }
                }
            ],
            fixedColumns: true,
            "columns": [
                { "data": "id", "name": "Id", width: '5px', class: 'text-wrap', style: 'word-break: break-word;' },
                { "data": "createdOn", "name": "Created On", width: '15px', class: 'text-wrap', style: 'word-break: break-word;' },
                { "data": "level", "name": "Level", width: '15px', class: 'text-wrap', style: 'word-break: break-word;' },
                { "data": "message", "name": "Message", width: '90px', class: 'text-wrap' },
                { "data": "stackTrace", "name": "Stack Trace", width: '90px', class: 'text-wrap', style: 'word-break: break-word;' },
                { "data": "exception", "name": "Exception", width: '90px', class: 'text-wrap', style: 'word-break: break-word;' },
                { "data": "logger", "name": "Logger", width: '40px', class: 'text-wrap', style: 'word-break: break-word;' },
                { "data": "url", "name": "Url", width: '50px', class: 'text-wrap', style: 'word-break: break-word;' }
                //{ "data": "formId", "name": "Form Id", width: '80px', class: 'text-wrap', style: 'word-break: break-word;' }

            ]
        });
    }
});

