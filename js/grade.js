/* global variables */

let typingTimer;
const doneTypingInterval = 1500; // 1 second delay

 $(document).ready(function() {

        function performSearch() {

            //clearDisplay();

            const searchTerm = $('#emailInput').val();

            // You can replace the URL with your external JSON file's location
            const jsonURL = 'checkpoint/csvjson.json';

            $.getJSON(jsonURL, function(data) {

                const exactMatch = data.find(item => item['Email'] == searchTerm);

                if (exactMatch) {

                    $('#searchResult').html(

                        '<h2 class="text-primary">' + exactMatch['First Name'] + ' ' + exactMatch['Last Name'] + "'s " + ' Grade' + '</h2>' +

                        '<table class="table table-bordered">' + 

                            '<thead class="bg-dark text-white">' +

                                '<th colspan = 14 class="h4">' + exactMatch['Term'] + '</th>' + 

                            '</thead>' +

                            '<thead>' +

                                '<tr class="bg-secondary">' + 
                             
                                    '<th>Lecture<br>Quiz (30%)</th>' +
                                    '<th>Lecture<br>Quiz Points</th>' +
                                    '<th>Lecture<br>Major Exam (40%)</th>' +
                                    '<th>Lecture<br>Major Exam Points</th>' +
                                    '<th>Lecture<br>Performance (30%)</th>' +
                                    '<th>Lecture<br>Performance Points</th>' +
                                    '<th>Lab Activities (40%)</th>' +
                                    '<th>Lab Activities Points</th>' +
                                    '<th>Lab Major Exam (60%)</th>' +
                                    '<th>Lab Major Exam Points</th>' +
                                    '<th>Lecture Term Grade (60%)</th>' +
                                    '<th>Lab Term Grade (40%)</th>' +
                                    '<th>Overall Term Grade</th>' +
                                    '<th>Equivalent </th>' +

                                '</tr>' +

                            '</thead>' +

                            '<tbody>' +

                                '<tr>' + 
                                 
                                    '<td>' + exactMatch['Lecture Quiz (30%)'] + '</td>' +
                                    '<td>' + exactMatch['Lecture Quiz Points'] + '</td>' +
                                    '<td>' + exactMatch['Lecture Major Exam (40%)'] + '</td>' +
                                    '<td>' + exactMatch['Lecture Major Exam Points'] + '</td>' +
                                    '<td>' + exactMatch['Lecture Performance (30%)'] + '</td>' +
                                    '<td>' + exactMatch['Lecture Performance Points'] + '</td>' +
                                    '<td>' + exactMatch['Lab Activities (40%)'] + '</td>' +
                                    '<td>' + exactMatch['Lab Activities Points'] + '</td>' +
                                    '<td>' + exactMatch['Lab Major Exam (60%)'] + '</td>' +
                                    '<td>' + exactMatch['Lab Major Exam Points'] + '</td>' +
                                    '<td>' + exactMatch['Lecture Term Grade (60%)'] + '</td>' +
                                    '<td>' + exactMatch['Lab Term Grade (40%)'] + '</td>' +
                                    '<td>' + exactMatch['Overall Term Grade'] + '</td>' +
                                    '<td class="bg-success">' + exactMatch['Equivalent'] + '</td>' +

                                '</tr>' +

                            '</tbody>' +

                        '</table>'
                    );

                } else {

                    
                    $('#searchResult').html('<h3 class="text-danger text-md">Email not found</h3>');
                }

            });

        }

        function clearDisplay() {

            $('#searchResult').empty();

        }

         $('#emailInput').on('keyup', function() {

                clearTimeout(typingTimer);
                typingTimer = setTimeout(performSearch, doneTypingInterval);
                
        });

});