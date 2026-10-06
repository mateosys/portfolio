import "./style.css";
import { animate, stagger, scroll, easeIn } from "motion"
import "./components/header.js";
import "./components/footer.js";
import { sanityClient } from "./sanity.js";
const journalQuery = `
  *[_type == "journalEntry" && defined(date)]
  | order(date desc) {
    _id,
    quote,
    speaker,
    date
  }
`;
// Journal Script
function formatEntryDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

function createArchiveEntry(entry) {
  const article = document.createElement("article");
  article.className = "border-olive-500/40 py-6 border-t";

  const date = document.createElement("time");
  date.className = "block mb-2 text-xs italic";
  date.dateTime = entry.date;
  date.textContent = formatEntryDate(entry.date);

  const quote = document.createElement("blockquote");
  quote.className = "text-lg";

  const quoteText = document.createElement("p");
  quoteText.textContent = entry.quote;

  const speaker = document.createElement("p");
  speaker.className = "mt-2 text-sm";
  speaker.textContent = `— ${entry.speaker}`;

  quote.append(quoteText);
  article.append(date, quote, speaker);

  return article;
}

async function loadJournal() {
  const journalWidgets = document.querySelectorAll("[data-journal-entry]");
  const archiveElement = document.querySelector("#archive-list");

  if (!journalWidgets.length && !archiveElement) {
    return;
  }

  try {
    const entries = await sanityClient.fetch(journalQuery);

    if (!entries.length) {
      journalWidgets.forEach((widget) => {
        const quoteElement = widget.querySelector("[data-journal-quote]");
        const speakerElement = widget.querySelector("[data-journal-speaker]");
        const dateElement = widget.querySelector("[data-journal-date]");

        if (quoteElement) {
          quoteElement.textContent = "No journal entries have been inked yet.";
        }

        if (speakerElement) {
          speakerElement.textContent = "";
        }

        if (dateElement) {
          dateElement.textContent = "";
          dateElement.removeAttribute("datetime");
        }
      });

      archiveElement?.replaceChildren();
      return;
    }

    const [latestEntry, ...previousEntries] = entries;

    journalWidgets.forEach((widget) => {
      const quoteElement = widget.querySelector("[data-journal-quote]");
      const speakerElement = widget.querySelector("[data-journal-speaker]");
      const dateElement = widget.querySelector("[data-journal-date]");

      if (quoteElement) {
        quoteElement.textContent = latestEntry.quote;
      }

      if (speakerElement) {
        speakerElement.textContent = latestEntry.speaker
          ? `— ${latestEntry.speaker}`
          : "";
      }

      if (dateElement) {
        dateElement.dateTime = latestEntry.date;
        dateElement.textContent = formatEntryDate(latestEntry.date);
      }
    });

    if (archiveElement) {
      if (!previousEntries.length) {
        const message = document.createElement("p");
        message.textContent = "No previous entries yet.";
        archiveElement.replaceChildren(message);
      } else {
        const archiveEntries = previousEntries.map(createArchiveEntry);
        archiveElement.replaceChildren(...archiveEntries);
      }
    }
  } catch (error) {
    console.error("Unable to load journal entries:", error);

    journalWidgets.forEach((widget) => {
      const quoteElement = widget.querySelector("[data-journal-quote]");
      const speakerElement = widget.querySelector("[data-journal-speaker]");
      const dateElement = widget.querySelector("[data-journal-date]");

      if (quoteElement) {
        quoteElement.textContent =
          "The daily entry could not be loaded. The Stranger is experiencing cognitive fog.";
      }

      if (speakerElement) {
        speakerElement.textContent = "";
      }

      if (dateElement) {
        dateElement.textContent = "";
        dateElement.removeAttribute("datetime");
      }

    });

    archiveElement?.replaceChildren();
  }
}

const journalExists =
  document.querySelector("[data-journal-entry]") ||
  document.querySelector("#archive-list");

if (journalExists) {
  loadJournal();
}

// Scramble effects note: the first const will always be unique, and not related to another const or function

const scrambleAnimations = new WeakMap();

const scrambleCharacters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!<>-_\\/[]{}—=+*^?#";

function randomCharacter() {
  return scrambleCharacters[
    Math.floor(Math.random() * scrambleCharacters.length)
  ];
}

function scrambleText(element, newText, options = {}) {
  const output = element.querySelector("[aria-hidden='true']");

  if (!output) {
    return;
  }

  // Stop an existing animation on this same element.
  const previousAnimation = scrambleAnimations.get(element);

  if (previousAnimation) {
    cancelAnimationFrame(previousAnimation);
  }

  const {
    duration = 850,
    scrambleSpeed = 35,
    stagger = 0.45,
  } = options;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  element.setAttribute("aria-label", newText);

  if (reducedMotion) {
    output.textContent = newText;
    return;
  }

  const startTime = performance.now();
  let previousUpdate = 0;

  function animate(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    /*
     * Characters settle from left to right.
     * Increasing stagger makes the transition more directional.
     */
    const settledPosition =
      progress * (newText.length + newText.length * stagger);

    if (
      currentTime - previousUpdate >= scrambleSpeed ||
      progress === 1
    ) {
      previousUpdate = currentTime;

      const animatedCharacters = [...newText].map(
        (character, index) => {
          if (character === " ") {
            return " ";
          }

          if (index < settledPosition) {
            return character;
          }

          return randomCharacter();
        }
      );

      output.innerHTML = animatedCharacters
        .map((character, index) => {
          const isSettled = index < settledPosition;

          if (isSettled || character === " ") {
            return character;
          }

          return `<span class="scramble-character">${character}</span>`;
        })
        .join("");
    }

    if (progress < 1) {
      const animationId = requestAnimationFrame(animate);
      scrambleAnimations.set(element, animationId);
    } else {
      output.textContent = newText;
      scrambleAnimations.delete(element);
    }
  }

  const animationId = requestAnimationFrame(animate);
  scrambleAnimations.set(element, animationId);
}

document.querySelectorAll("[data-scramble]").forEach((element) => {
  const finalText = element.dataset.scramble;

  scrambleText(element, finalText, {
    duration: 1000,
    scrambleSpeed: 30,
  });
});

// motion scripts
const quoteAnimation = document.getElementById("quoteAnimation")
const dotAnimation = document.getElementById("dotAnimation")
animate(quoteAnimation,   {
  duration: 1,
  opacity: [0, 1],
  filter: ["blur(4px)", "blur(0px)"],
  ease: easeIn,
})


