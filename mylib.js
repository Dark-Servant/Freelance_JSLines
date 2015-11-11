// // var mySize = new Size(20, 40);
// // // Create a Paper.js Path to draw a line into it:
// var path = new Path();
// // // Give the stroke a color
// // path.strokeColor = 'black';
// // var start = new Point(100, 100);
// // // Move to start and draw a line from there
// // path.moveTo(start);
// // // Note the plus operator on Point objects.
// // // PaperScript does that for us, and much more!
// // path.lineTo(start + [ 100, -50 ]);

// // var rect = new Path.Rectangle(10, 20, 200, 100);
// var rect = new Rectangle();
// rect.size = new Size(10, 50);
// rect.strokeColor = 'black';
// rect.center = new Point(100, 100);
// var rect = new Path.Rectangle(rect);
// // var rect = new Path.Rectangle(90, 2, 200, 100);
// // rect.strokeColor = 'black';
// // var point = new Point(10, 20);
// // point.strokeColor = 'black';
// // path.add(rect);
// // var path = new Path.Circle({
// //   center: view.center,
// //   radius: 30,
// //   strokeColor: 'black'
// // });

// // var a = new Point(12,34);
// // var b = new Point(121,64);
// // var c = a - b;
// // console.log(a)
// // console.log(b)
// // console.log(c)
// // console.log(c.length)
// // console.log(c.angle)
// // hi();
var myPath = new Path();
myPath.strokeColor = 'green';
myPath.add(new Point(0, 0), new Point(100, 50), new Point(10, 120), new Point(3, 33), new Point(130, 23));
myPath.position.x += 50;
myPath.closed=true;
myPath.add(new Point(23,44), new Point(56,21));
// myPath.fullySelected=true;
myPath.fillColor='yellow';
myPath.smooth();
myPath.flatten(10);
myPath.removeSegment(1);

var r = new Rectangle(new Point(10, 50), new Point(80, 140));
var p = new Path.Rectangle(r);
p.strokeColor = 'black';
myPath.rotate(33);

// window.setTimeout(2000, "console.log('yes');myPath.remove();");
// console.log(document);

var c = new Path.Circle(new Point(30, 12), 10);
c.strokeColor = 'brown';

// function onMouseMove(){
//   console.log('11');
// }
// // var myPath2 = myPath.clone();
// // myPath2.position.x += 150;
// // myPath2.smooth();

// // insert a segment between the two existing
// // segments in the path:
// // myPath.insert(1, new Point(30, 40));
// var ppi = 0;
// var pp = null;

// koko = function(){
//   if (pp != null) {
//     pp.remove();
//   }
//   console.log('cool');
// }

// function onMouseDown(event){
//   if (pp == null) {
//     pp = new Path();
//     pp.strokeColor = 'purple';
//     pp.add(event.point);
//   }
//   // pp.smooth();
// }

// function onMouseDrag(event){
//   // if (ppi < 1) {
//   //   pp.removeSegment(1);
//   //   pp.add(event.point);
//   // } else {
//   //   if (ppi > 1) {
//   //     pp.removeSegment(1);
//   //   } else {
//   //     ppi = 2;
//   //   }
//   //   pp.insert(1, event.point);
//   //   pp.smooth();
//   // }
//   console.log(123);
// }

// function onMouseUp(event){
//   pp.add(event.point);
//   if (ppi > 0) {
//     pp.smooth();
//     ppi =  0;
//     koko();
//     pp = null;
//   } else {
//     ppi = 1;
//   }
// }