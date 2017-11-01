# Session Two

Today we begin with some tooling - using Node Package Manager to implement a simple workflow for SASS and automatic browser refresh. We will start using SASS on our project to create responsive features and finish by using GIT and Github to create versioning.

## Homework

There is a starter page for homework available in this repo in the homework directory. Please review the tasks there.

1. Review setting up a workflow using NPM on your computer (use last week's homework files) which includes node-sass, browsernyc, and concurrently
2. Convert the CSS to SASS - use variables and nesting
3. Implement media queries using a mobile first strategy (add as much content as you think you need)

### Faking a Single Page Application (SPA)

These allow us to navigate (`index.html#research`) to sections of the document marked up with the corresponding id:

`<p id="watchlist">`

Note that clicking on an hashed link doesn't refresh the page. This makes hashes an important feature for creating SPAs - they are used to load different content via AJAX from a server with no page refresh.

We'll set up our page emulate a single page application.


```js
const siteWrap = document.querySelector('.site-wrap');
window.onload = function(){
  // window.location.hash = '#watchlist'
  // setTimeout( () => window.location.hash = '#watchlist' , 500)
}
```

`array.prototype.filter()`

```js
window.onhashchange = function() {
  let newloc = window.location.hash;
  console.log(newloc)
  let newContent = navItems.filter(
    function(navItem){
      return navItem.link == newloc
    })
  console.log(newContent)
  siteWrap.innerHTML = `
  <h2>${newContent[0].header}</h2>
  <p>${newContent[0].content}</p>
  `;
}
```

Refactor:

```js
window.onhashchange = function() {
  let newloc = window.location.hash;
  let newContent = navItems.filter( navItem => navItem.link == newloc );
  siteWrap.innerHTML = `
  <h2>${newContent[0].header}</h2>
  <p>${newContent[0].content}</p>
  `;
}
```


## NPM for SASS and Browser Refresh

* [Node Package Manager](https://www.npmjs.com)

* [SASS](http://sass-lang.com)

* [node-sass](https://www.npmjs.com/package/node-sass) and the [github repo](https://github.com/sass/node-sass)


### Node Package Manager (NPM)

#### For Windows users

This script style worked for me when trying to "start" browser sync:

```sh
"start": "browser-sync start --browser \"chrome.exe\" --server \"app\" --files \"app\"" 
```

Essentially, it requires '.exe' for chrome and uses delineated double quotes - \"

Additional Windwos resources for Nodejs:

[Microsoft's Nodejs Guidelines](https://github.com/Microsoft/nodejs-guidelines) is full of helpful information.

Of particular note if you are trying to use the `node-sass` npm package is [this entry](https://github.com/Microsoft/nodejs-guidelines/blob/master/windows-environment.md#compiling-native-addon-modules) on compiling modules.

It appears that Windows users need to install [this npm package](https://github.com/nodejs/node-gyp#on-windows)

Windows users may wish to install and use [Visual Studio Code](https://code.visualstudio.com) as a text editor - it may help you feel a bit more at home.


====

1. `$ cd` to the working directory
1. run `$ npm init` and accept the defaults
2. examine the `package.json` file
2. `$ npm install --save-dev node-sass`
3. examine the file again (--save-dev vs. --save, vs. -g, and the node_modules folder)
3. Add a [sass script](https://github.com/sass/node-sass#usage-1) to the package.json file. e.g.:

```js
{
  "name": "basic-dom",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "build-css": "node-sass --include-path scss scss/styles.scss   public/css/styles.css"
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "node-sass": "^4.3.0"
  }
}
```

Create `scss` directory and place `styles.scss` within. Test with a variable: `$badass: #bada55;` and:

```
html {
  background: $badass;
  ...
}
```

Compile the css: `$ npm run build-css`

Add watching:

```
  "scripts": {
    "build-css": "node-sass --include-path scss scss/styles.scss   public/css/styles.css",
    "watch-node-sass": "node-sass --watch scss/styles.scss --output public/css/  --source-map true"
  },
```

and `$ npm run watch-node-sass`

Now to get rid of the manual refresh.

#### Browser Sync

[BrowserSync](https://browsersync.io) is billed as a testing tool but makes a nice server and auto refresher for everyday use. With npm you have the option of installing it globally or on a per project basis.

1. Stop any process running in the terminal
1. `$ npm install browser-sync --save-dev`
2. Add a task to our npm scripts e.g. `"start-test": "browser-sync start --directory --server --files '*.js, *.html, *.css'",`
3. [Documentation](https://browsersync.io/docs/command-line)
2. test it in the terminal, look at `localhost:3001`
2. Add/Edit another task to our npm scripts e.g. `"start": "browser-sync start --browser \"google chrome\" --server 'public' --files 'public'",`
3. Restart and test

#### Concurrently

As it stands we need two terminal tabs to run our two processes - SASS and BrowserSync - in. To ameliorate this we can install a simple  utility called Concurrently and write a 'master' npm script.

1. `$ npm install concurrently --save-dev`
2. add a new script: `"boom!": "concurrently \"npm run start\" \"npm run watch-node-sass\" "`
3. `$ npm run boom!`

Here's our final package.json:

```js
{
  "name": "basic-dom",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "watch-node-sass": "node-sass --watch scss/styles.scss --output public/css/  --source-map true",
    "start": "browser-sync start --browser \"google chrome\" --server 'public' --files 'public'",
    "boom!": "concurrently \"npm run start\" \"npm run watch-node-sass\" "
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "browser-sync": "^2.18.6",
    "concurrently": "^3.1.0",
    "node-sass": "^4.4.0"
  }
}

```



## SASS

We are going to retrofit our page for responsive layout using SASS - and in particular node-sass. 

[Sass homepage](http://sass-lang.com)

[Bootstrap SASS](https://github.com/twbs/bootstrap-sass)

SASS Features:

* error checking 
* 📌 watch for errors and messages in the terminal if it looks like the CSS is not being processed
* variables
* imports 
* better structure and more

Create `_variables.scss` in an new `scss > imports` folder

* why are we using an underscore? 

* (See [bootstrap in sass](https://github.com/twbs/bootstrap-sass/tree/master/assets/stylesheets))

Add `@import "imports/variables";` to the top of styles.scss

Add badass to variables as well as:
```
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

Checkout: [StatCounter Global Stats - Screen Resolution Market Share](href="http://gs.statcounter.com/screen-resolution-stats")

Create `_main.scss` in `scss > imports` folder

Copy paste all code from styles (except first line) and add `@import "imports/main";` to the top of styles.scss



#### Aside - CSS native variables

By convention apply native variables to the highest level element in the DOM (although any element will work):

```
:root {
  --base: #ffc600;
  --spacing: 10px;
  --blur: 10px;
}
```

and here is the syntax for usage:

```
html {
  box-sizing: border-box;
  background: var(--base);
  font-family: 'Source Sans Pro', Helvetica, Clean, sans-serif;
  font-size: 100%;
  font-weight: 400; 
}
```

[Can I Use](http://caniuse.com/#search=css%20v)

#### Nesting - _header.scss

Create a new _heading.scss import and move the code into it as:

```css
header {
  text-align: center;
  height: 40vh;
  background: url(../img/img.jpg) top no-repeat;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  h1 {
    color: white;
    font-size: 7vw;
    font-weight: 300;
    text-shadow: 3px 4px 0 rgba(0, 0, 0, 0.2); 
  }
}
```

#### Ampersands

Frequently used with pseudo selectors:

```css
a {
  color: $links;
  &:hover {
    text-decoration: underline;
  }
}
```

=====Prefix: Before (demo only):

```css
body {
  margin: 0; 
}
body.fixed-nav nav {
  position: fixed;
  box-shadow: 0 5px 3px rgba(0, 0, 0, 0.1); 
}
body.fixed-nav .site-wrap {
  transform: scale(1); 
}
```

=====Prefix: After (demo only):

```css
body {
  margin: 0;
  &.fixed-nav nav {
    position: fixed;
    box-shadow: 0 5px 3px rgba(0, 0, 0, 0.1); 
  }
  &.fixed-nav .site-wrap {
    transform: scale(1); 
  }
}
```

Postfix: use of ampersand at the end of the selector:

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

#### Media Queries

The grand daddy of media queries - print stylesheets:

```
@media print {
  a[href]:after {
    content: " (" attr(href) ") ";
  }
}
```

The birth of [responsive design](http://alistapart.com/article/responsive-web-design) 

In `_header.scss`:

```css
@media screen and (min-width: 760px){
  header {
    // background-size: 100% auto;
    background-attachment: fixed;
  }
}
```

Compare this to the media query in last week's homework assignment.

```css
@media (max-width: 600px) {
  .site-header {
    flex-wrap: wrap;
  }
  .site-nav {
    order: 2;
    background: #333;
    width: 100%;
  }
}
```

The first adds CSS instructions to wider screens (Mobile First responsive design) and the second adds features to smaller screens.


#### Sample 1

`@media screen and (min-width: 760px){ ... }`

#### Translation

If the device width is greater than or equal to 760px then do {...}
If the actual device width is 320px this condition will return false.

#### Sample 2

`@media (max-width: 600px) { ... }`

#### Translation 2

If the device width is less than or equal to [specified #], then do {...}

The choice between max and min width has profound consquences for the way you write your CSS. Typically, with min-width patterns, you're designing for mobile first. With max-width patterns, you're designing for desktop first. 

Mobile first design: use min-width media queries to add features to larger screens `@media (min-width: 46.25em) { }` instead of using max-width media queries to add features to smaller screens.

#### Sample 3

`@media screen and (min-width:100px) and (max-width:200px) { ... }`

#### Translation 3

In this example you are only targeting devices with a width between 100px and 200px.


#### Nested Media Query (SASS)

```css
header {
  text-align: center;
  height: 40vh;
  background: url(../img/img.jpg) top no-repeat;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  @media screen and (min-width: $break-two){
    background-size: 100% auto;
    background-attachment: fixed;
  }
  h1 {
    color: white;
    font-size: 7vw;
    font-weight: 300;
    text-shadow: 3px 4px 0 rgba(0, 0, 0, 0.2); 
  }
}
```

If we want to work mobile first then we want to establish the default CSS as that NOT in the media query:

```css
header {
  text-align: center;
  height: 20vh;
  background: url(../img/img.jpg) top no-repeat;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  @media (min-width: $break-two){
    height: 40vh;
    background-size: 100% auto;
    background-attachment: fixed;
  }
  h1 {
    color: white;
    font-size: 12vw;
    line-height: 1;
    font-weight: 300;
    text-shadow: 3px 4px 0 rgba(0, 0, 0, 0.2); 
    @media (min-width: $break-two){
      font-size: 7vw;
    }
  }
}
```

Leveraging SASS nesting in your media queries enforces a specific organization of your code. The media queries are grouped together with the element - not in separate files or in separate blocks within your CSS.

Move all nav related css into a new partial `_nav.scss` and import.

Nested:

```css
nav {
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
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    min-height: 2.25rem; 
  }
  li {
    flex: 1;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center; 
    &.logo {
      max-width:0;
      overflow: hidden;
      background: white;
      transition: all 0.5s;
      font-weight: 600;
      font-size: 30px;
      .fixed-nav & {
        max-width:500px;
      }
      img {
        padding-top: 0.25rem;
        width: 2.5rem;
      }
    }
  }
  a {
    text-decoration: none;
    display: inline-block;
    color: white; 
  }
}

```

Flip the `<ul>` flex direction on small screens vs wide:

```css
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    min-height: 2.25rem; 
    @media screen and (min-width: $break-two) {
      flex-direction: row;
    }
  }
```

Hide the nav-liks initially on small screens while maintaining the flex display characteristics on wide:

```css
  #nav-links {
    display: none;
    @media (min-width: $break-two){
      display: flex;
    }
  }
  li {
    padding: 0.5rem;
    align-items: center; 
    @media screen and (min-width: $break-two) {
      padding: 0;
      display: flex;
      flex: 1;
      justify-content: center;
      text-align: center;
    }
```

`flex: 1;`

Show the logo in small screens to use as a button (e.g. hamburger icon) to show the menu:

```css
.logo {
  display: block;
  max-width:100%;
  transition: all 0.5s;
  font-weight: 600;
  font-size: 30px;
  @media screen and (min-width: $break-two) {
    max-width:0;
    overflow: hidden;
  }
  .fixed-nav & {
    max-width:500px;
  }
  img {
    padding-top: 0.25rem;
    width: 2.5rem;
  }
}
```

Make clicking on the logo show the menu on narrow screens:

```js
if (document.documentElement.clientWidth <= 740) {
  logo.addEventListener('click', showMenu);
}

function showMenu(e){
  navLinks.classList.toggle('show');
  e.preventDefault();
}
```

```
window.onhashchange = function() {
  if(location.hash == '#0'){
    return;
  }
  let newloc = window.location.hash;
  ...
```

Add to `_nav.scss`:

```
.show {
  display: block !important;
}
```

## And critically... The viewport META tag

* Use the meta tag `<meta name="viewport" content="width=device-width, initial-scale=1.0">` to ensure this works on devices

* Chrome device toolbar

* http://daniel.deverell.com/barcap/public


## SASS Links

[The SASS Way](http://thesassway.com)

[Responsive Design Patterns](https://bradfrost.github.io/this-is-responsive/)


## Babel

Install the dependencies and test:

```
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

```
"babel": "babel app.js --watch --out-file public/js/main.js",
```

Add babel to our concurrent commands:

```
"boom!": "concurrently \"npm run start\" \"npm run watch-node-sass\"  \"npm run babel\" "
```



## GIT and GITHUB

Since we've just created a nice reusable setup we should save it. 

Git is a version control system originally invented for use developing Linux by Linus Torvalds. It is the standard version tool and integrates with Github to permit collaboration.

There is a handy and very simple tutorial for Git on [the Git Website](https://try.github.io/levels/1/challenges/1) which is highly recommended for newbies.

1. make sure terminal is in the `basic-dom` directory using `cd` (drag-and-drop, copy paste)
1. initialize the repo:

```
git init
```

Configuring Git - only if you haven't done this before, and you only need to do this once:

```
git config
git config --global user.name " ***** "
git config --global user.email " ***** "
git config --list
```

* Add (watch) all your files:

```
git add .
```

Once you have made changes you need to commit them

```
git commit -m 'initial commit'
```

Note: `git commit`  without the `-m` flag goes into VI - a text popular UNIX text editor. To avoid this always using the -m flag when committing. (If you end up in VI, hit ESC and type “:q” to exit.)

Git Status

```
git status
On branch master
nothing to commit, working directory clean
```

* Create a new branch:

```
git branch <new branchname>
git checkout <new branchname>
git branch
```

To merge branches

* make sure the branch you want to merge is clear (`$ git status`)
* checkout the branch you want to merge into
* run status on that branch too (make sure it is clear)

```
git checkout master
git status
git merge <new branchname>
```

Delete branches:

```
git branch -d <branchname>
```

Pushing Files to Remote Repos - Github

Note: always create a .gitignore file to prevent local working / utility files from being pushed.

```
.sass_cache
.DS_store
node_modules
```

* Log into Github, create and new repo and follow the instructions e.g.:

```
git remote add origin https://github.com/<nameofgithubrepo>
git push -u origin master
```

Finally - when downloading a github repo use the `clone` method to move it to your local disk while retaining the git history, branches, and etc.

Use of MSCode as a Git / diff client?



### Notes

Some interesting applications of SVG:

* http://responsivelogos.co.uk
* http://www.svgeneration.com/recipes/Beam-Center/

## Server Accounts

Username is the first seven letters of your last name + first letter of first name

Hostname is oit2.scps.nyu.edu

Password is first initial, last initial, 123890

e.g. devereld // dd123890

Test to see if your account is active by entering this URL into a new browser tab (use your username after the tilde):

http://oit2.scps.nyu.edu/~******

Ensure you are using sFTP (port 22).

Suggested clients: Cyberduck, FileZilla


<!-- 2. Optional: Download the done branch for this week's class and correct one or more of the responsive display issues:
    * The hamburger menu does not need to display on wide screens - hide it
    * The layout of the menu on small screens is awkward - try optimizing it so it looks more like [this](http://getbootstrap.com/examples/navbar-fixed-top/) - bonus if you can make it [animate](http://css3.bradshawenterprises.com/animating_height/) on click
    * When the user clicks on a link in the small screen the menu stays open - have it close after a click
    * Any others? -->



