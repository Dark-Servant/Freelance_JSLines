var gridSize = 20;
var whatnowcreating = 0;
var elements = [];
var currentElement = null;
var selectedElement = null;
var allcounts = {};

document.oncontextmenu = function(event){
  return false;
}

function startCreate(what){
  whatnowcreating = what;
}

function showNewElement(){
  currentElement['type'] = whatnowcreating;
  elements.push(currentElement);
  var elpointer = 'object' + whatnowcreating;
  allcounts[elpointer] = (allcounts[elpointer] != undefined) ? allcounts[elpointer] + 1 : 1;
  var whatadded = document.getElementById('whatadded');
  whatadded.innerHTML += document.getElementById('objlib').getElementsByClassName(elpointer)[0].outerHTML.replace(/(<span[^>]*>)([^<]*)/, "$1$2 " + allcounts[elpointer]);
  whatnowcreating = 0;
  currentElement = null;
}

function unselectElement(){
  if (selectedElement != null) {
    var menuunit = document.getElementById('whatadded').children[selectedElement.num];
    menuunit.style['border'] = '1px solid white';
    menuunit.getElementsByTagName('img')[0].style['display'] = 'none';
    var options = menuunit.getElementsByClassName('options')[0];
    if (options != undefined) {
      options.style['display'] = 'none';
    }
    selectedElement['sel']['obj'].selected = false;
    selectedElement = null;
  }
  showRotate(false);
}

function setParam(num){
  if (elements[num].type == 3) {
    document.getElementById('whatadded').children[num].querySelector('.options input').value = elements[num].obj.content;
  } else if (elements[num].type == 4) {
    var r = document.getElementById('whatadded').children[num].querySelectorAll('.options input');
    r[0].value = Math.round(elements[num].obj.bounds.width * 0.5 / gridSize);
    r[1].value = Math.round(elements[num].obj.bounds.height * 0.5 / gridSize);
  } else if (elements[num].type == 5) {
    var r = document.getElementById('whatadded').children[num].querySelectorAll('.options input');
    r[0].value = Math.round(elements[num].obj.bounds.width / gridSize);
    r[1].value = Math.round(elements[num].obj.bounds.height / gridSize);
  }
}

function selectElement(num){
  selectedElement = {
    sel: elements[num],
    num: num
  };
  var menuunit = document.getElementById('whatadded').children[num];
  menuunit.style['border'] = '1px solid lightgray';
  menuunit.getElementsByTagName('img')[0].style['display'] = 'inline-block';
  var options = menuunit.getElementsByClassName('options')[0];
  if (options != undefined) {
    options.style['display'] = 'block';
    setParam(num);
  }
  selectedElement['sel']['obj'].selected = true;
  if ((elements[num]['type'] == 2) || (elements[num]['type'] == 5)) {
    showRotate(true);
  }
}

function chooseElement(obj) {
  unselectElement();
  var elnum = 0;
  var objlist = document.getElementById('whatadded').children;
  for (; (elnum < objlist.length) && (obj.parentNode != objlist[elnum]); ++elnum);
  selectElement(elnum);
  paper.view.draw();
}

function delElement(){
  if (selectedElement == null) {
    return false;
  }
  var num = selectedElement.num;
  unselectElement();
  var menu = document.getElementById('whatadded');
  menu.removeChild(menu.children[num]);
  elements[num].obj.remove();
  elements.splice(num, 1);
  paper.view.draw();
  return true;
}

function editElement(){
  if (selectedElement == null) {
    return false;
  }
  if (selectedElement.sel.type == 3) {
    selectedElement.sel.obj.content = 
      document.getElementById('whatadded').children[selectedElement.num].querySelector('.options input').value.toString().replace(/^\s+/, '').replace(/\s+$/, '');
  } else if (selectedElement.sel.type == 4) {
    var r = document.getElementById('whatadded').children[selectedElement.num].querySelectorAll('.options input');
    var rtrue = [];
    for (var ri = 0; ri < r.length; ++ri) {
      var rval = r[ri].value.toString().replace(/^\s+/, '').replace(/\s+$/, '');
      if (!/^\d+$/.test(rval)) {
        return false;
      } else {
        rtrue.push(parseInt(rval));
      }
    }
    selectedElement.sel.obj.bounds.width = rtrue[0] * 2 * gridSize;
    selectedElement.sel.obj.bounds.height = rtrue[1] * 2 * gridSize;
  } else if (selectedElement.sel.type == 5) {
    var r = document.getElementById('whatadded').children[selectedElement.num].querySelectorAll('.options input');
    var rtrue = [];
    for (var ri = 0; ri < r.length; ++ri) {
      var rval = r[ri].value.toString().replace(/^\s+/, '').replace(/\s+$/, '');
      if (!/^\d+$/.test(rval)) {
        return false;
      } else {
        rtrue.push(parseInt(rval));
      }
    }
    selectedElement.sel.obj.bounds.width = rtrue[0] * gridSize;
    selectedElement.sel.obj.bounds.height = rtrue[1] * gridSize;
  }
  unselectElement();
  paper.view.draw();
  return true;
}

function nearPoint(mypoint) {
  var point = new paper.Point(Math.floor(mypoint.x / gridSize) * gridSize, Math.floor(mypoint.y / gridSize) * gridSize);
  var points = [point, point + [0, gridSize], point + [gridSize, 0], point + [gridSize, gridSize]];
  var len = (mypoint - point).length;
  for (var i = 0; i < points.length; ++i) {
    var leni = (points[i] - mypoint).length;
    if (leni < len) {
      len = leni;
      point = points[i];
    }
  }
  return point;
}

function showRotate(show) {
  var allrotation = document.querySelectorAll('.button.rotate');
  for (var i = 0; i < allrotation.length; ++i) {
    if (show) {
      allrotation[i].style['display'] = 'inline';
    } else {
      allrotation[i].style['display'] = 'none';
    }
  }
}

function runRotate(way){
  if (selectedElement != null) {
    if (selectedElement.sel.type == 2) {
      var fp = selectedElement.sel.obj.segments[0].point;
      var lp = selectedElement.sel.obj.segments[selectedElement.sel.obj.segments.length - 1].point;
      var center = new paper.Point(
        fp.x + (lp.x - fp.x) * 0.5,
        fp.y + (lp.y - fp.y) * 0.5
      );
      selectedElement.sel.obj.rotate(90 * way, nearPoint(center));
      selectedElement.sel.throughvector = {
        x: - way * selectedElement.sel.throughvector.y,
        y: way * selectedElement.sel.throughvector.x
      };
    } else {
      selectedElement.sel.obj.rotate(90 * way, nearPoint(selectedElement.sel.obj.bounds.center));
    }
    paper.view.draw();
  }
}

var gridLayer = null;
var elementLayer = null;

function drawElements(newGridSize){
  elementLayer.clear();
  // for (var i = 0; i < elementLayer.children.length; ++i) {
  //   var point = new paper.Point(elementLayer.children[i].position._x * newGridSize / gridSize, elementLayer.children[i].position._x * newGridSize / gridSize);
  //   if (!/^PointText/.test(elementLayer.children[i].toString())) {
  //     elementLayer.children[i].scale(newGridSize / gridSize);
  //   }
  //   elementLayer.children[i].position = point;
  // }
  for (var i = 0; i < elements.length; ++i) {
    if ((elements[i].type == 1) || (elements[i].type == 5)) {
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
    } else if (elements[i].type == 2) {
      var obj = new paper.Path.Arc(
        new paper.Point(elements[i].obj.segments[0].point.x * newGridSize / gridSize, elements[i].obj.segments[0].point.y * newGridSize / gridSize), 
        new paper.Point(
          (elements[i].obj.segments[0].point.x + elements[i].throughvector.x) * newGridSize / gridSize, 
          (elements[i].obj.segments[0].point.y + elements[i].throughvector.y) * newGridSize / gridSize
        ),
        new paper.Point(
          elements[i].obj.segments[elements[i].obj.segments.length - 1].point.x * newGridSize / gridSize, 
          elements[i].obj.segments[elements[i].obj.segments.length - 1].point.y * newGridSize / gridSize
        )
      );
      obj.strokeColor = 'black';
      elements[i].obj.remove();
      elements[i].obj = obj;
      elements[i].throughvector.x *= newGridSize / gridSize;
      elements[i].throughvector.y *= newGridSize / gridSize;
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
      // var obj = new paper.Path.Ellipse(
        new paper.Point(
          Math.round(elements[i].obj.bounds._x * newGridSize / gridSize) + newGridSize, 
          Math.round(elements[i].obj.bounds._y * newGridSize / gridSize) + newGridSize
        ),
        newGridSize
        // Math.round(elements[i].obj.bounds.width * newGridSize / gridSize),
        // Math.round(elements[i].obj.bounds.height * newGridSize / gridSize)
      );
      obj.bounds.width = Math.round(elements[i].obj.bounds.width * newGridSize / gridSize);
      obj.bounds.height = Math.round(elements[i].obj.bounds.height * newGridSize / gridSize);
      obj.strokeColor = 'black';
      elements[i].obj.remove();
      elements[i].obj = obj;
    }
  }
}

function createGrid(newGridSize) {
  var maxSize = (paper.view._viewSize._height > paper.view._viewSize._width) ? paper.view._viewSize._height : paper.view._viewSize._width;
  if (gridLayer == null) {
    gridLayer = new paper.Layer();
  } else {
    gridLayer.clear();
    paper.project._activeLayer = gridLayer;
  }
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
  if (elementLayer == null) {
    elementLayer = new paper.Layer();
  } else {
    paper.project._activeLayer = elementLayer;
  }
}

function initcanvas() {
  paper.setup(document.getElementById('myCanvas'));
  createGrid(gridSize);
  paper.view.draw();
}

function changeGrid(value) {
  var newGridSize = gridSize + value;
  if ((newGridSize < 10) || (newGridSize > 50)) {
    return;
  }
  createGrid(newGridSize);
  drawElements(newGridSize);
  paper.view.draw();
  gridSize = newGridSize;
}

function getXmlHttp() {
  var xmlhttp;
  try {
    xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
  } catch (e) {
    try {
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    } catch (E) {
      xmlhttp = false;
    }
  }
  if (!xmlhttp && (typeof(XMLHttpRequest) != 'undefined')) {
    xmlhttp = new XMLHttpRequest();
  }
  return xmlhttp;
}

var downloader = null;

function saveElements(obj){
  if (elements.length < 1) {
    return;
  }
  obj.disabled = true;
  var xmlhttp = getXmlHttp();
  xmlhttp.open('POST', '/', true);
  xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  var data = [];
  for (var i = 0; i < elements.length; ++i) {
    var edt = {
      obj: elements[i].obj.exportJSON()
    };
    for (var j in elements[i]) {
      if (j != 'obj') {
        edt[j] = elements[i][j];
      }
    }
    data.push(edt);
  }
  xmlhttp.send("savedata=true&" + "&data=" + encodeURIComponent(JSON.stringify({gridSize: gridSize, data: data})));
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4) {
      if(xmlhttp.status == 200) {
        if (downloader == null) {
          downloader = document.createElement('a');
          downloader.setAttribute('href', '#');
          downloader.onclick = function(e){
            e.preventDefault();
            var lnk = this, xhr = getXmlHttp();
            xhr.open("GET", lnk.dataset.link);
            xhr.responseType = "blob";
            xhr.overrideMimeType("octet/stream");
            xhr.onload = function() {
              if (xhr.status === 200) {
                window.location = (URL || webkitURL).createObjectURL(xhr.response);
              }
            };
            xhr.send();
          }
        }
        downloader.setAttribute('data-link', xmlhttp.responseText);
        // var file = document.createElement('a');
        // file.setAttribute('href', xmlhttp.responseText);
        // file.setAttribute('download', file.href.replace(/^[\W\w]*\//, ''));
        // file.click();
        downloader.click();
      }
    }
  };
  obj.disabled = false;
}

function loadElements(obj){
  // console.log('in function');
  var loader = document.createElement("input");
  loader.setAttribute("type", "file");
  loader.onchange = function(){
    // console.log('were changes');
    var formData = new FormData();
    formData.append("thefile", loader.files[0]);
    formData.append("loaddata", 'true');
    var xhr = getXmlHttp();
    xhr.open('POST', '/', true);
    xhr.send(formData);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        if(xhr.status == 200) {
          // console.log('answer exists!');
          try{
            var olddata = JSON.parse(xhr.responseText.replace(/^\s+/, '').replace(/\s+$/, ''));
          } catch (e) {
            console.log('error in data of loaded file');
            return;
          }
          createGrid(olddata['gridSize']);
          elementLayer.clear();
          elements = [];
          allcounts = {};
          document.getElementById('whatadded').innerHTML = '';
          for (var i = 0; i < olddata['data'].length; ++i) {
            currentElement = olddata['data'][i];
            currentElement.obj = paper.Path.importJSON(currentElement.obj);
            elementLayer.addChild(currentElement.obj);
            whatnowcreating = currentElement.type;
            showNewElement();
          }
          paper.view.draw();
          gridSize = olddata['gridSize'];
        // } else {
        //   console.log('STATUS not 200');
        }
      // } else {
      //   console.log('READY STATE not 4');
      }
    };
  };
  loader.click();
}