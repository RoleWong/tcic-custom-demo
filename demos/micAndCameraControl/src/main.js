import { defineCustomElement } from 'vue';
import TeacherCheckInBtn from './Speaker.vue';
import StudentModal from './Camera.vue';
import Speaker from './Speaker.vue';
import Camera from './Camera.vue';
const SpeakerBtnEl = defineCustomElement(Speaker, { shadowRoot: false });
customElements.define('speaker-btn', SpeakerBtnEl);
const CameraBtnlEl = defineCustomElement(Camera, { shadowRoot: false });
customElements.define('camera-btn', CameraBtnlEl);

TCIC.SDK.instance.promiseState('TStateComponentLoaded', true).then(() => {
  if (TCIC.SDK.instance.isTeacher()) {
    const menuArea = document.querySelector('.header-component .header__sub-operation');
    if (menuArea) {
      const checkInBtn = document.createElement('teacher-checkin-btn');
      menuArea.prepend(checkInBtn);
    }
  } else if (TCIC.SDK.instance.isStudent()) {
    document.body.appendChild(document.createElement('student-modal'));
  }
});