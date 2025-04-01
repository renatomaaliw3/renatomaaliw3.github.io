/* global variables */

let typingTimer;
const doneTypingInterval = 1350; // 1 second delay

$(document).ready(function() {

    const gradeTable = $('#gradeTable');
    const searchResult = $('#searchResult')

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

        var contents =  '<h3 class="text-primary text-left font-weight-bold">' + exactMatch['First Name'] + ' ' + exactMatch['Last Name'] + '</h3>';
        contents +=     '<table class="table table-bordered table-responsive" id="gradeTable" style="display: table;">';
    
        contents +=         '<thead>';
        contents +=             '<tr id="headerLabels" class="bg-secondary">';
    
        var keysToShow = ['Term', 'Lecture Quiz', 'Lecture Quiz Points (max = 30%)',
                        'Lecture Major Exam', 'Lecture Major Exam Points (max = 40%)',
                        'Lecture Performance', 'Lecture Performance Points (max = 30%)',
                        'Lab Activities', 'Lab Activities Points (max = 40%)',
                        'Lab Major Exam','Lab Major Exam Points (max = 60%)',
                        'Lecture Term Grade (60%)', 
                        'Lab Term Grade (40%)', 'Lecture Term Grade (E)', 'Lab Term Grade (E)'];
    
        keysToShow.forEach(function(key) {

            if (key == 'Lecture Term Grade (E)' || key == 'Lab Term Grade (E)' || key == 'Term') {

                contents += '<th class="' + clean_key(key) + '">' + key + '</th>'; // display specified keys as headers

            } else {

                contents += '<th class="' + clean_key(key) + '"' + ' style="display: none;">' + key + '</th>'; // display specified keys as headers

            }

        });
    
        contents +=             '</tr>';
        contents +=         '</thead>';
        contents +=         '<tbody>';
            
        data.forEach(function(item) {

            var email = item['Email'].toLowerCase();
    
            if (email == searchTerm) {

                contents += '<tr id="scoreData">';
    
                keysToShow.forEach(function(key) {

                    if (key === 'Lecture Term Grade (E)' || key === 'Lab Term Grade (E)' || key === 'Term') {

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
            }
        });
    
        contents +=         '</tbody>';
        contents +=     '</table>';
    
        // Button for details
        contents += '<div style="display: flex;"><input type="button" value="Show Details" id="btnDetails"></div>';
    
        // PyScript
        // contents += '<section class="pyscript">';
        // 	contents += '<div id="grph"></div>';
        // 	contents += '<script type="py" src="python/main.py" config="python/pyscript.toml"></script>';
        // contents += '</section>';

        // contents += '<table id="gradeLegend" style="display: none;">';
        // contents += '<tr><td colspan=2> Equivalent Rating </td></tr><tr><td> 1.00 </td><td> 98 - 100 </td></tr><tr><td> 1.25 </td><td> 95 - 97 </td></tr><tr><td> 1.50 </td><td> 92 - 94 </td></tr><tr><td> 1.75 </td><td> 89 - 91 </td></tr><tr><td> 2.00 </td><td> 86 - 88 </td></tr><tr><td> 2.25 </td><td> 83 - 85 </td></tr><tr><td> 2.50 </td><td> 80 - 82 </td></tr><tr><td> 2.75 </td><td> 77 - 79 </td></tr><tr><td> 3.00 </td><td> 75 - 76 </td></tr><tr><td data-color="orange"> 4.00 </td><td data-color="orange"> 70 - 74 </td></tr><tr><td class="text-danger"> 5.00 </td><td class="text-danger"> 50 - 69 </td></tr>';                         
        // contents += '</table>';
        // contents += '<h6 class="info mt-5" style="font-size: 0.75rem;"> As per SLSU University Code, Chapter 55 (Honors, Art. 443 - Computation of Grades), the rounding off of final grades shall not be allowed. </h6>';
    
        $('#searchResult').html(contents);
        highlight_na();

    }

    $('#emailInput').on('keyup', function() {

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
            $('#gradeTable').css({'display':'block'});
            $('#gradeLegend').css({'display':'table'});
            $('#grph').show();

        } else {

            button.val('Show Details');
            searchResult.find('#gradeTable th, #gradeTable td').not('.Term, .LectureTermGradeE, .LabTermGradeE').hide(); //Hide class except
            $('#gradeTable').css({'display':'table'});
            $('#gradeLegend').css({'display':'none'});
            $('#grph').hide();
            
        }

    });

    // Functions
    function emailNotFound() {

        $('#searchResult').html('<h3 class="text-danger text-md">Pass Key Not Found</h3>');

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