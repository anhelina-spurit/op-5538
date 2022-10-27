import { clDebug, getRandomDate, getRandomNumber } from "../utils";

const CHILDREN = ['Neo', 'Morpheus', 'Trinity']

export function getMockEditChild(data, childID) {
  const childJSON = JSON.parse(data);
  childJSON.uuid = childID;
  return childJSON;
}

export function getMockAddChild(data) {
 return getMockChildren(JSON.parse(data));
}

export function getMockChildren(extraAddedChildData = null) {
  const randomNumberOfChildren = getRandomNumber(3);

  let output =
    `{
      "children": [`;

  if(extraAddedChildData) {
    const randomUUID = getRandomNumber();
    output +=
    `{
        "uuid": "${randomUUID}",
        "firstName": "${extraAddedChildData.firstName}",
        "birthDate": "${extraAddedChildData.birthDate}",
        "sex": "${extraAddedChildData.sex}"
      }${(randomNumberOfChildren > 0) ? ',' : ''}`;
  }

  for (let i = 0; i < randomNumberOfChildren; i++) {
    const randomUUID = getRandomNumber();
    output +=
    `{
        "uuid": "${randomUUID}",
        "firstName": "${CHILDREN[i]}",
        "birthDate": "${getRandomDate(new Date(2014, 0, 1))}",
        "sex": "${i == 2 ? 'Female' : 'Male'}"
      }${(i < randomNumberOfChildren - 1) ? ',' : ''}`;
  }
  output += `]}`;

  clDebug(true, `*** (getMockFamilyMembers) :: output: ${output}`);

  return JSON.parse(output);
}
