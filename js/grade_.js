/* global variables */

let typingTimer;
const doneTypingInterval = 1350; // 1 second delay

$(document).ready(function() {

    const gradeTable = $('#gradeTable');
    const searchResult = $('#searchResult')

    const searchTerm = $('#emailInput').val();
    const dropDown = $('#courseMenu').val();
    var direct = 'checkpoint/';
    var graphs = 'checkpoint/graphs/';

    // You can replace the URL with your external JSON file's location
    var jsonScores = '';

    function performSearch() {

        const searchTerm = $('#emailInput').val();
        const dropDown = $('#courseMenu').val();

        jsonScores = direct + dropDown;
        jsonGraphs = graphs + dropDown;

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

        $.getJSON(jsonGraphs, function(data) {

            constructGraphMenu(data);

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
                        'Lab Term Grade (40%)', 'Lecture Term Grade (E)', 'Lab Term Grade (E)', 'Section Rank', 'Overall Rank'];
    
        keysToShow.forEach(function(key) {

            if (key == 'Lecture Term Grade (E)' || key == 'Lab Term Grade (E)' || key == 'Term' || key == 'Section Rank' || key == 'Overall Rank') {

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

                    if (key === 'Lecture Term Grade (E)' || key === 'Lab Term Grade (E)' || key === 'Term' || key == 'Section Rank' || key == 'Overall Rank') {

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
        contents +=     '<p style="text-align: left; font-size: 14px; margin-bottom: 2rem;"><em> Section and Overall Ranks are Lecture Grades only </em></p>'; 
    
        // Button for details
        contents += '<div style="display: flex;"><input type="button" value="Show Details" id="btnDetails"></div>';
    
        $('#searchResult').html(contents);
        highlight_na();

    }

    function constructGraphMenu(data) {

        var contents = '<form id="graphForm" class="form-group">';

                contents += '<label for="graphOption"> Select Term Statistics: </label>';
                contents += '<select id="graphOption" class="form-select form-control">';
                contents += '<option disabled selected> [Select Term] </option>';

                data.forEach(function(item){

                   var term = item['Term'];
                   var graph = item['Graphs'];

                   contents += '<option value="' + graph + '">' + term  + '</option>';

                });
                    
                contents += '</select>';

            contents += '</form>';

        $('#graphs').html(contents);

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
            $('#graphs').show();


        } else {

            button.val('Show Details');
            searchResult.find('#gradeTable th, #gradeTable td').not('.Term, .LectureTermGradeE, .LabTermGradeE , .SectionRank, .OverallRank').hide(); //Hide class except
            $('#gradeTable').css({'display':'table'});
            $('#gradeLegend').css({'display':'none'});
            $('#graphs').hide();
            $('#graphOption option:first').prop('selected', true);
            $('#img-container').html('');
            
        }

    });

    $('#graphs').on('change', '#graphOption', function() {

        const optx = $(this);

        var the_image = graphs + optx.val();
        var img = new Image();

        img.onload = function() {

            $('#img-container').html('<img src="' + the_image + '">');

        };

        img.onerror = function() {

            $('#img-container').html('<h6 style="text-align: center;" class="text-danger"> Not yet available </h6>');

        };

        // Start loading the image
        img.src = the_image;
        
    });

    // Functions
    function emailNotFound() {

        $('#searchResult').html('<h3 class="text-danger text-md">Pass Key Not Found</h3>');
        $('#graphs').hide();
        $('#img-container').html('');

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