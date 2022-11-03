import { renderQuizzPage } from "./quizz-page.js";

const main = document.querySelector(".main"),
  body = document.querySelector(".body");

const dataPath = "./data.json";

quizzPageStart();

body.addEventListener("mousemove", function (e) {
  body.style.setProperty("--x", -window.event.clientX / 25 + "px");
});

async function quizzPageStart () {
  globalThis.data = await getData(dataPath);
  renderQuizzPage(main);

}

async function getData(path) {
  try {
    const response = await fetch(path);
    return await response.json();
  } catch (error) {
    console.log(error);
  }
}
