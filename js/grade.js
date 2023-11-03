/* global variables */

let typingTimer;
const doneTypingInterval = 1000; // 1 second delay

 $(document).ready(function() {


        $('#emailInput').on('keyup', function() {

                clearTimeout(typingTimer);
                typingTimer = setTimeout(performSearch, doneTypingInterval);
        });

        function performSearch() {

            const searchTerm = $('#emailInput').val();

            // You can replace the URL with your external JSON file's location
            const jsonURL = 'checkpoint/_datfile.json';

            $.getJSON(jsonURL, function(data) {

                const exactMatch = data.find(item => item.email === searchTerm);

                if (exactMatch) {

                    $('#searchResult').html('Exact email found: ' + exactMatch.email);

                } else {

                    $('#searchResult').html('Email not found');
                }
            });
        }
});