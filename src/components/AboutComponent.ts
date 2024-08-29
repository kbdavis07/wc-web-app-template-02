export class AboutComponent extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
        <h1>About Us</h1>
        <p>This is the about page content.</p>
      `;
    }
  }
  
  customElements.define('about-component', AboutComponent);