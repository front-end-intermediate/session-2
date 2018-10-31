## Browser Storage

We'll learn how to use `localStorage` and `sessionStorage` to store data natively in the browser and use it later.

These browser APIs let you do full, real page reloads while maintaining state and user data. They’re great for enhancing the user experience.

Take a moment to add a new script in package.json that targets the autosave directory.

## localStorage and sessionStorage

There are two browser APIs you can use to save data natively in the browser: `localStorage` and `sessionStorage`. They work mostly the same way, with a few notable differences.

### localStorage

The localStorage API lets you store data locally that the browser can access later. This data is stored indefinitely and must be a string.

There are three methods in the API:

1. `setItem(key, value)` saves data to localStorage. The first argument is the key for the data, and the second is the data itself.
1. `getItem(key)` retrieves saved data from localStorage using a provided key.
1. `removeItem(key)` will remove data saved to the provided key from localStorage.

```js
// Store data
var someData = 'The data that I want to store for later.';
localStorage.setItem('myDataKey', someData);

// Get data
var data = localStorage.getItem('myDataKey');

// Remove data
localStorage.removeItem('myDatakey');
```

Note the Application pane in the browser tools:

![Image of browser inspector](other/app.png)

You can right click on the localStorage item (`http://127.0.0.1:5500` in the image) to clear the storage.

### sessionStorage

The sessionStorage API works just like localStorage, except the data is cleared when the browser session ends. If the user closes the browser or opens a new tab to the same page, that’s a new session.

```js
// Store data
var someTempData = 'The data that I want to store temporarily.';
sessionStorage.setItem('myTempDataKey', someTempData);

// Get data
var tempData = sessionStorage.getItem('myTempDataKey');

// Remove data
sessionStorage.removeItem('myTempDatakey');
```

Your data must be a string. If you try to store an array or object, you’ll get back a string instead.

This will not work:

```js
var dinner = {
    main: 'lasagna',
    dessert: 'parfait',
    drink: 'Red Wine'
};

// Save dinner to localStorage
localStorage.setItem('dinnerOrder', dinner);

// Get dinner
// returns "[object Object]" - a string, not an object
localStorage.getItem('dinnerOrder');
```

## Storing arrays and objects

Data stored in storage APIs must be a string, but you'll typically be working with arrays and objects.

You convert arrays and objects to strings using `JSON.stringify()`. This allows you to store multiple values as a single item.

The `JSON.stringify()` method converts objects into strings.

This works:

```js
var dinner = {
    main: 'lasagna',
    dessert: 'parfait',
    drink: 'Red Wine'
};

// Save data to local storage
localStorage.setItem('dinnerOrder', JSON.stringify(dinner));

// Get dinner
// doesn't return "[object Object]" - but a string that looks like an object
localStorage.getItem('dinnerOrder');
```

It works with arrays, too.

```js
// Drink options
var drinks = ['wine', 'cocktail', 'soda'];

// Save data to local storage
localStorage.setItem('drinkOptions', JSON.stringify(drinks));
```

### JSON.parse

The `JSON.parse` method converts stringified JSON back into an object or array.

```js
// Get data from local storage
var savedDinner = JSON.parse(localStorage.getItem('dinnerOrder'));
var savedDrinks = JSON.parse(localStorage.getItem('drinkOptions'));
```

If there is no saved entry in localStorage (or sessionStorage), calling `JSON.parse()` with null will throw an error. As a result, it’s often a good idea to check that the item exists first:

```js
// Get data
var savedDinner = localStorage.getItem('dinnerOrder');

// If there's data, convert it back to an object
if (savedDinner) {
    savedDinner = JSON.parse(savedDinner);
}
```

## A Note on Storage Limits

Browsers provide differing levels of storage space for localStorage and sessionStorage, ranging from as little as 2mb up to unlimited.

To make things more confusing, some browsers limit both localStorage and sessionStorage, while others do not restrict sessionStorage size. Not doing so is what’s in the W3C standard, but not all browsers adhered to it.

For browsers with a maximum storage limit, this amount is a total allowable amount of data, not just a max for your specific site or web app. Accordingly, you should try to reduce the overall footprint of your data as much as possible.

## EXERCISE

Let's build a form that automatically saves a user’s data as they type.

### The template

The template for this project is a form with a variety of input types, as well as a select menu and textarea element.

The form has a class and ID of save-me. Each form element has a unique ID you can hook into.

```html
<form class="save-me" id="save-me">

    <label for="name">Name</label>
    <input type="text" name="name" id="name">

    <label for="address">Address</label>
    <input type="text" name="address" id="address">

    <label for="email">Email</label>
    <input type="email" name="email" id="email">

    <label for="hear-about-us">How did you hear about us?</label>
    <select name="hear-about-us" id="hear-about-us">
        <option value=""></option>
        <option value="google">Google</option>
        <option value="referral">Referred by a Friend</option>
        <option value="tv">A TV Ad</option>
        <option value="radio">A Radio Ad</option>
    </select>

    <label id="more">Additional thoughts?</label>
    <textarea name="more" id="more"></textarea>

    <p><strong>Do you agree to our terms of service?</strong></p>
    <label class="label-plain">
        <input type="radio" name="tos" value="yes">
        Yes
    </label>
    <label class="label-plain">
        <input type="radio" name="tos" value="no">
        No
    </label>

    <p><strong>Pick your favorite super heros.</strong></p>

    <label class="label-plain">
        <input type="checkbox" name="spiderman">
        Spiderman
    </label>

    <label class="label-plain">
        <input type="checkbox" name="wonderwoman">
        Wonder Woman
    </label>

    <label class="label-plain">
        <input type="checkbox" name="blackpanther">
        Black Panther
    </label>

    <p><button type="submit">Submit</button></p>

</form>
```

As the user types, we'll save their data in real time to `localStorage`. When the page loads, automatically populate the form fields with any saved data.

You should be able to type, reload the page in the browser (or quit and come back later) and see all of your data just as you left it.

When the user clicks submit, wipe out any saved data.

Should we store each element individually, or as part of a single item in localStorage? How will we match fields against data in localStorage? What would happen if there were more than one form on the page?

Implement a bare bones local storage structure: 

```js
// Your code goes here...

const formElem = document.getElementById('save-me');

var saveData = function(){
  var someData = 'The data that I want to store for later.';
  localStorage.setItem('myDataKey', someData);
  getData()
}

var getData = function(){
  var data = localStorage.getItem('myDataKey');
  console.log(data)
}

formElem.addEventListener('input', saveData);
```

When you enter data into any of the forms the string is added to local storage. 

Let's focus on the first input field.

```js
// Your code goes here...

const formElem = document.getElementById('save-me');

var saveData = function(){
  var someData = document.querySelector('#name').value;
  console.log(someData);
  localStorage.setItem('name', someData);
  getData()
}

var getData = function(){
  var data = localStorage.getItem('name');
  console.log(data)
}

formElem.addEventListener('input', saveData);
```

Note - the input event is being used here.

At this point you should start monitoring the Application portion of the browser's inspector:

![Image of browser inspector](other/app.png)

Note that you can right click on the Local Storage url to clear the contents.

For the following we will use `event`:

```js
const formElem = document.getElementById('save-me');

var test = function(){
		console.log(event.target);
}

formElem.addEventListener('click', test);
```

When you add an event listener, that event is passed to the function. We can use the `event.target` property to get the element and `event.target.value` to get the element's contents.

```js
const formElem = document.getElementById('save-me');

var saveData = function(){
  var someData = document.querySelector('#name').value;
  console.log(event.target.value);
  localStorage.setItem('name', someData);
  getData()
}

var getData = function(){
  var data = localStorage.getItem('name');
  console.log(data)
}

formElem.addEventListener('input', saveData);
```

We'll use `event.target` to set both the target (the name of the input field) and the target's value (the value of the input field) to JSON. (Remember, local storage can only accept strings.)

```js
const formElem = document.getElementById('save-me');

var saveData = function(){

  var elem = event.target.id;
  var someData = event.target.value;

  var dataKey = JSON.stringify(elem);
  var inputData = JSON.stringify(someData);

  localStorage.setItem(dataKey, inputData);
  getData(dataKey)
}

var getData = function(key){
  console.log(key)  
  var data = localStorage.getItem(key);
  console.log(data)
}

formElem.addEventListener('input', saveData);
```

Let's try accounting for elements that do not have an id such as radio buttons and check boxes.

```js
const formElem = document.getElementById('save-me');
var faves = []; // NEW 

var saveData = function(){
  
  if(event.target.id){
    var elem = event.target.id;
    var someData = event.target.value;
  } else if (event.target.type == 'radio'){
    var elem = event.target.name;
    var someData = event.target.value;
  } else if (event.target.type == 'checkbox'){
    var elem = 'faves';
    faves.push(event.target.name)
    var someData = faves;
  }
  
  var dataKey = JSON.stringify(elem);  // NEW
  var inputData = JSON.stringify(someData);
  
  localStorage.setItem(dataKey, inputData);
  getData(dataKey)
}

var getData = function(key){
  console.log(key)  
  var data = localStorage.getItem(key);
  console.log(data)
}

formElem.addEventListener('input', saveData);
```

Now let's focus on refreshing and onload - events which should populate the form with data from local storage. Fortunately we already have a `getData()` function we can use.

Consult [MDN's Events page](https://developer.mozilla.org/en-US/docs/Web/Events)

```js
var getData = function(){
  var nameItem = JSON.parse(localStorage.getItem('name'));
  if (nameItem) {
    document.querySelector('#name').value = nameItem;
  } else {
    document.querySelector('#name').placeholder = 'Please enter a name';
  }
}

window.addEventListener('load', getData);
```

Its at this point where we realize that getting and setting these values could get quite long and that there is probably a better way. But that's OK - most scripts start out rough and then are refined as you proceed. 

Let's unify the storage objects by prefixing them with the form's id.

Because we are going to be using `console.log` a lot more let's shorten it:

```js
const formElem = document.getElementById('save-me');
var log = console.log;
```

We'll use the id for the local storage key name:

```js
var saveData = function(){
  var id = formElem.id;
	log(id);

	localStorage.setItem('formData-' + id, JSON.stringify(formData));
}
```

Before we start recording the input data we will get any pre-existing data:

```js
var saveData = function(){
  var id = formElem.id;
	var formData = localStorage.getItem('formData-' + id);
	log(formData)

	localStorage.setItem('formData-' + id, JSON.stringify(formData));
}
```

We are getting the form data before setting it. This is resulting in `null` because there is no form data yet. 

Because it is possible that the form data is null we will use a ternary operator (rather than an if statement) to set formData to either the existing data or just an empty object:

```js
var saveData = function(){
  var id = formElem.id;
  var formData = localStorage.getItem('formData-' + id);
  formData = formData ? JSON.parse(formData) : {};
	log(formData)
	
	formData[event.target.name] = event.target.value;
  
	localStorage.setItem('formData-' + id, JSON.stringify(formData));
}
```

Finally, let's refactor the code so the checkboxes report true if checked:

```js
var saveData = function(){
  var id = formElem.id;
  var formData = localStorage.getItem('formData-' + id);
  formData = formData ? JSON.parse(formData) : {};
  log(formData)

  if (event.target.type === 'checkbox') {
    formData[event.target.name] = event.target.checked;
  } else {
    formData[event.target.name] = event.target.value;
	}
		localStorage.setItem('formData-' + id, JSON.stringify(formData));
}
```

`"spiderman": "on"` now becomes `"spiderman":true`

Let's look at the getData function.

Start by getting the dta from local storage:

```js
var getData = function () {
	var formData = localStorage.getItem('formData-' + formElem.id);
	log(formData)
}
```

Parse the JSON:

```js
var getData = function () {
	var formData = localStorage.getItem('formData-' + formElem.id);
	formData = JSON.parse(formData);
	log(formData)
}
```

Now formData is an object. We will use a `for ... in` loop to work with it:

```js
var getData = function () {
	var formData = localStorage.getItem('formData-' + formElem.id);
  formData = JSON.parse(formData);
  
  for (var data in formData) {
    log(data)
	}
}
```

Note the name attributes on the form elements. We will loop through setting field by using an attribute selector, e.g.:

```js
[name="tos"]
```

```js
var getData = function () {
	var formData = localStorage.getItem('formData-' + formElem.id);
  formData = JSON.parse(formData);
  
  for (var data in formData) {
    var field = formElem.querySelector('[name="' + data + '"]'); // NEW
    log(field)
	}
}
```

Again, the checkboxes are a special case. Checkboxes have a simple property - `checked` - which is either true or false.

We will start populating our form by including checkboxes in our loop and using the formData to set the value of the form element:

```js
var getData = function () {
	var formData = localStorage.getItem('formData-' + formElem.id);
  formData = JSON.parse(formData);
  
  for (var data in formData) {
    var field = formElem.querySelector('[name="' + data + '"]');

    if (field.type === 'checkbox') {
      field.checked = formData[data];
    }
	log(formData)
	}
}
```

Now, about those pesky radio buttons. 

Let's check to see if we are dealing with a radio button and, if so, create a new array `radios` so we can run a `forEach` on them. We'll use an inner `if` statement to set the checked value to true.

```js
var getData = function () {
	var formData = localStorage.getItem('formData-' + formElem.id);
  formData = JSON.parse(formData);
  
  for (var data in formData) {
    var field = formElem.querySelector('[name="' + data + '"]');
    
    if (field.type === 'checkbox') {
      field.checked = formData[data];
    }
    
    if (field.type === 'radio') {
      var radios = Array.from(formElem.querySelectorAll('input[type="radio"]'));
      radios.forEach(function (radio) {
        if (radio.value === formData[data]) {
          radio.checked = true;
        }
      });
    }
    log(formData)
	}
}
```

We have one more condition to account for. if the field type is not a checkbox or a radio button it must be a field.

We'll use `else if` for the radios:

```js
var getData = function () {
	var formData = localStorage.getItem('formData-' + formElem.id);
  formData = JSON.parse(formData);
  
  for (var data in formData) {
    var field = formElem.querySelector('[name="' + data + '"]');
    
    if (field.type === 'checkbox') {
      field.checked = formData[data];
    }
    
    else if (field.type === 'radio') { // NEW
      var radios = Array.from(formElem.querySelectorAll('input[type="radio"]'));
      radios.forEach(function (radio) {
        if (radio.value === formData[data]) {
          radio.checked = true;
        }
      });
    }
    log(formData)
	}
}
```

And add a final `else` clause for everything else (the form fields):

```js
var getData = function () {
	var formData = localStorage.getItem('formData-' + formElem.id);
  formData = JSON.parse(formData);
  
  for (var data in formData) {
    var field = formElem.querySelector('[name="' + data + '"]');
    
    if (field.type === 'checkbox') {
      field.checked = formData[data];
    }
    
    else if (field.type === 'radio') {
      var radios = Array.from(formElem.querySelectorAll('input[type="radio"]'));
      radios.forEach(function (radio) {
        if (radio.value === formData[data]) {
          radio.checked = true;
        }
      });
    }
    
    else {
      field.value = formData[data];
    }
  }
  
  log(formData)
}
```

Add an event listener for when the user hits the submit button. This will remove local storage.

```js
// Listen for submit event
document.addEventListener('submit', resetData, false);
```

Create the resetData function:


```js
// Reset formData to empty object
var resetData = function (event) {
	var id = formElem.id;
	localStorage.setItem('formData-' + id, JSON.stringify({}));
};
```

Finally we can use an IIFE


```js
;(function (window, document, undefined) {
	'use strict';
  const formElem = document.getElementById('save-me');
  var log = console.log;
  
  var saveData = function(){
    var id = formElem.id;
    var formData = localStorage.getItem('formData-' + id);
    formData = formData ? JSON.parse(formData) : {};
    log(formData)
    
    if (event.target.type === 'checkbox') {
      formData[event.target.name] = event.target.checked;
    } else {
      formData[event.target.name] = event.target.value;
    }
    
    localStorage.setItem('formData-' + id, JSON.stringify(formData));
  }
  
  var getData = function () {
    var formData = localStorage.getItem('formData-' + formElem.id);
    formData = JSON.parse(formData);
    
    for (var data in formData) {
      var field = formElem.querySelector('[name="' + data + '"]');
      
      if (field.type === 'checkbox') {
        field.checked = formData[data];
      }
      
      else if (field.type === 'radio') {
        var radios = Array.from(formElem.querySelectorAll('input[type="radio"]'));
        radios.forEach(function (radio) {
          if (radio.value === formData[data]) {
            radio.checked = true;
          }
        });
      }
      
      else {
        field.value = formData[data];
      }
    }
    
    log(formData)
  }
  
  var resetData = function (event) {
    var id = formElem.id;
    localStorage.setItem('formData-' + id, JSON.stringify({}));
  };
  
  formElem.addEventListener('input', saveData);
  window.addEventListener('load', getData);
  
  document.addEventListener('submit', resetData, false);
})(window, document);
```


## Expiring localStorage data

Unlike cookies, localStorage does not have a native method for expiring data. It’s kept in storage until you or the user explicitly delete it.

However, there’s a technique you can use to keep data for longer than a browser session, but not forever.

Save your data as an object with two keys:

1. The data key holds the data itself.
1. The timestamp key is the date your data was saved on. We can compare it to the current date, and fetch new data or delete it after a certain period of time.

### Setting a “saved on” date

This part is relatively straightforward.

Create an object with your two keys. Set the data key as your data, and use `new Date().getTime()` for the timestamp key. This creates a UTC timestamp of the current time.

Then, stringify your object and save it to localStorage.

```js
// Setup the localStorage data
var saved = {
    data: data,
    timestamp: new Date().getTime()
};

// Save to localStorage
localStorage.setItem('myData', JSON.stringify(saved));
```

### Checking your timestamp

After getting your data out of localStorage, make sure that it has data and timestamp keys. If it does, we can compare the timestamp to the current time and act accordingly.

First, let’s get the difference between our timestamp and the current time. This gives us a number in milliseconds.

```js
var isDataValid = function (saved) {

    // Check that there's data, and a timestamp key
    if (!saved || !saved.data || !saved.timestamp) return false;

    // Get the difference between the timestamp and current time
    var difference = new Date().getTime() - cache.timestamp;

};
```

Next, we’ll convert that difference from milliseconds into hours.

To do that, we’ll divide it by the number of millseconds in an hour. We can use JS math operators to figure that out for us. We’ll multiply 1000 milliseconds (the number in a second) by 60 seconds (the number in a minute), and again by 60 minutes (the number in an hour).

Then, we’ll divide the difference by that number.

```js
var isDataValid = function (saved) {

    // Check that there's data, and a timestamp key
    if (!saved || !saved.data || !saved.timestamp) return false;

    // Get the difference between the timestamp and current time
    var difference = new Date().getTime() - cache.timestamp;

    // Convert the difference into hours
    var oneHour = 1000 * 60 * 60;
    var convertedTime = difference / oneHour;

};
```

Finally, we’ll check that the convertedTime in hours is less than 1. If it is, we’ll return true.

```js
var isDataValid = function (saved) {

    // Check that there's data, and a timestamp key
    if (!saved || !saved.data || !saved.timestamp) return false;

    // Get the difference between the timestamp and current time
    var difference = new Date().getTime() - cache.timestamp;

    // Convert the difference into hours
    var oneHour = 1000 * 60 * 60;
    var convertedTime = difference / oneHour;

    // Check if it's been less than an hour
    if (convertedTime < 1) return true;

};
```

And you’d use it like this.

```js
// Get data from localStorage
var saved = JSON.parse(localStorage.getItem('myData'));

// Check its validity
if (isDataValid(saved)) {
    // The data is still good, use it
} else {
    // Get fresh data and use that instead
}
```

### Other expiration times

If, like me, you find this kind of math confusing, I wanted to provide some helpful numbers you can work with.

```js
// 1 Hour = 1000ms * 60s * 60m
var oneHour = 1000 * 60 * 60;

// 1 Day =  1000ms * 60s * 60m * 24h
var oneDay = 1000 * 60 * 60 * 24;

// 1 Week =  1000ms * 60s * 60m * 24h * 7 days
var oneWeek = 1000 * 60 * 60 * 24 * 7;

// 1 Year =  1000ms * 60s * 60m * 24h * 365 days
var oneYear = 1000 * 60 * 60 * 24 * 365;
```

If you you wanted to use units other than “one,” multiply any of those by your preferred quantity.

For example, to expire after 12 hours, you would do this:

```js
// 12 Hours = 1000ms * 60s * 60m * 12
var twelveHours = 1000 * 60 * 60 * 12;
```

For four weeks, you’d do this:

```js
// 4 Weeks =  1000ms * 60s * 60m * 24h * 7 days * 4
var fourWeeks = 1000 * 60 * 60 * 24 * 7 * 4;
```

## EXERCISE 

The template for this project is an empty `div` with the `#app` ID.

```html
<div id="app"></div>
```

### The assignment

You’re going to get articles from the Scuttlebutt, a fictional pirate news magazine, using their pirates API endpoint.

For this assignment:

1. Get the data from an API endpoint.
1. Cache your API call for an hour. If the cached data is still valid, use that instead of making a new API call.
1. If the API call fails for some reason, fallback to your cached data (even if it’s expired).
1. Use that data to build a simple magazine (with headlines, bylines, dates, and article copy).

```html
<!DOCTYPE html>
<html lang="en-US">
<head>
	<title>API Cache</title>

	<meta charset="utf-8">

	<!-- Force latest available IE rendering engine and Chrome Frame (if installed) -->
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

	<!-- Mobile Screen Resizing -->
	<meta name="viewport" content="width=device-width, initial-scale=1.0">

	<style type="text/css">
		/**
		 * Add box sizing to everything
		 * @link http://www.paulirish.com/2012/box-sizing-border-box-ftw/
		 */
		/* line 38, src/sass/components/_normalize.scss */
		*,
		*:before,
		*:after {
			box-sizing: border-box;
		}
		/**
		 * Layout
		 */
		body {
			font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
			font-size: 112.5%;
			margin-left: auto;
			margin-right: auto;
			max-width: 40em;
			width: 88%;
		}
	</style>
</head>
<body>

	<h1>The Scuttlebutt</h1>

	<div id="app"></div>

	<script>
		/**
		 * Dynamically vary the API endpoint
		 * @return {String} The API endpoint
		 */
		var getEndpoint = function () {
			var endpoint = 'https://daniel.deverell.com/api/';
			var random = Math.random();
			if (random < 0.3) return endpoint + 'pirates.json';
			if (random < 0.6) return endpoint + 'pirates2.json';
			return endpoint + 'fail.json';
		};
		// Your code goes here...
	</script>

</body>
</html>
```

To simulate API content updates and spotty networks, I’ve put together a function that will randomize the API endpoint (and occasionally throw failures).

Use `getEndpoint()` where you would normally include a URL to make API calls.

```js
/**
 * Dynamically vary the API endpoint
 * @return {String} The API endpoint
 */
var getEndpoint = function () {
    var endpoint = 'https://oit2.scps.nyu.edu/~devereld/api/';
    var random = Math.random();
    if (random < 0.3) return endpoint + 'pirates.json';
    if (random < 0.6) return endpoint + 'pirates2.json';
    return endpoint + 'fail.json';
};
```

Some considerations

When you should you delete your saved data from localStorage? What happens if your API call fails and there is no data in localStorage to fallback on? How can you best structure your code to avoid repeating yourself.

pirates.json

```js
{
	"publication": "The Scuttlebutt",
	"tagline": "The number one source of pirate news",
	"attribution": {
		"name": "Pirate Ipsum",
		"url": "https://pirateipsum.me"
	},
	"articles": [
		{
			"title": "Scourge of the High Seas",
			"author": "Blackbeard",
			"article": "Clap of thunder port capstan draught case shot. Port interloper rigging overhaul bilged on her anchor.\n\nYellow Jack cog interloper topgallant chase. Reef sails pillage case shot mizzenmast shrouds.\n\nPillage bilge water clipper hempen halter bounty. Loaded to the gunwalls loot quarter hogshead lookout.\n\nMutiny dance the hempen jig bucko killick sheet. Jack Ketch swab case shot clap of thunder lee.\n\nPrivateer carouser chandler coxswain Jack Tar. Lee draft snow handsomely crow's nest.",
			"pubdate": "December 14, 1684",
			"category": "Personal Interest"
		},
		{
			"title": "Leadership Tips for the New Captain",
			"author": "Madame Cheng",
			"article": "Snow clap of thunder coffer hulk prow yo-ho-ho jib scourge of the seven seas main sheet bowsprit. Splice the main brace schooner chase guns Privateer grog blossom avast Pirate Round swing the lead transom bring a spring upon her cable. Coffer lee boom smartly doubloon heave to poop deck Gold Road cackle fruit chantey.\n\nFurl rigging carouser avast swing the lead scurvy fore smartly booty Jack Tar. Boatswain mizzen long clothes main sheet spyglass American Main Chain Shot salmagundi starboard fathom. Swing the lead nipper coxswain lateen sail scuppers interloper heave to black jack grapple chase guns.\n\nBilge rat bucko gabion lugsail handsomely overhaul grog nipperkin Brethren of the Coast lookout. Tender hardtack loot scuppers ballast bilged on her anchor stern mutiny pillage booty. Six pounders spyglass overhaul mizzenmast marooned hearties man-of-war rigging deadlights handsomely",
			"pubdate": "March 21, 1804",
			"category": "Business"
		},
		{
			"title": "So, you've got a Kraken problem?",
			"author": "Jack Sparrow",
			"article": "Gangplank poop deck chase guns cable jib brigantine stern. Yard spike main sheet piracy gabion boom pirate. Port gaff yard crack Jennys tea cup Pieces of Eight line capstan.\n\nJolly boat yo-ho-ho wench Sail ho Shiver me timbers handsomely draught. Weigh anchor nipperkin Davy Jones' Locker topgallant draft bring a spring upon her cable run a rig. Gunwalls yard marooned parley hearties wherry mizzen.\n\nHulk grog blossom ho barkadeer scurvy boatswain spike. Gibbet chandler weigh anchor stern parrel nipper Spanish Main. Fathom long boat American Main Corsair walk the plank flogging black jack.\n\nCome about pirate black jack heave to Nelsons folly boatswain marooned. Come about bucko Cat o'nine tails maroon Yellow Jack fore plunder. Ballast blow the man down log square-rigged heave down gun jib.",
			"pubdate": "July 14, 1702",
			"category": "Technology"
		},
		{
			"title": "Summer Styles for the Fashionable Pirate",
			"author": "Calico Jack",
			"article": "Yo-ho-ho splice the main brace topmast lee brig killick grapple belay Cat o'nine tails gangway. Ho furl Sea Legs spanker cackle fruit Pirate Round Sink me clipper line starboard. Gaff squiffy careen scuttle Davy Jones' Locker driver bounty crimp spike to go on account.\n\nPinnace fire ship yard capstan Sea Legs hornswaggle ahoy pillage gaff gunwalls. Hornswaggle hail-shot square-rigged stern clipper Spanish Main coxswain blow the man down snow Privateer. Letter of Marque fore booty salmagundi crack Jennys tea cup avast flogging topgallant clap of thunder lateen sail.\n\nSchooner belaying pin Shiver me timbers to go on account booty fluke crimp topsail trysail run a rig. Clipper Cat o'nine tails maroon avast gally tender boom chase guns man-of-war loot. Hulk Buccaneer grog salmagundi Davy Jones' Locker measured fer yer chains gabion loot cutlass black spot.",
			"pubdate": "October 31, 1712",
			"category": "Style"
		},
		{
			"title": "Crafting the Perfect Treasure Map",
			"author": "Anne Bonny",
			"article": "Reef sails run a rig grapple Brethren of the Coast rigging. Jury mast marooned lanyard jolly boat pirate.\n\nBucko pressgang brigantine maroon barque. Grapple yawl clipper rum Brethren of the Coast.\n\nExecution dock nipperkin jack prow cog. Bounty hail-shot chase guns Pieces of Eight scourge of the seven seas.\n\nChase guns rigging swing the lead sutler driver. Long clothes squiffy jib walk the plank to go on account.\n\nMe spyglass rum chase Sink me. Belaying pin belay spyglass Buccaneer cutlass.\n\nMutiny lee hempen halter hang the jib gally. Fathom dance the hempen jig cackle fruit scuppers red ensign.\n\nLee square-rigged interloper ballast topsail. Provost square-rigged avast yo-ho-ho scuttle.",
			"pubdate": "November 3, 1776",
			"category": "Business"
		}
	]
}
```

pirates2.json

```js
{
	"publication": "The Scuttlebutt",
	"tagline": "The number one source of pirate news",
	"attribution": {
		"name": "Pirate Ipsum",
		"url": "https://pirateipsum.me"
	},
	"articles": [
		{
			"title": "Keel Hauling for the Adrenaline Junkie",
			"author": "Blackbeard",
			"article": "Clap of thunder port capstan draught case shot. Port interloper rigging overhaul bilged on her anchor.\n\nYellow Jack cog interloper topgallant chase. Reef sails pillage case shot mizzenmast shrouds.\n\nPillage bilge water clipper hempen halter bounty. Loaded to the gunwalls loot quarter hogshead lookout.\n\nMutiny dance the hempen jig bucko killick sheet. Jack Ketch swab case shot clap of thunder lee.\n\nPrivateer carouser chandler coxswain Jack Tar. Lee draft snow handsomely crow's nest.",
			"pubdate": "December 14, 1684",
			"category": "Personal Interest"
		},
		{
			"title": "Leadership Tips for the New Captain",
			"author": "Madame Cheng",
			"article": "Snow clap of thunder coffer hulk prow yo-ho-ho jib scourge of the seven seas main sheet bowsprit. Splice the main brace schooner chase guns Privateer grog blossom avast Pirate Round swing the lead transom bring a spring upon her cable. Coffer lee boom smartly doubloon heave to poop deck Gold Road cackle fruit chantey.\n\nFurl rigging carouser avast swing the lead scurvy fore smartly booty Jack Tar. Boatswain mizzen long clothes main sheet spyglass American Main Chain Shot salmagundi starboard fathom. Swing the lead nipper coxswain lateen sail scuppers interloper heave to black jack grapple chase guns.\n\nBilge rat bucko gabion lugsail handsomely overhaul grog nipperkin Brethren of the Coast lookout. Tender hardtack loot scuppers ballast bilged on her anchor stern mutiny pillage booty. Six pounders spyglass overhaul mizzenmast marooned hearties man-of-war rigging deadlights handsomely",
			"pubdate": "March 21, 1804",
			"category": "Business"
		},
		{
			"title": "How to Handle Your First Mutiny",
			"author": "Jack Sparrow",
			"article": "Gangplank poop deck chase guns cable jib brigantine stern. Yard spike main sheet piracy gabion boom pirate. Port gaff yard crack Jennys tea cup Pieces of Eight line capstan.\n\nJolly boat yo-ho-ho wench Sail ho Shiver me timbers handsomely draught. Weigh anchor nipperkin Davy Jones' Locker topgallant draft bring a spring upon her cable run a rig. Gunwalls yard marooned parley hearties wherry mizzen.\n\nHulk grog blossom ho barkadeer scurvy boatswain spike. Gibbet chandler weigh anchor stern parrel nipper Spanish Main. Fathom long boat American Main Corsair walk the plank flogging black jack.\n\nCome about pirate black jack heave to Nelsons folly boatswain marooned. Come about bucko Cat o'nine tails maroon Yellow Jack fore plunder. Ballast blow the man down log square-rigged heave down gun jib.",
			"pubdate": "July 14, 1702",
			"category": "Business"
		},
		{
			"title": "These Boots Were Made for Sailing: Best Pirate Boots to Wear This Fall",
			"author": "Calico Jack",
			"article": "Yo-ho-ho splice the main brace topmast lee brig killick grapple belay Cat o'nine tails gangway. Ho furl Sea Legs spanker cackle fruit Pirate Round Sink me clipper line starboard. Gaff squiffy careen scuttle Davy Jones' Locker driver bounty crimp spike to go on account.\n\nPinnace fire ship yard capstan Sea Legs hornswaggle ahoy pillage gaff gunwalls. Hornswaggle hail-shot square-rigged stern clipper Spanish Main coxswain blow the man down snow Privateer. Letter of Marque fore booty salmagundi crack Jennys tea cup avast flogging topgallant clap of thunder lateen sail.\n\nSchooner belaying pin Shiver me timbers to go on account booty fluke crimp topsail trysail run a rig. Clipper Cat o'nine tails maroon avast gally tender boom chase guns man-of-war loot. Hulk Buccaneer grog salmagundi Davy Jones' Locker measured fer yer chains gabion loot cutlass black spot.",
			"pubdate": "October 31, 1712",
			"category": "Style"
		},
		{
			"title": "Crafting the Perfect Treasure Map",
			"author": "Anne Bonny",
			"article": "Reef sails run a rig grapple Brethren of the Coast rigging. Jury mast marooned lanyard jolly boat pirate.\n\nBucko pressgang brigantine maroon barque. Grapple yawl clipper rum Brethren of the Coast.\n\nExecution dock nipperkin jack prow cog. Bounty hail-shot chase guns Pieces of Eight scourge of the seven seas.\n\nChase guns rigging swing the lead sutler driver. Long clothes squiffy jib walk the plank to go on account.\n\nMe spyglass rum chase Sink me. Belaying pin belay spyglass Buccaneer cutlass.\n\nMutiny lee hempen halter hang the jib gally. Fathom dance the hempen jig cackle fruit scuppers red ensign.\n\nLee square-rigged interloper ballast topsail. Provost square-rigged avast yo-ho-ho scuttle.",
			"pubdate": "November 3, 1776",
			"category": "Business"
		}
	]
}
```