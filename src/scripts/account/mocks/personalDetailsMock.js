import { clDebug, getRandomNumber } from '../utils';

export function getMockPersonalDetails(details) {
  const randomUUID = getRandomNumber();
  const clientNumber = getRandomNumber();
  let JSONDetails;

  if (details) JSONDetails = JSON.parse(details);

  const output =  `
    {
      "id": "${details ? JSONDetails.id : randomUUID}",
      "clientNumber": "${details ? JSONDetails.clientNumber : clientNumber}",
      "civility": "${details ? JSONDetails.civility : 'MRS'}",
      "firstName": "${details ? JSONDetails.firstName : 'myFirstName'}",
      "lastName": "${details ? JSONDetails.lastName : 'myLastName'}",
      "birthDate": "${details ? JSONDetails.birthDate : '2000-12-31'}",
      "email":  "${details ? JSONDetails.email : 'test@the-oz.com'}",
      "zipCode": "${details ? JSONDetails.zipCode : '75015'}",
      "city": "${details ? JSONDetails.city : 'Paris'}",
      "address1": "${details ? JSONDetails.address1 : 'Rue des rosignols'}",
      "address2": "${details ? JSONDetails.address2 : '3 ieme'}",
      "mobilePhoneNumber": "${details ? JSONDetails.mobilePhoneNumber : '0732456433'}",
      "marketingSMS": "${details ? JSONDetails.marketingSMS : 'false'}",
      "marketingEmail": "${details ? JSONDetails.marketingEmail : 'true'}"
    }
  `;

  clDebug(true, `*** (getMockPersonalDetails) :: output: ${output}`);

  return JSON.parse(output);
}
