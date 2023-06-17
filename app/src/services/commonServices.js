/**
 * Paginate results in the given model collection.
 * @param {Model} model - The Mongoose model representing the collection.
 * @param {number} page - The page number for pagination (default: 1).
 * @param {number} limit - The number of items per page (default: 50).
 * @param {Object} searchQuery - The search criteria object (default: {}).
 * @param {Array} populateFields - The array of field names to populate (default: []).
 * @param {Object} selectFields - The object containing arrays of main and nested fields to select (default: { main: [], nested: {} }).
 * @returns {Object} - An object containing paginated results, page information, and total results count.
 */
exports.paginateResults = async (
    model,
    page = 1,
    limit = 50,
    searchQuery = {},
    populateFields = [],
    selectFields = { main: [], nested: {} }
  ) => {
    const skip = (page - 1) * limit; // Calculate the number of documents to skip
  
    // Construct the query object with search criteria
    let query = model.find(searchQuery);
  
    // Add select fields for the main fields
    const mainFields = selectFields.main;
    if (mainFields.length > 0) {
      query = query.select(mainFields.join(" "));
    }
  
    // Populate the specified fields if provided
    if (populateFields.length > 0) {
      populateFields.forEach((field) => {
        const nestedField = selectFields.nested[field];
        if (nestedField) {
          const select = nestedField || [];
          query = query.populate({
            path: field,
            select: select.join(" "),
          });
        } else {
          query = query.populate(field);
        }
      });
    }
  
    // Fetch the documents with pagination
    const results = await query.skip(skip).limit(limit);
  
    // Count total number of documents
    const totalResults = await model.countDocuments(searchQuery);
  
    return {
      results,
      page,
      limit,
      totalPages: Math.ceil(totalResults / limit),
      totalResults,
    };
  };
  