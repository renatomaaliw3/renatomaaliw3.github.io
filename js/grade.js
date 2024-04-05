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

            if (dropDown == 'CPE06') {

                //You can replace the URL with your external JSON file's location
                jsonScores = 'checkpoint/cpe06-23-24.json';

            } else {

                jsonScores = 'checkpoint/cpe28-23-24.json';

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
            contents +=     '<table class="table table-bordered table-responsive" id="gradeTable">' + 

                                '<thead class="bg-dark text-white">' +

                                    // '<th colspan = 14 class="h4">' + exactMatch['Term'] + '</th>' + 

                                '</thead>';

            contents +=         '<thead>'
            contents +=             '<tr id="headerLabels" class="bg-secondary">';

                    for (var key in exactMatch) { // get JSON keys

                        //console.log(key)

                        if (exactMatch.hasOwnProperty(key)) { 

                            if (key == 'Email' || key == 'Course' || key == 'Section' || key == 'Last Name' || key == 'First Name' || key == 'No.') {
                                
                                continue; //skip this keys as headers

                            } else {

                                contents += '<th>' + key + '</th>'; // if not skipped (keys), display it as headers

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

                                for (var key in exactMatch) {

                                     if (key == 'Email' || key == 'Course' || key == 'Section' || key == 'Last Name' || key == 'First Name' || key == 'No.') {
                                
                                        continue; // skip this values

                                    } else {

                                        contents += '<td>' + decimal_places(item[key]) + '</td>'; //display with specific decimal points (values)

                                    }

                                }

                                contents += '</tr>';

                            }

                        });

            contents +=         '</tbody>';
            contents +=         '</table>';
            contents +=         '<h6 class="info mt-md-10"> As per SLSU University Code, Chapter 55 (Honors, Art. 443 - Computation of Grades), the rounding off of final grades shall not be allowed. </h6>';

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

        function decimal_places(value) {

            if (!isNaN(value)) {

                return parseFloat(value).toFixed(2);

            } else {

                return value;

            }

        }


});