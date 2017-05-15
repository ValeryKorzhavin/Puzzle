function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomPos() {
  return {
    top: getRandomInt(10, 271),
    left: getRandomInt(460, 751),
  };
}

function initPuzzleObjects(puzzles) {
    puzzles.each(function(index, element) {
      var leftOffset = 10;
      var topOffset = 10;
      var dist = 1;
      var position = {
          left: (index % 3) * 120 + dist *
                (index % 3) + leftOffset,
          top: Math.floor(index / 3) * 120 + dist *
               Math.floor(index / 3) + topOffset,
      }
      var object = {
        busy: false,
        pos: position,
      };
      $(element).css(position)
      $(element).data(object);
    });
}

function initImageObjects(images) {
    images.each(function(index, element) {
      var position = getRandomPos();
      var object = {
        pos: position,
        onPlace: false,
        puz: -1,
      };
      $(element).css(position);
      $(element).data(object);
    });
}

function checkInside(puzzles, fragment) {
  var selectedPuzzle = -1;
  var center = {
    left: fragment.position().left + 60,
    top: fragment.position().top + 60,
  };

  puzzles.each(function(index, element) {
    var puzzlePos = $(element).data().pos;
    if (center.left > puzzlePos.left &&
        center.left < puzzlePos.left + 120 &&
        center.top > puzzlePos.top &&
        center.top < puzzlePos.top + 120) {
      selectedPuzzle = index;
      return false;
    }
  });

  return selectedPuzzle;
}

function checkSolution(data) {
  var images = data.images;
  var puzzles = data.puzzles;
  var scene = data.scene;
  var button = data.button;
  var message = data.message;
  var result = true;
  var wrongFragments = [];

  images.each(function(index, element) {
    var image = $(element);
    if (!image.data().onPlace) {
      wrongFragments.push(image);
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
        var imageData = item.data();
        puzzles.eq(imageData.puz).data().busy = false;
        imageData.puz = -1;
        item.animate({
          left: imageData.pos.left,
          top: imageData.pos.top
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
  var puzzles = data.puzzles;
  var result = true;

  puzzles.each(function(index, element) {
    var puzzleData = $(element).data();
    if (!puzzleData.busy) {
      result = false;
      return false;
    }
  });

  return result;
}

function switchOnActionHandlers(data, fragment) {
  return function() {
    buttonHandler(data);
    dragFragment(data);
    fragment.removeClass('high-priority');
  }
}

function moveFragment(fragment, pos, data) {
  fragment.removeClass('on-move');
  fragment.animate(
    pos,
    500,
    switchOnActionHandlers(data, fragment)
  );

}

function dragFragment(data) {
  var images = data.images;
  var puzzles = data.puzzles;
  var parent = data.parent;
  var button = data.button;
  var window = data.window;

  images.on('mousedown', function(event) {
    var fragment = $(this);
    var pos = {};

    var fragmentData = fragment.data();
    var fragmentIndex = fragment.index('.image');
    var srcPos = fragment.data().pos;

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

      var puzzleIndex = fragmentData.puz;
      if (puzzleIndex >= 0) {
          puzzles.eq(puzzleIndex).data().busy = false;
          fragmentData.puz = -1;
      }
      fragment.addClass('on-move');

      fragment.css(newPos);
    });

    window.on('mouseup', function() {
      var puzzleIndex = checkInside(puzzles, fragment);

      if (puzzleIndex >= 0) {
        var puzzle = puzzles.eq(puzzleIndex).data();
        var puzzlePos = puzzle.pos;

        if (!puzzle.busy) {
          puzzle.busy = true;

          fragmentData.puz = puzzleIndex;
          fragmentData.onPlace = fragmentIndex === puzzleIndex;

          moveFragment(fragment, puzzlePos, data);

        } else if (fragment.hasClass('on-move')) {
          moveFragment(fragment, srcPos, data);
        } else {
          switchOnActionHandlers(data, fragment)();
        }
      } else {
        moveFragment(fragment, srcPos, data);
      }

      button.prop('disabled', !isPuzzlesReady(data));
      window.off('mouseup');
      window.off('mousemove');
    });
  });
}
