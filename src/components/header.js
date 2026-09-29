class SiteHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <header class="px-6 py-2 ">
            <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>

        <link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

<link
  href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap"
  rel="stylesheet"
/>

<style>
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&family=Space+Grotesk:wght@300..700&display=swap');
</style>
          <nav
            class=" mx-auto flex max-w-6xl items-center justify-end items-baseline "
            aria-label="Main navigation"
          >
            <ul class="flex items-center gap-6  scramble-text uppercase">
              <li>
                <a href="/texture/index.html" class="hidden hover:underline">Journal</a>
              </li>
              <li>
                <a href="mailto:hello@mateos.studio" class="hover:underline text-xs align-baseline text-olive-800/50">hello@mateos.studio</a>
              </li>
            </ul>
          </nav>
        </header>
      `;
  }
}

customElements.define("site-header", SiteHeader);
