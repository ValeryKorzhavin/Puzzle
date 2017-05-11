$(document).ready(function() {
  // При загрузке страницы выполнится весь написанный здесь код

  var data = {
    button: $('.check'),
    puzzles: $('.puzzle'),
    images: $('.image'),
    parent: $('.workspace'),
    scene: $('.scene'),
    window: $(window),
  };

  shuffleFragments(data.images);
  dragFragment(data);

});
