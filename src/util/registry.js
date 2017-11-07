
class Registry {
	constructor(defaultValue, readOnly=false) {
		this._values = Object.create(null); 
		this._defaultValue = defaultValue;
		this._readOnly = readOnly;
	}

	getValues (){
		var values = {};
		for (var value in this._values){
			values[value] = this._values[value];
		}

		return values;
	}

	set(key, value) {
		if ((this._readOnly === true && !Object.prototype.hasOwnProperty.call(this._values, key)) || this._readOnly === false) {
			this._values[key] = value;
		}
	}

	get(key) {
		if (Object.prototype.hasOwnProperty.call(this._values, key)) {
			return this._values[key];
		}

		return this._defaultValue;
	}
}

module.exports = {
	g: new Registry(),
	isolated: (defaultValue, readOnly) => { return new Registry(defaultValue, readOnly); }
}