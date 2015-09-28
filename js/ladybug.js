window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

bug = document.getElementById("ladybug");
header = document.getElementById("header");
// bug.style.left = "350px";
bug.style.top = "10px";
bug.style.left = "350px";
// bug.style.top = "4000px";

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

  var dead_zone = 50;
  var in_dead_zone = false;
  var punch = 10;

  if (x < dead_zone) {
    x = dead_zone + punch;
    in_dead_zone = true;
  }
  if (y < -200) {
    y = -200 + punch;
    in_dead_zone = true;
  }
  if (x > (getDocumentWidth() - dead_zone)) {
    x = getDocumentWidth() - dead_zone - punch;
    in_dead_zone = true;
  }
  if (y > (getDocumentHeight() - dead_zone)) {
    y = getDocumentHeight() - dead_zone - punch;
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
                        html.clientHeight, html.scrollHeight, html.offsetHeight) - 400;
  return documentHeight;
}
function getDocumentWidth() {
  return window.innerWidth - 200;
}

// body.addEventListener("load", init(), false);
$(document).ready(init);

function init() {
  documentHeight = 0;
}

