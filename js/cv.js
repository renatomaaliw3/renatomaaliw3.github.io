(function () {
	var $ = function (s, r) { return (r || document).querySelector(s); };
	var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

	// Theme toggle (remembered per browser; works without storage)
	var root = document.documentElement, btn = $('#themeBtn');
	try { var saved = localStorage.getItem('cv-theme'); if (saved) root.setAttribute('data-theme', saved); } catch (e) {}
	function isDark() {
		var t = root.getAttribute('data-theme');
		return t ? t === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
	}
	function paint() { if (btn) { btn.textContent = isDark() ? 'â˜€' : 'â˜¾'; btn.setAttribute('aria-label', isDark() ? 'Switch to light theme' : 'Switch to dark theme'); } }
	if (btn) btn.addEventListener('click', function () {
		var next = isDark() ? 'light' : 'dark';
		root.setAttribute('data-theme', next);
		try { localStorage.setItem('cv-theme', next); } catch (e) {}
		paint();
	});
	paint();

	// Wrap each section (heading + body, up to the next section) in a card
	var cv = $('.cv'), section = null, hasH2 = false;
	var subAnchors = ['n-books', 'n-journal', 'n-book-chapters', 'n-conference-papers'];
	Array.prototype.slice.call(cv.children).forEach(function (el) {
		if (el.classList.contains('stats') || el.classList.contains('credentials')) return;
		var isAnchor = el.tagName === 'A';
		var startsCard = isAnchor ? subAnchors.indexOf(el.getAttribute('name')) === -1 : !!el.querySelector('h2');
		if (startsCard && (!section || hasH2)) {
			section = document.createElement('section');
			section.className = 'section';
			cv.insertBefore(section, el);
			hasH2 = false;
		}
		if (!section) return;
		section.appendChild(el);
		if (!isAnchor && el.querySelector('h2')) hasH2 = true;
	});
	$$('a[name]').forEach(function (a) { if (!a.id) a.id = a.getAttribute('name'); });
	// Collapse very long lists
	$$('ol.research-list').forEach(function (ol) {
		var n = ol.children.length;
		if (n < 12) return;
		ol.classList.add('list-collapsed');
		var b = document.createElement('button');
		b.type = 'button'; b.className = 'more-btn'; b.textContent = 'Show all ' + n;
		b.addEventListener('click', function () {
			var open = ol.classList.toggle('list-collapsed');
			b.textContent = open ? 'Show all ' + n : 'Show fewer';
			if (open) ol.closest('.section, body').scrollIntoView({ block: 'nearest' });
		});
		ol.parentNode.insertBefore(b, ol.nextSibling);
	});
	// Printing / find-in-page: expand everything
	window.addEventListener('beforeprint', function () { $$('.list-collapsed').forEach(function (o) { o.classList.remove('list-collapsed'); }); });

	// Stats strip
	var stats = [
		['Journal articles', '#researchArticles > ol > li'],
		['Conference papers', '#conferencePaper > li'],
		['Book chapters', '#bookChapters > li'],
		['Books', '#books > li'],
		['Patents', '#patents > li']
	];
	var st = $('#stats');
	if (st) stats.forEach(function (s) {
		var n = $$(s[1]).length; if (!n) return;
		var d = document.createElement('div'); d.className = 'stat';
		d.innerHTML = '<b>' + n + '</b><span>' + s[0] + '</span>';
		st.appendChild(d);
	});

	// Scroll spy, progress bar, back-to-top
	var links = $$('.toc a'), prog = $('.progress'), top = $('.to-top');
	var targets = links.map(function (a) { return $(a.getAttribute('href')); });
	function onScroll() {
		var y = window.scrollY, h = document.documentElement.scrollHeight - window.innerHeight;
		if (prog) prog.style.width = (h > 0 ? y / h * 100 : 0) + '%';
		if (top) top.classList.toggle('show', y > 700);
		var cur = -1;
		targets.forEach(function (t, i) { if (t && t.getBoundingClientRect().top < 140) cur = i; });
		links.forEach(function (a, i) {
			var on = i === cur; a.classList.toggle('active', on);
			if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
			if (on && a.scrollIntoView && a.parentNode.scrollWidth > a.parentNode.clientWidth) {
				var p = a.parentNode; p.scrollLeft = a.offsetLeft - p.clientWidth / 2 + a.clientWidth / 2;
			}
		});
	}
	window.addEventListener('scroll', onScroll, { passive: true });
	if (top) top.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
	onScroll();
})();

