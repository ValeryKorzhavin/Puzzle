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

  fragments.each(function(index, element) {
    $(element).draggable({
      containment: 'parent'
    });
  });
  /*
  fragments.on('mousedown', function(event) {
    var fragment = $(this);
    var pos = {};

    pos.inner = {
      left: event.offsetX,
      top: event.offsetY,
    };

    parent.on('mousemove', function(event) {
      pos.parent = parent.offset();
      pos.cursor = {
        left: event.pageX,
        top: event.pageY,
      };

      var parentWidth = parent.width();
      var parentHeight = parent.height();

      var leftPos = pos.cursor.left - pos.parent.left - pos.inner.left;
      var topPos = pos.cursor.top - pos.parent.top - pos.inner.top;
      leftPos = leftPos < 0 ? 0 : leftPos;
      leftPos = leftPos > parentWidth - 120 ? parentWidth - 120 : leftPos;
      topPos = topPos < 0 ? 0 : topPos;
      topPos = topPos > parentHeight - 120 ? parentHeight - 120 : topPos;
      new_pos = {
        left: leftPos,
        top: topPos,
      };
      fragment.css(new_pos);
    });

    fragments.on('mouseup', function() {
      fragment.off("mouseup");
      parent.off("mousemove");
    });
  });*/
}
