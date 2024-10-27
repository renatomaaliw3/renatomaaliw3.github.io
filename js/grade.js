/* glob
al variables */

let typingTimer;
const doneTypingInterval = 1350; // 1 second delay
 
 $(document).ready(function() {

        const searchTerm = $('#emailInput').val();
        const dropDown = $('#courseMenu').val();
        var direct = 'checkpoint/';

        // You can replace the URL with your external JSON file's location
        var jsonScores = '';

        function performSearch() {

            const searchTerm = $('#emailInput').val();
            const dropDown = $('#courseMenu').val();

            jsonScores = direct + dropDown;

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
            contents +=     '<table class="table table-bordered table-responsive" id="gradeTable">';

            contents +=         '<thead>';
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

                                         // Check if the key is 'Lecture Term Grade (E)' or 'Lab Term Grade (E)'
                                        if ((key === 'Lecture Term Grade (E)' || key === 'Lab Term Grade (E)') && (item[key] == 4.00)) {

                                            // Apply warning color if the value is 4.00
                                            contents += '<td class="text-warning">' + decimal_places(item[key]) + '</td>';

                                        } else if ((key === 'Lecture Term Grade (E)' || key === 'Lab Term Grade (E)') && (item[key] == 5.00)) {

                                             // Apply danger color if the value is 4.00
                                            contents += '<td class="text-danger">' + decimal_places(item[key]) + '</td>';

                                        } else {

                                            // Default color for other values
                                            contents += '<td>' + decimal_places(item[key]) + '</td>';

                                        }

                                    }

                                }

                                contents += '</tr>';

                            }

                        });

            contents +=         '</tbody>';
            contents +=         '</table>';

            contents +=         '<table id="gradeLegend">';

            contents +=             '<tr><td colspan=2> Equivalent Rating </td></tr><tr><td> 1.00 </td><td> 98 - 100 </td></tr><tr><td> 1.25 </td><td> 95 - 97 </td></tr><tr><td> 1.50 </td><td> 92 - 94 </td></tr><tr><td> 1.75 </td><td> 89 - 91 </td></tr><tr><td> 2.00 </td><td> 86 - 88 </td></tr><tr><td> 2.25 </td><td> 83 - 85 </td></tr><tr><td> 2.50 </td><td> 80 - 82 </td></tr><tr><td> 2.75 </td><td> 77 - 79 </td></tr><tr><td> 3.00 </td><td> 75 - 79 </td></tr><tr><td class=text-warning> 4.00 </td><td class=text-warning> 70 - 74 </td></tr><tr><td class=text-danger> 5.00 </td><td class=text-danger> 50 - 69 </td></tr>';                         
                     
            contents +=         '</table>';
            contents +=         '<h6 class="info mt-5" style="font-size: 0.75rem;"> As per SLSU University Code, Chapter 55 (Honors, Art. 443 - Computation of Grades), the rounding off of final grades shall not be allowed. </h6>';

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