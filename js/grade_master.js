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

        // Append the contents to the searchResult div
        $('#searchResult').html(contents);

    }

    // Helper function to build table for a given term

    function buildTermTable(term, data) {

        var contents = '<h4>' + term + '</h4>';
        contents += '<table class="table table-bordered" id="gradeTable">';
        contents += '<thead>';
        contents += '<tr id="headerLabels" class="bg-secondary">';

        var keysToShow = ['Last Name', 'First Name', 'Lecture Term Grade (60%)', 
                         'Lab Term Grade (40%)', 'Lecture Term Grade (E)', 'Lab Term Grade (E)'];
        
        keysToShow.forEach(function(key) {
            contents += '<th>' + key + '</th>';
        });

        contents += '</tr>';
        contents += '</thead>';
        contents += '<tbody>';

        data.forEach(function(item) {

            contents += '<tr id="scoreData">';

            keysToShow.forEach(function(key) {

                contents += '<td>' + decimal_places(item[key]) + '</td>';

            });

            contents += '</tr>';

        });

        contents += '</tbody>';
        contents += '</table>';

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
