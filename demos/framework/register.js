import Vue from 'vue';

export function registerApp(config) {
  const { component, router, store } = config;
  // vue preset
  const props = {
    render: h => h(component),
  };
  if (router) {
    props.router = router;
  }
  if (store) {
    props.store = store;
  }
  const app = new Vue(props);
  app.$mount('#app');
}
