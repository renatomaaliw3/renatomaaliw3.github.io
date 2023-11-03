/* glob
al variables */

let typingTimer;
const doneTypingInterval = 1500; // 1 second delay
 
 // You can replace the URL with your external JSON file's location

 $(document).ready(function() {

        function performSearch() {

            const searchTerm = $('#emailInput').val();

            const jsonScores = 'checkpoint/csvjson.json';

            $.getJSON(jsonScores, function(data) {

                var exactMatch = data.find(item => item['Email'] == searchTerm);

                if (exactMatch) {

                    constructTable(exactMatch);

                } else {

                    $('#searchResult').html('<h3 class="text-danger text-md">Email not found</h3>');
                }

            });

        }

        function constructTable(exactMatch) {

            var contents =  '<h1 class="text-primary font-weight-bold">' + exactMatch['First Name'] + ' ' + exactMatch['Last Name'] + '</h1>';
            contents +=     '<table class="table table-bordered table-responsive">' + 

                                '<thead class="bg-dark text-white">' +

                                    // '<th colspan = 14 class="h4">' + exactMatch['Term'] + '</th>' + 

                                '</thead>';

            contents +=         '<thead>'
            contents +=             '<tr id="headerLabels" class="bg-secondary">';

                    for (var key in exactMatch) {

                        if (exactMatch.hasOwnProperty(key)) {

                            if (key == 'Email' || key == 'Course' || key == 'Section' || key == 'Last Name' || key == 'First Name' || key == 'No.') {
                                
                                continue;

                            } else {

                                contents += '<th>' + key + '</th>';

                            }

                        }

                    }

            contents +=             '</tr>';
            contents +=         '</thead>';

            contents +=         '<tbody>';
            contents +=             '<tr id="scoreData">';

                    for (var key in exactMatch) {

                        if (exactMatch.hasOwnProperty(key)) {

                            if (key == 'Email' || key == 'Course' || key == 'Section' || key == 'Last Name' || key == 'First Name' || key == 'No.') {
                                
                                continue;

                            } else {

                                var value = exactMatch[key]

                                contents += '<td>' + value + '</td>';

                            } 

                        }

                    }

            contents +=             '</tr>';
            contents +=         '</tbody>';

            $('#searchResult').html(contents);

        }


        $('#emailInput').on('keyup', function() {

                clearTimeout(typingTimer);
                typingTimer = setTimeout(performSearch, doneTypingInterval);
                
        });

});