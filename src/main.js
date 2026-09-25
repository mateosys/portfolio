import "./style.css";

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