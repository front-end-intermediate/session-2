# II - DOM Manipulation

## Reading

1. Bob on [Template Strings](https://youtu.be/INPob8yPyBo)
1. Bob on DOM scripting parts [one](https://youtu.be/0ik6X4DJKCc), [two](https://youtu.be/mPd2aJXCZ2g), [three](https://youtu.be/wK2cBMcDTss) and [four](https://youtu.be/i37KVt_IcXw).  Please make every effort to follow along on your computer.
1. If you want more information on navigating with JSON and JavaScript watch [this video](https://www.youtube.com/watch?v=xN9QxPtK2LM). The source code for it is [here](https://github.com/curran/screencasts/tree/gh-pages/navigation).

## Homework

1. Review the notes below, paying particular attention to and researching anything that was unclear to you in class.

## NPM Manifests

We will be again using [Browser Sync](https://www.browsersync.io) as our sample application.

```sh
npm init -y
npm install browser-sync --save-dev
```

* `npm init` creates `package.json`
* `npm install browser-sync` installs [Browser Sync](https://www.browsersync.io) into a new `node_modules` folder
* `--save-dev` adds the software to a list of development dependancies in the manifest

### Editing package.json

* Browser Sync [Command Line (CLI) documentation](https://www.browsersync.io/docs/command-line)
* [Github Repo](https://github.com/BrowserSync/browser-sync)

Create the NPM script using the Browser Sync command line documentation:

```js
  "scripts": {
    "start": "browser-sync start --server 'app' --files 'app'"
  },
```

Or, on a Windows PC:

```js
"start": "browser-sync start --server \"app\" --files \"app\""
```

Note: Windows users should check out Microsoft's [Nodejs Guidelines](https://github.com/Microsoft/nodejs-guidelines).

And run the process:

```sh
npm run start
```

## Faking a Single Page Application (SPA)

Page fragment links (`index.html#research`) allow us to navigate to sections of the document marked up with the corresponding id:

`<p id="watchlist">`

Note that clicking on a hashed link doesn't refresh the page. This makes hashes an important feature for creating SPAs - they are used to load different content via AJAX from a server with no page refresh.

We'll set up our page to _emulate_ a SPA using hashes.

This time we'll use a new event `window.onhashchange` and `filter()` and a slightly modified `navItems` array.

* examine the `navItems` array in `navItems.js`
* review the code in `main.js`
* review using [.filter, .join, and .map](https://github.com/front-end-intermediate/session-1#array-methods) with arrays

Begin by selecting the `site-wrap`:

```js
const siteWrap = document.querySelector('.site-wrap');
```

Attach an event listener to the hashchange event:

```js
window.addEventListener("hashchange", navigate)
```

Store the hash in a variable `newLoc`::

```js
function navigate(){
  let newloc = window.location.hash;
  console.log(newloc)
  }
```

Use that value to filter the navItems (our fake data) using [Array.prototype.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter). The `filter()` method creates a new array with all elements that pass the test implemented by the provided function.

```js
function navigate(){
  let newloc = window.location.hash;

  let newContent = navItems.filter(
    function(navItem){
      return navItem.link == newloc
    })

  console.log(newContent[0].header)
}
```

Filter selects an entry in navItems based on its hash (`newLoc`) and saves it into a const variable `newContent`.

Finally, set the innerHTML of the siteWrap to content from the resulting array:

```js
function navigate(){
  let newloc = window.location.hash;

  let newContent = navItems.filter(
    function(navItem){
      return navItem.link == newloc
    })

  siteWrap.innerHTML = `
  <h2>${newContent[0].header}</h2>
  ${newContent[0].content}
  `;
}
```

Refactor to use an [arrow function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions):

```js
function navigate(){
  let newloc = window.location.hash;
  let newContent = navItems.filter( navItem => navItem.link == newloc );
  siteWrap.innerHTML = `
  <h2>${newContent[0].header}</h2>
  ${newContent[0].content}
  `;
}
```

Note that arrow functions have an implicit return.

Establish a default page and call navigate to set the initial view:

```js
if(!location.hash) {
  location.hash = "#watchlist";
}

navigate();
```

Final script:

```js
const nav = document.getElementById('main');
const navLinks = nav.querySelector('#nav-links');
const siteWrap = document.querySelector('.site-wrap');

const markup = `${navItems
  .map(listItem => `<li><a href="${listItem.link}">${listItem.label}</a></li>`)
  .join('')}`;

navLinks.innerHTML = markup;

const logo = document.querySelector('#main ul li');
logo.classList.add('logo');
logo.firstChild.innerHTML = '<img src="img/logo.svg" />';


let topOfNav = nav.offsetTop;

function fixNav() {
  if(window.scrollY >= topOfNav) {
    document.body.style.paddingTop = nav.offsetHeight + 'px';
    document.body.classList.add('fixed-nav');
  } else {
    document.body.classList.remove('fixed-nav');
    document.body.style.paddingTop = 0;
  }
}

function navigate(){
  let newloc = window.location.hash;
  let newContent = navItems.filter( navItem => navItem.link == newloc );
  siteWrap.innerHTML = `
  <h2>${newContent[0].header}</h2>
  ${newContent[0].content}
  `;
}

if(!location.hash) {
  location.hash = "#watchlist";
}

navigate();

window.addEventListener('scroll', fixNav);
window.addEventListener("hashchange", navigate)
```

## JSON

When sending data you need to convert it to a string using [JSON.stringify()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify).

Run this in the browser's console:

```js
JSON.stringify(navItems, null, 4)
```

This is the source for `db.json` at the top level of today's folder.

We could use `db.json` as a static file but lets use it with [JSON Server](https://github.com/typicode/json-server) instead.

Install it using npm (`--save-dev`):

```sh
npm i json-server --save-dev
```

and add this scripts in `package.json`:

```js
"json": "json-server --watch db.json --port 3004"
```

We will need to use a second terminal in order to run `npm run json` as our first is tied up with browser-sync.

Test it at [http://localhost:3004/content](http://localhost:3004/content).

Create a new function `fetchData` that takes a hash and callback:

```js
function fetchData(hash, callback) {
  var xhr = new XMLHttpRequest();

  xhr.onload = function () {
    callback(JSON.parse(xhr.response));
  };

  xhr.open('GET', 'http://localhost:3004/content', true);
  xhr.send();
}
```

Edit the navigate function to call it:

```js
function navigate() {
  let newloc = window.location.hash;
  fetchData(newloc, function (content) {
    let newContent = content.filter( contentItem => contentItem.link == newloc );
    siteWrap.innerHTML = `
    <h2>${newContent[0].header}</h2>
    ${newContent[0].image}
    ${newContent[0].content}
    `;
  })
}
```

Note the use of callbacks.

The navigation is still coming from the original `navitems.js` file. Comment it out in the html files and use the json.

Call our fetchData function with null (we are not looking for a page here):

```js
fetchData(null, function(content) {
  const markup =
    `<ul>
    ${content.map(
      listItem => `<li><a href="${listItem.link}">${listItem.label}</a></li>`
    ).join('')}
    </ul>`;
  nav.innerHTML = markup;
})
```

Note that we need to initialize our logo as it doesn't exist until the navigation is built.

```js
fetchData(null, function(content) {
  const markup =
    `<ul>
    ${content.map(
      listItem => `<li><a href="${listItem.link}">${listItem.label}</a></li>`
    ).join('')}
    </ul>`;
  nav.innerHTML = markup;

  const logo = document.querySelector('#main ul li');
  logo.classList.add('logo');
  logo.firstChild.innerHTML = '<img src="img/logo.svg" />';

})
```

We can now remove the content from `index.html`.

## NPM node-sass

* [Node Package Manager](https://www.npmjs.com)
* [SASS](http://sass-lang.com)
* [node-sass](https://www.npmjs.com/package/node-sass) and its [github repo](https://github.com/sass/node-sass)
* sass processing can be accomplished using a [variety of desktop apps](https://graygrids.com/best-tools-resources-compile-manage-sass-less-stylus-css-preprocessors/)

### Node Package Manager (NPM)

* A Note for Windows users:

[Microsoft's Nodejs Guidelines](https://github.com/Microsoft/nodejs-guidelines) is full of helpful information.

Of particular note if you are trying to use the `node-sass` npm package is [this entry](https://github.com/Microsoft/nodejs-guidelines/blob/master/windows-environment.md#compiling-native-addon-modules) on compiling modules.

It appears that Windows users need to install [this npm package](https://github.com/nodejs/node-gyp#on-windows) using [elevated permissions](https://blogs.technet.microsoft.com/danstolts/2012/01/how-to-run-powershell-with-elevated-permissions/): `npm install -g node-gyp`.

* A Note for MacOS users:

You should probably install Xcode.

### Method One - Node Sass

Use the existing package.json.

In the terminal (you will need to temporarily stop node sync with Control + c):

1. `$ npm install --save-dev node-sass`
1. Add a [script](https://github.com/sass/node-sass#usage-1) to the package.json file. e.g.:

```js
  "sassy": "node-sass --watch \"scss\"  --output \"app/css/\""
```

Create `scss` directory and copy styles.css as `styles.scss` to it.

Test with a sass variable. Add:

`$badass: #bada55;` as the first line in `styles.scss` and then apply it to the html selector:

```css
html {
  background: $badass;
  ...
}
```

Compile the css: `$ npm run sassy`

Add mapping:

<!--

```css
  "scripts": {
    "build-css": "node-sass --include-path scss scss/styles.scss   app/css/styles.css",
    "sassy": "node-sass --watch \"scss\"  --output \"app/css/\" --source-map true"
  },
```

-->

```js
  "sassy": "node-sass --watch \"scss\"  --output \"app/css/\" --source-map true"
```

Cancel the process with Control-c and then run `$ npm run watch-node-sass`. Note the map file.

#### Concurrently

As it stands we need multiple terminal tabs to run our npm scripts. To improve this we will install a simple utility called Concurrently and write a 'master' npm script.

Stop any processes running in the terminal with Control-c and use the terminal to install and register Concurrently:

* `$ npm install concurrently --save-dev`

Add a new script:

* `"boom!": "concurrently \"npm run start\" \"npm run json\" \"npm run sassy\" "`

Run all processes:

* `$ npm run boom!`

Note that you will end up with multiple browser tabs by doing this. They are identical.

Here's my final package.json. Yours will differ but the important parts - the scripts and dependencies - should be the same:

```js
{
  "name": "session-2",
  "version": "1.0.0",
  "description": "## Reading",
  "main": "index.js",
  "scripts": {
    "start": "browser-sync start --server 'app' --files 'app'",
    "json": "json-server --watch db.json --port 3004",
    "sassy": "node-sass --watch \"scss\"  --output \"app/css/\" --source-map true",
    "boom!": "concurrently \"npm run start\" \"npm run json\" \"npm run sassy\" "
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/front-end-intermediate/session-2.git"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/front-end-intermediate/session-2/issues"
  },
  "homepage": "https://github.com/front-end-intermediate/session-2#readme",
  "devDependencies": {
    "browser-sync": "^2.24.4",
    "json-server": "^0.13.0",
    "node-sass": "^4.9.0"
  }
}
```

## CSS Preprocessing in the Editor

Most editors will offer the ability do preprocessing and browser refresh.

[Visual Studio Code](https://code.visualstudio.com) offers an array of plug-ins that we can use to perform the same preprocessing function. Note that the use of VS Code will not protect you in the long run from having to have some facility with [NPM](https://marketplace.visualstudio.com/items?itemName=eg2.vscode-npm-script)

[Live Sass Compiler](https://marketplace.visualstudio.com/items?itemName=ritwickdey.live-sass) for VS Code.

Install Live SASS Compiler and set the _workspace settings_ as shown:

```js
{
    "liveSassCompile.settings.formats": [
        {
            "savePath": "app/css",
            "format": "expanded"
        }
    ],
    "liveSassCompile.settings.excludeList": [
        "**/node_modules/**",
        ".vscode/**",
        "**/other/**"
    ]
}
```

VS Code is remarkably flexible and offers a setting for almost anything you could wish for. See the Visual Studio Code [documentation](https://code.visualstudio.com/docs/getstarted/settings) for changing settings.

Test it.

## SASS

We are going to retrofit our page for responsive layout using SASS.

[Sass homepage](http://sass-lang.com)

[Bootstrap SASS](https://github.com/twbs/bootstrap-sass)

SASS Features:

* error checking 📌 watch for errors and messages in the terminal if it looks like the CSS is not being processed
* variables
* imports
* nesting
* better structure and more...

Note `_variables.scss` in the `scss > imports` folder

* why are we using an underscore?
* (See [bootstrap in sass](https://github.com/twbs/bootstrap-sass/tree/master/assets/stylesheets))

Cut the variable `$badass: #bada55;` from `styles.scss` and paste it into the variables file along with:

```css
$break-five: 81.25em;
// 1300px
$break-four: 71.25em;
// 1140
$break-three: 61.25em;
// 980
$break-two: 46.25em;
// 740
$break-one: 22.5em;
// 360
```

Note `_base.scss` in the `scss > imports` folder

* Cut and paste all code from styles.scss
* Add `@import "imports/variables";` to the top of styles.scss
* Add `@import "imports/base";` to the top of styles.scss

Note the import statement and how a SASS import differs from a native CSS import such as the one used for the Google font.

Create a new `_nav.scss` file in `imports` and cut and paste the navigation CSS from `_base.scss` into it.

Import it into `styles.scss` so it now contains:

```css
@import "imports/variables";
@import "imports/base";
@import "imports/nav";
```

Nest the contents of `_nav.scss`.

<!-- ### Aside - CSS native variables

By convention apply native variables to the highest level element in the DOM (although any element will work):

```css
:root {
  --base: #ffc600;
  --spacing: 10px;
  --blur: 10px;
}
```

and here is the syntax for usage:

```css
html {
  box-sizing: border-box;
  background: var(--base);
  font-family: 'Source Sans Pro', Helvetica, Clean, sans-serif;
  font-size: 100%;
  font-weight: 400;
}
```

[Can I Use](http://caniuse.com/#search=css%20v)

Note - because css variables are inherited from an element they cannot be used for media query breakpoints. -->

### Header SASS

Create a new `_header.scss` file and cut and paste the header and h1 CSS rules into it:

```css
header {
    height: 24vh;
    background: url(../img/img.jpg) center no-repeat;
    background-size: cover;
    display: flex;
    align-items: center;
    justify-content: center;

    h1 {
        color: white;
        font-size: 7vw;
        font-weight: 400;
        text-shadow: 3px 4px 0 rgba(0, 0, 0, 0.2);
    }
}
```

Import the new header SASS file into `styles.scss`:

```css
@import "imports/variables";
@import "imports/base";
@import "imports/header";
@import "imports/nav";
```

### Ampersands

Frequently used with pseudo selectors.

In `_variables.scss`:

```css
$link-blue: #007eb6;
```

In `_base.scss`:

```css
a {
  color: $link-blue;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
}
```

They are used prefixed before the selector in nested SASS (demo only).

```css
body {
  margin: 0;
  &.fixed-nav nav {
    position: fixed;
    box-shadow: 0 5px 3px rgba(0, 0, 0, 0.1);
    top: 0;
    width: 100%;
    z-index: 1;
  }
  &.fixed-nav .site-wrap {
    transform: scale(1);
  }
}
```

Postfix: use of ampersand at the end of the selector (demo only):

```css
nav {
  display: flex;
  background: #007eb6;
  top: 0;
  width: 100%;
  transition: all 0.5s;
  position: relative;
  z-index: 1;
   .fixed-nav & {
    position: fixed;
    box-shadow: 0 5px 3px rgba(0, 0, 0, 0.1);
  }
}
```

and (demo only):

```css
.site-wrap {
  max-width: 780px;
  margin: 40px auto;
  background: white;
  padding: 40px;
  text-align: justify;
  box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.05);
  transform: scale(0.98);
  transition: transform 0.5s;
  body.fixed-nav & {
    transform: scale(1);
  }
}
```

### Media Queries

The birth of responsive design is [this article](http://alistapart.com/article/responsive-web-design).

The "grand daddy" of media queries are print stylesheets:

```css
@media print {
  a[href]:after {
    content: " (" attr(href) ") ";
  }
}
```

In `_header.scss`:

```css
@media screen and (min-width: $break-two){
  // 740px
  header {
    height: 10vh;
  }
}
```

Examine using the Toggle Device Toolbar in Chrome's developer tools.

### The Device meta tag

Test in the browser using the Developer Tools.

1. by resizing the visible area
1. by Toggling the Device Toolbar

[The responsive meta tag](https://css-tricks.com/snippets/html/responsive-meta-tag/)

```html
<meta name="viewport" content="width=device-width">
```

## Mobile First Design

### min-width

`@media (min-width: $break-two){ ... }`

Translation:

If the device width is greater than or equal to 760px then do {...}.

If the actual device width is 320px this condition will return false.

### max-width

`@media (max-width: $break-two) { ... }`

Translation:

If the device width is less than or equal to 760px then do {...}

The choice between max and min width has profound consquences for the way you write your CSS. Typically, with min-width patterns, you're designing for mobile first. With max-width patterns, you're designing for desktop first.

Mobile first design: use `min-width` media queries to add features to larger screens instead of using `max-width` media queries to add features to smaller screens.

### min / max width

`@media screen and (min-width:100px) and (max-width:200px) { ... }`

In this example you are only targeting devices with a width between 100px and 200px. You shouldn't need to do this often.

### Nested Media Query (SASS)

```css
header {
  height: 24vh;
  background: url(../img/img.jpg) center no-repeat;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  @media(min-width: $break-two){
    height: 14vh;
  }
  h1 {
      color: white;
      font-size: 7vw;
      font-weight: 400;
      text-shadow: 3px 4px 0 rgba(0, 0, 0, 0.2);
  }
}
```

If we want to work mobile first then we want to establish the default CSS as that NOT in the media query (see the `h1` below):

```css
header {
  height: 14vh;
  background: url(../img/img.jpg) center no-repeat;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  @media(min-width: $break-two){
    height: 24vh;
  }
    h1 {
      color: white;
      font-size: 7vw;
      font-weight: 400;
      text-shadow: 3px 4px 0 rgba(0, 0, 0, 0.2);
      @media (min-width: $break-two){
        font-size: 8vw;
        font-weight: 300;
      }
    }
  }
```

Leveraging SASS nesting in your media queries enforces a specific organization of your code. The media queries are grouped together with the element - not in separate files or in separate blocks within your CSS.

### The Navbar

Move all nav related css into a new partial `_nav.scss` and import.

Start by nesting the nav and ul tags:

```css
nav {
  background: #007eb6;
  width: 100%;
  transition: all 0.5s;
  z-index: 1;
  ul {
    list-style: none;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 2.5rem;
  }
}
```

and then extend it to nest everything except the fixed-nav related material:

```css
nav {
  background: #007eb6;
  width: 100%;
  transition: all 0.5s;
  z-index: 1;
  ul {
    list-style: none;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 2.5rem;
  }
  li {
    flex: 1;
    text-align: center;
  }
  a {
    text-decoration: none;
    display: inline-block;
    color: white;
  }

  li.logo img {
    padding-top: 0.25rem;
    width: 2.5rem;
  }
  li.logo {
    max-width: 0;
    overflow: hidden;
    background: white;
    transition: all 0.5s;
    font-weight: 600;
    font-size: 30px;
  }
}

.fixed-nav li.logo {
  max-width: 500px;
}

body.fixed-nav nav {
  position: fixed;
  top: 0;
  box-shadow:0 5px 3px rgba(0,0,0,0.1);
  width: 100%;
  z-index: 100;
}

body.fixed-nav .site-wrap {
  transform: scale(1);
}
```

Use the ampersand to further nest the code (see the `.logo img` selector):

```css
nav {
  background: #007eb6;
  width: 100%;
  transition: all 0.5s;
  z-index: 1;
  ul {
    list-style: none;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 2.5rem;
  }
  li {
    flex: 1;
    text-align: center;
    &.logo {
      max-width: 0;
      overflow: hidden;
      background: white;
      transition: all 0.5s;
      font-weight: 600;
      font-size: 30px;
    }
    &.logo img {
      padding-top: 0.25rem;
      width: 2.5rem;
    }
  }
  a {
    text-decoration: none;
    display: inline-block;
    color: white;
  }
}

.fixed-nav li.logo {
  max-width: 500px;
}

body.fixed-nav nav {
  position: fixed;
  top: 0;
  box-shadow:0 5px 3px rgba(0,0,0,0.1);
  width: 100%;
  z-index: 100;
}

body.fixed-nav .site-wrap {
  transform: scale(1);
}
```

Nest the `fixed-nav` using an ampersand _after_ the selector:

```css
nav {
  background: #007eb6;
  width: 100%;
  transition: all 0.5s;
  z-index: 1;
  ul {
    list-style: none;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 2.5rem;
  }
  li {
    flex: 1;
    text-align: center;
    &.logo {
      max-width: 0;
      overflow: hidden;
      background: white;
      transition: all 0.5s;
      font-weight: 600;
      font-size: 30px;
      .fixed-nav & {
        max-width: 500px;
      }
    }
    &.logo img {
      padding-top: 0.25rem;
      width: 2.5rem;
    }
  }
  a {
    text-decoration: none;
    display: inline-block;
    color: white;
  }
}

body.fixed-nav nav {
  position: fixed;
  top: 0;
  box-shadow:0 5px 3px rgba(0,0,0,0.1);
  width: 100%;
  z-index: 100;
}

body.fixed-nav .site-wrap {
  transform: scale(1);
}
```

Flip the `<ul>` flex direction on small screens vs wide:

```css
  ul {
    list-style: none;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 2.5rem;
    flex-direction: column;
    @media screen and (min-width: $break-two) {
      flex-direction: row;
    }
  }
```

Hide the links initially on small screens while maintaining the flex display on wide:

```css
  li {
    flex: 1;
    text-align: center;
    display: none;
    @media screen and (min-width: $break-two) {
      display: flex;
    }
    &.logo {
      display: block;
      // max-width: 0;
      // overflow: hidden;
      ...
    }
    ...
  }
...
```

Make clicking on the logo show the menu on narrow screens:

```js
if (document.documentElement.clientWidth <= 740) {
  logo.addEventListener('click', showMenu);
}

function showMenu(e) {
  document.body.classList.toggle('show');
  e.preventDefault();
}
```

Add to `_nav.scss`:

```css
.show ul li {
    display: block !important;
  }
```

## Notes

A working `_nav.scss`:

```css
nav {
  background: #007eb6;
  width: 100%;
  transition: all 0.5s;
  z-index: 1;
  ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    @media screen and (min-width: $break-two) {
      flex-direction: row;
      align-items: center;
    }
  }
  li {
    flex: 1;
    display: none;
    padding: 0.25rem;
    @media screen and (min-width: $break-two) {
      display: flex;
      justify-content: center;
    }
    &.logo {
      padding: 0;
      display: flex;
      background: white;
      font-size: 30px;
      font-weight: 600;
      @media screen and (min-width: $break-two) {
      max-width: 0;
      overflow: hidden;
      transition: all 0.5s;
      }
      .fixed-nav & {
        max-width: 100%;
      }
    }
    &.logo img {
      padding-top: 0.25rem;
      width: 2.5rem;
    }
  }
  a {
    text-decoration: none;
    display: inline-block;
    color: white;
  }
}

body.fixed-nav nav {
  position: fixed;
  top: 0;
  box-shadow:0 5px 3px rgba(0,0,0,0.1);
  width: 100%;
  z-index: 100;
}

body.fixed-nav .site-wrap {
  transform: scale(1);
}
.show ul li {
  display: block !important;
}
```

## SASS Links

* [The SASS Way](http://thesassway.com)
* [Responsive Design Patterns](https://bradfrost.github.io/this-is-responsive/)

## Babel

Install the dependencies and test:

```js
{
  "name": "basic-dom-dd2",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "watch-node-sass": "node-sass --watch scss/styles.scss --output public/css/  --source-map true",
    "start": "browser-sync start --browser \"google chrome\" --server 'public' --files 'public'",
    "babel": "babel app.js --watch --out-file test.js",
    "boom!": "concurrently \"npm run start\" \"npm run watch-node-sass\" "
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "babel-cli": "^6.22.2",
    "babel-preset-es2015": "^6.22.0",
    "browser-sync": "^2.18.6",
    "concurrently": "^3.1.0",
    "node-sass": "^4.4.0"
  },
  "babel": {
    "presets": [
      "es2015"
    ]
  }
}
```

Compile the js into the public/js directory:

```js
"babel": "babel app.js --watch --out-file public/js/main.js",
```

Add babel to our concurrent commands:

```js
"boom!": "concurrently \"npm run start\" \"npm run watch-node-sass\"  \"npm run babel\" "
```

## GIT and GITHUB

Since we've just created a nice reusable setup we should save it.

Git is a version control system originally invented for use developing Linux by Linus Torvalds. It is the standard version tool and integrates with Github to permit collaboration.

There is a handy and very simple tutorial for Git on [the Git Website](https://try.github.io/levels/1/challenges/1) which is highly recommended for newbies.

1. make sure terminal is in the `basic-dom` directory using `cd` (drag-and-drop, copy paste)
1. initialize the repo:

```bash
git init
```

Configuring Git - only if you haven't done this before, and you only need to do this once:

```bash
git config
git config --global user.name " ***** "
git config --global user.email " ***** "
git config --list
```

* Add (watch) all your files:

```bash
git add .
```

Once you have made changes you need to commit them

```bash
git commit -m 'initial commit'
```

Note: `git commit`  without the `-m` flag goes into VI - a text popular UNIX text editor. To avoid this always using the -m flag when committing. (If you end up in VI, hit ESC and type “:q” to exit.)

Git Status

```bash
git status
On branch master
nothing to commit, working directory clean
```

* Create a new branch:

```bash
git branch <new branchname>
git checkout <new branchname>
git branch
```

To merge branches

* make sure the branch you want to merge is clear (`$ git status`)
* checkout the branch you want to merge into
* run status on that branch too (make sure it is clear)

```bash
git checkout master
git status
git merge <new branchname>
```

Delete branches:

```bash
git branch -d <branchname>
```

Pushing Files to Remote Repos - Github

Note: always create a .gitignore file to prevent local working / utility files from being pushed.

```bash
.sass_cache
.DS_store
node_modules
```

* Log into Github, create and new repo and follow the instructions e.g.:

```bash
git remote add origin https://github.com/<nameofgithubrepo>
git push -u origin master
```

Finally - when downloading a github repo use the `clone` method to move it to your local disk while retaining the git history, branches, and etc.

Use of MSCode as a Git / diff client?

## Server Accounts

Username is the first seven letters of your last name + first letter of first name

Hostname is oit2.scps.nyu.edu

Password is first initial, last initial, 123890

e.g. devereld // dd123890

Test to see if your account is active by entering this URL into a new browser tab (use your username after the tilde):

`http://oit2.scps.nyu.edu/~******`

Ensure you are using sFTP (port 22).

Suggested clients: Cyberduck, FileZilla
