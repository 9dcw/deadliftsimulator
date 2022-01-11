/*!
* Start Bootstrap - Simple Sidebar v6.0.3 (https://startbootstrap.com/template/simple-sidebar)
* Copyright 2013-2021 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-simple-sidebar/blob/master/LICENSE)
*/
//
// Scripts
//

window.addEventListener('DOMContentLoaded', event => {
    calculate_and_display()
    // Toggle the side navigation
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        // Uncomment Below to persist sidebar toggle between refreshes
        // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
        //     document.body.classList.toggle('sb-sidenav-toggled');
        // }
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }

});

var max_height;

function printout(text) {
  let el = document.createElement('p')
  el.innerHTML = text
  let display_el = document.getElementById('data_display')
  display_el.appendChild(el)

}

function calculate_and_display() {
  let display_el = document.getElementById('data_display')


  while (display_el.firstChild) {
          display_el.removeChild(display_el.firstChild);
        }
  let barbell_weight = 315
  let barbell_height = 9.5
  let barbell_diameter = 1
  let barbell_y = barbell_height

  let full_foot_len = document.getElementById('shoesize').value
  let height = document.getElementById('height').value

  if (!full_foot_len && !height){
    printout('no foot or height data!')
    return
  }
  else if (!full_foot_len){
    printout('no foot length data!')
    return
  }
  else if (!height){
    printout('no height data!')
    return
  }
  max_height = height
  let midfoot_point = .5 * full_foot_len
  let front_foot_size = full_foot_len * 2/3

  let barbell_x = midfoot_point - (full_foot_len - front_foot_size)
  let leg_angle = Math.atan(barbell_y / (barbell_x-1)) / Math.PI * 180
  console.log('leg angle: ' +leg_angle.toString())

  let lower_leg_len = height * .306122
  let upper_leg_len = height * .244898
  let trunk_len = height * .258503
  let arm_len = height * .326531
  let shoulders_neck_head_len = height * .190476

  let foot_y1 = 0
  let foot_x1 = 0
  let foot_y2 = 0
  let foot_x2 = front_foot_size

  let arm_x1 = barbell_x
  let arm_y2 = barbell_y
  let arm_x2 = barbell_x
  let arm_y1 = arm_len + arm_y2

  let trunk_y2 = arm_y1
  let trunk_x2 = arm_x1

  let lower_leg_y1 = 0
  let lower_leg_x1 = 0
  let lower_leg_y2 = Math.sin(leg_angle*Math.PI/180) * lower_leg_len
  let lower_leg_x2 = Math.cos(leg_angle*Math.PI/180) * lower_leg_len

  let upper_leg_y1 = lower_leg_y2
  let upper_leg_x1 = lower_leg_x2


  let intersection_coords = get_intersections(trunk_x2, trunk_y2, trunk_len,
                                              upper_leg_x1, upper_leg_y1, upper_leg_len)

  console.log(intersection_coords)
  let upper_leg_x2 = intersection_coords[0]
  let upper_leg_y2 = intersection_coords[1]

  let trunk_y1 = upper_leg_y2
  let trunk_x1 = upper_leg_x2

  let asinarg = (trunk_y2-trunk_y1 ) / trunk_len
  let shoulders_neck_head_angle = Math.asin(asinarg)
  shoulders_neck_head_y1 = trunk_y2
  shoulders_neck_head_x1 = trunk_x2
  shoulders_neck_head_y2 = Math.sin(shoulders_neck_head_angle) * shoulders_neck_head_len + shoulders_neck_head_y1
  shoulders_neck_head_x2 = Math.cos(shoulders_neck_head_angle) * shoulders_neck_head_len + shoulders_neck_head_x1

  max_height = shoulders_neck_head_y2

  two_el = setup_two('data_display')
  //draw_base(two_el)
  console.log('cie')
  draw_line(lower_leg_x1,lower_leg_y1,lower_leg_x2,lower_leg_y2, two_el)
  draw_line(upper_leg_x1,upper_leg_y1,upper_leg_x2,upper_leg_y2, two_el)
  draw_line(trunk_x1,trunk_y1,trunk_x2,trunk_y2, two_el)
  draw_line(arm_x1,arm_y1,arm_x2,arm_y2, two_el)
  draw_line(shoulders_neck_head_x1,shoulders_neck_head_y1,shoulders_neck_head_x2,shoulders_neck_head_y2, two_el)
  draw_line(foot_x1,foot_y1,foot_x2,foot_y2, two_el)

  draw_circle(barbell_x, barbell_y, barbell_diameter, two_el)

}

function convert_y(inches, two) {

  canvas_y = (two.height - inches * two.height / max_height)
  return canvas_y
}

function convert_x(inches, two) {

  canvas_x = (inches + max_height/2) * two.height / max_height + (two.width - two.height)/2
  return canvas_x
}

function convert_diamater(inches, two) {
  d=inches / max_height * two.height
  return d
}

function draw_circle(x_in,y_in,d_in, two) {

  x = convert_x(x_in, two)
  y = convert_y(y_in, two)
  d = convert_diamater(d_in, two)
  var circle = two.makeCircle(x, y, d/2)
  circle.fill = '#FF8000'
  two.update();
}

function draw_line(x0,y0,x1,y1, two) {

  line = two.makeLine(convert_x(x0, two),
                      convert_y(y0, two),
                      convert_x(x1, two),
                      convert_y(y1, two))

  //printout('x1 ' +convert_x(x0, two).toString() + ' y1 ' + convert_y(y0, two).toString() + ' x2 '+
  //          convert_x(x1, two).toString() + ' y2 ' + convert_y(y1, two).toString())
  line.stroke = 'orangered'
  two.update();
}

function setup_two (parentEL){
  var params = {
    //fullscreen: true
    fitted: true
  };

  var elem = document.getElementById(parentEL)
  var two_el = new Two(params).appendTo(elem);
  console.log(two_el.width, two_el.height)

  return two_el
}

function draw_base(two) {

  // Two.js has convenient methods to make shapes and insert them into the scene.
  var radius = 50;
  var x = two.width * 0.5;
  var y = two.height * 0.5 - radius * 1.25;
  var circle = two.makeCircle(x, y, radius);

  y = two.height * 0.5 + radius * 1.25;
  var width = 100;
  var height = 100;
  var rect = two.makeRectangle(x, y, width, height);

  // The object returned has many stylable properties:
  circle.fill = '#FF8000';
  // And accepts all valid CSS color:
  circle.stroke = 'orangered';
  circle.linewidth = 5;

  rect.fill = 'rgb(0, 200, 255)';
  rect.opacity = 0.75;
  rect.noStroke();

  // Don’t forget to tell two to draw everything to the screen
  two.update();

}

function get_intersections(x0, y0, r0, x1, y1, r1) {
    // circle 1: (x0, y0), radius r0
    // circle 2: (x1, y1), radius r1
    console.log(x0, y0, r0, x1, y1, r1)
    let d=Math.sqrt((x1-x0)**2 + (y1-y0)**2)

    // non intersecting
    if (d > (r0 + r1)) {
        return
    }
    // One circle within other
    if (d < Math.abs(r0-r1)) {
        return
      }
    // coincident circles
    if (d === 0 && r0 === r1) {
        return
      }
    else {
        let a=(r0**2-r1**2+d**2)/(2*d)
        let h=Math.sqrt(r0**2-a**2)
        let x2=x0+a*(x1-x0)/d
        let y2=y0+a*(y1-y0)/d
        let x3=x2+h*(y1-y0)/d
        let y3=y2-h*(x1-x0)/d

        let x4=x2-h*(y1-y0)/d
        let y4=y2+h*(x1-x0)/d
        console.log('going in')
        if (x4 < x3){
          console.log('x4')
          return [x4, y4]
        }
        else{
          console.log('x3', x3, y3)

        return [x3, y3]
        }
      }
}
