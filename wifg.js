var Movie = Backbone.Model.extend({
	defaults:{
		movie_title: 'undefined',
		movie_poster: 'undefined',
		critics_score: 0,
		audience_score: 0,
	}
});

var Suggestion = Backbone.Model.extend({
	defaults:{
		movie_title: '',
		movie_year: 1900,
		rt_id: 0
	}
});

var MovieSuggestions = Backbone.Collection.extend({
	model: Suggestion,
});

var AppView = Backbone.View.extend({
	el: '#appview',
	events:{
		'click .searchbtn': 'search',
		'keyup :input' : 'typeAhead',
		'click #suggestwrap li' : 'pickMovie'
	},
	initialize: function(){
		console.log('init');
		

		this.render();
	},
	render: function(){
		console.log('render');

	},
	search: function(){
		var searchUrl = 'http://api.rottentomatoes.com/api/public/v1.0/movies.json?apikey=fw8ehsfytpv4t2hvsx2tddxy&q=';
		var query = this.$el.find('#searchbox').val();


		 $.ajax({
		    url: searchUrl+query+'&page_limit=6',
		    dataType: "jsonp",
		    success: function(data){
		    	console.log(data);
		    }
		  });

	

		console.log(searchUrl+query);
	},
	typeAhead: function(e){
		var thisTemplate = _.template($('#suggestions').html());

		var that = this;
		var searchUrl = 'http://api.rottentomatoes.com/api/public/v1.0/movies.json?apikey=fw8ehsfytpv4t2hvsx2tddxy&q=';
		var query = this.$el.find('#searchbox').val();

		var thisSearchCollection = new MovieSuggestions();

		setTimeout(function(){
			$.ajax({
			    url: searchUrl+query+'&page_limit=6',
			    dataType: "jsonp",
			    success: function(data){
			    	
			      	_.each(data.movies, function(mov){
			    		thisSearchCollection.add({'movie_title':mov.title, 'movie_year':mov.year});
						$('#suggestwrap').append(thisTemplate({'movie_title':mov.title, 'movie_year':mov.year, 'rt_id':mov.id}));
						console.log(mov);
			    	});
			    }

		  	});
		},500);
	},
	pickMovie: function(e){
		var selectedMovie = e.target.attributes[0].value;
		var thisTemplate = _.template($('#fullmovie').html());

		$.ajax({
		    url: 'http://api.rottentomatoes.com/api/public/v1.0/movies/'+selectedMovie+'.json?apikey=fw8ehsfytpv4t2hvsx2tddxy',
		    dataType: "jsonp",
		    success: function(data){
		    	$('#movieview').html(thisTemplate({
		    		'movie_title': data.title,
		    		'movie_poster': data.posters.original,
		    		'critics_score':data.ratings.critics_score,
		    		'audience_score':data.ratings.audience_score
		    	}));
		    	$('#suggestwrap').html('');
		    }
		  });
		
	}
});





var run = new AppView();

