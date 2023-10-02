$(document).ready(function() {
	
	
      var patentCount = $("ol#patents > li").length;
      var industrialDesignCount = $("ol#industrialDesign > li").length;
      var booksCount = $("ol#books > li").length;
      var researchCount = $("#researchArticles > ol.research-list > li").length;
            
      $("#patentsCount").text("Published Patents " + "(" + patentCount + ")");
      $("#industrialDesignCount").text("REGISTERED INDUSTRIAL DESIGN " + "(" + industrialDesignCount + ")");
      $("#booksCount").text("Books " + "(" + booksCount + ")");
      $("#researchArticlesCount").text("Research Articles " + "(" + researchCount + ")");


});