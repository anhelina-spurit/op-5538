import { getDate, formatDateToFranceLocal } from '../utils';

// TODO add translations
export function renderChildrenListing(data, testMode) {
  const childrenPlaceholder = document.querySelector('.children');
  if(testMode) childrenPlaceholder.querySelectorAll('.child').forEach((child) => {child.remove()});
  const children = data.children;

  if (children.length) {
    children.forEach((child) => {
      const alreadyDisplayedChild = document.querySelector(`.child[data-child-uuid='${child.uuid}']`);
      if (!alreadyDisplayedChild) {
        const childBirthdateParsed = getDate(child.birthDate);
        const childRender = document.querySelector('#child-item-render');
        if (!childRender) {
          return;
        }

        let childNode = document.createElement('div');
        childNode.innerHTML = childRender.innerHTML;

        childNode.className = 'child';
        childNode.setAttribute('data-child-uuid', child.uuid);
        childNode.setAttribute('data-child-name', child.firstName);
        childNode.setAttribute('data-child-sex', child.sex); 
        childNode.setAttribute('data-child-birthdate', child.birthDate);
        childNode.querySelector('.text-preview .text-preview__heading').textContent = child.firstName;
        childNode.querySelector('.text-preview .text-preview__description').textContent = `Né${child.sex.toLowerCase() == 'Female' ? 'e' : ''} le ${formatDateToFranceLocal(childBirthdateParsed)}`;

        childrenPlaceholder.appendChild(childNode);
      };
    });

    childrenPlaceholder.classList.remove('children-placeholder');
  }
}

export function renderEditedChild(data) {
  const child = document.querySelector(`[data-child-uuid="${data.uuid}"]`);
  const childName = child.querySelector('.text-preview .text-preview__heading');

  childName.textContent = data.firstName;
  child.dataset.childName = data.firstName;

  const childBirthdate = child.querySelector('.text-preview .text-preview__description');
  const childBirthdateParsed = getDate(data.birthDate);
  childBirthdate.textContent = `Né${data.sex.toLowerCase() == 'Female' ? 'e' : ''} le ${formatDateToFranceLocal(childBirthdateParsed)}`;
  child.dataset.childBirthdate = data.birthDate;
  child.dataset.childSex = data.sex;
}

function showExistingEditChildForm(modal) {
  modal.classList.add('modal--visible');
  modal.classList.add('modal--active');
  document.body.style.overflow = 'hidden';
}

export function hideEditChildForm() {
  const editModal = document.getElementById('child-edit-modal');
  if (!editModal) {
    return;
  }
  editModal.classList.remove('modal--visible');
  editModal.classList.remove('modal--active');
  editModal.removeAttribute('data-modal-child-quid');
  document.body.style.overflow = 'auto';
}

function createEditChildForm(child, modal) {
  modal.querySelector('[name="name"]').value = child.dataset.childName;
  modal.querySelector(`[name="sex"][value="${child.dataset.childSex}"]`).checked = true;
  const birthDateArray = child.dataset.childBirthdate.split('-');
  modal.querySelector(`[name="birthdate-day"] [value="${birthDateArray[2]}"]`).selected = true;
  modal.querySelector(`[name="birthdate-month"] [value="${birthDateArray[1]}"]`).selected = true;
  modal.querySelector(`[name="birthdate-year"] [value="${birthDateArray[0]}"]`).selected = true;

  modal.querySelectorAll('.feedback').forEach((feedback) => feedback.classList.add('hidden'));
}

export function renderEditChildForm(child) {
  const childUUID = child.dataset.childUuid;
  let editModal = document.getElementById('child-edit-modal');

  if (!editModal) {
    return;
  }

  editModal.setAttribute('data-modal-child-quid', childUUID);
  createEditChildForm(child, editModal);
  showExistingEditChildForm(editModal);
}

export function emptyAddChildForm() {
  const addChildForm = document.getElementById('account--add-child__form');

  addChildForm.querySelector('[name="name"]').value = '';
  addChildForm.querySelector('[name="sex"]:checked').checked = false; 
  addChildForm.querySelector('[name="birthdate-day"]').value = '';
  addChildForm.querySelector('[name="birthdate-month"]').value = '';
  addChildForm.querySelector('[name="birthdate-year"]').value = '';
}
