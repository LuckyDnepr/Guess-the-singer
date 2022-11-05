export function renderQuizzPage(target, stageNumber) {
  if (stageNumber !== 0) {
    toggleVibilityOfSections();
    setTimeout(() => {
      globalThis.stage = stageNumber;
      renderQuizzPageHTML(stageNumber, target);
      addListeners();
      setTimeout(() => {
        toggleVibilityOfSections();  
      }, 100);
    }, 400);
  } else {
      globalThis.stage = stageNumber;
      renderQuizzPageHTML(stageNumber, target);
      addListeners();
      toggleVibilityOfSections();
  }
}

function renderQuizzPageHTML(stageNumber, target) {
  const stage = `stage${stageNumber}`;

  target.innerHTML = `<section class="quizz-status">
          ${generateStagesSection(stageNumber)}
        </section>
        <aside class="select-answer fade">
          <ul class="answer-selection">
            ${generateArtistListHTML(globalThis.data[stage])}
          </ul>
        </aside>
          <section class="player fade">
            <section class="player__info">
              <figure class="player__info__image">
                <img src="./pics/unknown-person.png" alt="Unknown artist" />
              </figure>
              <section class="player__info__text">
                <p class="player__info__text__name"></p>
                <p class="player__info__text__years unknown-sign">***</p>
                <p class="player__info__text__song"></p>
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
                  value="15"
                />
              </section>
            </section>
          </section>
          <aside class="artist-info fade">
            <section class="artist-info__main">
              <figure class="artist-info__main__portrait">
                <img src="./pics/unknown-person.png" alt="Artist portrait" />
              </figure>
              <section class="artist-info__main__article">
                <p class="artist-info__main__article__name">* * *</p>
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
          <audio src="${
            globalThis.songs[stageNumber].url
          }" class="track"></audio>`;
}

function generateStagesSection(stageNumber) {
  let stages = new Array(6).fill(0).map((num, i) => {
    if (i < stageNumber) {
      return `<li class="quizz-status__stage__item passed">Stage ${i + 1}</li>`;
    } else if (i === stageNumber) {
      return `<li class="quizz-status__stage__item active">Stage ${i + 1}</li>`;
    } else {
      return `<li class="quizz-status__stage__item">Stage ${i + 1}</li>`;
    }
  });
  stages.unshift(`<ul class="quizz-status__stage">`);
  stages.push(`<li class="quizz-status__stage__item scores">
                Scores: <span class="scores-count">0</span>
                </li>
              </ul>`);
  return stages.join("");
}

function generateArtistListHTML(songs) {
  const answers = songs
    .map((song) => {
      return `<li class="answer-selection__item" value="${song.id}">${song.artist}</li>`;
    })
    .sort(() => (Math.random() > 0.5 ? 1 : -1));
  return answers.join("");
}

function addListeners() {
  const main = document.querySelector(".main"),
    play = document.querySelector(".player__controls__play"),
    music = document.querySelector(".track"),
    progress = document.querySelector(".player__controls__time"),
    timeStamp = document.querySelector(".player__controls__timeline"),
    mute = document.querySelector(".volume__container__mute"),
    volumeChanger = document.querySelector(".volume__container__volume"),
    answers = document.querySelector(".answer-selection"),
    nextStageBtn = document.querySelector(".next-stage__button"),
    artistInfo = document.querySelector(".artist-info"),
    playerInfoText = document.querySelector(".player__info__text"),
    nextStage = document.querySelector(".next-stage__button"),
    winsound = document.querySelector(".win-sound"),
    lostsound = document.querySelector(".lost-sound");

  music.volume = volumeChanger.value / 100;

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
  });

  music.addEventListener("timeupdate", (e) => {
    const duration = music.duration,
      currTime = e.target.currentTime,
      value = (100 * currTime) / duration,
      min = Math.floor(currTime / 60),
      sec = Math.floor(currTime - min * 60);
    const visibleSec = sec < 10 ? `0${sec}` : sec;

    progress.value = value;
    timeStamp.innerHTML = `${min}:${visibleSec}`;
  });

  progress.addEventListener("input", (e) => {
    const clickX = e.target.value;
    const duration = music.duration;
    music.currentTime = (duration * clickX) / 100;
  });

  answers.addEventListener("click", (e) => {
    if (e.target.classList.contains("answer-selection__item")) {
      if (e.target.value === globalThis.songs[globalThis.stage].id) {
        e.target.classList.add("hit");
        answers.dispatchEvent(new CustomEvent("winArtist"));
        music.pause();
        play.classList.add("paused");
        nextStageBtn.classList.add("pulsate");
        renderHitArtistInfo(e.target.value, playerInfoText);
      } else {
        if (document.querySelectorAll(".hit").length === 0) {
          answers.dispatchEvent(new CustomEvent("lostArtist"));
          e.target.classList.add("fail");
        }
      }
    }
    renderArtistInfo(e.target.value, artistInfo);
  });
  
  answers.addEventListener("lostArtist", () => {
    if (!nextStage.classList.contains("pulsate")) {
      lostsound.currentTime = 0;
      lostsound.play();
    }
  });

  answers.addEventListener("winArtist", () => {
    if (!nextStage.classList.contains("pulsate")) {
      lostsound.pause();
      winsound.play();
    }
  });

  nextStage.addEventListener("click", (e) => {
    if (e.target.classList.contains("pulsate")) {
      globalThis.stage++;

      renderQuizzPage(main, globalThis.stage);
    }
  });
}

function renderArtistInfo(id, target) {
  const checkedSong = globalThis.data[`stage${globalThis.stage}`].find(
    (song) => song.id === id
  );
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

function renderHitArtistInfo(id, target) {
  const checkedSong = globalThis.data[`stage${globalThis.stage}`].find(
    (song) => song.id === id
  );
  target.innerHTML = `
      <p class="player__info__text__name">${checkedSong.artist}</p>
      <p class="player__info__text__years">${checkedSong.years}</p>
      <p class="player__info__text__song">${checkedSong.song}</p>
      `;
}

function toggleVibilityOfSections() {
  const sections = [
    document.querySelector(".select-answer"),
    document.querySelector(".player"),
    document.querySelector(".artist-info"),
  ];
  sections.forEach((section) => section.classList.toggle("fade"));
}
