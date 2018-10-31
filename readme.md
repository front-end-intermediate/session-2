# II - DOM Manipulation

## Reading

<!-- 1. Bob on [Template Strings](https://youtu.be/INPob8yPyBo)
1. Bob on DOM scripting parts [one](https://youtu.be/0ik6X4DJKCc), [two](https://youtu.be/mPd2aJXCZ2g), [three](https://youtu.be/wK2cBMcDTss) and [four](https://youtu.be/i37KVt_IcXw).  Please make every effort to follow along on your computer.
1. If you want more information on navigating with JSON and JavaScript watch [this video](https://www.youtube.com/watch?v=xN9QxPtK2LM). The source code for the lessons is [here](https://github.com/curran/screencasts/tree/gh-pages/navigation). -->

## Homework

1. Review the notes below, paying particular attention to and researching anything that was unclear to you in class.

## NPM Manifests

We will start off using [Browser Sync](https://www.browsersync.io) as our sample application.

```sh
npm init -y
npm i browser-sync --save-dev
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

Or, cross platform, for a Mac or Windows PC:

```js
"start": "browser-sync start --server \"app\" --files \"app\""
```

Note: Windows users should check out Microsoft's [Nodejs Guidelines](https://github.com/Microsoft/nodejs-guidelines).

And run the process:

```sh
npm run start
```

<!-- ## Faking a Single Page Application (SPA)

Page fragment links (`index.html#research`) allow us to navigate to sections of the document marked up with the corresponding id:

`<p id="watchlist">`

Note that clicking on a hashed link doesn't refresh the page. This makes hashes an important feature for creating SPAs - they are used to load different content via AJAX from a server with no page refresh.

We'll set up our page to _emulate_ a SPA using hashes.

This time we'll use a new event `window.onhashchange` and `filter()` and a slightly modified `navItems` array.

* examine the `navItems` array in `navItems.js`
* review the code in `main.js`
* review [.filter, .join, and .map](https://github.com/front-end-intermediate/session-1#array-methods) with arrays

Note that despite the added content in the `navItems` variable, we are currently only using it for the navigation, not the content.

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

Return values stops the execution of a function and return a value from that function.

Suppose we wanted a variable that made one of our objects globally available:

```js
function navigate(){
  let newloc = window.location.hash;

  let newContent = navItems.filter(
    function(navItem){
      return navItem.link == newloc
    })
  return newContent;
  console.log(newContent[0].header)
}

let test = navigate()
```

Filter selects an entry in navItems based on its hash (`newLoc`) and saves it into a const variable `newContent`.

Finally, set the innerHTML of the `siteWrap` to content from the resulting array:

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

Note: arrow functions have an implicit return.

Establish a default landing page and call navigate to set the initial view:

```js
if(!location.hash) {
  location.hash = "#watchlist";
}

navigate();
```

## JSON

When sending data you need to convert it to a string using [JSON.stringify()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify).

Run this in the browser's console:

```js
JSON.stringify(navItems, null, 4)
```

This is the source for `db.json` at the top level of today's folder.

We could use `db.json` as a static file but lets use it with [JSON Server](https://github.com/typicode/json-server) instead.

Create a new terminal in the editor and install it using npm (`--save-dev`):

```sh
npm i json-server --save-dev
```

and add this script in `package.json`:

```js
"json": "json-server --watch db.json --port 3004"
```

We will use a second terminal to run `npm run json` as our first is tied up with browser-sync.

Test it at:

[http://localhost:3004](http://localhost:3004)

[http://localhost:3004/content](http://localhost:3004/content).

Create a new function `fetchData`:

```js
function fetchData() {
  var xhr = new XMLHttpRequest();
  
  xhr.onload = function () {
    console.log(JSON.parse(xhr.response));
  };
  
  xhr.open('GET', 'http://localhost:3004/content', true);
  xhr.send();
}
```

Test it by calling the function from the browser console with `fetchData()`.

Add a hash and `callback`:

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

Add an image:

```js
  siteWrap.innerHTML = `
  <h2>${newContent[0].header}</h2>
  ${newContent[0].image}
  ${newContent[0].content}
  `;
```

Note the use of callbacks.

The navigation is still coming from the original `navitems.js` file. Comment it out in the html files and use the json.

Initialize our page with a call to our fetchData function using `null` (we are not looking for a page here) and a callback function:

```js
// const markup = `
// <ul>
// ${navItems.map(
//   navItem => `<li><a href="${navItem.link}">${navItem.label}</a></li>`
// ).join('')}
// </ul>
// `;

// navbar.innerHTML = markup;

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

Note that we could initialize our logo here as `logo` doesn't exist until the navigation is built.

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

We can now remove `<script src="js/navitems.js"></script>` and the HTML content from `index.html`. Just be sure to leave the empty div required by our scripts:

```html
<div class="site-wrap"></div>
``` -->

## AJAX Adding Categories

Let's add additional categories to our page.




## Sass

[Sass homepage](http://sass-lang.com)

SASS Features:

* transpiling and concatenation of multiple css files into a single download via import
* error checking (📌 watch for errors and messages in the terminal if it looks like the CSS is not displaying)
* variables
* nesting and simpler media queries

SASS processing can be accomplished using a [variety of desktop apps](https://graygrids.com/best-tools-resources-compile-manage-sass-less-stylus-css-preprocessors/), using node, or in your editor.

### Method One - Node Sass

[Node-sass](https://www.npmjs.com/package/node-sass) and its [github repo](https://github.com/sass/node-sass)

Use the existing package.json.

In the terminal (you will need to temporarily stop with Control + c):

1. `$ npm install --save-dev node-sass`
1. Add a [script](https://github.com/sass/node-sass#usage-1) to the package.json file. e.g.:

```js
  "sassy": "node-sass --watch \"scss\"  --output \"app/css/\""
```

Run the script:

`$ npm run sassy`

Note the `scss` directory and copy the contents of styles.css into `imports/_base.scss`.

(See [bootstrap in sass](https://github.com/twbs/bootstrap-sass/tree/master/assets/stylesheets))

Import `_base` into `styles.scss`:

```css
@import 'imports/base';
```

Test with a sass variable. Add:

`$badass: #bada55;`

as the first line in `_variables.scss` and then apply it to the html selector:

```css
html {
  ...
  background: $badass;
  ...
}
```

Import `_variables` into `styles.scss`:

```css
@import 'imports/variables';
```

Examine the output and inspect the html tag in the developer tool.

Cancel the process with Control-c  and add mapping to the NPM script:

```js
  "sassy": "node-sass --watch \"scss\"  --output \"app/css/\" --source-map true"
```

and then run `$ npm run sassy`.

Note the new map file and the reference to the SASS in the browser's inspector.

#### Concurrently

As it stands we need multiple terminal tabs to run our npm scripts. To improve this we will install a simple utility called Concurrently and write a 'master' npm script.

Stop all processes running in the terminals with Control-c and dispose of them.

Use the remaining terminal to install and register Concurrently:

* `$ npm install concurrently --save-dev`

Add some new scripts:

```js
"boom!": "concurrently \"npm run start\" \"npm run json\" \"npm run sassy\" ",
"boomlet!": "concurrently \"npm run start\" \"npm run json\" "
```

Run all processes:

* `$ npm run boom!`

Note that you will end up with multiple browser tabs by doing this. They are identical.

## SASS Nesting

Note the import statement and how a SASS import differs from a native CSS import such as the one used for the Google font.

Create a new `_nav.scss` file in `imports` and cut and paste the navigation CSS from `_base.scss` into it.

Import it into `styles.scss` so it now contains:

```css
@import "imports/variables";
@import "imports/base";
@import "imports/nav";
```

Nest the contents of `_nav.scss`.

## CSS Preprocessing in the Editor

Most editors will offer the ability do preprocessing as well as browser refresh.

[Visual Studio Code](https://code.visualstudio.com) offers an array of plug-ins that we can use to perform the SASS preprocessing function. VS Code is remarkably flexible and offers a setting for almost anything you could wish for. See the Visual Studio Code [documentation](https://code.visualstudio.com/docs/getstarted/settings) for changing settings.

[Live Sass Compiler](https://marketplace.visualstudio.com/items?itemName=ritwickdey.live-sass) for VS Code.

Quit the `boom!` process and run `boomlet`.

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

Note the `.vscode` directory that is created for per project settings.

Click the `Watch Sass` button at the bottom of the editor.

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

Ampersands are the 'glue' for selectors that are *not* descendant. Frequently used with pseudo selectors.

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

In `_variables`:

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

```css
@media (min-width: $break-two){
  header {
    height: 10vh;
  }
}
```

If the device width is greater than or equal to 760px then do {...}.

* `min-width` adds features to the *wide* screen

### max-width

```css

@media (max-width: $break-two){
  header {
    height: 10vh;
  }
}
```

If the device width is less than or equal to 760px then do {...}.

* `max-width` adds features to the *small* screen

The choice between max and min width has profound consquences for the way you write your CSS. Typically, with min-width patterns, you're designing for mobile first. With max-width patterns, you're designing for desktop first. For sanity, you should stick with one or the other and not mix them.

Mobile first design: use `min-width` media queries to add features to larger screens instead of using `max-width` media queries to add features to smaller screens.

### Aside: min / max width

`@media screen and (min-width:100px) and (max-width:200px) { ... }`

In this example you are only targeting devices with a width between 100px and 200px. You shouldn't need to do this often.

### Nested Media Query (SASS)

Use 10vh for small screens and 20vh for wide screens with a min-width breakpoint:

```css
header {
  height: 10vh;
  background: url(../img/img.jpg) center no-repeat;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  @media(min-width: $break-two){
        height: 20vh;
      }
  h1 {
    color: white;
    font-size: 7vw;
    font-weight: 400;
    text-shadow: 3px 4px 0 rgba(0, 0, 0, 0.2)
  }
}
```

If we want to work mobile first then we want to establish the default CSS as that NOT in the media query (see the `h1` below):

```css
header {
  height: 10vh;
  background: url(../img/img.jpg) center no-repeat;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  @media(min-width: $break-two){
        height: 20vh;
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

Comment out the code responsible for adding the logo in main.js.

```js
// const logo = document.querySelector('#main ul li');
// logo.classList.add('logo');
// logo.firstChild.innerHTML = '<img src="img/logo.svg" />';
```

Move any logo related CSS from `_base` to `_nav`.

Add a logo div to the HTML:

```html
  <nav id="main">
      <div class="logo"><img src="img/logo.svg" /></div>
    <div class="navitems"></div>
  </nav>
```

Comment out the logo related css and check to make sure you can see it (e.g. `navbar.innerHTML = markup;`).

We moved all nav related css into a new partial `_nav.scss`.

Allow the logo to display only on small screens:

```css
.logo img {
  padding-top: 0.25rem;
  width: 2.5rem;
}
.logo {
  background: white;
  @media (min-width: $break-two){
    display:  none;
  }
}
```

And allow the navitems to display only on wide screen:

```css
  .navitems {
    display: none;
    @media (min-width: $break-two){
      display: block;
    }
  }
```

Temporarily display the navitems on small screens:

```css
  .navitems {
    // display: none;
    @media (min-width: $break-two){
      display: block;
    }
  }
```

Set the `ul` to display as a row or column depending on browser width using a media query:

```css
  ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    @media (min-width: $break-two){
      flex-direction: row;
      height: 2.5rem;
      justify-content: center;
      align-items: center;
    }
  }
```

Format the list items:

```css
  li {
    flex: 1;
    padding: 0.5rem;
    @media (min-width: $break-two){
      text-align: center;
    }
  }
```

Rehide the navitems on small screen and code the logo to add a class to the document that we can use to show and hide them.

```js
const logo = document.querySelector('.logo')

logo.addEventListener('click', showMenu);

function showMenu(e) {
  document.body.classList.toggle('show');
  e.preventDefault();
}
```

Add to `_nav.scss`:

```css
.show .navitems {
  display: block !important;
}
```

Close the navigation when one of the items is selected:

```js
function showMenu(e) {
  document.body.classList.toggle('show');
  const navLinks = document.querySelectorAll('.navitems a');
  navLinks.forEach(link => link.addEventListener('click', dump))
  console.log(navLinks)
  e.preventDefault();
}

function dump(){
  document.body.classList.toggle('show');
}
```

### CSS Animation

```css
  .navitems {
    // display:none;

    max-height: 0;
    overflow: hidden;
    transition: all 0.5s;

    @media (min-width: $break-two){
      // display:block;

      max-height: 2.5rem;
      overflow: hidden;
    }
  }
```

```css
.show .navitems {
  // display: block !important;

  max-height: 800px;
}
```

## Notes

## More SASS Links

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

## Debug

Sources > Network