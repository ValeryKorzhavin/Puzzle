$(document).ready(function() {
  // При загрузке страницы выполнится весь написанный здесь код

  var data = {
    button: $('.check'),
    puzzles: $('.puzzle'),
    images: $('.image'),
    parent: $('.workspace'),
    scene: $('.scene'),
    button: $('.check'),
    window: $(window),
    message: $('.message'),
  };

  initPuzzleObjects(data);
  initImageObjects(data)
  buttonHandler(data);
  dragFragment(data);
  //shuffleFragments(data.images);

});
