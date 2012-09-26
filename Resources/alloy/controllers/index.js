function Controller() {
    function do_the_magic() {
        var books = Alloy.createCollection("Book");
        books.on("fetch", function() {
            $.table.updateContent(books);
        }), books.fetch();
        var book = Alloy.createModel("Book", {
            book: "Jungle Book",
            author: "Kipling"
        });
        books.add(book), books.add({
            book: "War and Peace",
            author: "Tolstoy"
        }), books.forEach(function(model) {
            model.save();
        }), book.save({
            author: "R Kipling"
        }), books.fetch();
        for (i = books.length - 1; i >= 0; i--) {
            var model = books.at(i);
            model.destroy();
        }
        aUser.destroy();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    var $ = this, exports = {};
    $.__views.index = A$(Ti.UI.createWindow({
        backgroundColor: "white",
        layout: "vertical",
        id: "index"
    }), "Window", null), $.addTopLevelView($.__views.index);
    var __alloyId1 = [];
    $.__views.table = A$(Ti.UI.createTableView({
        data: __alloyId1,
        id: "table"
    }), "TableView", $.__views.index), $.__views.index.add($.__views.table), _.extend($, $.__views), $.table.updateContent = function(collection) {
        var rows = [];
        for (var i = 0; i < collection.length; i++) {
            var model = collection.at(i).attributes, title = "";
            for (var key in model) key !== "id" && (title += model[key] + "  ");
            rows.push(Ti.UI.createTableViewRow({
                title: title
            }));
        }
        this.setData(rows);
    };
    var aUser = Alloy.createModel("User", {
        username: "testuser",
        password: "password",
        password_confirmation: "password",
        first_name: "Aaron",
        last_name: "Saunders"
    });
    aUser.save({}, {
        success: function(_d) {
            Ti.API.info(" SUCCESS " + JSON.stringify(_d)), Ti.API.info(" model stringified " + _d.get("username")), Ti.API.info(" stored session " + _d.retrieveStoredSession()), do_the_magic();
        },
        error: function(_e) {
            Ti.API.info(" ERROR " + JSON.stringify(_e)), do_the_magic();
        }
    }), $.index.open(), _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, A$ = Alloy.A;

module.exports = Controller;