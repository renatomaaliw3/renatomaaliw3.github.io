/* glob
al variables */

let typingTimer;
const doneTypingInterval = 1350; // 1 second delay
 
 $(document).ready(function() {

        var dropDown = $('#courseMenu').val();
        var searchTerm = $('#lastName').val();

        var optionalTerm = $('#firstName').val()
        

        // You can replace the URL with your external JSON file's location
        var jsonScores = '';

        function performSearch() {

            var dropDown = $('#courseMenu').val();
            var searchTerm = $('#lastName').val();
            
            var optionalTerm = $('#firstName').val()

            if (dropDown == 'CPE06') {

                //You can replace the URL with your external JSON file's location
                jsonScores = 'checkpoint/cpe06.json';

            } else {

                jsonScores = 'checkpoint/csvjson2.json';

            }

            $.getJSON(jsonScores, function(data) {

                // find a match between input and data (JSON)

                var exactMatch = data.find(item => item['Last Name'] == searchTerm); 

                if (exactMatch) {

                    if (searchTerm == '') {

                        NotFound();

                    } else {

                        constructTable(data, exactMatch, searchTerm);

                    }

                } else {

                    NotFound();

                }

            });

        }

        function constructTable(data, exactMatch, searchTerm) {

            //var contents =  '<h1 class="text-primary font-weight-bold">' + exactMatch['First Name'] + ' ' + exactMatch['Last Name'] + '</h1>';
            
            var contents =     '<table class="table table-bordered" id="gradeTable">'; // class removed table-responsive
            contents +=             '<thead>';
            contents +=                 '<tr id="headerLabels" class="bg-secondary">';
            
            //var first_item = exactMatch[0] // Only the first item on the match

            for (key in exactMatch) { // Get the keys of the first item only

                if (exactMatch.hasOwnProperty(key)) {

                    if (key == 'Term' || key == 'Last Name' || key == 'First Name' || key == 'Lecture Term Grade (E)' || key == 'Lab Term Grade (E)'){

                        contents +=          '<th>' + key + '</th>';

                    } else {

                        continue;

                    }

                }

            }

            contents +=                '</tr>';
            contents +=         '   </thead>';

            contents +=         '<tbody>';
                
                        data.forEach(function(item) {

                            var lastName = item['Last Name'];

                            if (lastName == searchTerm) {

                                contents += '<tr id="scoreData">';

                                for (var key in exactMatch) {

                                    if (key == 'Term' || key == 'Last Name' || key == 'First Name' || key == 'Lecture Term Grade (E)' || key == 'Lab Term Grade (E)'){
                                
                                        contents += '<td>' + decimal_places(item[key]) + '</td>'; //display with specific decimal points (values)

                                    } else {

                                        continue; // skip this values 

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


        $('#lastName').on('keyup', function() {

                clearTimeout(typingTimer);
                typingTimer = setTimeout(performSearch, doneTypingInterval);
                
        });


        $('#firstName').on('keyup', function() {

                clearTimeout(typingTimer);
                typingTimer = setTimeout(performSearch, doneTypingInterval);
                
        });

        $('#courseMenu').on('change', function() {

                performSearch();
                
        });

        function NotFound() {

            $('#searchResult').html('<h3 class="text-danger text-md"> Last Name not Found</h3>');

        }

        function decimal_places(value) {

            if (!isNaN(value)) {

                return parseFloat(value).toFixed(2);

            } else {

                return value;

            }

        }


});