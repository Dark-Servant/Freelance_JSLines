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

function setParam(){
  var listunit = document.getElementById('whatadded').children[selectedElement.num];
  var linewidth = listunit.querySelector('.options .simple input.linewidth');
  if (linewidth != undefined) {
    linewidth.value = selectedElement.sel.obj.strokeWidth;
  }
  if (selectedElement.sel.type == 3) {
    listunit.querySelector('.options .simple input.textvalue').value = selectedElement.sel.obj.content;
    listunit.querySelector('.options .simple input.textsize').value = selectedElement.sel.obj.fontSize.replace(/\D+$/, '');
  } else if (selectedElement.sel.type == 4) {
    var wh = listunit.querySelector('.options .simple input.width');
    if (wh != undefined) {
      wh.value = Math.round(selectedElement.sel.obj.bounds.width / gridSize);
    }
    wh = listunit.querySelector('.options .simple input.height');
    if (wh != undefined) {
      wh.value = Math.round(selectedElement.sel.obj.bounds.height / gridSize);
    }
  }
  if (selectedElement.sel.type > 3) {
    if (selectedElement.sel.special == undefined) {
      selectedElement.sel.special = null;
    }
    var special = listunit.querySelectorAll('.options .special input[type=text]');
    if (selectedElement.sel.special == null) {
      listunit.querySelector('.options .special input[type=checkbox]').removeAttribute('checked');
      for (var i = 0; i < special.length; ++i) {
        special[i].setAttribute('disabled', 'disabled');
        special[i].value = '0';
      }
    } else {
      listunit.querySelector('.options .special input[type=checkbox]').setAttribute('checked', 'checked');
      for (var i = 0; i < special.length; ++i) {
        special[i].removeAttribute('disabled');
        if (typeof(selectedElement.sel.special[i]) != 'undefined') {
          special[i].value = selectedElement.sel.special[i].toString();
        } else {
          special[i].value = '0';
        }
      }
    }
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
    setParam();
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

function showSpecial() {
  if (selectedElement == null) {
    return false;
  }
  var listunit = document.getElementById('whatadded').children[selectedElement.num];
  var special = listunit.querySelectorAll('.options .special input[type=text]');
  if (listunit.querySelector('.options .special input[type=checkbox]').checked) {
    for (var i = 0; i < special.length; ++i) {
      special[i].removeAttribute('disabled');
    }
  } else {
    for (var i = 0; i < special.length; ++i) {
      special[i].setAttribute('disabled', 'disabled');
    }
  }
}

function editElement(){
  if (selectedElement == null) {
    return false;
  }
  var listunit = document.getElementById('whatadded').children[selectedElement.num];
  var linewidth = listunit.querySelector('.options .simple input.linewidth');
  if (linewidth != undefined) {
    linewidth = linewidth.value.replace(/^\s+/, '').replace(/\s+$/, '');
    if (/^\d+$/.test(linewidth) && (linewidth > '0')) {
      selectedElement.sel.obj.strokeWidth = parseInt(linewidth);
    } else {
      return false;
    }
  }
  if (selectedElement.sel.type == 3) {
    selectedElement.sel.obj.content = 
      listunit.querySelector('.options .simple input.textvalue').value.toString().replace(/^\s+/, '').replace(/\s+$/, '');
    var textsize = listunit.querySelector('.options .simple input.textsize').value.toString().replace(/^\s+/, '').replace(/\s+$/, '');
    if (/^\d+$/.test(textsize) && (textsize > '0')) {
      selectedElement.sel.obj.fontSize = textsize + 'px';
    } else {
      return false;
    }
  } else if (selectedElement.sel.type == 4) {
    var wh = listunit.querySelector('.options .simple input.width');
    if (wh != undefined) {
      wh = wh.value.toString().replace(/^\s+/, '').replace(/\s+$/, '');
      if (/^\d+$/.test(wh) && (wh > '0')) {
        selectedElement.sel.obj.bounds.width = parseInt(wh) * gridSize;
      } else {
        return false;
      }
    }
    wh = listunit.querySelector('.options .simple input.height');
    if (wh != undefined) {
      wh = wh.value.toString().replace(/^\s+/, '').replace(/\s+$/, '');
      if (/^\d+$/.test(wh) && (wh > '0')) {
        selectedElement.sel.obj.bounds.height = parseInt(wh) * gridSize;
      } else {
        return false;
      }
    }
  }
  if (selectedElement.sel.type > 3) {
    var special = listunit.querySelectorAll('.options .special input[type=text]');
    if (listunit.querySelector('.options .special input[type=checkbox]').checked) {
      specialarr = [];
      for (var i = 0; i < special.length; ++i) {
        var sval = special[i].value.toString().replace(/^\s+/, '').replace(/\s+$/, '');
        if (/^\d+$/.test(sval)) {
          specialarr.push(sval);
        } else {
          return false;
        }
      }
      selectedElement.sel.special = specialarr;
    } else {
      selectedElement.sel.special = null;
    }
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
      obj.strokeWidth = elements[i].obj.strokeWidth;
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
      obj.strokeWidth = elements[i].obj.strokeWidth;
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
      obj.strokeWidth = elements[i].obj.strokeWidth;
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
      obj.strokeWidth = elements[i].obj.strokeWidth;
      elements[i].obj.remove();
      elements[i].obj = obj;
    }
  }
}

var areaSize = {};

function createGrid(newGridSize) {
  document.getElementById('myCanvas').setAttribute('width', areaSize.width);
  document.getElementById('myCanvas').setAttribute('height', areaSize.height);
  paper.view.viewSize = new paper.Size(areaSize.width, areaSize.height);
  var maxSize = (areaSize.height > areaSize.width) ? areaSize.height : areaSize.width;
  if (gridLayer == null) {
    gridLayer = new paper.Layer();
  } else {
    gridLayer.clear();
    paper.project._activeLayer = gridLayer;
  }
  for (var i = newGridSize; i < maxSize; i += newGridSize) {
    if (i < areaSize.height) {
      var p = new paper.Path();
      p.add(new paper.Point(0, i), new paper.Point(areaSize.width, i));
      p.strokeColor = 'lightgray';
      p.strokeWidth = 0.5;
      p.dashArray = [2, 3];
    }
    if (i < areaSize.width) {
      var p = new paper.Path();
      p.add(new paper.Point(i, 0), new paper.Point(i, areaSize.height));
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
  areaSize = {width: 1200, height: 800};
  createGrid(gridSize);
  paper.view.draw();
}

function changeGrid(value) {
  var newGridSize = gridSize + value;
  if ((newGridSize < 10) || (newGridSize > 50)) {
    return;
  }
  areaSize = {width: 1200, height: 800};
  if (elements.length > 0) {
    for (var i = 0; i < elements.length; ++i) {
      var wh = Math.round((elements[i].obj.bounds.x + elements[i].obj.bounds.width) * newGridSize / gridSize);
      if (wh > areaSize.width) {
        areaSize.width = wh;
      }
      wh = Math.round((elements[i].obj.bounds.y + elements[i].obj.bounds.height) * newGridSize / gridSize);
      if (wh > areaSize.height) {
        areaSize.height = wh;
      }
    }
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
  xmlhttp.send("savedata=true&" + "&data=" + encodeURIComponent(JSON.stringify({gridSize: gridSize, areaSize: areaSize, data: data})));
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
    console.log('were changes');
    var formData = new FormData();
    formData.append("thefile", loader.files[0]);
    formData.append("loaddata", 'true');
    var xhr = getXmlHttp();
    xhr.open('POST', '/', true);
    xhr.send(formData);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        if(xhr.status == 200) {
          console.log('answer exists!');
          try{
            var olddata = JSON.parse(xhr.responseText.replace(/^\s+/, '').replace(/\s+$/, ''));
          } catch (e) {
            console.log('error in data of loaded file');
            return;
          }
          areaSize = olddata['areaSize'];
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