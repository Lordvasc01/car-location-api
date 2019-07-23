const { defaultItemsInOnePage, defaultSkipItems, cars, availableOrderFields, availableOrderTypes } = require('./constants');
const { isJson } = require('../helper');

const where = (where) => {

	if(!isJson(where)) {
		return [];
	}

	if(where == null) {
		return cars.data;
	}

	const queryFilter = JSON.parse(where);

	let queryFields = {
		isOnTrip: undefined,
		id: undefined,
		locationName: undefined
	}
	
	if(queryFilter.location_name !== undefined) {
		queryFields.locationName = queryFilter.location_name
	};

	if(queryFilter.id !== undefined) {
		queryFields.id = queryFilter.id
	};

	if(queryFilter.is_on_trip !== undefined) {
		queryFields.isOnTrip = queryFilter.is_on_trip
	}

	console.log(queryFields)

	return cars.data.filter(c => 
		(queryFields.locationName ? c['location_name'] == queryFields.locationName : c['location_name'] !== queryFields.locationName) && 
		(queryFields.id ? c['id'] == queryFields.id : c['id'] !== queryFields.id) && 
		((queryFields.isOnTrip == true || queryFields.isOnTrip == false) ? c['is_on_trip'] == queryFields.isOnTrip : c['is_on_trip'] !== queryFields.isOnTrip) 
	);
}

const order = (data, order, type) => {

	if((availableOrderFields.indexOf(order.toLowerCase()) < 0) || (availableOrderTypes.indexOf(type.toLowerCase())) < 0) {
		return false;
	}

	const orderByNonLocation = (input, orderName, orderType) => {
		return input.sort((a, b) => {
		  return orderType === 'asc' ? a[orderName] - b[orderName] : b[orderName] - a[orderName];
		});
	};

	const orderByLocationName = (input, sortType) => {
		return input.sort((a, b) => {
			let locationNameA = a.location_name.toUpperCase(); 
		  	let locationNameB = b.location_name.toUpperCase(); 

		  	if(sortType === 'asc') {
		  		if (locationNameA < locationNameB) {
				    return -1;
				  }
				  if (locationNameA > locationNameB) {
				    return 1;
				  }
		  	} else if(sortType === 'desc') {
		  		if (locationNameA < locationNameB) {
				    return 1;
				  }
				  if (locationNameA > locationNameB) {
				    return -1;
				  }
		  	}
		});
	};

	let result;

	switch(order){
		case 'id':
		case 'is_on_trip':
			result = orderByNonLocation(data, order, type)
			break;

		case 'location_name':
			result = orderByLocationName(data, type);
			break;

		default: 
			result = data;
	}

	return result;
}

const pagination = (data, from, size) => {
	if(from < 0 || size > cars.data.length) {
		return false;
	}
	const skip = from || defaultSkipItems;
	const total = size || defaultItemsInOnePage;

	const paginationData = (data.slice(skip)).slice(0, total);

	return paginationData;
}

module.exports = {
	where,
	order,
	pagination
};