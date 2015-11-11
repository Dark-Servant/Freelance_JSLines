var currentElement = null;
var selectedElement = null;

function nearPoint(mypoint) {
  var point = new Point(Math.floor(mypoint.x / gridSize) * gridSize, Math.floor(mypoint.y / gridSize) * gridSize);
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

function finishElement() {
  if (currentElement == null) {
    return;
  }
  if (whatnowcreating > 0) {
    elements.push(currentElement);
    showNewElement(elements.length - 1);
  }
  currentElement = null;
}

function selectElement(point){
  if (selectedElement != null) {
    selectedElement['sel']['obj'].selected = false;
    selectedElement = null;
  }
  for (var i = elements.length - 1; i > -1; --i) {
    if ((elements[i]['obj'].bounds._x < point.x) && (elements[i]['obj'].bounds._x + elements[i]['obj'].bounds._width > point.x)) {
      if ((elements[i]['obj'].bounds._y < point.y) && (elements[i]['obj'].bounds._y + elements[i]['obj'].bounds._height > point.y)) {
        selectedElement = {
          sel: elements[i],
          pos: point
        };
        selectedElement['sel']['obj'].selected = true;
        return true;
      }
    }
  }
  return false;
}

function onMouseDown(event) {
  if (event.event.button > 0) {
    if ((event.event.button == 2) && (whatnowcreating == 1)) {
      finishElement();
    }
    return;
  } else if (whatnowcreating < 1) {
    selectElement(nearPoint(event.point));
    return;
  }
  if (whatnowcreating < 3) {
    if (currentElement == null) {
      currentElement = {
        obj: new Path(),
        pcount: 0   
      };
      currentElement['obj'].strokeColor = 'black';
    }
    ++currentElement['pcount'];
    if ((whatnowcreating == 1) || (currentElement['pcount'] < 2)) {
      currentElement['obj'].add(nearPoint(event.point));
    } else {
      currentElement['obj'].insert(1, nearPoint(event.point));
      currentElement['obj'].smooth();
    }
  } else if (whatnowcreating == 4) {
      currentElement = {obj: new Path.Circle(nearPoint(event.point), gridSize)};
      // var p = nearPoint(event.point);
      // currentElement = {obj: new Path()};
      currentElement['obj'].strokeColor = 'black';
      // currentElement['obj'].add(p - [gridSize, 0], p - [0, gridSize], p + [gridSize, 0], p + [0, gridSize]);
      // currentElement['obj'].closed = true;
      // currentElement['obj'].smooth();
  }
}

function onMouseDrag(event) {
  if (event.event.button > 0) {
    return;
  } else if (whatnowcreating < 1) {
    if (selectedElement != null) {
      var nxtpos = nearPoint(event.point);
      selectedElement['sel']['obj'].position += nxtpos - selectedElement['pos'];
      selectedElement['pos'] = nxtpos;
    }
    return;
  }
  if (whatnowcreating < 3) {
    if (currentElement['obj']._segments.length > currentElement['pcount']) {
      if (whatnowcreating == 1) {
        currentElement['obj'].removeSegment(currentElement['pcount']);
      } else {
        currentElement['obj'].removeSegment(1);
      }
    }
    if (whatnowcreating == 1) {
      currentElement['obj'].add(nearPoint(event.point));
    } else {
      currentElement['obj'].insert(1, nearPoint(event.point));
      currentElement['obj'].smooth();
    }
  } else if (whatnowcreating == 4) {
    // var c = currentElement['obj'].bounds.center;
    var r = Math.round((currentElement['obj'].bounds.center - event.point).length / gridSize);
    if (r > 0) {
      var oldr = Math.round((currentElement['obj'].bounds.center - currentElement['obj']._segments[0].point).length / gridSize);
      currentElement['obj'].scale(r / oldr);
    }
    // var newx = Math.round((event.point.x - c._x) / gridSize);
    // var newy = Math.round((event.point.y - c._y) / gridSize);
    // if (newx > 0) {
    //   currentElement['obj'].removeSegment(2);
    //   currentElement['obj'].insert(2, new Point(c._x + newx * gridSize, c._y));
    // }
    // if (newy > 0) {
    //   currentElement['obj'].removeSegment(2);
    //   currentElement['obj'].insert(2, new Point(c._x, c._y + newy * gridSize));
    // }
    // console.log(c);
  }
}

function onMouseUp(event) {
  if ((whatnowcreating < 1) || (event.event.button > 0)) {
    return;
  }
  if (whatnowcreating == 1) {
    var p = nearPoint(event.point);
    var slen = currentElement['obj']._segments.length;
    if ((currentElement['obj']._segments[slen - 2].point._x == p.x) && (currentElement['obj']._segments[slen - 2].point._y == p.y)) {
      currentElement['obj'].removeSegment(slen - 1);
      --currentElement['pcount'];
    } else if ((currentElement['pcount'] > 1) && ((currentElement['obj']._segments[currentElement['pcount'] - 2].point._x == p.x) && (currentElement['obj']._segments[currentElement['pcount'] - 2].point._y == p.y))) {
      currentElement['obj'].removeSegment(slen - 1);
      --currentElement['pcount'];
    } else if ((currentElement['obj']._segments[0].point._x == p.x) && (currentElement['obj']._segments[0].point._y == p.y)) {
      whatnowcreating = 5;
      finishElement();
    }
  } else if (whatnowcreating == 2) {
    if (currentElement['pcount'] > 1) {
      finishElement();
    }
  } else if (whatnowcreating == 3) {
    currentElement = {obj: new PointText(event.point)};
    currentElement['obj'].fillColor = 'black';
    currentElement['obj'].font = 'arial';
    currentElement['obj'].fontSize = '12px';
    currentElement['obj'].content = 'Some sysysya text';
    finishElement();
  } else if (whatnowcreating == 4) {
    finishElement();
  }
  // if (currentElement['obj']._segments.length > 1) {
  //   if (currentElement['pcount'] > 1) {
  //     if ((currentElement['obj']._segments[currentElement['pcount'] - 2].point._x == p.x) && (currentElement['obj']._segments[currentElement['pcount'] - 2].point._y == p.y)) {
  //       currentElement['obj'].removeSegment(currentElement['obj']._segments.length - 1);
  //     }
  //   }
  // }
}