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
  currentElement = null;
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
    // if ((whatnowcreating == 1) || (currentElement['pcount'] < 2)) {
    //   // currentElement['points'].push([Math.round(nearp.x / gridSize), Math.round(nearp.y / gridSize)]);
    currentElement['obj'].add(nearp);
    // } else {
    //   // currentElement['points'].splice(1, 0,[Math.round(nearp.x / gridSize), Math.round(nearp.y / gridSize)]);
    //   currentElement['obj'].insert(1, nearp);
    //   currentElement['obj'].smooth();
    // }
  } else if (whatnowcreating < 3) {
    if (currentElement == null) {
      currentElement = {
        obj: null,
        throughvector: null//,
        // usecenter: false
      };
      // currentElement['obj'].strokeColor = 'black';
    }
    // ++currentElement['pcount'];
  } else if (whatnowcreating == 4) {
      currentElement = {
        obj: new Path.Circle(nearp, gridSize),
        // obj: new Path.Ellipse(nearp - [gridSize, gridSize], gridSize * 2, gridSize * 2),
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
      selectedElement['sel']['obj'].position += nearp - selectedElement['pos'];
      selectedElement['pos'] = nearp;
    }
    return;
  }
  setBeautyPoint(event.point);
  if (whatnowcreating < 2) {
    if (currentElement['obj']._segments.length > currentElement['pcount']) {
      // if (whatnowcreating == 1) {
      currentElement['obj'].removeSegment(currentElement['pcount']);
        // currentElement['points'].splice(currentElement['pcount'], 1);
      // } else {
      //   currentElement['obj'].removeSegment(1);
      //   // currentElement['points'].splice(1, 1);
      // }
    }
    // if (whatnowcreating == 1) {
      // currentElement['points'].push([Math.round(nearp.x / gridSize), Math.round(nearp.y / gridSize)]);
    currentElement['obj'].add(nearp);
    // } else {
    //   // currentElement['points'].splice(1, 0,[Math.round(nearp.x / gridSize), Math.round(nearp.y / gridSize)]);
    //   currentElement['obj'].insert(1, nearp);
    //   currentElement['obj'].smooth();
    // }
  } else if (whatnowcreating < 3) {
    if (currentElement['throughvector'] == null) {
      if (currentElement['obj'] != null) {
        currentElement['obj'].remove();
      }
      var fpoint = nearPoint(event.downPoint);
      // currentElement['points'] = [fpoint, fpoint + (nearp - fpoint) * 0.5, nearp];
      currentElement['obj'] = new Path.Arc(fpoint, fpoint + (nearp - fpoint) * 0.5, nearp);
    } else {
      // console.log(currentElement['obj']);
      var fpoint = currentElement['obj'].segments[0].point;
      // console.log('fpoint: ' + fpoint);
      var lpoint = currentElement['obj'].segments[currentElement['obj'].segments.length - 1].point;
      var center = fpoint + (lpoint - fpoint) * 0.5;
      // console.log('lpoint: ' + lpoint);
      if (currentElement['obj'] != undefined) {
        currentElement['obj'].remove();
      }
      currentElement['obj'] = new Path();
      var through = null;
      if (Math.round(lpoint.x - fpoint.x) < gridSize) {
        // currentElement['obj'].add(center, new Point(event.point.x, center.y));
        through = new Point(event.point.x, center.y);
        // currentElement['obj'] = new Path.Arc(fpoint, new Point(event.point.x, center.y), lpoint);
      } else if (Math.round(lpoint.y - fpoint.y) < gridSize) {
        // currentElement['obj'].add(center, new Point(center.x, event.point.y));
        through = new Point(center.x, event.point.y);
        // currentElement['obj'] = new Path.Arc(fpoint, new Point(center.x, event.point.y), lpoint);
      } else {
        var paramA = (lpoint.y - fpoint.y) / (lpoint.x - fpoint.x);
        // console.log('paramA: ' + paramA);
        // var paramB = fpoint.y - fpoint.x * (lpoint.y - fpoint.y) / (lpoint.x - fpoint.x);
        // console.log('paramB: ' + paramB);
        // console.log('center: ' + center);
        // y = - (x - center.x) * 1 / paramA  + center.y;
        // y = (x - event.point.x) * paramA + event.point.y;

        // - (x - center.x) * 1 / paramA  + center.y = (x - event.point.x) * paramA + event.point.y;
        // - x / paramA + center.x / paramA  + center.y = paramA * x - paramA * event.point.x + event.point.y;
        // - x / paramA - paramA * x = - paramA * event.point.x + event.point.y - center.x / paramA  - center.y;
        // - x ( 1 / paramA + paramA ) = - paramA * event.point.x + event.point.y - center.x / paramA  - center.y;
        // x ( 1 / paramA + paramA ) = paramA * event.point.x - event.point.y + center.x / paramA  + center.y;
        // x = (paramA * event.point.x - event.point.y + center.x / paramA  + center.y) / ( 1 / paramA + paramA );
        // x = (paramA * event.point.x - event.point.y + center.x / paramA  + center.y) / ( (1 + paramA * paramA) / paramA );
        var x = paramA * (paramA * event.point.x - event.point.y + center.x / paramA  + center.y) / (1 + paramA * paramA);
        var y = - (x - center.x) * 1 / paramA  + center.y;
        through = new Point(x, y);
        // var ln = new Path();
        // ln.strokeColor = 'black';
        // ln.add(center, new Point(x, y));
        // currentElement['obj'].add(center, new Point(x, y));
        // // x = (center.x / paramA  + center.y + event.point.x * paramA - event.point.y) * paramA / ( 1  + paramA * paramA)
      }
      currentElement['obj'] = new Path.Arc(fpoint, through, lpoint);
      currentElement['throughvector'] = through - fpoint;
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
    if (currentElement['throughvector'] != null) {
      finishElement();
    } else {
      currentElement['throughvector'] = (currentElement['obj'].segments[currentElement['obj'].segments.length - 1].point - currentElement['obj'].segments[0].point) * 0.5;
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