$(document).ready(function() {

    var direct = 'checkpoint/';

    $.getJSON(direct + 'set_a.json', function(data) {
      $.each(data, function(index, item) {
          var row = `<tr><td>${item.Date}</td><td>${item.Value}</td></tr>`;
          $('#set_a tbody').append(row);
      });
    });

    $.getJSON(direct + 'set_b.json', function(data) {
      $.each(data, function(index, item) {
          var row = `<tr><td>${item.Date}</td><td>${item.Value}</td></tr>`;
          $('#set_b tbody').append(row);
      });
    });

    $.getJSON(direct + 'set_c.json', function(data) {
      $.each(data, function(index, item) {
          var row = `<tr><td>${item.Date}</td><td>${item.Value}</td></tr>`;
          $('#set_c tbody').append(row);
      });
    });

    $.getJSON(direct + 'set_d.json', function(data) {
      $.each(data, function(index, item) {
          var row = `<tr><td>${item.Date}</td><td>${item.Value}</td></tr>`;
          $('#set_d tbody').append(row);
      });
    });

});