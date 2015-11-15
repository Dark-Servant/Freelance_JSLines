var beautyPoint = null;

function setBeautyPoint(point){
  if (beautyPoint != null) {
    beautyPoint.remove();
  }
  if (whatnowcreating > 0) {
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
    showNewElement();
  }
}

function findElement(point){
  unselectElement();
  for (var i = elements.length - 1; i > -1; --i) {
    if ((elements[i]['obj'].bounds._x <= point.x) && (elements[i]['obj'].bounds._x + elements[i]['obj'].bounds._width >= point.x)) {
      if ((elements[i]['obj'].bounds._y <= point.y) && (elements[i]['obj'].bounds._y + elements[i]['obj'].bounds._height >= point.y)) {
        selectElement(i);
        selectedElement['pos'] = point;
        return true;
      }
    }
  }
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
    findElement(nearp);
    return;
  }
  unselectElement();
  if (whatnowcreating < 2) {
    if (currentElement == null) {
      currentElement = {
        obj: new Path(),
        pcount: 0
      };
      currentElement['obj'].strokeColor = 'black';
    }
    ++currentElement['pcount'];
    currentElement['obj'].add(nearp);
  } else if (whatnowcreating < 3) {
    if (currentElement == null) {
      currentElement = {
        obj: null,
        throughvector: null//,
      };
    }
  } else if (whatnowcreating == 4) {
      currentElement = {
        obj: new Path.Circle(nearp, gridSize),
      };
      currentElement['obj'].strokeColor = 'black';
  }
}

function onMouseDrag(event) {
  var nearp = nearPoint(event.point);
  if (event.event.button > 0) {
    return;
  } else if (whatnowcreating < 1) {
    if (selectedElement != null) {
      selectedElement['sel']['obj'].position += nearp - selectedElement['pos'];
      selectedElement['pos'] = nearp;
    }
    return;
  }
  setBeautyPoint(event.point);
  if (whatnowcreating < 2) {
    if (currentElement['obj']._segments.length > currentElement['pcount']) {
      currentElement['obj'].removeSegment(currentElement['pcount']);
    }
    currentElement['obj'].add(nearp);
  } else if (whatnowcreating < 3) {
    if (currentElement['throughvector'] == null) {
      if (currentElement['obj'] != null) {
        currentElement['obj'].remove();
      }
      var fpoint = nearPoint(event.downPoint);
      currentElement['obj'] = new Path.Arc(fpoint, fpoint + (nearp - fpoint) * 0.5, nearp);
    } else {
      var fpoint = currentElement['obj'].segments[0].point;
      var lpoint = currentElement['obj'].segments[currentElement['obj'].segments.length - 1].point;
      var center = fpoint + (lpoint - fpoint) * 0.5;
      if (currentElement['obj'] != undefined) {
        currentElement['obj'].remove();
      }
      currentElement['obj'] = new Path();
      var through = null;
      if (Math.round(lpoint.x - fpoint.x) < gridSize) {
        through = new Point(event.point.x, center.y);
      } else if (Math.round(lpoint.y - fpoint.y) < gridSize) {
        through = new Point(center.x, event.point.y);
      } else {
        var paramA = (lpoint.y - fpoint.y) / (lpoint.x - fpoint.x);
        var x = paramA * (paramA * event.point.x - event.point.y + center.x / paramA  + center.y) / (1 + paramA * paramA);
        var y = - (x - center.x) * 1 / paramA  + center.y;
        through = new Point(x, y);
      }
      currentElement['obj'] = new Path.Arc(fpoint, through, lpoint);
      through -= fpoint;
      currentElement['throughvector'] = {x: through.x, y: through.y};
    }
    currentElement['obj'].strokeColor = 'black';
  } else if (whatnowcreating == 4) {
    var newwidth = nearp.x - currentElement['obj'].bounds._x;
    var newheight = nearp.y - currentElement['obj'].bounds._y;
    if (newwidth >= gridSize) {
      currentElement['obj'].bounds.width = 2 * newwidth;
    } else {
      currentElement['obj'].bounds.width = 2 * gridSize;
    }
    if (newheight >= gridSize) {
      currentElement['obj'].bounds.height = 2 * newheight;
    } else {
      currentElement['obj'].bounds.height = 2 * gridSize;
    }
  }
}

function onMouseUp(event) {
  if ((event.event.button > 0) || (whatnowcreating < 1)) {
    return;
  }
  if (whatnowcreating == 1) {
    var p = nearPoint(event.point);
    var slen = currentElement['obj']._segments.length;
    if (slen > 1) {
      if ((currentElement['obj']._segments[slen - 2].point._x == p.x) && (currentElement['obj']._segments[slen - 2].point._y == p.y)) {
        currentElement['obj'].removeSegment(slen - 1);
        --currentElement['pcount'];
      } else if ((currentElement['obj']._segments[0].point._x == p.x) && (currentElement['obj']._segments[0].point._y == p.y)) {
        whatnowcreating = 5;
        finishElement();
      }
    }
  } else if (whatnowcreating == 2) {
    if (currentElement['throughvector'] != null) {
      finishElement();
    } else {
      var through = (currentElement['obj'].segments[currentElement['obj'].segments.length - 1].point - currentElement['obj'].segments[0].point) * 0.5;
      currentElement['throughvector'] = {x: through.x, y: through.y};
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
}