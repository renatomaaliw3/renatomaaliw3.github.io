$(document).ready(function () {

	/* ---------- Wrap "Label: value" metadata lines for readability ---------- */
	/* Matches lines like "Period of Implementation: ...", "Funding Institution: ...",
	   "Amount of Project: ...", "Date: ...", "Location: ...", "Organizer: ..." that
	   sit as plain text nodes after <br> inside each publication's <p class="mb-3"> */

	var labelPattern = /^(\s*)([A-Za-z][A-Za-z \-\/]{1,40}:)(\s*.*)$/;

	$('.research-list p.mb-3').each(function () {
		var node = this.firstChild;
		while (node) {
			var next = node.nextSibling;
			if (node.nodeType === 3) {
				var match = labelPattern.exec(node.nodeValue);
				if (match && match[3].trim().length > 0) {
					var lead = document.createTextNode(match[1]);
					var label = document.createElement('span');
					label.className = 'meta-label';
					label.textContent = match[2];
					var rest = document.createTextNode(match[3]);
					var parent = node.parentNode;
					parent.insertBefore(lead, node);
					parent.insertBefore(label, node);
					parent.insertBefore(rest, node);
					parent.removeChild(node);
				}
			}
			node = next;
		}
	});

	/* ---------- Mute "Not yet available" placeholders ---------- */

	$('.research-list span').each(function () {
		var text = $(this).text().trim();
		if (text === 'Not yet available') {
			$(this).addClass('cen-nolink');
		}
	});

	/* ---------- Section element map (for quick stats + filtering) ---------- */
	/* The heading/sub-header markup is not a common ancestor of every list, so each
	   section's related elements are looked up explicitly rather than inferred. */

	var $patentsList = $('#patents');
	var $patentsTitle = $('#RM3-CV-PATENTS-TITLE');
	var $patentsWrap = $('#RM3-CV-PATENTS-ARTICLES'); // holds sub-header + body + list

	var $indList = $('#industrialDesign');
	var $indTitle = $('#RM3-CV-INDUSTRIAL-DESIGN-TITLE');
	var $indBody = $indList.parent(); // .RM3-CV-SECTIONS-BODY
	var $indHeader = $indBody.prev(); // .RM3-CV-SECTIONS-HEADER

	var $booksList = $('#books');
	var $booksBody = $booksList.parent();
	var $booksHeader = $booksBody.prev();

	var $articlesSection = $('#research_'); // <section> wrapping B. Articles header + body
	var $presBody = $('#researchPresentations');
	var $presHeader = $presBody.prev();

	var $pubTitle = $('#RM3-CV-PUBLICATIONS-TITLE'); // shared by Books / Articles / Presentations

	/* ---------- Quick stats bar ---------- */

	var sections = [
		{ href: '#patent', label: 'Patents', count: $patentsList.children('li').length },
		{ href: '#ind-design', label: 'Industrial Design', count: $indList.children('li').length },
		{ href: '#book', label: 'Books', count: $booksList.children('li').length },
		{ href: '#research', label: 'Articles', count: $articlesSection.find('ol.research-list > li').length },
		{ href: '#presentation', label: 'Presentations', count: $presBody.find('ol.research-list > li').length }
	];

	var statsHtml = sections.map(function (s) {
		return '<li><a href="' + s.href + '">' + s.label + ' <span class="n">(' + s.count + ')</span></a></li>';
	}).join('');
	$('#cenStats').html(statsHtml);

	/* ---------- Live search / filter across every publication list ---------- */

	var $input = $('#cenSearchInput');
	var $clear = $('#cenSearchClear');
	var $status = $('#cenSearchStatus');
	var totalCount = $('ol.research-list > li').length;
	var debounceTimer = null;

	function setVisible($el, visible) {
		$el.toggle(visible);
	}

	// Checks each element's OWN inline display style rather than jQuery's :visible,
	// which also walks up through ancestors — those ancestors (section wrappers) are
	// themselves toggled by this same function, so an ancestor-aware check would read
	// stale state left over from the previous filter pass and could get stuck hidden.
	function isOwnVisible(el) {
		return el.style.display !== 'none';
	}

	function countOwnVisible($items) {
		var n = 0;
		$items.each(function () { if (isOwnVisible(this)) n++; });
		return n;
	}

	function applyFilter() {
		var query = $input.val().trim().toLowerCase();
		var hasQuery = query.length > 0;

		$clear.prop('hidden', !hasQuery);

		var visibleCount = 0;
		$('ol.research-list > li').each(function () {
			var matches = !hasQuery || $(this).text().toLowerCase().indexOf(query) !== -1;
			this.style.display = matches ? '' : 'none';
			if (matches) visibleCount++;
		});

		$('h5.d-date').each(function () {
			var $list = $(this).next('ol.research-list');
			this.style.display = countOwnVisible($list.find('> li')) > 0 ? '' : 'none';
		});

		var patentsVisible = countOwnVisible($patentsList.find('> li')) > 0;
		setVisible($patentsTitle, patentsVisible);
		setVisible($patentsWrap, patentsVisible);

		var indVisible = countOwnVisible($indList.find('> li')) > 0;
		setVisible($indTitle, indVisible);
		setVisible($indHeader, indVisible);
		setVisible($indBody, indVisible);

		var booksVisible = countOwnVisible($booksList.find('> li')) > 0;
		setVisible($booksHeader, booksVisible);
		setVisible($booksBody, booksVisible);

		var articlesVisible = countOwnVisible($articlesSection.find('ol.research-list > li')) > 0;
		setVisible($articlesSection, articlesVisible);

		var presVisible = countOwnVisible($presBody.find('ol.research-list > li')) > 0;
		setVisible($presHeader, presVisible);
		setVisible($presBody, presVisible);

		setVisible($pubTitle, booksVisible || articlesVisible || presVisible);

		$('.cen-no-results').remove();
		if (hasQuery && visibleCount === 0) {
			$('#cenToolbar').after('<p class="cen-no-results">No publications match "' + $('<div>').text(query).html() + '".</p>');
		}

		if (hasQuery) {
			$status.prop('hidden', false).text('Showing ' + visibleCount + ' of ' + totalCount + ' publications.');
		} else {
			$status.prop('hidden', true);
		}
	}

	$input.on('input', function () {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(applyFilter, 150);
	});

	$clear.on('click', function () {
		$input.val('').trigger('input');
		$input.focus();
	});

	/* ---------- Floating nav: mobile collapse toggle ---------- */

	var $nav = $('#cenNav');
	var $navToggle = $('#cenNavToggle');
	$navToggle.on('click', function () {
		var collapsed = $nav.toggleClass('cen-collapsed').hasClass('cen-collapsed');
		$navToggle.attr('aria-expanded', String(!collapsed));
	});

	/* ---------- Floating nav: highlight the section currently in view ---------- */

	var anchors = $('a[name]').filter(function () {
		return ['b2top', 'patent', 'ind-design', 'book', 'research', 'presentation'].indexOf($(this).attr('name')) !== -1;
	});

	if ('IntersectionObserver' in window && anchors.length) {
		var navLinks = $('#cenNavList a');
		var observer = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (!entry.isIntersecting) return;
				var name = entry.target.getAttribute('name');
				navLinks.removeClass('cen-active');
				navLinks.filter('[href="#' + name + '"]').addClass('cen-active');
			});
		}, { rootMargin: '-10% 0px -80% 0px' });

		anchors.each(function () { observer.observe(this); });
	}

});
