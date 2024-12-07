/* global variables */

let typingTimer;
const doneTypingInterval = 1350; // 1 second delay
 
$(document).ready(function() {

    const gradeTable = $('#gradeTable');
    const searchResult = $('#searchResult')

    var dropDown = $('#courseMenu').val();
    var searchTerm = $('#lastName').val();
    var optionalTerm = $('#firstName').val();
    var direct = 'checkpoint/';

    var jsonScores = '';

    $('#gradeForm').hide()

    function performSearch() {

        var dropDown = $('#courseMenu').val();
        var searchTerm = $('#lastName').val().toLowerCase(); // Convert to lowercase for case-insensitive search
        var optionalTerm = $('#firstName').val().toLowerCase(); // Convert to lowercase for case-insensitive search

        jsonScores = direct + dropDown;
        
        $.getJSON(jsonScores, function(data) {

            // Modify the search to perform partial matching using 'includes'
            var matches = data.filter(item => {

                var lastNameMatch = item['Last Name'].toLowerCase().includes(searchTerm);
                var firstNameMatch = optionalTerm ? item['First Name'].toLowerCase().includes(optionalTerm) : true; // If optional term exists, check, otherwise ignore
                
                return lastNameMatch && firstNameMatch;

            });

            if (matches.length > 0) {

                constructTable(data, matches, searchTerm);

            } else {

                NotFound();

            }

        });

    }

    function constructTable(data, matches, searchTerm) {

        // Filter matches by term
        var preliminaryData = matches.filter(item => item['Term'] === 'Preliminary');
        var midtermData = matches.filter(item => item['Term'] === 'Midterm');
        var finalsData = matches.filter(item => item['Term'] === 'Finals');
        
        // Build the tables for each term
        var contents = '';

        if (preliminaryData.length > 0) {

            contents += buildTermTable('Preliminary', preliminaryData);

        }

        if (midtermData.length > 0) {

            contents += buildTermTable('Midterm', midtermData);

        }

        if (finalsData.length > 0) {

            contents += buildTermTable('Finals', finalsData);

        }

        contents += '<div style="display: flex;"><input type="button" value="Show Details" id="btnDetails"></div>' // Show Details button

        // Append the contents to the searchResult div
        $('#searchResult').html(contents);
        highlight_na();

    }

    // Helper function to build table for a given term

    function buildTermTable(term, data) {

        var contents = '<h4>' + term + '</h4>';
        contents += '<table class="table table-bordered table-responsive-sm" id="gradeTable">';
        contents += '<thead>';
        contents += '<tr id="headerLabels" class="bg-secondary">';

        var keysToShow = ['Last Name', 'First Name', 'Lecture Quiz', 'Lecture Quiz Points (max = 30%)',
                        'Lecture Major Exam', 'Lecture Major Exam Points (max = 40%)',
                        'Lecture Performance', 'Lecture Performance Points (max = 30%)',
                        'Lab Activities', 'Lab Activities Points (max = 40%)',
                        'Lab Major Exam','Lab Major Exam Points (max = 60%)',
                        'Lecture Term Grade (60%)', 
                        'Lab Term Grade (40%)', 'Lecture Term Grade (E)', 'Lab Term Grade (E)'];
        
        keysToShow.forEach(function(key) {

            if (key == 'Lecture Term Grade (E)' || key == 'Lab Term Grade (E)' 
               || key == 'Last Name' || key == 'First Name') {

                contents += '<th class="' + clean_key(key) + '">' + key + '</th>'; // display specified keys as headers

            } else {

                contents += '<th class="' + clean_key(key) + '"' + ' style="display: none;">' + key + '</th>'; // display specified keys as headers

            }

        });

        contents += '</tr>';
        contents += '</thead>';
        contents += '<tbody>';

        data.forEach(function(item) {

            contents += '<tr class="scoreData">';

            keysToShow.forEach(function(key) {

                if (key === 'Lecture Term Grade (E)' || key === 'Lab Term Grade (E)' || key === 'Last Name' || key === 'First Name') {

                    if (item[key] == 4.00) {

                        contents += '<td data-color="orange" class="' + clean_key(key) + '">' + decimal_places(item[key]) + '</td>';

                    } else if (item[key] == 5.00) {

                        contents += '<td data-color="red" class="' + clean_key(key) + '">' + decimal_places(item[key]) + '</td>';
                    
                    } else {

                        contents += '<td class="' + clean_key(key) + '">' + decimal_places(item[key]) + '</td>';

                    }

                } else {

                    contents += '<td class="' + clean_key(key) + '"' + ' style="display: none;">' + decimal_places(item[key]) + '</td>';

                }


            });

            contents += '</tr>';

        });

        contents += '</tbody>';
        contents += '</table>';

        // Button for details
        //contents += '<div style="display: flex;"><input type="button" value="Show Details" id="btnDetails"></div>';

        return contents;

    }

    $('#activate').on('click', function() {

        $('#gradeForm').fadeToggle();

    });

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

    $('#searchResult').on('click', '#btnDetails', function() {

        const button = $(this);

        if (button.val() == 'Show Details') {

            button.val('Hide Details')
            searchResult.find('th, td').show(); //Show all
            $(this).closest('#gradeTable').css({'display': 'block'});
         

        } else {

            button.val('Show Details');
            searchResult.find('#gradeTable th, #gradeTable td').not('.LectureTermGradeE, .LabTermGradeE, .LastName, .FirstName').hide(); //Hide class except
            $(this).closest('#gradeTable').css({'display': 'table'});
           
        }

    });

    function NotFound() {
        $('#searchResult').html('<h3 class="text-danger text-md"> Name not found</h3>');
    }

    function decimal_places(value) {

        if (!isNaN(value)) {

            return parseFloat(value).toFixed(2);

        } else {

            return value;

        }
    }

    function clean_key(value) {

        var the_key = value;

        return the_key.replace(/[\s()=%/]+/g,''); //remove spaces and characters (special)

    }

    function highlight_na() {

        $("#searchResult td:contains('N/A')").attr("data-color", "muted");

    }

});
