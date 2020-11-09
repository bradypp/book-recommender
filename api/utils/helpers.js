// Catches the async function when there is an error and sends it to the global error handler
exports.catchAsync = asyncFunction => {
  return (req, res, next) => {
    asyncFunction(req, res, next).catch(next);
  };
};

exports.omitKeyValuePairs = (obj, fieldsToOmit) => {
  return fieldsToOmit.reduce(
    (acc, field) => {
      const newData = { ...acc };
      delete newData[field];
      return newData;
    },
    { ...obj },
  );
};

exports.filterObject = (obj, allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
