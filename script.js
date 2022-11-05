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
  globalThis.songs = generateSolver();
  renderQuizzPage(main, 0);
}

function generateSolver () {
  const data = globalThis.data;
  let questions = [];
  for (const key of Object.keys(data)) {
    const stage = data[key];
    const index = Math.floor(Math.random()*stage.length);
    questions.push(data[key][index]);
  }
  return questions;
}

async function getData(path) {
  try {
    const response = await fetch(path);
    return await response.json();
  } catch (error) {
    console.log(error);
  }
}
