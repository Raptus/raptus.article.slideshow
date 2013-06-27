var slideshow = {
  selector: '.slideshow'
};

(function($) {

  var container;
  var timer = false;

  slideshow.init = function(container) {
    container = container;
    container.find(slideshow.selector).each(slideshow.create);
  };

  slideshow.create = function() {
    var touch = !!('ontouchstart' in window) || !!('onmsgesturechange' in window);
    var slides = $(this).find('> li');
    slides.each(function() {
      var content = $(this).find('> .wrapped > .content');
      var nav = $('<ul class="visualNoMarker nextprevious" />');
      var prev = $('<a href="javascript://" class="prev">&lt;</a>').appendTo(nav).click(slideshow.prev);
      var next = $('<a href="javascript://" class="next">&gt;</a>').appendTo(nav).click(slideshow.next);
      prev.wrap('<li />');
      next.wrap('<li />');
      nav.prependTo(content);
      if(touch)
        $(this).swipe({
          swipeLeft: function(e) {
            next.trigger('click');
          },
          swipeRight: function(e) {
            prev.trigger('click');
          }
        });
    });
    slideshow.auto();
  };

  function swap(hide, show) {
    hide.find('> .wrapped > .content').stop().animate({
      'margin-bottom': -20,
      'opacity': 0
    }, 500, function() {
      hide.stop().show().addClass('prev').removeClass('current');
      show.stop().hide().addClass('current');
      var content = show.find('> .wrapped > .content').removeAttr('style').hide();
      show.fadeTo(500, 1, function() {
        hide.hide().removeClass('prev');
        content.stop().removeAttr('style').hide().css('margin-bottom', -20).animate({
          'margin-bottom': 0,
          'opacity': 1
        }, 500).show();
      }).show();
    });
  }

  slideshow.next = function(e) {
    if(timer)
      slideshow.auto();
    var slide = $(this).closest('.slideshow > li');
    var next = slide.next('li');
    if(!next.size())
      next = slide.closest('.slideshow').find('li:first-child');
    swap(slide, next);
  };

  slideshow.prev = function(e) {
    if(timer)
      slideshow.auto();
    var slide = $(this).closest('.slideshow > li');
    var prev = slide.prev('li');
    if(!prev.size())
      prev = slide.closest('.slideshow').find('li:last-child');
    swap(slide, prev);
  };

  slideshow.auto = function() {
    if(timer)
      window.clearTimeout(timer);
    timer = window.setTimeout(function() {
      $.proxy(slideshow.next, container.find('li.current a.next'))();
      slideshow.auto();
    }, 8000);
  };

  $(document).ready(function() {
    slideshow.init($('body'));
  });

})(jQuery);
