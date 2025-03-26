import { defineCustomElement } from 'vue';
import BigClassCustomLayout from './App.ce.vue';
const MyVueElement = defineCustomElement(BigClassCustomLayout, { shadowRoot: false });
customElements.define('bigclass-custom-layout', MyVueElement);

TCIC.SDK.instance.setState('TStateBigClassLayout', { mobile: 'custom', customLayoutName: 'bigclass-custom-layout' });