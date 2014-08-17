// Function to keep a Ti.TableView in sync with Backbone Model.
$.table.updateContent = function(collection) {
	var rows = [];
	for (var i = 0; i < collection.length; i++) {
		var model = collection.at(i).attributes, title = "";
		for (var key in model) {
			if (key !== "id") {
				title += model[key] + "  "
			}
		}
		rows.push(Ti.UI.createTableViewRow({
			"title" : title
		}));
	}
	this.setData(rows);
};

function do_the_magic() {
	// Now let's create a Backbone collection that will hold our models,
	// the classes that represent our model have been generated automatically
	// as Alloy components. Use new on the component to create the model or
	// collection.
	var books = Alloy.createCollection('Book');

	// You can bind any Backbone event to models or collections but fetch is convenient because
	// fetch occurs when the persistent store is sync'd to the local Backbone server.
	books.on("fetch", function() {
		$.table.updateContent(books);
	});

	// Fetch will load models from persistent storage, sync'ing Backbone and persistent store.
	books.fetch();

	// Now we can add items to the model.
	var book = Alloy.createModel('Book', {
		book : "Jungle Book",
		author : "Kipling"
	});
	books.add(book);

	// Use Backbone shortcut to create a model and add to collection in single step. Does the same
	// thing as the creating a new model and then adding it to the collection.
	books.add({
		book : "War and Peace",
		author : "Tolstoy"
	});

	// Add will add models to local Backbone server but save triggers the CRUD create operation
	// causing the model to get added to the persistent store. During create an id is added to the
	// model signaling that the model has been persisted and no longer in the new state.
	books.forEach(function(model) {
		model.save();
	});

	// UPDATE - update the model save here triggers the CRUD update operation
	book.save({
		author : "R Kipling"
	});

	// Okay time to show the results. Remember this sync's local Backbone server with persistent store.
	books.fetch();

	// DELETE - destroy triggers the CRUD delete operation
	for ( i = books.length - 1; i >= 0; i--) {
		var model = books.at(i);
		//model.destroy();
	};

	aUser.destroy();
}

//
// CREATE THE USER
//
var options = {
	success : function(_m, _r) {
		Ti.API.info(' SUCCESS ' + JSON.stringify(_m));
		Ti.API.info(' model stringified ' + _m.get("username"));

		Ti.API.info(' stored session ' + _m.retrieveStoredSession());

		// do_the_magic();

		// Create a book
		var book = Alloy.createModel('Book', {
			book : "Birth of A Nation",
			author : "Saunders"
		});

		// save a book
		book.save({}, {
			success : function() {

				// update the book
				book.save({
					author : "R Kipling"
				}, {
					success : function() {
						debugger;
					},
					error : function() {
						debugger;
					}
				});
			},
			error : function() {

			}
		});
	},
	error : function(_m, _e) {
		Ti.API.info(' ERROR ' + JSON.stringify(_e));

		if (_e.indexOf("Username is already taken") !== -1) {
			loginUser();
		}

	}
};

function createUser() {
	var aUser = Alloy.createModel('User', {
		username : "testuser",
		password : "password",
		password_confirmation : "password",
		first_name : "Aaron",
		last_name : "Saunders"
	});
	aUser.save({}, options);
}

function loginUser() {
	var aUser = Alloy.createModel('User');
	aUser.login("testuser", "password", options);
}

$.index.open();

createUser();
