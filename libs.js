var gridSize = 20;
var whatnowcreating = 0;
var elements = [];
var currentElement = null;
var selectedElement = null;
var rotateSelected = false;
var allcounts = {
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
  ++allcounts[elpointer];
  var whatadded = document.getElementById('whatadded');
  whatadded.innerHTML += document.getElementById('objlib').getElementsByClassName(elpointer)[0].outerHTML;
  var newdata = whatadded.getElementsByClassName('obj')[elements.length - 1];
  var elttl = newdata.getElementsByTagName('span')[0];
  elttl.innerHTML = elname + ' ' + allcounts[elpointer];
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

function showRotate(show) {
  if (show) {
    document.querySelector('.button.rotate').style['display'] = 'inline';
  } else {
    document.querySelector('.button.rotate').style['display'] = 'none';
    rotateSelected = false;
  }
}

function beginRotate(){
  rotateSelected = !rotateSelected;
}

var layers = [];

function drawElements(newGridSize){
  for (var i = 0; i < elements.length; ++i) {
    if ((elements[i].type < 3) || (elements[i].type == 5)) {
      var obj = new paper.Path();
      obj.strokeColor = 'black';
      for (var j = 0; j < elements[i].obj.segments.length; ++j) {
        obj.add(new paper.Point(
          Math.round(elements[i].obj.segments[j].point.x  * newGridSize / gridSize),
          Math.round(elements[i].obj.segments[j].point.y  * newGridSize / gridSize)
        ));
      }
      elements[i].obj.remove();
      elements[i].obj = obj;
      if (elements[i].type == 2) {
        elements[i].obj.smooth();
      }
    } else if (elements[i].type == 3) {
      var obj = new paper.PointText(new paper.Point(elements[i].position[0] * newGridSize, elements[i].position[1] * newGridSize));
      obj.fillColor = elements[i].obj.fillColor;
      obj.font = elements[i].obj.font;
      obj.fontSize = elements[i].obj.fontSize;
      obj.content = elements[i].obj.content;
      elements[i].obj.remove();
      elements[i].obj = obj;
    } else if (elements[i].type == 4) {
      var obj = new paper.Path.Circle(
        Math.round(elements[i].obj.bounds.center._x * newGridSize / gridSize), 
        Math.round(elements[i].obj.bounds.center._y * newGridSize / gridSize), 
        Math.round(elements[i].obj.bounds.width * newGridSize / (2 * gridSize))
      );
      obj.strokeColor = 'black';
      elements[i].obj.remove();
      elements[i].obj = obj;
    }
  }
  gridSize = newGridSize;
}

function createGrid(newGridSize) {
  var maxSize = (paper.view._viewSize._height > paper.view._viewSize._width) ? paper.view._viewSize._height : paper.view._viewSize._width;
  for (var i = layers.length - 1; i > -1; --i) {
    layers[i].remove();
  }
  layers.push(new paper.Layer());
  for (var i = newGridSize; i < maxSize; i += newGridSize) {
    if (i < paper.view._viewSize._height) {
      var p = new paper.Path();
      p.add(new paper.Point(0, i), new paper.Point(paper.view._viewSize._width, i));
      p.strokeColor = 'lightgray';
      p.strokeWidth = 0.5;
      p.dashArray = [2, 3];
    }
    if (i < paper.view._viewSize._width) {
      var p = new paper.Path();
      p.add(new paper.Point(i, 0), new paper.Point(i, paper.view._viewSize._height));
      p.strokeColor = 'lightgray';
      p.strokeWidth = 0.5;
      p.dashArray = [2, 3];
    }
  }
  layers.push(new paper.Layer());
  drawElements(newGridSize);
  paper.view.draw();
}

function initcanvas() {
  paper.setup(document.getElementById('myCanvas'));
  createGrid(gridSize);
  // document.getElementsByClassName('button');
}

function changeGrid(value) {
  var newGridSize = gridSize + value;
  if ((newGridSize < 10) || (newGridSize > 50)) {
    return;
  }
  createGrid(newGridSize);
}