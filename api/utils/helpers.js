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

export const queryStringToFilterObj = (queryObj, ...additionalExcludedFilterParams) => {
  ['page', 'sort', 'limit', 'fields', ...additionalExcludedFilterParams].forEach(
    el => delete queryObj[el],
  );
  let queryStr = JSON.stringify(queryObj);

  // Allow filtering by gte|gt|lte|lt if they exist in queryParams by adding the mongodb $ operator
  // E.g. localhost:5000/api/user?age[gte]=18 (filter for age > 18)
  queryStr = queryStr.replace(
    /\b(gte|gt|lte|lt|all|in|regex|allregex|inregex)\b/g,
    match => `$${match}`,
  );

  const newQueryObj = JSON.parse(queryStr);

  Object.keys(newQueryObj).forEach(a => {
    if (newQueryObj[a].$regex) {
      newQueryObj[a].$regex = new RegExp(newQueryObj[a].$regex, 'i');
    }

    ['$gte', '$gt', '$lte', '$lt'].forEach(b => {
      if (newQueryObj[a][b]) {
        newQueryObj[a][b] = newQueryObj[a][b] * 1;
      }
    });

    // Turns any $in or $all queries into an array of regular expressions
    // E.g. localhost:5000/api/profile?skills[in]=html,css becomes {skills: { $all : [/html/i, /css/i]}} as required
    Object.keys(newQueryObj[a]).forEach(b => {
      if (b === '$allregex') {
        newQueryObj[a].$all = newQueryObj[a][b].map(c => new RegExp(c, 'i'));
        delete newQueryObj[a][b];
      }
      if (b === '$inregex') {
        newQueryObj[a].$in = newQueryObj[a][b].map(c => new RegExp(c, 'i'));
        delete newQueryObj[a][b];
      }
    });
  });
  return newQueryObj;
};
