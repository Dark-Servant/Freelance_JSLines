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

var beautyPoint = null;

function setBeautyPoint(point){
  if (whatnowcreating > 0) {
    if (beautyPoint != null) {
      beautyPoint.remove();
    }
    if (point != null) {
      beautyPoint = new Path.Circle(nearPoint(point), 2);
      beautyPoint.strokeColor = 'yellow';
      beautyPoint.fillColor = 'yellow';
    } else {
      beautyPoint = null;
    }
  }
}

function onMouseMove(event) {
  setBeautyPoint(event.point);
}

function finishElement() {
  if (currentElement == null) {
    return;
  }
  setBeautyPoint(null);
  if (whatnowcreating > 0) {
    currentElement['type'] = whatnowcreating;
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
          pos: point//,
          // moving: false
        };
        selectedElement['sel']['obj'].selected = true;
        showRotate(true);
        return true;
      }
    }
  }
  showRotate(false);
  return false;
}

function onMouseDown(event) {
  var nearp = nearPoint(event.point);
  if (event.event.button > 0) {
    if ((event.event.button == 2) && (whatnowcreating == 1)) {
      finishElement();
    }
    return;
  } else if (whatnowcreating < 1) {
    // selectElement((rotateSelected) ? event.point : nearp);
    selectElement(nearp);
    return;
  }
  if (whatnowcreating < 3) {
    if (currentElement == null) {
      currentElement = {
        obj: new Path(),
        pcount: 0//,
        // points: []
      };
      currentElement['obj'].strokeColor = 'black';
    }
    ++currentElement['pcount'];
    if ((whatnowcreating == 1) || (currentElement['pcount'] < 2)) {
      // currentElement['points'].push([Math.round(nearp.x / gridSize), Math.round(nearp.y / gridSize)]);
      currentElement['obj'].add(nearp);
    } else {
      // currentElement['points'].splice(1, 0,[Math.round(nearp.x / gridSize), Math.round(nearp.y / gridSize)]);
      currentElement['obj'].insert(1, nearp);
      currentElement['obj'].smooth();
    }
  } else if (whatnowcreating == 4) {
      currentElement = {
        obj: new Path.Ellipse(nearp, gridSize, gridSize),
        // points: [[Math.round(nearp.x / gridSize), Math.round(nearp.y / gridSize)]],
        // radius: 1
      };
      // var p = nearp;
      // currentElement = {obj: new Path()};
      currentElement['obj'].strokeColor = 'black';
      // currentElement['obj'].add(p - [gridSize, 0], p - [0, gridSize], p + [gridSize, 0], p + [0, gridSize]);
      // currentElement['obj'].closed = true;
      // currentElement['obj'].smooth();
  }
}

function onMouseDrag(event) {
  var nearp = nearPoint(event.point);
  if (event.event.button > 0) {
    return;
  } else if (whatnowcreating < 1) {
    if (selectedElement != null) {
      if (rotateSelected) {
        selectedElement['sel']['obj'].rotate(
          (nearp - selectedElement['sel']['obj'].position).angle - 
          (selectedElement['pos'] - selectedElement['sel']['obj'].position).angle
        );
        selectedElement['pos'] = nearp;
      } else {
        selectedElement['sel']['obj'].position += nearp - selectedElement['pos'];
        selectedElement['pos'] = nearp;
        // selectedElement['moving'] = true;
      }
    }
    return;
  }
  setBeautyPoint(event.point);
  if (whatnowcreating < 3) {
    if (currentElement['obj']._segments.length > currentElement['pcount']) {
      if (whatnowcreating == 1) {
        currentElement['obj'].removeSegment(currentElement['pcount']);
        // currentElement['points'].splice(currentElement['pcount'], 1);
      } else {
        currentElement['obj'].removeSegment(1);
        // currentElement['points'].splice(1, 1);
      }
    }
    if (whatnowcreating == 1) {
      // currentElement['points'].push([Math.round(nearp.x / gridSize), Math.round(nearp.y / gridSize)]);
      currentElement['obj'].add(nearp);
    } else {
      // currentElement['points'].splice(1, 0,[Math.round(nearp.x / gridSize), Math.round(nearp.y / gridSize)]);
      currentElement['obj'].insert(1, nearp);
      currentElement['obj'].smooth();
    }
  } else if (whatnowcreating == 4) {
    var c = currentElement['obj'].bounds.center;
    // var r = Math.round((currentElement['obj'].bounds.center - event.point).length / gridSize);
    // if (r > 0) {
    //   var oldr = Math.round((currentElement['obj'].bounds.center - currentElement['obj']._segments[0].point).length / gridSize);
    //   currentElement['obj'].scale(r / oldr);
    //   currentElement['radius'] = r;
    // }

  }
}

function onMouseUp(event) {
  if (event.event.button > 0) {
    return;
  } else if (whatnowcreating < 1) {
    // if ((selectedElement != null) && selectedElement['moving']) {
    //   selectedElement['sel']['points'] = [];
    //   for (var i = 0; i < selectedElement['sel']['obj']._segments.length; ++i) {
    //     selectedElement['sel']['points'].push([
    //       Math.round(selectedElement['sel']['obj']._segments[i]._point._x / gridSize),
    //       Math.round(selectedElement['sel']['obj']._segments[i]._point._y / gridSize)
    //     ]);
    //   }
    // }
    return;
  }
  if (whatnowcreating == 1) {
    var p = nearPoint(event.point);
    var slen = currentElement['obj']._segments.length;
    if (slen > 1) {
      if ((currentElement['obj']._segments[slen - 2].point._x == p.x) && (currentElement['obj']._segments[slen - 2].point._y == p.y)) {
        currentElement['obj'].removeSegment(slen - 1);
        // currentElement['points'].splice(slen - 1, 1);
        --currentElement['pcount'];
      // } else if ((currentElement['pcount'] > 1) && ((currentElement['obj']._segments[currentElement['pcount'] - 2].point._x == p.x) && (currentElement['obj']._segments[currentElement['pcount'] - 2].point._y == p.y))) {
      //   currentElement['obj'].removeSegment(slen - 1);
      //   // currentElement['points'].splice(slen - 1, 1);
      //   --currentElement['pcount'];
      // // } else if () {
      } else if ((currentElement['obj']._segments[0].point._x == p.x) && (currentElement['obj']._segments[0].point._y == p.y)) {
        whatnowcreating = 5;
        finishElement();
      }
    }
  } else if (whatnowcreating == 2) {
    if (currentElement['pcount'] > 1) {
      finishElement();
    }
  } else if (whatnowcreating == 3) {
    var nearp = nearPoint(event.point);
    currentElement = {
      obj: new PointText(nearp),
      position: [Math.round(nearp.x / gridSize), Math.round(nearp.y / gridSize)]
    };
    currentElement['obj'].fillColor = 'black';
    currentElement['obj'].font = 'arial';
    currentElement['obj'].fontSize = '12px';
    currentElement['obj'].content = 'Some text';
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