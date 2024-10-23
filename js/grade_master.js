/* global variables */

let typingTimer;
const doneTypingInterval = 1350; // 1 second delay
 
$(document).ready(function() {

    $('#gradeForm').hide()

    var dropDown = $('#courseMenu').val();
    var searchTerm = $('#lastName').val();
    var optionalTerm = $('#firstName').val();
    var direct = 'checkpoint/';

    var jsonScores = '';

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

        var contents = '<table class="table table-bordered" id="gradeTable">';
        contents += '<thead>';
        contents += '<tr id="headerLabels" class="bg-secondary">';

        // Only include relevant columns
        var keysToShow = ['Term', 'Last Name', 'First Name', 'Lecture Term Grade (60%)', 'Lab Term Grade (40%)', 'Lecture Term Grade (E)',
                         'Lab Term Grade (E)'];
        keysToShow.forEach(function(key) {
            contents += '<th>' + key + '</th>';
        });

        contents += '</tr>';
        contents += '</thead>';
        contents += '<tbody>';
        
        // Loop through each match and display the relevant data
        matches.forEach(function(item) {
            contents += '<tr id="scoreData">';
            keysToShow.forEach(function(key) {
                contents += '<td>' + decimal_places(item[key]) + '</td>'; // Apply decimal formatting
            });
            contents += '</tr>';
        });

        contents += '</tbody>';
        contents += '</table>';
        contents += '<h6 class="info mt-md-10"> As per SLSU University Code, Chapter 55 (Honors, Art. 443 - Computation of Grades), the rounding off of final grades shall not be allowed. </h6>';

        $('#searchResult').html(contents);
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

});
