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

    $("#modalTable").DataTable({
        "searching": false, // Remove the search feature
        "paging": false, // Remove pagination
        "lengthChange": false, // Remove the page length option
        "ordering": false, // Disable sorting for the entire table
        "info": false, // Remove "Showing x of y entries" message
        columnDefs: [
            createShowMoreRenderConfig(1, 50),
            createShowMoreRenderConfig(2, 50)
        ],
        "columns": [
            { "data": "id", "name": "Id", "width": '5%' }, // Adjust the width as needed
            { "data": "message", "name": "Message", "width": '25%' }, // Adjust the width as needed
            { "data": "stackTrace", "name": "Stack Trace", "width": '60%' }, // Adjust the width as needed
            { "data": "url", "name": "Url", "width": '10%' } // Adjust the width as needed
        ]
    });

    // Set column widths using jQuery
    $('#modalTable').css('width', '100%'); // Adjust the table width if necessary

    $('#modalTable th:eq(0)').css('width', '5%'); // ID column
    $('#modalTable th:eq(1)').css('width', '25%'); // Message column
    $('#modalTable th:eq(2)').css('width', '60%'); // Stack Trace column
    $('#modalTable th:eq(3)').css('width', '10%'); // Url column

    // Adjust td widths (if needed)
    $('#modalTable td:eq(0)').css('width', '5%'); // ID column
    $('#modalTable td:eq(1)').css('width', '25%'); // Message column
    $('#modalTable td:eq(2)').css('width', '60%'); // Stack Trace column
    $('#modalTable td:eq(3)').css('width', '10%'); // Url column

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

    // Event listener for clicking on the log details hyperlink
    $('#logTable').on('click', '.log-details', function (e) {
        e.preventDefault();

        // Extract the ID of the log from data attribute
        var logId = $(this).data('id');

        // Assuming you have a function to fetch additional details based on logId
        // Replace 'getLogDetails' with your function for retrieving log details
        const logDetails = getLogDetails(logId); // Fetch details using an API call or other method
        console.log('logDetails d:', logDetails);
        // Using a for loop to iterate through the logDetails array
        //for (let i = 0; i < logDetails.length; i++) {
        //    const log = logDetails[i];

        //    // Update the modal content with the fetched details for each log object
        //    $('#messageId').text(log.id);
        //    $('#message').text(log.message);
        //    $('#stackTrace').text(log.stackTrace);
        //    $('#exception').text(log.exception);

        //    // Add logic here to handle displaying multiple log details (e.g., appending to a container)
        //    // Example: $('#logDetailsContainer').append(`<div>${log.id}: ${log.message}</div>`);
        //}

        // Display the modal
        $('#logDetailsModal').modal('show');
    });

    // Function to fetch log details based on log ID (Replace this with your actual data retrieval method)
    function getLogDetails(logId) {
        // Assuming you have an API endpoint to retrieve log details
        // Perform an AJAX call or use any method to fetch log details from your server/API
        // Replace this with your actual API endpoint
        return $.ajax({
            url: 'https://localhost:7188/api/Logger/GetLogDetails?LogId=' + logId,
            method: 'GET',
            // Additional options like headers, data, etc., if needed
        })
            .done(function (response, textStatus, jqXHR) {
                debugger
                console.log('Success - Received response:', response);
                console.log('Status:', jqXHR.status);
                for (let i = 0; i < response.length; i++) {
                    const log = response[i];

                    // Update the modal content with the fetched details for each log object
                    $('#id').text(log.id);
                    $('#message').text(log.message);
                    $('#stackTrace').text(log.stackTrace);
                    $('#exception').text(log.exception);

                    // Find the index of "/api/" in the URL
                    const apiUrlIndex = log.url.indexOf('/api/');
                    if (apiUrlIndex !== -1) {
                        log.url = log.url.substring(apiUrlIndex + 5); // Get the part of the URL after "/api/"
                    }
                    $('#url').text(log.url);

                    // Add logic here to handle displaying multiple log details (e.g., appending to a container)
                    // Example: $('#logDetailsContainer').append(`<div>${log.id}: ${log.message}</div>`);
                }
                return response;
            })
            .fail(function (error) {
                alert('error');
                console.error('Error fetching log details:', error);
                // Handle errors appropriately, e.g., display an error message
            });
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
                "url": "https://localhost:7188/api/Logger/LoadData",
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
                //createEllipsisRenderConfig(0, 50),
                {
                    targets: 0,
                    "data": "id",
                    "name": "Id",
                    "width": '5px',
                    "class": 'text-wrap',
                    "style": 'word-break: break-word;',
                    "render": function (data, type, row) {
                        // Render the "Id" column as a hyperlink
                        return '<a href="#" class="log-details" data-id="' + row.id + '">' + data + '</a>';
                    }
                },
                createDateTimeRenderConfig(1),
                createShowMoreRenderConfig(3, 50), 
                createShowMoreRenderConfig(4, 50), 
                createShowMoreRenderConfig(5, 50), 
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

