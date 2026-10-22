// Put this ONCE in the <head> of every page (not inside the component):
//
// <link rel="preconnect" href="https://fonts.googleapis.com" />
// <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
// <link rel="stylesheet"
//   href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;700&family=Space+Grotesk:wght@300..700&display=swap" />

class SiteHeader extends HTMLElement {
  connectedCallback() {
    const path = location.pathname;
    const current = (href) =>
      (href === "/" ? path === "/" : path.startsWith(href)) ? 'aria-current="page"' : "";

    this.innerHTML = `
      <header class="mb-4 px-6 py-2 border-b border-b-olive-500/65 w-full min-w-lvw">
      
        <div class="mx-auto block md:flex max-w-6xl items-baseline justify-between gap-4">

          <div class="flex min-w-0 items-baseline gap-2">
            <p class="shrink-0 text-xs font-bold scramble-text" data-scramble="MATTHEW SUSTAITA">
              <span class="sr-only">Matthew Sustaita</span>
              <span aria-hidden="true">MATTHEW SUSTAITA</span>
            </p>
            <p class="hidden truncate text-xs text-olive-800/65 sm:block dark:text-olive-50/65 scramble-text-p"
               data-scramble="Web Designer &amp; Developer">
              <span class="sr-only">Web Designer &amp; Developer</span>
              <span aria-hidden="true">Web Designer &amp; Developer</span>
            </p>
          </div>

          <nav class="shrink-0" aria-label="Main navigation">
            <ul class="flex items-baseline gap-3 text-xs uppercase scramble-text">
              <li><a href="/" ${current("/")} class="underline-offset-2 hover:underline aria-[current=page]:underline">Home</a></li>
              <li><a href="/work/" ${current("/work/")} class="underline-offset-2 hover:underline aria-[current=page]:underline">Work</a></li>
              <li><a href="/about/" ${current("/about/")} class="underline-offset-2 hover:underline aria-[current=page]:underline">About</a></li>
              <li>
                <a href="mailto:hello@mateos.studio"
                   class="bg-olive-800 px-1.5 py-0.5 text-olive-50 underline-offset-2 hover:underline dark:bg-olive-50 dark:text-olive-900">
                  hello@mateos.studio
                </a>
              </li>
            </ul>
          </nav>

        </div>
      </header>
    `;
  }
}

customElements.define("site-header", SiteHeader);
