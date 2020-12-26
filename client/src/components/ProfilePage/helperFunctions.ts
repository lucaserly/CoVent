import { Profile } from '../../types/user';

const filterByCriteria = (aList: any, bList: any, criteria: string, property: string): Profile[] => { // eslint-disable-line @typescript-eslint/no-explicit-any
  const res = aList.filter((el: any): boolean => {                                                // eslint-disable-line @typescript-eslint/no-explicit-any
    return el[criteria][0][property] === bList[criteria][0][property];
  })
  return res;
};

// eslint-disable-next-line @typescript-eslint/ban-types
const selectOperation = (el: any, operation: object | string): Profile => { // eslint-disable-line @typescript-eslint/no-explicit-any
  if (typeof operation === 'object') {
    return el.match(operation);
  } else {
    return el[operation];
  }
};

const accessProperty = (el: any, criteria: string): Profile[] => { // eslint-disable-line @typescript-eslint/no-explicit-any
  if (criteria.length > 0) {
    return el[criteria];
  } else {
    return el;
  }
};

// eslint-disable-next-line @typescript-eslint/ban-types
const filterByMultipleCriterias = (aList: any, bList: any, criteria: string, propertyA: string, propertyB: string | object): Profile[] => { // eslint-disable-line @typescript-eslint/no-explicit-any
  const result = [];
  const bElement = accessProperty(bList, criteria);
  for (let i = 0; i < aList.length; i++) {
    let flag;
    for (let a = 0; a < bElement.length; a++) {
      if (Number(selectOperation(bElement[a], propertyB)) === Number(aList[i][propertyA])) {
        flag = true;
        break;
      }
    }
    if (!flag) {
      result.push(aList[i])
    } else {
      flag = false;
    }
  }
  return result;
};



export { filterByCriteria, selectOperation, accessProperty, filterByMultipleCriterias }