// Multimedia page: hover captions and the detail modal.
// Loaded only by work/multimedia/index.html.

const modal = document.getElementById("piece-modal");

// The parts of the modal we fill in each time it opens
const stage = modal.querySelector("[data-modal-stage]");
const modalImg = modal.querySelector("[data-modal-img]");
const modalVideo = modal.querySelector("[data-modal-video]");
const modalTitle = modal.querySelector("[data-modal-title]");
const modalMeta = modal.querySelector("[data-modal-meta]");
const modalDescription = modal.querySelector("[data-modal-description]");
const backTitle = modal.querySelector("[data-modal-back-title]");
const closeButton = modal.querySelector("[data-modal-close]");

// --- A small copy of the scramble effect from main.js ---

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!<>-_\\/[]{}—=+*^?#";
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function scramble(element, text, duration = 700) {
  // The visible letters live in the aria-hidden span inside the element
  const output = element.querySelector("[aria-hidden='true']") || element;

  if (reducedMotion.matches) {
    output.textContent = text;
    return;
  }

  cancelAnimationFrame(element.scrambleId);
  const start = performance.now();

  function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    const settled = progress * text.length * 1.45;

    output.innerHTML = [...text]
      .map((letter, i) => {
        if (letter === " " || i < settled) return letter;
        const random = characters[Math.floor(Math.random() * characters.length)];
        return `<span class="scramble-character">${random}</span>`;
      })
      .join("");

    if (progress < 1) {
      element.scrambleId = requestAnimationFrame(frame);
    } else {
      output.textContent = text;
    }
  }

  element.scrambleId = requestAnimationFrame(frame);
}

// --- Tiles ---

document.querySelectorAll(".tile").forEach((tile) => {
  const captionTitle = tile.querySelector(".caption-title");

  // Replay the scramble on the caption each time it slides up
  const playCaption = () => scramble(captionTitle, captionTitle.dataset.text);
  tile.addEventListener("mouseenter", playCaption);
  tile.addEventListener("focus", playCaption);

  tile.addEventListener("click", () => openModal(tile.dataset));
});

// --- Modal ---

function openModal(piece) {
  modalMeta.textContent = piece.meta;
  modalDescription.textContent = piece.description;
  backTitle.textContent = piece.title;

  if (piece.kind === "video") {
    // Videos don't spin. They play bigger, with controls.
    stage.classList.add("hidden");
    modalVideo.classList.remove("hidden");
    modalVideo.src = piece.src;
    modalVideo.muted = true;
    modalVideo.play();
  } else {
    modalVideo.classList.add("hidden");
    stage.classList.remove("hidden");
    modalImg.src = piece.src;
    modalImg.alt = piece.alt;
  }

  modal.showModal(); // the browser handles focus and the Esc key for us
  scramble(modalTitle, piece.title, 900);
}

// Close with the button, or by clicking the dark area outside the box
closeButton.addEventListener("click", () => modal.close());
modal.addEventListener("click", (event) => {
  if (event.target === modal) modal.close();
});

// Whenever the modal closes (button, backdrop or Esc), stop the video
modal.addEventListener("close", () => {
  modalVideo.pause();
  modalVideo.removeAttribute("src");
  modalVideo.load();
});
