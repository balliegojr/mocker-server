const extend = require('util')._extend;

class FilterBuilder {
	build(queryString) {
		let response = {}
		if (!queryString){
			return response;
		}

		if (queryString.ordering){
			response.sorting = {};
			queryString.ordering.split(',').forEach(function(fieldFilter) {
				if (fieldFilter[0] === '-')	{
					response.sorting[fieldFilter.substring(1)] = -1;
				} else {
					response.sorting[fieldFilter] = 1;
				}
			});
		}

		if (queryString.skip || queryString.limit) {
			response.pagination = { skip: parseInt(queryString.skip), limit: parseInt(queryString.limit) };
		}

		if (queryString.filtering){
			response.filtering = {};
		}
		
		return response;
	}
}


module.exports = FilterBuilder;