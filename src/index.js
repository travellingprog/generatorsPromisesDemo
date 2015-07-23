import mainTemplate from './templates/content.hbs';
import resultsTemplate from './templates/results.hbs';

import co from '../node_modules/co';

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




console.log('Hey man!');

var numbers = [5, 27, 923, 17, 923414, 823417];

for (var number of numbers) {
	if (number % 2 === 0) {
		console.log('Found the first even number: ' + number);
		break;
	}
}



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
