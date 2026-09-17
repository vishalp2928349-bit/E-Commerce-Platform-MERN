// Reusable query builder for search, filtering, sorting, and pagination on the Product model.
class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  search() {
    if (this.queryString.keyword) {
      this.query = this.query.find({
        $text: { $search: this.queryString.keyword },
      });
    }
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryString };
    const removeFields = ["keyword", "page", "limit", "sort"];
    removeFields.forEach((field) => delete queryCopy[field]);

    const filters = {};
    if (queryCopy.category) filters.category = queryCopy.category;
    if (queryCopy.brand) filters.brand = queryCopy.brand;
    if (queryCopy.availability === "true") filters.stock = { $gt: 0 };
    if (queryCopy.availability === "false") filters.stock = { $eq: 0 };
    if (queryCopy.rating) filters.rating = { $gte: Number(queryCopy.rating) };

    if (queryCopy.minPrice || queryCopy.maxPrice) {
      filters.price = {};
      if (queryCopy.minPrice) filters.price.$gte = Number(queryCopy.minPrice);
      if (queryCopy.maxPrice) filters.price.$lte = Number(queryCopy.maxPrice);
    }

    this.query = this.query.find(filters);
    return this;
  }

  sort() {
    const sortMap = {
      newest: "-createdAt",
      "price-low": "price",
      "price-high": "-price",
      "top-rated": "-rating",
      "best-selling": "-numReviews",
    };
    const sortBy = sortMap[this.queryString.sort] || "-createdAt";
    this.query = this.query.sort(sortBy);
    return this;
  }

  paginate() {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 12;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

export default ApiFeatures;
