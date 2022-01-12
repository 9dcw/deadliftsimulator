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

//var max_height;

function data_toggle() {
  let button = document.getElementById("dataToggle")
  let h_section = document.getElementById("height_entry_section")
  let l_section = document.getElementById("limb_entry_section")

  if (button.innerHTML === 'Enter Height') {
    button.innerHTML = 'Enter Limb Lengths'
    h_section.setAttribute('style', "display:inline")
    l_section.setAttribute('style', "display:none")

  }
  else {
    button.innerHTML = 'Enter Height'
    h_section.setAttribute('style', "display:none")
    l_section.setAttribute('style', "display:inline")
  }

}

function printout(text) {
  let el = document.createElement('p')
  el.innerHTML = text
  let display_el = document.getElementById('data_display')
  display_el.appendChild(el)

}

function calculate_and_display() {
  let button = document.getElementById("dataToggle")
  let display_el = document.getElementById('data_display')
  let vitruvian_el = document.getElementById('vitruvian')
  while (vitruvian_el.firstChild) {
          vitruvian_el.removeChild(vitruvian_el.firstChild);
        }


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

  let lower_leg_len;
  let upper_leg_len;
  let trunk_len;
  let arm_len;
  let shoulders_neck_head_len;


  if (button.innerHTML === 'Enter Height') {
    lower_leg_len = parseFloat(document.getElementById('lower_leg_len').value)
    upper_leg_len = parseFloat(document.getElementById('upper_leg_len').value)
    trunk_len = parseFloat(document.getElementById('trunklen').value)
    arm_len = parseFloat(document.getElementById('armlen').value)
    shoulders_neck_head_len = parseFloat(trunk_len * .190476 /.258503 )


  }
  else {
    lower_leg_len = height * .306122
    upper_leg_len = height * .244898
    trunk_len = height * .258503
    arm_len = height * .326531
    shoulders_neck_head_len = height * .190476

  }
  console.log('testing', lower_leg_len, upper_leg_len, trunk_len, arm_len)

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

  max_height = shoulders_neck_head_y2 + 5

  two_el = setup_two('data_display')
  //draw_base(two_el)

  draw_line(lower_leg_x1,lower_leg_y1,lower_leg_x2,lower_leg_y2, two_el, max_height)
  draw_line(upper_leg_x1,upper_leg_y1,upper_leg_x2,upper_leg_y2, two_el, max_height)
  draw_line(trunk_x1,trunk_y1,trunk_x2,trunk_y2, two_el, max_height)
  draw_line(arm_x1,arm_y1,arm_x2,arm_y2, two_el, max_height)
  draw_line(shoulders_neck_head_x1,shoulders_neck_head_y1,shoulders_neck_head_x2,shoulders_neck_head_y2, two_el, max_height)
  draw_line(foot_x1,foot_y1,foot_x2,foot_y2, two_el, max_height)

  draw_circle(barbell_x, barbell_y, barbell_diameter, two_el, max_height)

  two_vitruvian = setup_two('vitruvian')
  max_height_v = height + 10
  draw_vitruvian(lower_leg_len, upper_leg_len, trunk_len,
                  arm_len, shoulders_neck_head_len,
                  two_vitruvian, max_height_v)
}

function convert_y(inches, two, max_height) {

  canvas_y = (two.height - inches * two.height / max_height)
  return canvas_y
}

function convert_x(inches, two, max_height) {

  canvas_x = (inches + max_height/2) * two.height / max_height + (two.width - two.height)/2
  return canvas_x
}

function convert_diamater(inches, two, max_height) {
  d=inches / max_height * two.height
  return d
}

function draw_v_circle(x_in,y_in,d_in, two, max_height) {

  x = convert_x(x_in, two, max_height)
  y = convert_y(y_in, two, max_height)
  d = convert_diamater(d_in, two, max_height)
  var circle = two.makeCircle(x, y, d/2)
  circle.fill = 'transparent'
  two.update();
}

function draw_circle(x_in,y_in,d_in, two, max_height) {

  x = convert_x(x_in, two, max_height)
  y = convert_y(y_in, two, max_height)
  d = convert_diamater(d_in, two, max_height)
  var circle = two.makeCircle(x, y, d/2)
  circle.fill = '#FF8000'
  two.update();
}

function draw_line(x0,y0,x1,y1, two, max_height) {

  line = two.makeLine(convert_x(x0, two, max_height),
                      convert_y(y0, two, max_height),
                      convert_x(x1, two, max_height),
                      convert_y(y1, two, max_height))

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
  console.log(elem)
  var two_el = new Two(params).appendTo(elem);

  return two_el
}

function draw_vitruvian(lower_leg, upper_leg, torso, arm, head, two, max_height) {

  leg = lower_leg + upper_leg
  leg_1_x1 = 2
  leg_1_x2 = 2
  leg_1_y1 = 0
  leg_1_y2 = leg
  draw_line(leg_1_x1,leg_1_y1,leg_1_x2,leg_1_y2, two, max_height)

  leg_2_x1 = -2
  leg_2_x2 = -2
  leg_2_y1 = 0
  leg_2_y2 = leg
  draw_line(leg_2_x1,leg_2_y1,leg_2_x2,leg_2_y2, two, max_height)

  leg_3_angle = 296
  leg_3_x1 = Math.cos(leg_3_angle*Math.PI/180)*leg
  leg_3_x2 = 2
  // adjusting for taking the angle from the endpoint instead of floor
  leg_3_y1 = (Math.sin(leg_3_angle*Math.PI/180)+1)*leg
  leg_3_y2 = leg
  draw_line(leg_3_x1,leg_3_y1,leg_3_x2,leg_3_y2, two, max_height)

  leg_4_angle = 244
  leg_4_x1 = Math.cos(leg_4_angle*Math.PI/180)*leg
  leg_4_x2 = -2
  // adjusting for taking the angle from the endpoint instead of floor
  leg_4_y1 = (Math.sin(leg_4_angle*Math.PI/180)+1)*leg
  leg_4_y2 = leg
  console.log(leg_4_y1, leg_4_y2)
  draw_line(leg_4_x1,leg_4_y1,leg_4_x2,leg_4_y2, two, max_height)

  leg_2_x1 = -2
  leg_2_x2 = -2
  leg_2_y1 = 0
  leg_2_y2 = lower_leg + upper_leg
  draw_line(leg_2_x1,leg_2_y1,leg_2_x2,leg_2_y2, two, max_height)

  torso_x1 = 0
  torso_x2 = 0
  torso_y1 = lower_leg + upper_leg
  torso_y2 = lower_leg + upper_leg + torso
  draw_line(torso_x1,torso_y1,torso_x2,torso_y2, two, max_height)

  arm_1_x1 = 2
  arm_1_x2 = 2 + arm
  arm_1_y1 = torso_y2
  arm_1_y2 = torso_y2
  draw_line(arm_1_x1,arm_1_y1,arm_1_x2,arm_1_y2, two, max_height)

  arm_2_x1 = -2
  arm_2_x2 = -2 - arm
  arm_2_y1 = torso_y2
  arm_2_y2 = torso_y2
  draw_line(arm_2_x1,arm_2_y1,arm_2_x2,arm_2_y2, two, max_height)

  arm_3_angle = 18
  arm_3_x1 = 2
  arm_3_x2 = Math.cos(arm_3_angle*Math.PI/180)*arm + arm_3_x1
  arm_3_y1 = torso_y2
  arm_3_y2 = Math.sin(arm_3_angle*Math.PI/180)*arm + arm_3_y1
  draw_line(arm_3_x1,arm_3_y1,arm_3_x2,arm_3_y2, two, max_height)

  arm_4_angle = 162
  arm_4_x1 = -2
  arm_4_x2 = Math.cos(arm_4_angle*Math.PI/180)*arm + arm_4_x1
  arm_4_y1 = torso_y2
  arm_4_y2 = Math.sin(arm_4_angle*Math.PI/180)*arm + arm_4_y1
  draw_line(arm_4_x1,arm_4_y1,arm_4_x2,arm_4_y2, two, max_height)

  head_x1 = 0
  head_x2 = 0
  head_y1=torso_y2
  head_y2=torso_y2 + head
  draw_line(head_x1,head_y1,head_x2,head_y2, two, max_height)

  let x_array = [arm_1_x2,arm_2_x2,arm_3_x2,arm_4_x2,
              leg_1_x1,leg_2_x1,leg_3_x1,leg_4_x1]

  let y_array = [arm_1_y2,arm_2_y2,arm_3_y2,arm_4_y2,
              leg_1_y1,leg_2_y1,leg_3_y1,leg_4_y1,
                ]

  const average = (array) => array.reduce((a, b) => a + b) / array.length;
  av_x = 0
  av_y = average(y_array)
  console.log(av_x, av_y)
  draw_v_circle(av_x,av_y+5,max_height, two, max_height)
  // Don’t forget to tell two to draw everything to the screen
  two.update();

}

function get_intersections(x0, y0, r0, x1, y1, r1) {
    // circle 1: (x0, y0), radius r0
    // circle 2: (x1, y1), radius r1
    //console.log('registering', x0, y0, r0, x1, y1, r1)
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
        if (x4 < x3){
          return [x4, y4]
        }
        else{

        return [x3, y3]
        }
      }
}
