var AppData = function() {
	var _endpoints,
    	_initialCards,
    	_announcements,
        _private;

	_endpoints = {
		starbucksTest: {path:"scripts/starbucksTest.json", verb:"GET"}
	};
    
	_initialCards = [
		{
			"cardNumber":"001",
			"amount":20,
			"bonusPoints":60,
			"expireDate":"2013/12/06"
		},{
			"cardNumber":"002",
			"amount":76,
			"bonusPoints":22,
			"expireDate":"2014/10/16"
		},{
			"cardNumber":"003",
			"amount":104,
			"bonusPoints":56,
			"expireDate":"2014/11/24"
		}
	];
    
	_announcements = [
		{ title: "Mathematics", description: "Math Instruction sites for Beginner through Advanced Math Students.", url: "images/MTBlady.png" },
		{ title: "Biological Sciences", description: "Areas of Study directly related to Biological Studies.", url: "images/MTBman.png" },
		{ title: "Physical Sciences", description: "Primarily areas of Physics and Chemistry Studies.", url: "images/MTBlady.png" },
		{ title: "Computer Science", description: "Computer Programming and related Technologies.", url: "images/MTBman.png" },
		{ title: "Other Educational Sites and Topics", description: "Other Educational sites focused on STEM studies.", url: "images/MTBlady.png" },
		{ title: "", description: ".", url: "" }
	];
    
	_private = {
		load: function(route, options) {
			var path = route.path,
    			verb = route.verb,
    			dfd = new $.Deferred();

			console.log("GETTING", path, verb, options);

			//Return cached data if available (and fresh)
			if (verb === "GET" && _private.checkCache(path) === true) {
				//Return cached data
				dfd.resolve(_private.getCache(path));
			}
			else {
				//Get fresh data
				$.ajax({
					type: verb,
					url: path,
					data: options,
					dataType: "json"
				}).success(function (data, code, xhr) {
					_private.setCache(path, {
						data: data,
						expires: new Date(new Date().getTime() + (15 * 60000)) //+15min
					});
					dfd.resolve(data, code, xhr);
				}).error(function (e, r, m) {
					console.log("ERROR", e, r, m);
					dfd.reject(m);
				});
			}

			return dfd.promise();
		},
        
		checkCache: function(path) {
			var data,
			path = JSON.stringify(path);

			try {
				data = JSON.parse(localStorage.getItem(path));
                
				if (data === null || data.expires <= new Date().getTime()) {
					console.log("CACHE EMPTY", path);
					return false;
				}
			}
			catch (err) {
				console.log("CACHE CHECK ERROR", err);
				return false;
			}

			console.log("CACHE CHECK", true, path);
			return true;
		},
        
		setCache: function(path, data, expires) {
			var cache = {
				data: data,
				expires: expires
			},
			path = JSON.stringify(path);

			//TODO: Serialize JSON object to string
			localStorage.setItem(path, JSON.stringify(cache));

			console.log("CACHE SET", cache, new Date(expires), path);
		},
        
		getCache: function(path) {
			var path = JSON.stringify(path),
			cache = JSON.parse(localStorage.getItem(path));

			console.log("LOADING FROM CACHE", cache, path);

			//TODO: Deserialize JSON string
			return cache.data.data;
		}
	};

	return {
		getStarbucksLocations: function(lat, lng, max) {
            return $.getJSON("data/starbucksTest.json");
		},
        
		getInitialCards: function() {
			return JSON.stringify(_initialCards);
		},
        
		getAnnouncements: function() {
			return _announcements;
		}
	};
}