import { defineCustomElement } from 'vue';
import App from './App.ce.vue';

const MyVueElement = defineCustomElement(App);
customElements.define('custom-courseware-tab', MyVueElement);
TCIC.SDK.instance.promiseState('TStateComponentLoaded', true).then(() => {
  console.log('document component', 'setState');
  TCIC.SDK.instance.setState('TStateDocCustom', {customTab: {
    element: 'custom-courseware-tab', // 点击 tab时要展示的 custom element
    name: '其他课件' // tab title name
  }});
});