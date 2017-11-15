const extend = require('util')._extend;


const operators = {
	'eq': '=',

}

class FilterBuilder {
	build(queryString) {
		let response = {}
		if (!queryString){
			return response;
		}

		if (queryString.ordering){
			response.sorting = {};
			queryString.ordering.split(',').forEach((fieldFilter) => {
				if (fieldFilter[0] === '-')	{
					response.sorting[fieldFilter.substring(1)] = -1;
				} else {
					response.sorting[fieldFilter] = 1;
				}
			});
		}

		if (queryString.skip || queryString.limit) {
			response.pagination = { skip: parseInt(queryString.skip || 0), limit: parseInt(queryString.limit || 0) };
		}

		if (queryString.filtering){
			response.filtering = JSON.parse(queryString.filtering);
		}

		return response;
	}
}


module.exports = FilterBuilder;