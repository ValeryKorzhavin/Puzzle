function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomPos() {
  return {
    top: getRandomInt(10, 271),
    left: getRandomInt(460, 751),
  }
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

$(document).ready(function() {
  // При загрузке страницы выполнится весь написанный здесь код

  var data = {
    button: $('.check'),
    puzzles: $('.puzzle'),
    images: $('.image'),
    parent: $('.workspace'),
    scene: $('.scene'),
  };

  shuffleFragments(data.images);

});
