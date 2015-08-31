window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

bug = document.getElementById("ladybug");
bug.style.left = "100px";
bug.style.top = "100px";

dir_x = 1.0;
dir_y = 0.0;
v = 0.1;
alpha_v = 0.001;
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

  if (!stopped) {
    x += dir_x * v * dt;
    y += dir_y * v * dt;
  }

  bug.style.left = x + "px";
  bug.style.top = y + "px";

  alpha = Math.atan2(dir_y, dir_x);
  // d_alpha = (Math.random() - 0.5) * alpha_v * dt;
  if (Math.random() < 0.01)
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

  requestAnimationFrame(step);
}

function onLoad() {
  requestAnimationFrame(step);
}

function ladybugOnEnter(obj) {
  stopped = true;
}

function ladybugOnLeave(obj) {
  stopped = false; 
}

