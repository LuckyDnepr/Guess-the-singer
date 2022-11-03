export function renderQuizzPage(target) {
  globalThis.songs = generateSolver();
  target.innerHTML = getQuizzPageHTML(globalThis.data.stage1);
  addListeners();
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

function getQuizzPageHTML(firstStage) {
  return `<section class="quizz-status">
          <ul class="quizz-status__stage">
            <li class="quizz-status__stage__item active">Stage 1</li>
            <li class="quizz-status__stage__item">Stage 2</li>
            <li class="quizz-status__stage__item">Stage 3</li>
            <li class="quizz-status__stage__item">Stage 4</li>
            <li class="quizz-status__stage__item">Stage 5</li>
            <li class="quizz-status__stage__item">Stage 6</li>
            <li class="quizz-status__stage__item scores">
              Scores: <span class="scores-count">0</span>
            </li>
          </ul>
        </section>
        <aside class="select-answer">
          <ul class="answer-selection">
            ${generateArtistListHTML(firstStage)}
          </ul>
        </aside>
          <section class="player">
            <section class="player__info">
              <figure class="player__info__image">
                <img src="./pics/unknown-person.png" alt="Unknown artist" />
              </figure>
              <section class="player__info__text">
                <p class="player__info__text__name">Jack Dou</p>
                <p class="player__info__text__years">1900-2000</p>
                <p class="player__info__text__location">USA</p>
              </section>
            </section>
            <section class="player__controls">
              <button class="player__controls__play paused"></button>
              <input
                type="range"
                class="player__controls__time"
                id="timeline"
                value="10"
              />
              <span class="player__controls__timeline"> 00:00 </span>
              <section class="volume__container">
                <input
                  type="checkbox"
                  class="volume__container__mute"
                  id="mute"
                />
                <label for="mute" class="volume__container__mute__label"
                  ><span class="volume__container__mute__label__icon"></span
                ></label>
                <input
                  type="range"
                  class="volume__container__volume"
                  id="volume"
                  value="20"
                />
              </section>
            </section>
          </section>
          <aside class="artist-info">
            <section class="artist-info__main">
              <figure class="artist-info__main__portrait">
                <img src="./pics/unknown-person.png" alt="Artist portrait" />
              </figure>
              <section class="artist-info__main__article">
                <p class="artist-info__main__article__name">Jack Dou</p>
                <p class="artist-info__main__article__years">1900-2000</p>
                <p class="artist-info__main__article__location">USA</p>
                <p class="artist-info__main__article__link">
                  <a href="#">Link to infopage</a>
                </p>
              </section>
            </section>
          </aside>
          <audio src="${globalThis.songs[0].url}" class="track"></audio>`;
}

function generateArtistListHTML(songs) {
  const answers = songs.map(song => {
    return `<li class="answer-selection__item">${song.artist}</li>`;
  });
  return answers.join("");
}

function addListeners() {
  const play = document.querySelector(".player__controls__play");
  const music = document.querySelector(".track");
  console.dir(music);
  play.addEventListener("click", (e) => {
    if (e.target.classList.contains("paused")) {
      music.play();
    } else {
      music.pause();
    }
    e.target.classList.toggle("paused");
  });

  music.addEventListener("progress", (e) => {
    console.log(music.currentTime);
  }
  );
}
