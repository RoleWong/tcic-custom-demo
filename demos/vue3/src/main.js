import { defineCustomElement } from 'vue';
import App from './App.ce.vue';

const MyVueElement = defineCustomElement(App);

// 不能修改元素名字
customElements.define('interact-reminder-component-teacher-tip', MyVueElement)

const myVueElement = document.createElement('interact-reminder-component-teacher-tip');
// document.body.appendChild(myVueElement);
TCIC.SDK.instance.promiseState('TStateComponentLoaded', true).then(() => {
  const timeTool = TCIC.SDK.instance.getComponent('interact-reminder-component');
  timeTool.setAttribute('custom', 'interact-reminder-component-teacher-tip');
});