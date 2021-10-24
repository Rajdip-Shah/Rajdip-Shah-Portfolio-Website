function menuToggle(){
    toggleBtn = document.getElementById("toggle");
    navBar = document.getElementById("toggleNav");
    dayNightBtn = document.getElementById("day-night-btn");
    toggleBtn.classList.toggle("open");
    navBar.classList.toggle("open");
    dayNightBtn.classList.toggle("open");

}









const { to, fromTo, set } = gsap;

document.querySelectorAll('.day-night').forEach(dayNight => {
  let toggle = dayNight.querySelector('.toggle'),
  svgLine = dayNight.querySelector('.line'),
  svgLineProxy = new Proxy({
    y: null },
  {
    set(target, key, value) {
      target[key] = value;
      if (target.y !== null) {
        svgLine.innerHTML = getPath(target.y, .1925);
      }
      return true;
    },
    get(target, key) {
      return target[key];
    } });


  svgLineProxy.y = 18;

  toggle.addEventListener('click', e => {
    e.preventDefault();

    if (dayNight.classList.contains('animate')) {
      return;
    }
    dayNight.classList.add('animate');

    let night = dayNight.classList.contains('night');

    to(dayNight, {
      keyframes: [{
        [night ? '--sun-y' : '--moon-y']: '-4px',
        duration: .25 },
      {
        [night ? '--sun-y' : '--moon-y']: '60px',
        duration: .2 },
      {
        [night ? '--moon-y' : '--sun-y']: '-4px',
        duration: .25,
        delay: .275,
        onStart() {
          to(dayNight, {
            '--new-percent': '100%',
            '--line': night ? 'var(--night-line)' : 'var(--day-line)',
            duration: 0.3 });

        } },
      {
        [night ? '--moon-y' : '--sun-y']: '0px',
        duration: .5,
        ease: 'elastic.out(1, .5)',
        clearProps: true,
        onComplete() {
          if (night) {
            dayNight.classList.remove('night');
          } else {
            dayNight.classList.add('night');
          }
          dayNight.classList.remove('animate');
        } }] });



    to(svgLineProxy, {
      keyframes: [{
        y: 24,
        delay: .25,
        duration: .2 },
      {
        y: 12,
        duration: .2 },
      {
        y: 24,
        duration: .25 },
      {
        y: 18,
        duration: .5,
        ease: 'elastic.out(1, .5)' }] });



  });
});

function getPoint(point, i, a, smoothing) {
  let cp = (current, previous, next, reverse) => {
    let p = previous || current,
    n = next || current,
    o = {
      length: Math.sqrt(Math.pow(n[0] - p[0], 2) + Math.pow(n[1] - p[1], 2)),
      angle: Math.atan2(n[1] - p[1], n[0] - p[0]) },

    angle = o.angle + (reverse ? Math.PI : 0),
    length = o.length * smoothing;
    return [current[0] + Math.cos(angle) * length, current[1] + Math.sin(angle) * length];
  },
  cps = cp(a[i - 1], a[i - 2], point, false),
  cpe = cp(point, a[i - 1], a[i + 1], true);
  return `C ${cps[0]},${cps[1]} ${cpe[0]},${cpe[1]} ${point[0]},${point[1]}`;
}

function getPath(update, smoothing) {
  let points = [
  [4, 18],
  [26, update],
  [48, 18]],

  d = points.reduce((acc, point, i, a) => i === 0 ? `M ${point[0]},${point[1]}` : `${acc} ${getPoint(point, i, a, smoothing)}`, '');
  return `<path d="${d}" />`;
}













// COOL SHITS I CAN DO















// const { gsap, imagesLoaded } = window;

const buttons = {
  prev: document.querySelector(".btn--left"),
  next: document.querySelector(".btn--right") };

const cardsContainerEl = document.querySelector(".cards__wrapper");
const cardInfosContainerEl = document.querySelector(".info__wrapper");

buttons.next.addEventListener("click", () => swapCards("right"));

buttons.prev.addEventListener("click", () => swapCards("left"));

function swapCards(direction) {
  const currentCardEl = cardsContainerEl.querySelector(".current--card");
  const previousCardEl = cardsContainerEl.querySelector(".previous--card");
  const nextCardEl = cardsContainerEl.querySelector(".next--card");

  const currentVideo = currentCardEl.querySelector(".video");
  currentVideo.pause();

  changeInfo(direction);
  swapCardsClass();
  removeCardEvents(currentCardEl);

  function swapCardsClass() {
    currentCardEl.classList.remove("current--card");
    previousCardEl.classList.remove("previous--card");
    nextCardEl.classList.remove("next--card");


    currentCardEl.style.zIndex = "50";

    if (direction === "right") {
      previousCardEl.style.zIndex = "20";
      nextCardEl.style.zIndex = "30";


      currentCardEl.classList.add("previous--card");
      previousCardEl.classList.add("next--card");
      nextCardEl.classList.add("current--card");

    } else if (direction === "left") {
      previousCardEl.style.zIndex = "30";
      nextCardEl.style.zIndex = "20";


      currentCardEl.classList.add("next--card");
      previousCardEl.classList.add("current--card");
      nextCardEl.classList.add("previous--card");

    }
  }
}


function playVideo(){
  const cardsContainerEl = document.querySelector(".cards__wrapper");
  const currentCardEl = cardsContainerEl.querySelector(".current--card");
  const video = currentCardEl.querySelector(".video");
  const playIcon = currentCardEl.querySelector(".play");
  const pauseIcon = currentCardEl.querySelector(".pause");
  console.log(playIcon);
  console.log(pauseIcon);

  console.log(video.paused);
  if (video.paused) {
      playIcon.style.display = "block";
      pauseIcon.style.display = "none";
      video.play();
  }
  else {
    playIcon.style.display = "none";
    pauseIcon.style.display = "block";
    video.pause();
  }
}


function changeInfo(direction) {
  let currentInfoEl = cardInfosContainerEl.querySelector(".current--info");
  let previousInfoEl = cardInfosContainerEl.querySelector(".previous--info");
  let nextInfoEl = cardInfosContainerEl.querySelector(".next--info");

  gsap.timeline().
  to([buttons.prev, buttons.next], {
    duration: 0.2,
    opacity: 0.5,
    pointerEvents: "none" }).

  to(
  currentInfoEl.querySelectorAll(".text"),
  {
    duration: 0.4,
    stagger: 0.1,
    translateY: "-120px",
    opacity: 0 },

  "-=").

  call(() => {
    swapInfosClass(direction);
  }).
  call(() => initCardEvents()).
  fromTo(
  direction === "right" ?
  nextInfoEl.querySelectorAll(".text") :
  previousInfoEl.querySelectorAll(".text"),
  {
    opacity: 0,
    translateY: "40px" },

  {
    duration: 0.4,
    stagger: 0.1,
    translateY: "0px",
    opacity: 1 }).


  to([buttons.prev, buttons.next], {
    duration: 0.2,
    opacity: 1,
    pointerEvents: "all" });


  function swapInfosClass() {
    currentInfoEl.classList.remove("current--info");
    previousInfoEl.classList.remove("previous--info");
    nextInfoEl.classList.remove("next--info");

    if (direction === "right") {
      currentInfoEl.classList.add("previous--info");
      nextInfoEl.classList.add("current--info");
      previousInfoEl.classList.add("next--info");
    } else if (direction === "left") {
      currentInfoEl.classList.add("next--info");
      nextInfoEl.classList.add("previous--info");
      previousInfoEl.classList.add("current--info");
    }
  }
}

function updateCard(e) {
  const card = e.currentTarget;
  const box = card.getBoundingClientRect();
  const centerPosition = {
    x: box.left + box.width / 2,
    y: box.top + box.height / 2 };

  let angle = Math.atan2(e.pageX - centerPosition.x, 0) * (35 / Math.PI);
  gsap.set(card, {
    "--current-card-rotation-offset": `${angle}deg` });

  const currentInfoEl = cardInfosContainerEl.querySelector(".current--info");
  gsap.set(currentInfoEl, {
    rotateY: `${angle}deg` });

}

function resetCardTransforms(e) {
  const card = e.currentTarget;
  const currentInfoEl = cardInfosContainerEl.querySelector(".current--info");
  gsap.set(card, {
    "--current-card-rotation-offset": 0 });

  gsap.set(currentInfoEl, {
    rotateY: 0 });

}

function initCardEvents() {
  const currentCardEl = cardsContainerEl.querySelector(".current--card");
  currentCardEl.addEventListener("pointermove", updateCard);
  currentCardEl.addEventListener("pointerout", e => {
    resetCardTransforms(e);
  });
}

initCardEvents();

function removeCardEvents(card) {
  card.removeEventListener("pointermove", updateCard);
}

function init() {

  let tl = gsap.timeline();

  tl.to(cardsContainerEl.children, {
    delay: 0.15,
    duration: 0.5,
    stagger: {
      ease: "power4.inOut",
      from: "right",
      amount: 0.1 },

    "--card-translateY-offset": "0%" }).

  to(cardInfosContainerEl.querySelector(".current--info").querySelectorAll(".text"), {
    delay: 0.5,
    duration: 0.4,
    stagger: 0.1,
    opacity: 1,
    translateY: 0 }).

  to(
  [buttons.prev, buttons.next],
  {
    duration: 0.4,
    opacity: 1,
    pointerEvents: "all" },

  "-=0.4");
}
