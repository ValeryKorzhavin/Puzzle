function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomPos() {
  return {
    top: getRandomInt(10, 271),
    left: getRandomInt(460, 751),
  };
}

function shuffleFragments(fragments) {
  fragments.each(function(index, element) {
    var pos = getRandomPos();
    $(element).css({
      'top': pos.top,
      'left': pos.left,
    });
  });
}

function dragFragment(data) {
  var fragments = data.images;
  var parent = data.parent;
  var window = data.window;


  fragments.on('mousedown', function(event) {
    var fragment = $(this);
    var pos = {};

    pos.inner = {
      left: event.offsetX,
      top: event.offsetY,
    };

    window.on('mousemove', function(event) {
      pos.parent = parent.offset();
      pos.cursor = {
        left: event.pageX,
        top: event.pageY,
      };

      var parentWidth = parent.width();
      var parentHeight = parent.height();

      var leftPos = pos.cursor.left - pos.parent.left - pos.inner.left;
      var topPos = pos.cursor.top - pos.parent.top - pos.inner.top;

      if (leftPos < 0) {
        leftPos = 0;
      }
      if (leftPos > parentWidth - 120) {
        leftPos = leftPos > parentWidth - 120;
      }
      if (topPos < 0) {
        topPos = 0;
      }
      if (topPos > parentHeight - 120) {
        topPos = parentHeight - 120;
      }
      var new_pos = {
        left: leftPos,
        top: topPos,
      };

      fragment.css(new_pos);
    });

    window.on('mouseup', function() {
      window.off("mousemove");
    });
  });
}
