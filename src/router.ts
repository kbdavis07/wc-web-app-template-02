import { SimplrRouter, SimplrRouterOptions } from "@simplr-wc/router";

const routerOptions: SimplrRouterOptions = {
  routes: [
  {
    name: 'home',
    path: '/',
    component: 'home-component',
    import: () => import("./components/HomeComponent.js"),
  },
  {
    name: 'about',
    path: '/about',
    component: 'about-component',
    import: () => import("./components/AboutComponent.js"),
  },
  {
    name: 'resume',
    path: '/resume',
    component: 'resume-component',
    import: () => import("./components/ResumeComponent.js"),
  },

],
transitionSpeed: 50,
};

const router = new SimplrRouter(routerOptions);
router.init();