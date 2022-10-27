import { addChildAndGetFeedback, editChildAndGetFeedback, getChildrenAndPopulate, removeChildAndGetFeedback  } from './api/clientAPI';
import { clDebug, showErrorFeedback, showSuccessFeedback } from './utils';
import { emptyAddChildForm, hideEditChildForm, renderChildrenListing, renderEditChildForm, renderEditedChild } from './ui/childrenRendering';

const EDIT_INITIALISED_CLASS = 'edit-init';

/************************
UTILS
************************/

function getChildFormData(form, childUuid) {
  return {
    uuid: childUuid,
    firstName: form.elements['name'].value,
    birthDate: `${form.elements['birthdate-year'].value}-${form.elements['birthdate-month'].value}-${form.elements['birthdate-day'].value}`,
    sex: form.querySelector('[name="sex"]:checked').value,
  }
}

/************************
FEEDBACK FUNCTIONS
************************/

function displayFeedbackChildEdited(editedChildUUID, data) {
  const editedChildData = data.children?.find((child) => child.uuid === editedChildUUID);
  if (editedChildData) {
    renderEditedChild(editedChildData);
    hideEditChildForm();
  } else {
    const formFeedback = document.querySelector(`[data-modal-child-quid="${editedChildData.uuid}"] #account--edit-child__form .feedback`);
    showErrorFeedback(formFeedback);
  }
}

function displayFeedbackChildDeleted(childUuid) {
  const deletedChild = document.querySelector(`[data-child-uuid="${childUuid}"]`);
  deletedChild.remove();
}

function displayFeedbackChildAdded(testMode, data) {
  const formFeedback = document.querySelector('#account--add-child__form .feedback');

  if (data) {
    initChildrenListingAndEditing(testMode, data);
    showSuccessFeedback(formFeedback);
    emptyAddChildForm();
  } else {
    showErrorFeedback(formFeedback);
  }
}


/************************
CALLBACKS
************************/

function initChildrenListingAndEditing(testMode = false, data) {
  renderChildrenListing(data, testMode);
  initEditChildren(testMode);
}

function initEditChildren(testMode) {
  const children = document.querySelectorAll(`.child`);

  children.forEach((child) => {
    if (child.classList.contains(EDIT_INITIALISED_CLASS)) {
      return;
    }
    // Init update child
    const updateButton = child.querySelector('.child--update');
    updateButton.addEventListener('click', () => {
      const child = updateButton.closest('.child');
      renderEditChildForm(child);
    });

    // Init delete child
    const deleteButton = child.querySelector('.child--delete');
    deleteButton.addEventListener('click', () => {
      const child = deleteButton.closest('.child');
      const childUuid = child.dataset.childUuid;
      removeChildAndGetFeedback(testMode, childUuid, displayFeedbackChildDeleted.bind(this, childUuid));
    });
    child.classList.add(EDIT_INITIALISED_CLASS);
  });
}

/************************
INITIALISATION
************************/

function listChildren(testMode) {
  getChildrenAndPopulate(testMode, initChildrenListingAndEditing.bind(null, testMode));
}

function initAddChild(testMode) {
  const addChildForm = document.querySelector('#account--add-child__form');

  addChildForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const childData = getChildFormData(addChildForm);
    clDebug(testMode, `*** (addChild) :: childData: ${JSON.stringify(childData)}`);
    addChildAndGetFeedback(testMode, displayFeedbackChildAdded.bind(null, testMode), JSON.stringify(childData));
  });
}

function initEditModalListeners (testMode) {
  const editChildModal = document.getElementById('child-edit-modal'),
        editChildForm = editChildModal?.querySelector('#account--edit-child__form'),
        closeModalButton = editChildModal?.querySelector('[data-modal-close]');

  if (!editChildModal) {
    return;
  }

  closeModalButton.addEventListener('click', hideEditChildForm);

  editChildForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const childUuid = editChildModal.getAttribute('data-modal-child-quid'),
          childData = getChildFormData(e.target, childUuid);

    clDebug(testMode, `*** (initEditChildFormSubmit) :: data: ${JSON.stringify(childData)}`);
    editChildAndGetFeedback(
      testMode,
      childUuid,
      displayFeedbackChildEdited.bind(this, childUuid),
      JSON.stringify(childData),
    );
  });
}

/************************
ENTRY POINT
************************/

export function initFamilyTab(testMode) {
  listChildren(testMode);
  initAddChild(testMode);
  initEditModalListeners(testMode);
}
