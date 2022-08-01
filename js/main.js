$(document).ready(function() {
	
	var the_list = $('.parameters li');
	var the_contents = $('.contents');
	var the_link = $('.parameters a');
	var nav = $('.navigation');

	var top_distance_threshold = 1000;

	var x_axis = 1;
	var y_axis = 1;

	the_link.attr('target','_blank'); //every link has attribute of target="_blank"

	the_list.each(function(index, el) {
		
		var el = $(el);

		if (el.find('a').length == 0) {

			el.addClass('gray');

		}

	});

	//Save Title as PDF
	var front_main = $('.front-main');
	var li_span = $('.parameters .front-main, .parameters li > span');
	var li_span_strong = $('.parameters li > span > strong');
	var count_li_span = li_span.length;

	var area_text = $.trim($('#area').text());

	var doc = new jsPDF('p','in',[8.5,13]);

	$('#generate-fp').on('click', function() {

		var doc = new jsPDF('p','in', [8.5,13]);

		doc.setFontSize(21);

		li_span.each(function(index, el) {
		
			var el = $(el);

			var the_text = $.trim(el.text());
			var split_text = doc.splitTextToSize(the_text, 5);

			if (el.hasClass('front-main')) { //center align

				doc.setFontType('bold');
				doc.text(split_text, 4.3, 5, 'center');

			} else {

				doc.setFontType('normal');
				doc.text(split_text, 1.5, 5);

			}

			
			if (index != (count_li_span - 1)) {

				doc.addPage();

			} 

		});

		doc.autoPrint();
		doc.save(area_text + ' - Front Pages.pdf');

	});

	$('#generate-tabs').on('click', function() {

		li_span_strong.each(function(index, el) {
		
			var el = $(el);

			var the_text = $.trim(el.text());

			doc.setFontType('normal');

			console.log(x_axis);

			if (y_axis > 12) {

				x_axis = x_axis + 1.5;
				y_axis = 1;

			}

			// if (x_axis > 5.5) {

			// 	doc.addPage();
			// 	x_axis = 1;
			// 	y_axis = 1;

			// }

			doc.text(the_text, x_axis, y_axis, 'center');
			y_axis = y_axis + 0.5;

		});

		doc.autoPrint();
		doc.save(area_text + ' - Side Tabs.pdf');

	});

	$(window).on('scroll', function() {

		var scroll_top_d = $(this).scrollTop();

		if (scroll_top_d >= top_distance_threshold) {

			nav.fadeIn();

		} else {

			nav.fadeOut();

		}

	});

	the_contents.on('click', '.parameters li', function(event) {

		event.stopPropagation();

		var _this = $(this);

		_this.children('span').toggleClass('active');

	});

});