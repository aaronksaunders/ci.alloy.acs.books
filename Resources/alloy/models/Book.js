exports.definition = {
    config: {
        columns: {
            active: "boolean"
        },
        defaults: {},
        adapter: {
            type: "acs"
        },
        settings: {
            object_name: "book",
            object_method: "Objects"
        }
    },
    extendModel: function(Model) {
        return _.extend(Model.prototype, {}), Model;
    },
    extendCollection: function(Collection) {
        return _.extend(Collection.prototype, {}), Collection;
    }
};

var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

model = Alloy.M("book", exports.definition, []), collection = Alloy.C("book", exports.definition, model), exports.Model = model, exports.Collection = collection;