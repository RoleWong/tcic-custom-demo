import { defineCustomElement } from 'vue';
import TeacherCheckInBtn from './TeacherCheckInBtn.ce.vue';
import StudentModal from './StudentModal.ce.vue';
const TeacherCheckInBtnEl = defineCustomElement(TeacherCheckInBtn, { shadowRoot: false });
customElements.define('teacher-checkin-btn', TeacherCheckInBtnEl);
const StudentModalEl = defineCustomElement(StudentModal, { shadowRoot: false });
customElements.define('student-modal', StudentModalEl);

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