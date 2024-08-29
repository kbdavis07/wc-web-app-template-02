export class ResumeComponent extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
        <h1>Resume</h1>
        <p>This is where you can find my resume.</p>
      `;
    }
  }
  
  customElements.define('resume-component', ResumeComponent);





