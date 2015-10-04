window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

bug = document.getElementById("ladybug");
header = document.getElementById("header");
bug.style.top = "300px";
bug.style.left = "350px";

dir_x = 1.0;
dir_y = 0.0;

// v = 1;
// alpha_v = 0.007;
// change_alpha_v_prob = 0.1;

v = 0.1;
alpha_v = 0.001;
change_alpha_v_prob = 0.01;
alpha_dir = 1;
prev_time_stamp = null;
stopped = false;

border_l = document.getElementById("border_l");
border_r = document.getElementById("border_r");
border_t = document.getElementById("border_t");
border_b = document.getElementById("border_b");
ladybug_point = document.getElementById("ladybug_point");
navbar = document.getElementsByClassName("navbar")[0];
navbar_height = parseFloat(navbar.offsetHeight);
console.log("navbar_height = " + navbar.offsetHeight);


function step(timestamp) {
  // console.log("timestamp = " + timestamp);
  if (prev_time_stamp == null) {
    dt = 0.;
  } else {
    dt = timestamp - prev_time_stamp;
  }    
  prev_time_stamp = timestamp;

  x = parseFloat(bug.style.left);
  y = parseFloat(bug.style.top);
  var rect = bug.getBoundingClientRect();
  w = bug.clientWidth;  // may not work somewhere?
  h = bug.clientHeight;

  if (!stopped) {
    x += dir_x * v * dt;
    y += dir_y * v * dt;
  }

  alpha = Math.atan2(dir_y, dir_x);

  // forvard_r = 150;
  // forv_x = x + w / 2.0 + dir_x * forvard_r;
  // forv_y = y + h / 2.0 + dir_y * forvard_r;
  // console.log("x = " + x);
  // console.log("y = " + y);
  // console.log("window.innerWidth = " + window.innerWidth);
  // console.log("document.innerHeight = " + getDocumentHeight());

  var dead_zone = 10;
  var in_dead_zone = false;
  var punch = 10;

  var min_x = dead_zone;
  var min_y = dead_zone + navbar_height;
  var max_x = getDocumentWidth() - dead_zone;
  var max_y = getDocumentHeight() - dead_zone;

  // console.log("min_x = " + min_x);
  // console.log("min_y = " + min_y);
  // console.log("max_x = " + max_x);
  // console.log("max_y = " + max_y);

  // // for debug
  // border_l.style.left = min_x + "px";
  // border_r.style.left = max_x + "px";
  // border_t.style.top = min_y + "px";
  // border_b.style.top = max_y + "px";

  if (x < min_x) {
    x = min_x;
    in_dead_zone = true;
  }
  if (y < min_y) {
    y = min_y;
    in_dead_zone = true;
  }
  if (x > max_x) {
    x = max_x;
    in_dead_zone = true;
  }
  if (y > max_y) {
    y = max_y;
    in_dead_zone = true;
  }

  if (in_dead_zone) {
    // console.log("in_dead_zone");
    alpha += Math.PI; // turn around
  }

  if (Math.random() < change_alpha_v_prob)
    alpha_dir *= -1;

  d_alpha = alpha_v * dt * alpha_dir;
  if (!stopped)
    alpha += d_alpha;
  dir_x = Math.cos(alpha);
  dir_y = Math.sin(alpha);

  alpha_deg = alpha * 180 / Math.PI + 90;
  bug.style.webkitTransform = 'rotate('+alpha_deg+'deg)';
  bug.style.mozTransform    = 'rotate('+alpha_deg+'deg)';
  bug.style.msTransform     = 'rotate('+alpha_deg+'deg)';
  bug.style.oTransform      = 'rotate('+alpha_deg+'deg)';
  bug.style.transform       = 'rotate('+alpha_deg+'deg)';

  bug.style.left = x + "px";
  bug.style.top = y + "px";

  // // for debug
  // ladybug_point.style.left = x + "px";
  // ladybug_point.style.top = y + "px";

  requestAnimationFrame(step);
}


requestAnimationFrame(step);

var cursorX;
var cursorY;
document.onmousemove = function(e) {
  cursorX = e.pageX;
  cursorY = e.pageY;

  var rect = bug.getBoundingClientRect();
  x = parseFloat(rect.left) + rect.width / 2.0;
  y = parseFloat(rect.top) + rect.height / 2.0 + window.scrollY;

  // console.log("x: " + x + " " + parseFloat(cursorX));
  // console.log("y: " + y + " " + parseFloat(cursorY));
  dx = x - parseFloat(cursorX);
  dy = y - parseFloat(cursorY);
  r = Math.sqrt(dx * dx + dy * dy);
  // console.log("r = " + r);
  bug_r = 35;
  if (r < bug_r) {
    ladybugOnEnter();
  }    
  else {
    ladybugOnLeave();
  }
}

function ladybugOnEnter(obj) {
  stopped = true;
  console.log("ladybugOnEnter");
  bug.style.backgroundImage = 'url(img/ladybug_looking.gif)';
}

function ladybugOnLeave(obj) {
  stopped = false;
  bug.style.backgroundImage = 'url(img/ladybug.gif)';
}

var documentHeight = 0;
function getDocumentHeight() {
  if (documentHeight > 0)
    return documentHeight;
  var body = document.body,
    html = document.documentElement;

  documentHeight = Math.max(body.scrollHeight, body.offsetHeight, 
                        html.clientHeight, html.scrollHeight, html.offsetHeight) - 100;
  return documentHeight;
}
function getDocumentWidth() {
  return window.innerWidth;
}

// body.addEventListener("load", init(), false);
$(document).ready(init);

function init() {
  documentHeight = 0;
}

