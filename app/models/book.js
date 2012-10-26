exports.definition = {

    config : {
        "columns" : {
            "active" : "boolean"
        },
        "defaults" : {},
        "adapter" : {
            "type" : "acs",
            "collection_name" : "books",
            "custom" : true
        },

    },

    extendModel : function(Model) {
        _.extend(Model.prototype, {

        });
        // end extend

        return Model;
    },

    extendCollection : function(Collection) {
        _.extend(Collection.prototype, {

        });
        // end extend

        return Collection;
    }
}