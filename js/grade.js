/* glob
al variables */

let typingTimer;
const doneTypingInterval = 1500; // 1 second delay
 
 // You can replace the URL with your external JSON file's location
const jsonScores = 'checkpoint/csvjson.json';

 $(document).ready(function() {

        function performSearch() {

            const searchTerm = $('#emailInput').val();

            $.getJSON(jsonScores, function(data) {

                var exactMatch = data.find(item => item['Email'] == searchTerm); // find a match between input and data (JSON)

                if (exactMatch) {

                     constructTable(data, exactMatch, searchTerm);

                } else {

                    $('#searchResult').html('<h3 class="text-danger text-md">Email not found</h3>');

                }

            });

        }

        function constructTable(data, exactMatch, searchTerm) {

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
                 
                                    
                        data.forEach(function(item) {

                            var email = item['Email'].toLowerCase();

                            if (email == searchTerm) {

                                contents += '<tr id="scoreData">';

                                for (key in exactMatch) {

                                     if (key == 'Email' || key == 'Course' || key == 'Section' || key == 'Last Name' || key == 'First Name' || key == 'No.') {
                                
                                        continue;

                                    } else {

                                        contents += '<th>' + item[key] + '</th>'; 

                                    }

                                }

                                contents += '</tr>';

                            }

                        });

            contents +=         '</tbody>';

            $('#searchResult').html(contents);

        }


        $('#emailInput').on('keyup', function() {

                clearTimeout(typingTimer);
                typingTimer = setTimeout(performSearch, doneTypingInterval);
                
        });

});