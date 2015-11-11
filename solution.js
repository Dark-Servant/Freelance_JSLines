var gridSize = 20;
var maxSize = (view._viewSize._height > view._viewSize._width) ? view._viewSize._height : view._viewSize._width;

for (var i = 20; i < maxSize; i += gridSize) {
  if (i < view._viewSize._height) {
    var p = new Path();
    p.add(new Point(0, i), new Point(view._viewSize._width, i));
    p.strokeColor = 'lightgray';
    p.strokeWidth = 0.5;
    p.dashArray = [2, 3];
  }
  if (i < view._viewSize._width) {
    var p = new Path();
    p.add(new Point(i, 0), new Point(i, view._viewSize._height));
    p.strokeColor = 'lightgray';
    p.strokeWidth = 0.5;
    p.dashArray = [2, 3];
  }
}

var drawLayer = new Layer();

var elements = [];
var currObj = null;
var pointcount = 0;

var selElement = null;
var selPoint = null;

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
  if (currObj == null) {
    return;
  }
  if (whatnowcreating > 0) {
    // currObj.selected = true;
    // currObj.onMouseDown = function(event){
    //   // this.selected = true;
    //   // console.log(this);
    //   console.log('pip');
    // };
    elements.push(currObj);
    showNewElement();
  }
  currObj = null;
  pointcount = 0;
}

function selectElement(point){
  if (selElement != null) {
    selElement.selected = false;
    selElement = null;
    selPoint = null;
  }
  for (var i = elements.length - 1; i > -1; --i) {
    if ((elements[i].bounds._x < point.x) && (elements[i].bounds._x + elements[i].bounds._width > point.x)) {
      if ((elements[i].bounds._y < point.y) && (elements[i].bounds._y + elements[i].bounds._height > point.y)) {
        selElement = elements[i];
        selElement.selected = true;
        selPoint = point;
        return true;
      }
    }
  }
  return false;
}

function onMouseDown(event) {
  if (whatnowcreating < 1) {
    selectElement(event.point);
    return;
  }
  if (event.event.button > 0) {
    if (event.event.button == 2) {
      finishElement();
    }
    return;
  }
  if (whatnowcreating < 3) {
    if (currObj == null) {
      currObj = new Path();
      currObj.strokeColor = 'black';
    }
    ++pointcount;
    if ((whatnowcreating == 1) || (pointcount < 2)) {
      currObj.add(nearPoint(event.point));
    } else if (whatnowcreating == 2) {
      currObj.insert(1, nearPoint(event.point));
      currObj.smooth();
    }
  } else if (whatnowcreating == 4) {
      currObj = new Path.Circle(nearPoint(event.point), gridSize);
      currObj.strokeColor = 'black';
  }
}

function onMouseDrag(event) {
  if (event.event.button > 0) {
    return;
  } else if (whatnowcreating < 1) {
    if (selElement != null) {
      var nxtpos = nearPoint(event.point);
      selElement.position += nxtpos - selPoint;
      selPoint = nxtpos;
    }
    return;
  }
  if (whatnowcreating < 3) {
    if (currObj._segments.length > pointcount) {
      if (whatnowcreating == 1) {
        currObj.removeSegment(pointcount);
      } else if (whatnowcreating == 2) {
        currObj.removeSegment(1);
      }
    }
    if (whatnowcreating == 1) {
      currObj.add(nearPoint(event.point));
    } else if (whatnowcreating == 2) {
      currObj.insert(1, nearPoint(event.point));
      currObj.smooth();
    }
  } else if (whatnowcreating == 4) {
    var r = Math.round((currObj.bounds.center - event.point).length / gridSize);
    if (r > 0) {
      var oldr = Math.round((currObj.bounds.center - currObj._segments[0].point).length / gridSize);
      currObj.scale(r / oldr);
    }
  }
}

function onMouseUp(event) {
  if ((whatnowcreating < 1) || (event.event.button > 0)) {
    return;
  }
  if (whatnowcreating == 1) {
    var p = nearPoint(event.point);
    var slen = currObj._segments.length;
    if ((currObj._segments[slen - 2].point._x == p.x) && (currObj._segments[slen - 2].point._y == p.y)) {
      currObj.removeSegment(slen - 1);
      --pointcount;
    } else if ((pointcount > 1) && ((currObj._segments[pointcount - 2].point._x == p.x) && (currObj._segments[pointcount - 2].point._y == p.y))) {
      currObj.removeSegment(slen - 1);
      --pointcount;
    } else if ((currObj._segments[0].point._x == p.x) && (currObj._segments[0].point._y == p.y)) {
      whatnowcreating = 5;
      finishElement();
    }
  } else if (whatnowcreating == 2) {
    if (pointcount > 1) {
      finishElement();
    }
  } else if (whatnowcreating == 3) {
    currObj = new PointText(event.point);
    currObj.fillColor = 'black';
    currObj.font = 'arial';
    currObj.fontSize = '12px';
    currObj.content = 'Some sysysya text';
    finishElement();
  } else if (whatnowcreating == 4) {
    finishElement();
  }
  // if (currObj._segments.length > 1) {
  //   if (pointcount > 1) {
  //     if ((currObj._segments[pointcount - 2].point._x == p.x) && (currObj._segments[pointcount - 2].point._y == p.y)) {
  //       currObj.removeSegment(currObj._segments.length - 1);
  //     }
  //   }
  // }
}