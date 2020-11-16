// Catches the async function when there is an error and sends it to the global error handler
export const catchAsync = asyncFunction => {
  return (req, res, next) => {
    asyncFunction(req, res, next).catch(next);
  };
};

export const omitKeyValuePairs = (obj, fieldsToOmit) => {
  return fieldsToOmit.reduce(
    (acc, field) => {
      const newData = { ...acc };
      delete newData[field];
      return newData;
    },
    { ...obj },
  );
};

export const filterObject = (obj, allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

export const isString = value => typeof value === 'string' || value instanceof String;
export const isNumber = value => typeof value === 'number' && isFinite(value);

export const isArray = value => Array.isArray(value);

export const isObject = value => value && typeof value === 'object' && value.constructor === Object;

export const getFilterObj = (queryObj, excludedFilterFields = [], isFilterObjPrepared = false) => {
  ['page', 'sort', 'limit', 'fields', ...excludedFilterFields].forEach(el => delete queryObj[el]);

  if (isFilterObjPrepared) return queryObj;
  let queryStr = JSON.stringify(queryObj);

  // Allow filtering by gte|gt|lte|lt if they exist in queryParams by adding the mongodb $ operator
  // E.g. localhost:5000/api/user?age[gte]=18 (filter for age > 18)
  queryStr = queryStr.replace(
    /\b(gte|gt|lte|lt|all|in|regex|allregex|inregex)\b/g,
    match => `$${match}`,
  );

  const filterObj = JSON.parse(queryStr);

  Object.keys(filterObj).forEach(a => {
    if (filterObj[a].$regex) {
      filterObj[a].$regex = new RegExp(filterObj[a].$regex, 'i');
    }

    ['$gte', '$gt', '$lte', '$lt'].forEach(b => {
      if (filterObj[a][b]) {
        filterObj[a][b] = filterObj[a][b] * 1;
      }
    });

    // Turns any $in or $all queries into an array of regular expressions
    // E.g. localhost:5000/api/profile?skills[in]=html,css becomes {skills: { $all : [/html/i, /css/i]}} as required
    Object.keys(filterObj[a]).forEach(b => {
      if (b === '$allregex') {
        filterObj[a].$all = [filterObj[a][b]].flat().map(c => new RegExp(c, 'i'));
        delete filterObj[a][b];
      }
      if (b === '$inregex') {
        filterObj[a].$in = [filterObj[a][b]].flat().map(c => new RegExp(c, 'i'));
        delete filterObj[a][b];
      }
    });
  });

  return filterObj;
};
