$(document).ready(function() {
	
      var patentCount = $("ol#patents > li").length;
      var industrialDesignCount = $("ol#industrialDesign > li").length;
      var booksCount = $("ol#books > li").length;
      var researchCount = $("#researchArticles > ol.research-list > li").length;
      var acceptedCount = $("#acceptedArticles > li").length;
            
      $("#patentsCount").text("(" + patentCount + ")");
      $("#industrialDesignCount").text("(" + industrialDesignCount + ")");
      $("#booksCount").text("(" + booksCount + ")");
      $("#acceptedArticlesCount").text("(" + acceptedCount + ")");

});