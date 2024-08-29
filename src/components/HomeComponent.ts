export class HomeComponent extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
        
       
        <main class="container">
       
         <h1>Welcome to the Home Page</h1>
         <p>This is the home page content.</p>

          <div class="bg-body-tertiary p-5 rounded">
            <h1>Navbar example</h1>
            <p class="lead">This example is a quick exercise to illustrate how fixed to top navbar works. As you scroll, it will remain fixed to the top of your browser’s viewport.</p>
            <a class="btn btn-lg btn-primary" href="../components/navbar/" role="button">View navbar docs &raquo;</a>
          </div>
        </main>

      `;
    }
  }

customElements.define('home-component', HomeComponent);