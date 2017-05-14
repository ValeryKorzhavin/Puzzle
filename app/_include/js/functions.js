function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomPos() {
  return {
    top: getRandomInt(10, 271),
    left: getRandomInt(460, 751),
  };
}

function initPuzzleObjects(data) {
  data.puzzle = (function() {
    var array = [];
    data.puzzles.each(function(index, element) {
      var leftOffset = 10;
      var topOffset = 10;
      var dist = 1;
      var leftPos = index % 3 * 120 + dist * (index % 3) + leftOffset;
      var topPos = Math.floor(index / 3) * 120 + dist *
                   Math.floor(index / 3) + topOffset;
      var object = {
        puz: $(element).css({
          'left': leftPos,
          'top': topPos,
        }),
        busy: false,
        pos: {
          left: leftPos,
          top: topPos,
        }
      }
      array.push(object);
    });
    return array;
  })();
}

function initImageObjects(data) {
  data.image = (function() {
    var array = [];
    data.images.each(function(index, element) {
      var position = getRandomPos();
      var object = {
        img: $(element).css({
          'top': position.top,
          'left': position.left,
        }),
        pos: position,
        onPlace: false,
        puz: -1,
      }
      array.push(object);
    });
    return array;
  })();
}

function checkInside(puzzles, position) {
  var selectedPuzzle = -1;

  puzzles.forEach(function(item, index) {
    if (position.left > item.pos.left &&
        position.left < item.pos.left + 120 &&
        position.top > item.pos.top &&
        position.top < item.pos.top + 120) {
      selectedPuzzle = index;
      return false;
    }
  });

  return selectedPuzzle;
}

function checkSolution(data) {
  var images = data.image;
  var puzzles = data.puzzle;
  var scene = data.scene;
  var button = data.button;
  var message = data.message;
  var result = true;
  var wrongFragments = [];

  images.forEach(function(item, index) {
    if (!item.onPlace) {
      wrongFragments.push(item);
      result = false;
    }
  });

  if (result) {
    setTimeout(function() {
      scene.fadeOut('slow');
    }, 2000);
  } else {
    button.addClass('wrong');
    message.fadeIn();

    setTimeout(function() {
      button.removeClass('wrong');
      message.fadeOut();

      wrongFragments.forEach(function(item, index) {
        puzzles[item.puz].busy = false;
        item.puz = -1;
        item.img.animate({
          left: item.pos.left,
          top: item.pos.top
        }, 500);
      });

      $.when.apply($, wrongFragments).done(function() {
        button.prop('disabled', !isPuzzlesReady(data));
        buttonHandler(data);
        dragFragment(data);
      });

    }, 1000);
  }

  return result;
}

function buttonHandler(data) {
  var button = data.button;
  var images = data.images;

  button.on('click', function() {
    button.off('click');
    images.off('mousedown');
    checkSolution(data);
  });
}

function isPuzzlesReady(data) {
  var puzzles = data.puzzle;
  var result = true;

  puzzles.forEach(function(item, index) {
    if (!item.busy) {
      result = false;
      return false;
    }
  });

  return result;
}

function dragFragment(data) {
  var images = data.images;
  var puzzles = data.puzzles;
  var image = data.image;
  var puzzle = data.puzzle;
  var parent = data.parent;
  var button = data.button;
  var window = data.window;

  images.on('mousedown', function(event) {
    var fragment = $(this);
    var pos = {};

    var fragmentIndex = fragment.index('.image');
    var fragmentObject = data.image[fragmentIndex];
    var srcPos = fragmentObject.pos;

    fragment.addClass('high-priority');
    button.off('click');
    images.off('mousedown');

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
        leftPos = parentWidth - 120;
      }
      if (topPos < 0) {
        topPos = 0;
      }
      if (topPos > parentHeight - 120) {
        topPos = parentHeight - 120;
      }
      var newPos = {
        left: leftPos,
        top: topPos,
      };

      var puzzleIndex = fragmentObject.puz;
      if (puzzleIndex >= 0) {
          puzzle[puzzleIndex].busy = false;
          fragmentObject.puz = -1;
      }

      fragment.css(newPos);
    });

    window.on('mouseup', function() {
      var fragmentPos = fragment.position();
      var fragmentCenter = {
        left: fragmentPos.left + 60,
        top: fragmentPos.top + 60,
      };

      var actionsSwitchOn = function(data, fragment) {
        return function() {
          buttonHandler(data);
          dragFragment(data);
          fragment.removeClass('high-priority');
        }
      };

      function moveFragment(fragment, pos) {
        fragment.animate({
          left: pos.left,
          top: pos.top},
          500,
          actionsSwitchOn(data, fragment));
      }

      var puzzleIndex = checkInside(puzzle, fragmentCenter);

      if (puzzleIndex >= 0) {
        var puzzlePos = puzzle[puzzleIndex].pos;

        if (!puzzle[puzzleIndex].busy) {
          puzzle[puzzleIndex].busy = true;
          image[fragmentIndex].puz = puzzleIndex;
          image[fragmentIndex].onPlace = fragmentIndex === puzzleIndex;
          moveFragment(fragment, puzzlePos);
        } else if (puzzlePos.left !== fragmentPos.left &&
                   puzzlePos.top !== fragmentPos.top) {
          moveFragment(fragment, srcPos);
        } else {
          actionsSwitchOn(data, fragment)();
        }
      } else {
        moveFragment(fragment, srcPos);
      }

      button.prop('disabled', !isPuzzlesReady(data));
      window.off('mouseup')
      window.off('mousemove');
    });
  });
}
