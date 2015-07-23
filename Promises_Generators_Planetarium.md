# Workshop steps

1. Install Node.
1. Create initial package.json: `npm init`.
1. Create src/ and build/.
1. Add src/index.js: `cd src && touch index.js`.
1. Put in some random js (e.g `console.log('Hello World');`).
1. Webpack install, with config file but NO loaders. [**](#webpack-installation)
1. Try it by running `webpack --progress --colors` and then `node build/bundle.js`.
1. Add index.html. **
1. Add webpack-dev-server and make it watch for changes. **
1. Add some ES6 code, with a for-of loop for an iterator. **
1. Add babel-loader to the Webpack configuration. **
1. Add generator examples. **
1. Add jQuery. **
1. Add Handlebars. **
1. Add API call to OMDB. **
1. Make API call into a Promise. **
1. Add another API call. **
1. Explain how a generator could be fed a promise.
1. Introduce Co.
1. Use Co everywhere.


# Webpack Installation
*[(back to top)](#workshop-steps)

1. `npm install webpack -g`
1. `npm install webpack-dev-server -g`
1. Go to project root folder
1. `touch webpack.config.js`
1. Insert the content below:

```
module.exports = {
	entry: './src/index.js',
	output: {
		path: __dirname + '/build/',
		filename: 'bundle.js'
	},
	devtool: 'source-map'
};
```



# Index.html (part 1)
*[(back to top)](#workshop-steps)

1. `cd build`
1. `touch index.html`
1. Add the following content:

```
<!DOCTYPE html>
<html>
<head lang="en">
  <meta charset="UTF-8">
  <title>Test application</title>
</head>
<body>
  <script src="bundle.js"></script>
</body>
</html>
```



# Webpack-dev-server Setup
*[(back to top)](#workshop-steps)

1. `npm install webpack-dev-server --save-dev`
1. Add the following to **package.json**:
```
  "scripts": {
    "build": "webpack --progress --colors",
    "start": "webpack-dev-server --progress --colors --content-base build"
  }
```
1. `npm start`
1. In your browser, go to **localhost:8080**.



# ES6 for-of example
*[(back to top)](#workshop-steps)

```
var numbers = [5, 27, 923, 17, 923414, 823417];

for (var number of numbers) {
	if (number % 2 === 0) {
		console.log('Found the first even number: ' + number);
		break;
	}
} 
```



# Webpack babel-loader
*[(back to top)](#workshop-steps)

1. `npm install babel-core --save-dev`
1. `npm install babel-loader --save-dev`
1. Inside of `webpack.config.js`, add `var path = require('path');`.
1. Add the following to `webpack.config.js`, inside of the `module.exports` object

```
	module: {
		loaders: [
			{
				test: /\.js$/,
				include: path.resolve(__dirname, 'src'),
				loader: 'babel'
			}
		]
	}
```



# Generator examples
*[(back to top)](#workshop-steps)

1. Copy **node_modules/babel-core/browser-polyfill.min.js** to a new **build/libs** folder.
1. In **index.html**, add `<script src="libs/browser-polyfill.min.js"></script>` BEFORE loading bundle.js.
1. Add the following content to index.js:

```
function* quips(name) {
  	yield 'hello ' + name + '!';
  	yield 'i hope you are enjoying the blog posts';
  	if (name.startsWith("X")) {
  		yield "it's cool how your name starts with X, " + name;
  	}
  	yield 'see you later!';
}

for (var msg of quips('Xavier')) {
	console.log(msg);
}



function* mathExpert(initNum) {
	console.log('initNum', initNum);
	
	var num = yield Math.pow(initNum, 3);
	console.log('num', num);
	
	num = yield Math.floor(Math.log(num) * Math.sqrt(num));
	console.log('num', num);
	
	yield Math.floor(Math.cos(num) * Math.sqrt(num));
}

// Going to do a bunch of calculations, with all the "difficult" calculations being
// sent to our mathExpert generator
var a = 8;
var iter = mathExpert(a);
var response = iter.next();  // response = { value: 512, done: false }

while (!response.done) {
	a = response.value;
	
	console.log('a before addition', a);
	a += Math.floor(Math.random() * 10) + 1;   // adds a random number between 1 and 10
	console.log('a after addition', a);
	
	response = iter.next(a); 
}

// at this point, response = { value: undefined, done: true }

console.log('final a', a);
```



# Install jQuery
*[(back to top)](#workshop-steps)

1. Go to https://jquery.com/download/.
1. Download **jQuery.min.js** inside the **build/libs/** folder.
1. Add a `<script>` element to load it in your **index.html**.



# Handlebars setup
*[(back to top)](#workshop-steps)

1. Create the following Handlebars file **src/templates/content.hbs**:
```
<input type="text" placeholder="search here"/>

<div class="results">
</div>
```
1. Create the following Handlebars file **src/templates/results.hbs**:
```
{{#if searching}}
	<p>Loading...</p>
{{/if}}
{{#if searchFinished}}
	<p>Search Finished.</p>	
{{/if}}
{#if error}}
	<p>A search error occured: {{errorMsg}}</p>
{{/if}}
```
1. `npm install handlebars --save-dev`
1. `npm install handlebars-loader --save-dev`.
1. Add the following to **webpack.config.js** loaders section:
```
			{
				test: /\.hbs$/,
				include: path.resolve(__dirname, 'src'),
				loader: 'handlebars-loader'
			}
```
1. At the top of `index.js`, add the following:
```
import mainTemplate from './templates/content.hbs';
import resultsTemplate from './templates/results.hbs';

$('body').html(mainTemplate());
$('.search-field').keypress(searchHandler);


function renderResults(model) {
  $('.results').html(resultsTemplate(model));
}


function searchHandler (event) {
  if (event.which !== 13) {
    return;
  }

  var query = $(this).val();
  if (!query) {
    renderResults({});
  }

  renderResults({searching: true});
  setTimeout(function () {
    renderResults({searchFinished: true});
  }, 1500);
}
```



# API Call to OMDB

1. Add the following function inside of **index.js**:
```
// Based on https://mathiasbynens.be/notes/xhr-responsetype-json
function getJSON (url, params, callback) {
  var xhr = new XMLHttpRequest();
  
  xhr.onload = function() {
    var status = xhr.status;
    if (status == 200) {
      callback && callback(null, xhr.response);
    } else {
      callback && callback('status response ' + status);
    }
  };
  xhr.onerror = function(e) {
    callback(e.target.status);
  }
  
  xhr.open('get', url + '?' + $.param(params), true);
  xhr.responseType = 'json';
  xhr.send();
};
```
1. Remove the `setTimeout` in searchHandler() and replace it with:
```
  getJSON('http://www.omdbapi.com', {
    t: query,
    plot: 'full',
    r: 'json',
    tomatoes: true
  }, function (err, response) {
    if (err) {
      renderResults({error: true, errorMsg: err});
      return;
    }

    if (response.Poster === 'N/A') delete response.Poster;
    renderResults({movieResult: response, searchFinished: true});
  });
```
1. Add the following in `results.hbs`, above the searchFinished block:
```
{{#if movieResult}}
	{{#if movieResult.error}}
		<p>{{movieResult.error}}</p>
	{{else}}
		{{#with movieResult}}
		{{#if Poster}}
		<p><img src="{{Poster}}" alt="movie poster"></p>
		{{/if}}
		<p>movie search result: <strong>{{Title}}</strong></p>
		<p>{{Plot}}</p>
		<ul>
			<li>Starring: {{Actors}}</li>
			<li>Directed By: {{Director}}</li>
			<li>Runtime: {{Runtime}}</li>
			<li>Year: {{Year}}</li>
			<li>Language: {{Language}}</li>
			<li>Ratings: {{imdbRating}} (IMDB), {{tomatoMeter}} (Rotten Tomatoes)</li>
		</ul>
		{{/with}}
	{{/if}}
{{/if}}
```



# Make API call into a promise
*[(back to top)](#workshop-steps)

1. Change the *getJSON()* method to this:
```
function getJSON (url, params) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    
    xhr.onload = function() {
      var status = xhr.status;
      if (status == 200) {
        resolve(xhr.response);
      } else {
        reject('status response ' + status);
      }
    };
    xhr.onerror = function(e) {
      reject(e.target.status);
    }
    
    xhr.open('get', url + '?' + $.param(params), true);
    xhr.responseType = 'json';
    xhr.send();
  });
};
```
1. In *searchHandler()*, change the API request to this:
```
  getJSON('http://www.omdbapi.com', {
    t: query,
    plot: 'full',
    r: 'json',
    tomatoes: true
  }).then(function (response) {
    if (response.Poster === 'N/A') delete response.Poster;
    renderResults({movieResult: response, searchFinished: true});

  }).catch(function (err) {
    renderResults({error: true, errorMsg: err});
  });
 ```



# Add Another API call
*[(back to top)](#workshop-steps)

1. Change *searchHandler()* to this:
```
function searchHandler (event) {
  if (event.which !== 13) {
    return;
  }

  var query = $(this).val();
  if (!query) {
    renderResults({});
  }

  var model = {searching: true};
  renderResults(model);

  var movieSearch = getJSON('http://www.omdbapi.com', {
    t: query,
    plot: 'full',
    r: 'json',
    tomatoes: true
  });
  var tvSeriesSearch = getJSON('http://www.omdbapi.com', {
    s: query,
    type: 'series',
    r: 'json'
  });

  movieSearch.then(function (response) {
    if (response.Poster === 'N/A') delete response.Poster;
    model.movieResult = response;
    renderResults(model);
  });

  tvSeriesSearch.then(function (response) {
    model.tvSeriesResult = response;
    renderResults(model);
  });

  Promise.all([movieSearch, tvSeriesSearch]).then(function () {
    model.searching = false;
    renderResults(model);
  }).catch(function (err) {
    renderResults({error: true, errorMsg: err});
  });
}
```
1. Change **results.hbs** to this:
```
{{#if searching}}
	<p>Loading...</p>
{{/if}}
{{#if movieResult}}
	{{#if movieResult.Error}}
		<p>No Movie Found!</p>
	{{else}}
		{{#with movieResult}}
		{{#if Poster}}
		<p><img src="{{Poster}}" alt="movie poster"></p>
		{{/if}}
		<p>movie search result: <strong>{{Title}}</strong></p>
		<p>{{Plot}}</p>
		<ul>
			<li>Starring: {{Actors}}</li>
			<li>Directed By: {{Director}}</li>
			<li>Runtime: {{Runtime}}</li>
			<li>Year: {{Year}}</li>
			<li>Language: {{Language}}</li>
			<li>Ratings: {{imdbRating}} (IMDB), {{tomatoMeter}} (Rotten Tomatoes)</li>
		</ul>
		{{/with}}
	{{/if}}
{{/if}}
{{#if tvSeriesResult}}
	{{#if tvSeriesResult.Error}}
		<p>No TV Series Found!</p>
	{{else}}
		<p><strong>top TV series results: </p>
		<ul>
		{{#each tvSeriesResult.Search}}
			<li>{{this.Title}} ({{this.Year}})
		{{/each}}
		</ul>
	{{/if}}
{{/if}}
{{#if error}}
	<p>A search error occured: {{errorMsg}}</p>
{{/if}}
```



# Introduce Co
*[(back to top)](#workshop-steps)

1. `npm install co --save-dev`.
1. In **index.js**, add `import co from '../node_modules/co';` at the top.
1. Replace searchHandler with this:
```
function searchHandler (event) {
  if (event.which !== 13) {
    return;
  }

  var query = $(this).val();
  if (!query) {
    renderResults({});
  }

  var model = {searching: true};
  renderResults(model);

  // promises in series example
  co(function* () {
    var movieResponse = yield getJSON('http://www.omdbapi.com', {
      t: query,
      plot: 'full',
      r: 'json',
      tomatoes: true
    });

    if (movieResponse.Poster === 'N/A') delete movieResponse.Poster;
    model.movieResult = movieResponse;
    renderResults(model);

    model.tvSeriesResult = yield getJSON('http://www.omdbapi.com', {
      s: query,
      type: 'series',
      r: 'json'
    });

    model.searching = false;
    renderResults(model);
  });

  // promises in parallel example
  // co(function* () {
  //   var responses = yield {
  //     movie: getJSON('http://www.omdbapi.com', {
  //       t: query,
  //       plot: 'full',
  //       r: 'json',
  //       tomatoes: true
  //     }),

  //     tvSeries: getJSON('http://www.omdbapi.com', {
  //       s: query,
  //       type: 'series',
  //       r: 'json'
  //     })
  //   };

  //   if (responses.movie.Poster === 'N/A') delete responses.movie.Poster;
  //   model.movieResult = responses.movie;
  //   model.tvSeriesResult = responses.tvSeries;
  //   model.searching = false;
  //   renderResults(model);
  // });
}
```
