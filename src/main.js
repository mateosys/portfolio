import "./style.css";
import {sanityClient} from './sanity.js'
const journalQuery = `
  *[_type == "journalEntry" && defined(date)]
  | order(date desc) {
    _id,
    quote,
    speaker,
    date
  }
`

function formatEntryDate(dateString) {
  const [year, month, day] = dateString.split('-').map(Number)

  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(year, month - 1, day))
}

function createArchiveEntry(entry) {
  const article = document.createElement('article')
  article.className = 'border-olive-500/40 py-6 border-t'

  const date = document.createElement('time')
  date.className = 'block mb-2 text-xs'
  date.dateTime = entry.date
  date.textContent = formatEntryDate(entry.date)

  const quote = document.createElement('blockquote')
  quote.className = 'text-lg'

  const quoteText = document.createElement('p')
  quoteText.textContent = entry.quote

  const speaker = document.createElement('p')
  speaker.className = 'mt-2 text-sm'
  speaker.textContent = `— ${entry.speaker}`

  quote.append(quoteText)
  article.append(date, quote, speaker)

  return article
}

async function loadJournal() {
  const quoteElement = document.querySelector('#daily-quote')
  const speakerElement = document.querySelector('#entry-speaker')
  const dateElement = document.querySelector('#entry-date')
  const archiveElement = document.querySelector('#archive-list')

  try {
    const entries = await sanityClient.fetch(journalQuery)

    if (!entries.length) {
      quoteElement.textContent = 'No journal entries have been inked yet.'
      archiveElement.replaceChildren()
      return
    }

    const [latestEntry, ...previousEntries] = entries

    quoteElement.textContent = latestEntry.quote
    speakerElement.textContent = latestEntry.speaker

    dateElement.dateTime = latestEntry.date
    dateElement.textContent = formatEntryDate(latestEntry.date)

    if (!previousEntries.length) {
      const message = document.createElement('p')
      message.textContent = 'No previous entries yet.'
      archiveElement.replaceChildren(message)
      return
    }

    const archiveEntries = previousEntries.map(createArchiveEntry)
    archiveElement.replaceChildren(...archiveEntries)
  } catch (error) {
    console.error('Unable to parse journal entries, the stranger seems to have obfuscated the planchette :', error)

    quoteElement.textContent =
      'The daily entry could not be loaded. The Stranger is experiencing a cognitive fog..'

    archiveElement.replaceChildren()
  }
}

const journalExists = document.querySelector('#daily-quote')

if (journalExists) {
  loadJournal()
}


const canvas = document.querySelector("#particle-network");
const context = canvas?.getContext("2d");

// Continue with the canvas code here


if (canvas && context) {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  let particles = [];
  let animationFrame;
  let width = 0;
  let height = 0;
  let pixelRatio = 1;

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.radius = Math.random() * 1.4 + 0.5;

      // Keep the movement deliberately slow.
      this.velocityX = (Math.random() - 0.5) * 0.18;
      this.velocityY = (Math.random() - 0.5) * 0.18;
    }

    update() {
      this.x += this.velocityX;
      this.y += this.velocityY;

      if (this.x < 0 || this.x > width) {
        this.velocityX *= -1;
      }

      if (this.y < 0 || this.y > height) {
        this.velocityY *= -1;
      }
    }

    draw() {
      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      context.fillStyle = "rgba(190, 205, 255, 0.65)";
      context.fill();
    }
  }

  function resizeCanvas() {
    const bounds = canvas.getBoundingClientRect();

    width = bounds.width;
    height = bounds.height;
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;

    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    // Fewer particles on smaller screens.
    const particleCount = Math.min(
      80,
      Math.max(28, Math.floor(width / 18))
    );

    particles = Array.from(
      { length: particleCount },
      () => new Particle()
    );
  }

  function connectParticles() {
    const connectionDistance = 135;

    for (let first = 0; first < particles.length; first++) {
      for (
        let second = first + 1;
        second < particles.length;
        second++
      ) {
        const dx = particles[first].x - particles[second].x;
        const dy = particles[first].y - particles[second].y;
        const distance = Math.hypot(dx, dy);

        if (distance < connectionDistance) {
          const opacity =
            (1 - distance / connectionDistance) * 0.22;

          context.beginPath();
          context.moveTo(
            particles[first].x,
            particles[first].y
          );
          context.lineTo(
            particles[second].x,
            particles[second].y
          );
          context.strokeStyle =
            `rgba(166, 178, 255, ${opacity})`;
          context.lineWidth = 0.75;
          context.stroke();
        }
      }
    }
  }

  function render() {
    context.clearRect(0, 0, width, height);

    particles.forEach((particle) => {
      if (!reducedMotion) {
        particle.update();
      }

      particle.draw();
    });

    connectParticles();

    if (!reducedMotion) {
      animationFrame = requestAnimationFrame(render);
    }
  }

  resizeCanvas();
  render();

  const resizeObserver = new ResizeObserver(() => {
    cancelAnimationFrame(animationFrame);
    resizeCanvas();
    render();
  });

  resizeObserver.observe(canvas);
}