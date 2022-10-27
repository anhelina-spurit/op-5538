import { formatDateToFranceLocal } from '../utils';

const CLASSES = {
  INVISIBLE: 'invisible',
};

function renderClientNumberOnPersonalDetailsTab(clientNumber) {
  const clientNumberPlaceholder = document.querySelector('.account--details__client-number');
  if (clientNumberPlaceholder) clientNumberPlaceholder.textContent = clientNumber;
}

function renderClientNumberOnFidelityTab(clientNumber) {
  const loyaltyNumberPlaceholder = document.querySelector('.points__loyalty-card .text-preview__description');
  if (loyaltyNumberPlaceholder) {
    loyaltyNumberPlaceholder.textContent = loyaltyNumberPlaceholder.textContent.replace('{cardId}', clientNumber);
    loyaltyNumberPlaceholder.parentElement.classList.remove(CLASSES.INVISIBLE);
  }
}

export function renderClientNumber(data) {
  const clientNumber = data.clientNumber;
  renderClientNumberOnPersonalDetailsTab(clientNumber);
  renderClientNumberOnFidelityTab(clientNumber);
}

export function renderDetailsForm(data) {
  const detailsForm = document.getElementById('account--details__form');

  for (const [key, val] of Object.entries(data)) {
    const input = detailsForm.elements[key];
    if (input) input.value = val;
    if(val && key === 'email') input.setAttribute('disabled', '');
  }
}

function renderLoyaltyPointsDiscounts(loyaltyPoints, expiryDate) {
  const loyaltyDiscountsHeading = document.getElementById('loyalty-discounts-heading');
  const loyaltyPointsDescription = document.getElementById('loyalty-discounts-description');
  const loyaltyPointsColumn = document.getElementById('loyalty-discounts-column');
  const discountsCount = Math.floor(loyaltyPoints / 200);

  if (discountsCount > 0 && loyaltyDiscountsHeading && loyaltyPointsDescription) {
    const formattedExpiryDate = formatDateToFranceLocal(new Date(expiryDate.slice(0, 10)));
    loyaltyPointsDescription.textContent = loyaltyPointsDescription.textContent.replace('{date}', formattedExpiryDate);
    loyaltyPointsColumn?.classList.remove(CLASSES.INVISIBLE);
  }
}

function renderLoyaltyPointsCountdown(loyaltyPoints) {
  const missingLoyaltyPointsPlaceholder = document.getElementById('missing-loyalty-points-count');
  const statusBar = document.querySelector('.status-bar__progress');
  const loyaltyPointsPlaceholder = document.getElementById('loyalty-points-count');

  const runningPoints = loyaltyPoints % 200;
  const pointsToDiscount = 200 - runningPoints;

  if (missingLoyaltyPointsPlaceholder && loyaltyPointsPlaceholder && statusBar) {
    loyaltyPointsPlaceholder.textContent = loyaltyPointsPlaceholder.textContent.replace('{points}', loyaltyPoints);
    missingLoyaltyPointsPlaceholder.textContent = missingLoyaltyPointsPlaceholder.textContent.replace(
      '{points}',
      pointsToDiscount,
    );
    loyaltyPointsPlaceholder.classList.remove(CLASSES.INVISIBLE);
    statusBar.style.width = `${(100 / 200) * runningPoints}%`;
  }
}

export function renderLoyaltyPoints(data) {
  const loyaltyPoints = data.loyaltyPoints;
  const expiryDate = data.loyaltyExpiryDate;

  if (loyaltyPoints) renderLoyaltyPointsCountdown(loyaltyPoints);
  if (loyaltyPoints && expiryDate) renderLoyaltyPointsDiscounts(loyaltyPoints, expiryDate);
}

export function renderSubscriptions(data) {
  const subscriptionsForm = document.getElementById('account--subscriptions__form');
  const marketingEmailInput = document.getElementById('input-checkbox-newsletter');
  const marketingSMSInput = document.getElementById('input-checkbox-sms');

  if (data.mobilePhoneNumber) subscriptionsForm.setAttribute('data-mobile-phone', data.mobilePhoneNumber);
  marketingEmailInput.checked = data.marketingEmail === 'true';
  marketingSMSInput.checked = data.marketingSMS === 'true';
}
