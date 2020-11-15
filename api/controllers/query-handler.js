import { queryStringToFilterObj } from '../utils/helpers';

// Example use:
// const user = await new QueryHandler(User.find(), req.params).filter().sort().limit().paginate().query;

class QueryHandler {
  constructor(query, queryParams = {}) {
    // The database query e.g. User.find()
    this.query = query;
    // Object containing query config params e.g. req.params
    this.queryParams = queryParams;
  }

  filter(...additionalExcludedFilterParams) {
    const queryObj = queryStringToFilterObj({
      ...this.queryParams,
      ...additionalExcludedFilterParams,
    });
    this.query = this.query.find(queryObj);
    return this;
  }

  sort() {
    if (this.queryParams.sort) {
      // Split sort param by commas and add a space to get sort query fields
      // E.g. localhost:5000/api/user?sort=age,length (sort ascending by age then length)
      // For descending order, add a - before the field e.g. localhost:5000/api/user?sort=-age,-length
      const sortBy = [this.queryParams.sort].flat().join(' ');

      this.query = this.query.sort(sortBy);
    } else {
      // If there's no sort param, sort by created_at date in descending order
      this.query = this.query.sort('-created_at');
    }

    return this;
  }

  limitFields() {
    if (this.queryParams.fields) {
      // Limit the fields to query and return from the database
      // E.g. localhost:5000/api/user?field=name,age (only return the name and age)
      const fields = [this.queryParams.fields, '-__v'].flat().join(' ');
      // Remove the fields & the mongodb field __v
      this.query = this.query.select(`${fields}`);
    }

    return this;
  }

  paginate() {
    // To turn string fields into numbers for pagination, limit & page * 1
    const page = this.queryParams.page * 1 || 1;
    const limit = this.queryParams.limit * 1 || 100;

    // Determines what page of data we want to query & how many results per page
    // E.g. localhost:5000/api/page=2&limit=10 would return the second 10 results
    const skip = (page - 1) * limit;

    // skip = number of results to skip, limit = number of results to return
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

export default QueryHandler;
