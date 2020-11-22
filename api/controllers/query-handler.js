import { isEmpty } from 'lodash';

import { getFilterObj, isObject } from '../utils/helpers';

// Example use:
// const user = await new QueryHandler(User.find(), req.params).filter().sort().limit().paginate().query;

class QueryHandler {
  constructor(query, queryObj = {}) {
    // The database query e.g. User.find()
    this.query = query;
    // Object containing query config params e.g. req.params
    this.queryObj = queryObj;
  }

  filter(options) {
    const filterObj = getFilterObj({ ...this.queryObj }, options);

    if (!isEmpty(filterObj)) {
      this.query = this.query.find(filterObj);
    }

    return this;
  }

  sort() {
    if (this.queryObj.sort) {
      // Split sort param by commas and add a space to get sort query fields
      // E.g. localhost:5000/api/book?sort[]=age&sort[]=length (sort ascending by age then length)
      // For descending order, add a - before the field
      const sortBy = isObject(this.queryObj.sort)
        ? this.queryObj.sort
        : [this.queryObj.sort].flat().join(' ');

      this.query = this.query.sort(sortBy);
    } else {
      // If there's no sort param, sort by ratingValue in descending order
      this.query = this.query.sort('-ratingValue');
    }

    return this;
  }

  limitFields() {
    if (this.queryObj.fields) {
      // Limit the fields to query and return from the database
      // E.g. localhost:5000/api/book?field[]=name&field[]=age (only return the name and age)
      const fields = isObject(this.queryObj.fields)
        ? { ...this.queryObj.fields }
        : [this.queryObj.fields].flat().join(' ');

      this.query = this.query.select(fields);
    }

    return this;
  }

  paginate() {
    // To turn string fields into numbers for pagination, limit & page * 1
    const page = this.queryObj.page * 1 || 1;
    const limit = this.queryObj.limit * 1 || 100;

    // Determines what page of data we want to query & how many results per page
    // E.g. localhost:5000/api/book?page=2&limit=10 would return the second 10 results
    const skip = (page - 1) * limit;

    // skip = number of results to skip, limit = number of results to return
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

export default QueryHandler;
