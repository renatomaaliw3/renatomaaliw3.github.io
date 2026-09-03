/* ==========================================================================
   Rating Viewer
   --------------------------------------------------------------------------
   Renders a student's per-term ratings for the selected course.

   Layout note: this script never writes inline `display` styles. Which
   columns are visible is expressed with two classes (`rv-col-brief`,
   `rv-col-detail`) plus a single `rv-details-open` class on <body>, so the
   summary view, the detailed view and the mobile stacked-card view are all
   driven from css/app.css and can never fall out of sync.
   ========================================================================== */

(function ($) {

	'use strict';

	var DATA_DIR       = 'checkpoint/';
	var GRAPH_DIR      = 'checkpoint/graphs/';
	var TYPING_DELAY   = 600;        // ms of silence before a lookup is fired
	var CACHE_LIFETIME = 5 * 60000;  // how long a downloaded course file is reused

	/* Column model -------------------------------------------------------- */
	/* mode: 'always' — shown in both views (and used as the mobile card title)
	         'brief'  — shown only while the details are collapsed
	         'detail' — shown only while the details are expanded
	   group: drives the lecture / laboratory colour coding
	   equiv: value is an equivalent rating, so 4.00 / 5.00 get flagged        */

	var COLUMNS = [
		{ key: 'Term',                                    mode: 'always', group: 'term' },
		{ key: 'Lecture Quiz',                            mode: 'detail', group: 'lec' },
		{ key: 'Lecture Quiz Points',                     mode: 'detail', group: 'lec' },
		{ key: 'Lecture Major Exam',                      mode: 'detail', group: 'lec' },
		{ key: 'Lecture Major Exam Points',               mode: 'detail', group: 'lec' },
		{ key: 'Lecture Performance & Attendance',        mode: 'detail', group: 'lec' },
		{ key: 'Lecture Performance & Attendance Points', mode: 'detail', group: 'lec' },
		{ key: 'Lab Activities',                          mode: 'detail', group: 'lab' },
		{ key: 'Lab Activities Points',                   mode: 'detail', group: 'lab' },
		{ key: 'Lab Major Exam',                          mode: 'detail', group: 'lab' },
		{ key: 'Lab Major Exam Points',                   mode: 'detail', group: 'lab' },
		{ key: 'Lecture Term Grade',                      mode: 'detail', group: 'lec-total' },
		{ key: 'Lab Term Grade',                          mode: 'detail', group: 'lab-total' },
		{ key: 'Lecture Term Grade (E)',                  mode: 'always', group: 'lec-total', equiv: true },
		{ key: 'Lab Term Grade (E)',                      mode: 'always', group: 'lab-total', equiv: true },
		{ key: 'Section Rank',                            mode: 'detail', group: 'meta' },
		{ key: 'Overall Rank',                            mode: 'detail', group: 'meta' },
		{ key: 'Remarks',                                 mode: 'brief',  group: 'meta' }
	];

	$(document).ready(function () {

		var $status    = $('#searchStatus');
		var $result    = $('#searchResult');
		var $graphs    = $('#graphs');
		var $image     = $('#img-container');
		var $input     = $('#emailInput');
		var $course    = $('#courseMenu');

		var typingTimer  = null;
		var requestToken = 0;      // guards against out-of-order responses
		var scoreCache   = {};     // url -> { time, data }

		/* -- Search ------------------------------------------------------- */

		function performSearch() {

			var searchTerm = normalize($input.val());
			var course     = $course.val();
			var token      = ++requestToken;

			setDetailsOpen(false);

			if (searchTerm === '') {

				clearResults();
				setStatus('');
				return;

			}

			setStatus('Looking up your rating…');

			$.when(fetchJSON(DATA_DIR + course), fetchJSON(GRAPH_DIR + course, true))
				.done(function (scores, terms) {

					if (token !== requestToken) { return; }   // a newer search won

					var matches = $.grep(scores || [], function (item) {

						return normalize(item['Email']) === searchTerm;

					});

					if (!matches.length) {

						clearResults();
						setStatus('Pass key not found. Please check the key and the selected course.', true);
						return;

					}

					setStatus('');
					renderResult(matches);
					renderTermMenu(terms || []);

				})
				.fail(function () {

					if (token !== requestToken) { return; }

					clearResults();
					setStatus('The ratings for this course could not be loaded. Please try again.', true);

				});

		}

		function fetchJSON(url, optional) {

			var cached = scoreCache[url];

			/* Short-lived cache: keeps typing from re-downloading the whole
			   course file, without serving a stale copy to a tab left open. */
			if (cached && (Date.now() - cached.time) < CACHE_LIFETIME) {

				return $.Deferred().resolve(cached.data).promise();

			}

			return $.getJSON(url).then(function (data) {

				scoreCache[url] = { time: Date.now(), data: data };
				return data;

			}, function (error) {

				/* A missing statistics file must not break the ratings table. */
				if (optional) {

					return $.Deferred().resolve([]).promise();

				}

				return $.Deferred().reject(error).promise();

			});

		}

		/* -- Rendering ---------------------------------------------------- */

		function renderResult(rows) {

			var student = rows[0];
			var rating  = overallRating(rows);
			var html    = '';

			html += '<div class="rv-result__head">';
			html +=     '<h2 class="rv-result__name">' + escapeHtml(fullName(student)) + '</h2>';

			if (rating !== '') {

				html += '<span class="rv-result__rating"' + colorAttr(rating) + '>Overall - ' + escapeHtml(rating) + '</span>';

			}

			html += '</div>';

			html += '<div class="rv-table-scroll">';
			html +=     '<table id="gradeTable">';
			html +=         '<thead><tr id="headerLabels">';

			$.each(COLUMNS, function (i, col) {

				html += '<th scope="col" class="' + columnClasses(col) + '">' + escapeHtml(col.key) + '</th>';

			});

			html +=         '</tr></thead>';
			html +=         '<tbody>';

			$.each(rows, function (i, item) {

				html += '<tr class="rv-score-row">';

				$.each(COLUMNS, function (j, col) {

					var value = decimalPlaces(item[col.key]);

					html += '<td class="' + columnClasses(col) + '" data-label="' + escapeHtml(col.key) + '"' + valueColorAttr(col, value) + '>';
					html +=     '<span class="rv-cell__value">' + escapeHtml(value) + '</span>';
					html += '</td>';

				});

				html += '</tr>';

			});

			html +=         '</tbody>';
			html +=     '</table>';
			html += '</div>';

			html += '<p class="rv-note"> Section &amp; Overall Ranks, and Remarks are for Lecture Grades only. </p>';

			html += '<div class="rv-actions">';
			html +=     '<button type="button" id="btnDetails" aria-expanded="false" aria-controls="gradeTable"> Show Details </button>';
			html += '</div>';

			$result.html(html);
			$('body').addClass('rv-has-result');

			highlightNotApplicable();

		}

		function renderTermMenu(terms) {

			if (!terms.length) {

				$graphs.empty();
				return;

			}

			var html = '';

			html += '<form id="graphForm" class="rv-field">';
			html +=     '<label class="rv-field__label" for="graphOption"> Select Term Statistics </label>';
			html +=     '<select id="graphOption" class="rv-control">';
			html +=         '<option value="" disabled selected> [Select Term] </option>';

			$.each(terms, function (i, item) {

				html += '<option value="' + escapeHtml(item['Graphs']) + '">' + escapeHtml(item['Term']) + '</option>';

			});

			html +=     '</select>';
			html += '</form>';

			$graphs.html(html);

		}

		function clearResults() {

			$result.empty();
			$graphs.empty();
			$image.empty();
			$('body').removeClass('rv-has-result');

		}

		/* -- Details toggle ----------------------------------------------- */

		function setDetailsOpen(open) {

			$('body').toggleClass('rv-details-open', open);

			$('#btnDetails')
				.attr('aria-expanded', open ? 'true' : 'false')
				.text(open ? ' Hide Details ' : ' Show Details ');

			if (!open) {

				$('#graphOption').prop('selectedIndex', 0);
				$image.empty();

			}

		}

		/* -- Events ------------------------------------------------------- */

		$('#gradeForm').on('submit', function (event) {

			/* Mobile keyboards show a Go / Search key: never reload the page. */
			event.preventDefault();
			window.clearTimeout(typingTimer);
			performSearch();

		});

		$input.on('input', function () {

			window.clearTimeout(typingTimer);
			typingTimer = window.setTimeout(performSearch, TYPING_DELAY);

		});

		$course.on('change', function () {

			window.clearTimeout(typingTimer);
			performSearch();

		});

		$result.on('click', '#btnDetails', function () {

			setDetailsOpen($(this).attr('aria-expanded') !== 'true');

		});

		$graphs.on('change', '#graphOption', function () {

			var source = GRAPH_DIR + $(this).val();
			var image  = new Image();

			$image.html('<p class="rv-chart-msg"> Loading chart… </p>');

			image.onload = function () {

				$image.html('<img src="' + escapeHtml(source) + '" alt="Class statistics for the selected term">');

			};

			image.onerror = function () {

				$image.html('<p class="rv-chart-msg rv-chart-msg--empty"> Not yet available </p>');

			};

			image.src = source;

		});

		/* -- Helpers ------------------------------------------------------ */

		function setStatus(message, isError) {

			$status
				.text(message)
				.toggleClass('is-shown', message !== '')
				.toggleClass('is-error', !!isError);

		}

		function columnClasses(col) {

			var classes = ['rv-col-' + cleanKey(col.key), 'rv-g-' + col.group];

			if (col.mode === 'brief')  { classes.push('rv-col-brief'); }
			if (col.mode === 'detail') { classes.push('rv-col-detail'); }

			return classes.join(' ');

		}

		function valueColorAttr(col, value) {

			return col.equiv ? colorAttr(value) : '';

		}

		function colorAttr(value) {

			var number = parseFloat(value);

			if (number === 4) { return ' data-color="orange"'; }
			if (number === 5) { return ' data-color="red"'; }

			return '';

		}

		function fullName(student) {

			return trim((student['First Name'] || '') + ' ' + (student['Last Name'] || ''));

		}

		function overallRating(rows) {

			/* Only one term row carries the rating; every other row holds a
			   placeholder ("-", "N/A", …). Scan backwards and skip those, so
			   the badge shows the real figure no matter which term declares
			   it — and stays hidden while the course is still incomplete.   */
			for (var i = rows.length - 1; i >= 0; i--) {

				var rating = rows[i]['Overall Rating'];

				if (!isPlaceholder(rating)) {

					return decimalPlaces(rating);

				}

			}

			return '';

		}

		function isPlaceholder(value) {

			if (value === undefined || value === null) { return true; }

			/* A rating is always numeric; anything else ("-", "--", "N/A",
			   "TBA", a blank cell) means "not published yet".               */
			var text = trim(value);

			return text === '' || isNaN(text);

		}

		function decimalPlaces(value) {

			if (value === undefined || value === null || value === '') { return ''; }

			if (!isNaN(value)) { return parseFloat(value).toFixed(2); }

			return String(value);

		}

		function cleanKey(value) {

			return String(value).replace(/[^A-Za-z0-9]+/g, '');

		}

		function normalize(value) {

			return trim(value).toLowerCase();

		}

		function trim(value) {

			return String(value === undefined || value === null ? '' : value).replace(/^\s+|\s+$/g, '');

		}

		function escapeHtml(value) {

			return String(value === undefined || value === null ? '' : value)
				.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/"/g, '&quot;')
				.replace(/'/g, '&#39;');

		}

		function highlightNotApplicable() {

			$result.find('td').filter(function () {

				return trim($(this).text()) === 'N/A';

			}).attr('data-color', 'muted');

		}

	});

}(jQuery));
