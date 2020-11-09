import queryString from 'query-string';
import { omit } from 'lodash';

// queryString.parse('arr=1,2,3', {arrayFormat: 'comma'});
// { arr: ['1', '2', '3'] }

export const queryStringToObject = (str, options = {}) =>
  queryString.parse(str, {
    arrayFormat: 'comma',
    skipNull: true,
    skipEmptyString: true,
    ...options,
  });

export const objectToQueryString = (obj, options = {}) =>
  queryString.stringify(obj, {
    arrayFormat: 'comma',
    skipNull: true,
    skipEmptyString: true,
    ...options,
  });

export const omitFromQueryString = (str, keys) =>
  objectToQueryString(omit(queryStringToObject(str), keys));

export const addToQueryString = (str, fields) =>
  objectToQueryString({
    ...queryStringToObject(str),
    ...fields,
  });
