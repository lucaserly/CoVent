/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Profile } from '../../types/user';

const filterByCondition = (list: any, target: string, property: string, condition: string): Profile[] => {
  return list[target].filter((el: any) => el[property] !== condition)
};

const filterByCriteria = (aList: any, bList: any, criteria: string, property: string): Profile[] => {
  const res = aList.filter((el: any): boolean => {
    return el[criteria][0][property] === bList[criteria][0][property];
  })
  return res;
};

const selectOperation = (el: any, operation: object | string): Profile => {
  if (typeof operation === 'object') {
    return el.match(operation);
  } else {
    return el[operation];
  }
};

const accessProperty = (el: any, criteria: string): Profile[] => {
  if (criteria.length > 0) {
    return el[criteria];
  } else {
    return el;
  }
};

const filterByMultipleCriterias = (aList: any, bList: any, criteria: string, propertyA: string, propertyB: string | object): Profile[] | undefined => {
  const result = [];
  if (bList.id) {
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
  }
};

const firstLetterUpper = (str: string): string => {
  const arr = str.split('')
  arr[0] = arr[0].toUpperCase()
  return arr.join('')
};

export { filterByCriteria, selectOperation, accessProperty, filterByMultipleCriterias, firstLetterUpper, filterByCondition }