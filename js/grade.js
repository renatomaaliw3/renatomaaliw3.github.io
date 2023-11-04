/* glob
al variables */

let typingTimer;
const doneTypingInterval = 1350; // 1 second delay
 
 $(document).ready(function() {

        const searchTerm = $('#emailInput').val();
        const dropDown = $('#courseMenu').val();

        // You can replace the URL with your external JSON file's location
        var jsonScores = '';

        function performSearch() {

            const searchTerm = $('#emailInput').val();
            const dropDown = $('#courseMenu').val();

            if (dropDown == 'CPE15') {

                //You can replace the URL with your external JSON file's location
                jsonScores = 'checkpoint/csvjson.json';

            } else {

                jsonScores = 'checkpoint/csvjson2.json';

            }

            $.getJSON(jsonScores, function(data) {

                var exactMatch = data.find(item => item['Email'] == searchTerm); // find a match between input and data (JSON)

                if (exactMatch) {

                    if (searchTerm == '') {

                        emailNotFound();

                    } else {

                        constructTable(data, exactMatch, searchTerm);

                    }

                } else {

                    emailNotFound();

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

                                        contents += '<td>' + item[key] + '</td>'; 

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

        $('#courseMenu').on('change', function() {

                performSearch();
                
        });

        function emailNotFound() {

            $('#searchResult').html('<h3 class="text-danger text-md">Email not found</h3>');

        }


});