$(document).ready(function() {
	
	
      var patentCount = $("ol#patents > li").length;
      var industrialDesignCount = $("ol#industrialDesign > li").length;
      var booksCount = $("ol#books > li").length;
      var researchCount = $("#researchArticles > ol.research-list > li").length;
      var bookChapterCount = $("#bookChapters > li").length;
      var conferencePaperCount = $("#conferencePaper > li").length;
            
      $("#patentsCount").text("(" + patentCount + ")");
      $("#industrialDesignCount").text("(" + industrialDesignCount + ")");
      $("#booksCount").text("(" + booksCount + ")");
      $("#researchArticlesCount").text("(" + researchCount + ")");
      $("#bookChapterCount").text("(" + bookChapterCount + ")");
      $("#conferencePaperCount").text("(" + conferencePaperCount + ")")



});