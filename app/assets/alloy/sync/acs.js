var STR = require("alloy/string");

function S4() {
	return ((1 + Math.random()) * 65536 | 0).toString(16).substring(1);
}

function guid() {
	return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
}

function InitAdapter(config) {
	Cloud = require("ti.cloud"), Cloud.debug = !0, config.Cloud = Cloud;
}

function Sync(method, model, opts) {

	var object_name = model.config.adapter.collection_name;
	var isCustomObject = model.config.adapter.custom;
	var object_method = isCustomObject ? Cloud['Objects'] : Cloud[STR.ucfirst(object_name)];
	object_name = isCustomObject ? object_name.replace(/s$/i, '') : object_name;

	Ti.API.info("method " + method);
	debugger;

	switch (method) {
		case "create":
			// stick attributes into the params variable
			var params = {};
			// if custom object then set the classname in params variable
			if (isCustomObject === true) {
				params['fields'] = model.toJSON();
				params['classname'] = object_name;
			} else {
				params = model.toJSON();
			}
			object_method.create(params, function(e) {
				if (e.success) {
					model.meta = e.meta;
					opts.success && opts.success(e[object_name][0]), model.trigger("fetch");
					return;
				}
				Ti.API.error(e);
				opts.error && opts.error(e.error && e.message || e);
			});
			break;
		case "read":
			var id_name = object_name.replace(/s+$/, "") + "_id", params = {};
			params[id_name] = model.id = opts.id || model.id;

			if (isCustomObject === true) {
				!opts.data ? opts.data = {} : opts.data;
				opts.data['classname'] = object_name;
				opts.data['id'] = model.id;
			} else {
				id_name = object_name.replace(/s+$/, "") + "_id";
				model.id && (opts.data[id_name] = model.id);
			}

			if (model.id) {
				getObject(model, opts);
			} else if (opts && opts.data && opts.data.q) {
				searchObjects(model, opts);
			} else {
				getObjects(model, opts);
			}
			break;
		case "update":
			Ti.API.info(' updating object with id ' + model.id);

			var opt = {}, params = model.toJSON(), id_name = object_name.replace(/s+$/, "") + "_id";
			if (model.config.adapter.custom === !0) {
				opt.classname = object_name;
				opt.id = model.id;
				opt.fields = JSON.stringify(model.toJSON());
				params = opt;
			} else {
				id_name = object_name.replace(/s+$/, "") + "_id";
				params[id_name] = model.id;
			}
			object_method.update(params, function(e) {
				if (e.success) {
					model.meta = e.meta;
					opts.success && opts.success(e[object_name][0]), model.trigger("fetch");
					return;
				}
				Ti.API.error(e);
				opts.error && opts.error(e.error && e.message || e);
			}), model.trigger("fetch");
			break;
		case "delete":
			var id_name = "";
			var params = {};

			if (model.config.adapter.custom === true) {
				params['classname'] = object_name;
				params['id'] = model.id;
			} else {
				id_name = object_name.replace(/s+$/, "") + "_id";
				params[id_name] = model.id;
			}

			object_method.remove(params, function(e) {
				if (e.success) {
					model.meta = e.meta;
					opts.success && opts.success({}), model.trigger("fetch");
					return;
				}
				Ti.API.error(e);
				opts.error && opts.error(e.error && e.message || e);
			});
	}
}

function getObject(_model, _opts) {
	var object_name = _model.config.adapter.collection_name;
	var isCustomObject = _model.config.adapter.custom;
	var object_method = isCustomObject ? Cloud['Objects'] : Cloud[STR.ucfirst(object_name)];
	object_name = isCustomObject ? object_name.replace(/s$/i, '') : object_name;

	Ti.API.info(" searching for object id " + JSON.stringify(_opts.data));
	object_method.show(_opts.data, function(e) {
		if (e.success) {
			if (_model.id) {
				_model.meta = e.meta;
				_opts.success && _opts.success(e[object_name][0]), _model.trigger("fetch");
				return;
			}
		} else {
			Ti.API.error(e);
			_opts.error && _opts.error(e.error && e.message || e);
		}
	});
}

function getObjects(_model, _opts) {
	var object_name = _model.config.adapter.collection_name;
	var isCustomObject = _model.config.adapter.custom;
	var object_method = isCustomObject ? Cloud['Objects'] : Cloud[STR.ucfirst(object_name)];
	object_name = isCustomObject ? object_name.replace(/s$/i, '') : object_name;

	if (isCustomObject === true) {
		!_opts.data ? _opts.data = {} : _opts.data;
		_opts.data['classname'] = object_name;
	}

	object_method.query((_opts.data || {}), function(e) {
		if (e.success) {
			var retArray = [];
			for (var i in e[object_name]) {
				retArray.push(e[object_name][i]);
			}
			_model.meta = e.meta;
			_opts.success && _opts.success(retArray), _model.trigger("fetch");
			return;
		} else {
			Ti.API.error(e);
			_opts.error && _opts.error(e.error && e.message || e);
		}
	});
}

function searchObjects(_model, _opts) {
	var object_name = _model.config.adapter.collection_name;
	var isCustomObject = _model.config.adapter.custom;
	var object_method = isCustomObject ? Cloud['Objects'] : Cloud[STR.ucfirst(object_name)];
	object_name = isCustomObject ? object_name.replace(/s$/i, '') : object_name;

	if (isCustomObject === true) {
		!_opts.data ? _opts.data = {} : _opts.data;
		_opts.data['classname'] = object_name;
	}

	object_method.search(_opts.data, function(e) {
		if (e.success) {
			if (e[object_name].length !== 0) {
				var retArray = [];
				for (var i in e[object_name]) {
					retArray.push(e[object_name][i]);
				}
				_model.meta = e.meta;
				_opts.success && _opts.success(retArray), _model.trigger("fetch");
				return;
			}
		} else {
			Ti.API.error(e);
			_opts.error && _opts.error(e.error && e.message || e);
		}
	});
}

var Cloud, _ = require("alloy/underscore")._;

module.exports.sync = Sync, module.exports.beforeModelCreate = function(config) {
	return config = config || {}, config.data = {}, InitAdapter(config), config;
}, module.exports.afterModelCreate = function(Model) {
	return Model = Model || {}, Model.prototype.config.Model = Model, Model;
};
