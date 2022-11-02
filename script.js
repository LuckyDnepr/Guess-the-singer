const body = document.querySelector(".body"),
play = document.querySelector(".player__controls__play");

body.addEventListener("mousemove", function(e) {
  body.style.setProperty('--x', -window.event.clientX/25 + "px");
});

play.addEventListener("click", (e) => {
  e.target.classList.toggle("paused");
});
