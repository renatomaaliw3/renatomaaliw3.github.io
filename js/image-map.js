function rescaleImageMap(img, map) {
  if (!img.naturalWidth || !img.naturalHeight) return;

  const xScale = img.clientWidth / img.naturalWidth;
  const yScale = img.clientHeight / img.naturalHeight;

  map.querySelectorAll('area').forEach((area) => {
    // Store original coords once
    if (!area.dataset.originalCoords) {
      area.dataset.originalCoords = area.coords;
    }

    const original = area.dataset.originalCoords.split(',').map(Number);
    const scaled = original.map((value, index) => {
      // even index = x, odd index = y
      const isX = index % 2 === 0;
      return Math.round(value * (isX ? xScale : yScale));
    });

    area.coords = scaled.join(',');
  });
}

window.addEventListener('load', function () {
  const img = document.getElementById('campus-map');
  const map = document.querySelector('map[name="image-map"]');
  if (!img || !map) return;

  function update() {
    rescaleImageMap(img, map);
  }

  update(); // initial
  window.addEventListener('resize', update);

    $(function () {
    var $areas = $('map[name="image-map"] area');

    // Create the bubble once and attach to body
    var $tooltip = $('<div id="map-tooltip"></div>').appendTo('body');

    // Move each title into data-title so browser's default tooltip is disabled
    $areas.each(function () {
      var $a = $(this);
      var t = $a.attr('title');
      if (t) {
        $a.data('title', t);
        $a.removeAttr('title');
      }
    });

    // When mouse moves over an area, show & position bubble
    $areas.on('mousemove', function (e) {
      var $a = $(this);
      var text = $a.data('title') || $a.attr('alt') || "";

      if (!text) {
        $tooltip.hide();
        return;
      }

      $tooltip.text(text).show();

      var tooltipWidth  = $tooltip.outerWidth();
      var tooltipHeight = $tooltip.outerHeight();
      var pageWidth     = $(window).width();
      var scrollTop     = $(window).scrollTop();

      // Center horizontally over the cursor
      var left = e.pageX - tooltipWidth / 2;
      left = Math.max(8, Math.min(left, pageWidth - tooltipWidth - 8));

      // Place bubble ABOVE cursor (arrow points down to it)
      var offsetY = 14; // gap between cursor and bubble
      var top = e.pageY - tooltipHeight - offsetY;

      // Make sure it doesn't go above top of viewport
      if (top < scrollTop + 8) {
        top = scrollTop + 8;
      }

      $tooltip.css({
        left: left + 'px',
        top: top + 'px'
      });
    });

    // Hide bubble when leaving the area or losing focus
    $areas.on('mouseleave blur', function () {
      $tooltip.hide();
    });
  });

});


