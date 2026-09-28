class SiteHeader extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
        <header class="border-b border-olive-700">
          <nav
            class="mx-auto flex max-w-6xl items-center justify-between px-6 py-5"
            aria-label="Main navigation"
          >
            <a href="/" class="font-bold">
              Mateo's Studio
            </a>
  
            <ul class="flex items-center gap-6">
              <li>
                <a href="/" class="hover:underline">Home</a>
              </li>
  
              <li>
                <a href="/work/" class="hover:underline">Work</a>
              </li>
  
              <li>
                <a href="/about/" class="hover:underline">About</a>
              </li>
  
              <li>
                <a href="/contact/" class="hover:underline">Contact</a>
              </li>
            </ul>
          </nav>
        </header>
      `
    }
  }
  
  customElements.define('site-header', SiteHeader)