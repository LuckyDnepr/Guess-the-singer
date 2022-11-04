export function renderQuizzPage(target) {
  globalThis.songs = generateSolver();
  globalThis.stage = 0;
  target.innerHTML = getQuizzPageHTML(globalThis.data.stage0);
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
                <p class="player__info__text__name">? ? ?</p>
                <p class="player__info__text__years"> ? ? </p>
                <p class="player__info__text__song">? ? ?</p>
              </section>
            </section>
            <section class="player__controls">
              <button class="player__controls__play paused"></button>
              <input
                type="range"
                class="player__controls__time"
                id="timeline"
                value="0"
              />
              <span class="player__controls__timeline">00:00</span>
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
                <p class="artist-info__main__article__name">? ? ?</p>
                <p class="artist-info__main__article__years"></p>
                <p class="artist-info__main__article__location"></p>
                <p class="artist-info__main__article__link">
                  <a href="#"></a>
                </p>
              </section>
            </section>
          </aside>
          <section class="next-stage">
            <button class="next-stage__button">Next stage >>></button>
          </section>
          <audio src="${globalThis.songs[0].url}" class="track"></audio>`;
}

function generateArtistListHTML(songs) {
  const answers = songs
    .map(song => {
      return `<li class="answer-selection__item" value="${song.id}">${song.artist}</li>`;
    })
    .sort(() => (Math.random() > 0.5) ? 1 : -1);
  return answers.join("");
}

function addListeners() {
  const play = document.querySelector(".player__controls__play"),
  music = document.querySelector(".track"),
  progress = document.querySelector(".player__controls__time"),
  timeStamp = document.querySelector(".player__controls__timeline"),
  mute = document.querySelector(".volume__container__mute"),
  volumeChanger = document.querySelector(".volume__container__volume"),
  answers = document.querySelector(".answer-selection"),
  nextStageBtn = document.querySelector(".next-stage__button"),
  artistInfo = document.querySelector(".artist-info");

  play.addEventListener("click", (e) => {
    if (e.target.classList.contains("paused")) {
      music.play();
    } else {
      music.pause();
    }
    e.target.classList.toggle("paused");
  });

  mute.addEventListener("input", (e) => {
    if (e.target.checked) {
      music.muted = true;
    } else {
      music.muted = false;
    }
  });

  volumeChanger.addEventListener("input", (e) => {
    const newVolume = e.target.value / 100;
    music.volume = newVolume;
    console.log(newVolume);
  });

  music.addEventListener("timeupdate", (e) => {
    const duration = music.duration,
    currTime = e.target.currentTime,
    value = 100 * currTime / duration,
    min = Math.floor(currTime / 60),
    sec = Math.floor(currTime - min * 60);
    const visibleSec = sec < 10 ? `0${sec}` : sec;

    progress.value = value;
    timeStamp.innerHTML = `${min}:${visibleSec}`;
  }
  );

  progress.addEventListener("input", (e) => {
    const clickX = e.target.value;
    const duration = music.duration;
    music.currentTime = duration * clickX / 100;
  });

  answers.addEventListener("click", (e) => {
    if (e.target.classList.contains("answer-selection__item")) {
      if (e.target.value === globalThis.songs[globalThis.stage].id) {
        e.target.classList.add("hit");
        nextStageBtn.classList.add("pulsate");
      } else {
        if (document.querySelectorAll(".hit").length === 0) {
          e.target.classList.add("fail");
        }
      }
    }
    renderArtistInfo(e.target.value, artistInfo);
  });
}

function renderArtistInfo (id, target) {
  const checkedSong = globalThis.data[`stage${globalThis.stage}`].find(song => song.id === id);
      target.innerHTML = `<section class="artist-info__main">
              <figure class="artist-info__main__portrait">
                <img src="./pics/unknown-person.png" alt="Artist portrait" />
              </figure>
              <section class="artist-info__main__article">
                <p class="artist-info__main__article__name">${checkedSong.artist}</p>
                <p class="artist-info__main__article__years">${checkedSong.years}</p>
                <p class="artist-info__main__article__location">${checkedSong.location}</p>
                <p class="artist-info__main__article__link">
                  <a href="${checkedSong.info}">More info...</a>
                </p>
              </section>
            </section>`;
}
