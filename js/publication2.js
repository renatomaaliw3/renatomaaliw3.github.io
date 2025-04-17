$(document).ready(function() {
	
      var patentCount = $("ol#patents > li").length;
      var industrialDesignCount = $("ol#industrialDesign > li").length;
      var booksCount = $("ol#books > li").length;
      var researchCount = $("#researchArticles > ol.research-list > li").length;
      var researchPresCount = $("#researchPresentations > ol.research-list > li").length;
      var bookChapterCount = $("#bookChapters > li").length;
      var conferencePaperCount = $("#conferencePaper > li").length;
      var acceptedArticlesCount = $("#acceptedArticles > li").length;
      var submittedArticlesCount = $("#submittedArticles > li").length;

      var indexingCount = $("span.indexed").length;

            
      $("#patentsCount").text("(" + patentCount + ")");
      $("#industrialDesignCount").text("(" + industrialDesignCount + ")");
      $("#booksCount").text("(" + booksCount + ")");
      $("#researchPresentationsCount").text("(" + researchPresCount + ")");
      $("#researchArticlesCount").text("(" + researchCount + ")");
      $("#bookChapterCount").text("(" + bookChapterCount + ")");
      $("#conferencePaperCount").text("(" + conferencePaperCount + ")")
      $("#acceptedArticlesCount").text("(" + acceptedArticlesCount + ")");
      $("#submittedArticlesCount").text("(" + submittedArticlesCount + ")");
      $("#indexing").text("Scopus or WOS indexed publications: " + indexingCount + "");

      var nav = $('.navigation');
      var top_distance_threshold = 1000;

      // Per Date Count

      $('.d-date').each(function() {
            
            var count = $(this).next('.research-list').children('li').length;
            $(this).find('.per-date-count').text('(' + count + ')');

      });
      
	$(window).on('scroll', function() {

		var scroll_top_d = $(this).scrollTop();

		if (scroll_top_d >= top_distance_threshold) {

			nav.fadeIn();

		} else {

			nav.fadeOut();

		}

	});

});