var gridSize = 20;
var whatnowcreating = 0;
var elements = [];
var elcounts = {
  line: 0,
  arc: 0,
  polygon: 0,
  text: 0,
  circle: 0
};

document.oncontextmenu = function(event){
  return false;
}

function startCreate(what){
  whatnowcreating = what;
}

function showNewElement(elementpos){
  var elpointer = null;
  var elname = null;
  if (whatnowcreating == 1) {
    elpointer = 'line';
    elname = 'Линия';
  } else if (whatnowcreating == 2) {
    elpointer = 'arc';
    elname = 'Дуга';
  } else if (whatnowcreating == 3) {
    elpointer = 'text';
    elname = 'Текст';
  } else if (whatnowcreating == 4) {
    elpointer = 'circle';
    elname = 'Окружность';
  } else if (whatnowcreating == 5) {
    elpointer = 'polygon';
    elname = 'Многоугольник';
  }
  ++elcounts[elpointer];
  var whatadded = document.getElementById('whatadded');
  whatadded.innerHTML += document.getElementById('objlib').getElementsByClassName(elpointer)[0].outerHTML;
  var newdata = whatadded.getElementsByClassName('obj')[elements.length - 1];
  var elttl = newdata.getElementsByTagName('span')[0];
  elttl.innerHTML = elname + ' ' + elcounts[elpointer];
  elttl.setAttribute('onclick', 'editElement(this, ' + elementpos + ')');
  newdata.getElementsByTagName('a')[0].setAttribute('onclick', 'delElement(this, ' + elementpos + ')');
  whatnowcreating = 0;
}

function editElement(obj, elementpos){
  elements[elementpos]['obj'].selected = true;
  paper.view.draw();
  // obj.parentNode.style['background-color'] = 'lightgray';
}

function delElement(elementpos){
  elements[elementpos]['wasdeleted'] = true;
  elements[elementpos]['obj'].remove();
  paper.view.draw();
}

var gridLayer = null;
var drawLayer = null;

function createGrid() {
  var maxSize = (paper.view._viewSize._height > paper.view._viewSize._width) ? paper.view._viewSize._height : paper.view._viewSize._width;
  gridLayer = new paper.Layer();
  for (var i = 20; i < maxSize; i += gridSize) {
    if (i < paper.view._viewSize._height) {
      var p = new paper.Path;
      p.add(new paper.Point(0, i), new paper.Point(paper.view._viewSize._width, i));
      p.strokeColor = 'lightgray';
      p.strokeWidth = 0.5;
      p.dashArray = [2, 3];
    }
    if (i < paper.view._viewSize._width) {
      var p = new paper.Path;
      p.add(new paper.Point(i, 0), new paper.Point(i, paper.view._viewSize._height));
      p.strokeColor = 'lightgray';
      p.strokeWidth = 0.5;
      p.dashArray = [2, 3];
    }
  }
  drawLayer = new paper.Layer();
  paper.view.draw();
}

function initcanvas() {
  paper.setup(document.getElementById('myCanvas'));
  createGrid();
}

function changeGrid(value) {
  var newGridSize = gridSize + value;
  if ((newGridSize < 10) || (newGridSize > 50)) {
    return;
  }
  gridSize = newGridSize;
  gridLayer.remove();
  createGrid();
}