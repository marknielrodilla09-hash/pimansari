const gift = document.querySelector("#gift");
const openGiftButton = document.querySelector("#open-gift");
const surprise = document.querySelector("#surprise");
const homeView = document.querySelector("#home-view");
const memoriesView = document.querySelector("#memories-view");
const messageView = document.querySelector("#message-view");
const finalView = document.querySelector("#final-view");
const continueButton = document.querySelector("#continue-to-memories");
const backHomeButton = document.querySelector("#back-to-home");
const readMessageButton = document.querySelector("#read-message");
const backToMemoriesButton = document.querySelector("#back-to-memories");
const openFinalSurpriseButton = document.querySelector("#open-final-surprise");
const backToMessageButton = document.querySelector("#back-to-message");
const revealFinalSurpriseButton = document.querySelector("#reveal-final-surprise");
const finalReveal = document.querySelector("#final-reveal");
const dayCounter = document.querySelector("#day-counter");

const relationshipStartDate = [2024, 2, 23];

function updateDayCounter() {
  if (!dayCounter) {
    return;
  }

  const today = new Date();
  const startUtc = Date.UTC(
    relationshipStartDate[0],
    relationshipStartDate[1],
    relationshipStartDate[2],
  );
  const todayUtc = Date.UTC(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const elapsedDays = Math.max(
    0,
    Math.floor((todayUtc - startUtc) / (1000 * 60 * 60 * 24)),
  );

  dayCounter.textContent = String(elapsedDays);
}

function scheduleDayCounterUpdate() {
  const now = new Date();
  const nextMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0,
    0,
    0,
    100,
  );

  window.setTimeout(() => {
    updateDayCounter();
    scheduleDayCounterUpdate();
    window.setInterval(updateDayCounter, 60 * 1000);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        updateDayCounter();
      }
    });
  }, nextMidnight.getTime() - now.getTime());
}

updateDayCounter();
scheduleDayCounterUpdate();

openGiftButton.addEventListener("click", () => {
  gift.classList.add("is-open");
  openGiftButton.hidden = true;
  surprise.hidden = false;
});

let isSwitchingViews = false;

async function switchView(currentView, nextView) {
  if (isSwitchingViews) {
    return;
  }

  isSwitchingViews = true;
  currentView.inert = true;
  currentView.setAttribute("aria-hidden", "true");

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const exitAnimation = currentView.animate(
      [
        { opacity: 1, transform: "translateY(0)" },
        { opacity: 0, transform: "translateY(-10px)" },
      ],
      { duration: 220, easing: "ease-in", fill: "forwards" },
    );
    await exitAnimation.finished;
    exitAnimation.cancel();
  }

  currentView.hidden = true;
  currentView.style.opacity = "";
  currentView.style.transform = "";
  nextView.hidden = false;
  nextView.inert = false;
  nextView.removeAttribute("aria-hidden");

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    await nextView.animate(
      [
        { opacity: 0, transform: "translateY(10px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      { duration: 280, easing: "ease-out" },
    ).finished;
  }

  isSwitchingViews = false;
  nextView.querySelector("h1, h2, button").focus();
  window.scrollTo({
    top: 0,
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth",
  });
}

continueButton.addEventListener("click", () => {
  switchView(homeView, memoriesView);
});

backHomeButton.addEventListener("click", () => {
  switchView(memoriesView, homeView);
});

readMessageButton.addEventListener("click", () => {
  switchView(memoriesView, messageView);
});

backToMemoriesButton.addEventListener("click", () => {
  switchView(messageView, memoriesView);
});

openFinalSurpriseButton.addEventListener("click", () => {
  switchView(messageView, finalView);
});

backToMessageButton.addEventListener("click", () => {
  switchView(finalView, messageView);
});

revealFinalSurpriseButton.addEventListener("click", () => {
  finalReveal.hidden = false;
  revealFinalSurpriseButton.hidden = true;
});

const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxCaption = document.querySelector("#lightbox-caption");
const closeLightboxButton = document.querySelector(".lightbox__close");
const previousPhotoButton = document.querySelector("#previous-photo");
const nextPhotoButton = document.querySelector("#next-photo");
const memoryCards = [...document.querySelectorAll(".memory-card")];
let activePhotoIndex = 0;

function showPhoto(index) {
  activePhotoIndex = (index + memoryCards.length) % memoryCards.length;
  const card = memoryCards[activePhotoIndex];

  lightboxImage.src = card.dataset.fullImage;
  lightboxImage.alt = card.dataset.caption;
  lightboxCaption.textContent = card.dataset.caption;
}

memoryCards.forEach((card, index) => {
  card.addEventListener("click", () => {
    showPhoto(index);
    lightbox.showModal();
  });
});

previousPhotoButton.addEventListener("click", () => {
  showPhoto(activePhotoIndex - 1);
});

nextPhotoButton.addEventListener("click", () => {
  showPhoto(activePhotoIndex + 1);
});

lightbox.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    showPhoto(activePhotoIndex - 1);
  } else if (event.key === "ArrowRight") {
    showPhoto(activePhotoIndex + 1);
  } else if (event.key === "Escape") {
    lightbox.close();
  }
});

closeLightboxButton.addEventListener("click", () => {
  lightbox.close();
});

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    lightbox.close();
  }
});
