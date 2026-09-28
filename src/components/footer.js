class SiteFooter extends HTMLElement {
    connectedCallback() {
      const year = new Date().getFullYear()
  
      this.innerHTML = `
        <footer class="bg-olive-800 text-olive-50 border-t border-amber-500">
          <div
            class="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4 mt-2 sm:flex-row sm:items-center sm:justify-between md:text-sm text-xs"
          >
            <p class="m-0 ">
              © ${year} Matthew Sustaita
            </p>

           <p class="m-0 ">
              Designed with Vite + Tailwind
            </p>
  
            <a
              href="mailto:hello@mateos.studio"
              class="hover:underline  text-amber-500"
            >
              hello@mateos.studio
            </a>
          </div>
        </footer>
      `
    }
  }
  
  customElements.define('site-footer', SiteFooter)