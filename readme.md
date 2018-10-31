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

## AJAX - Adding Categories

Let's add additional categories to our page.

Comment out the function call:

```js
// requestStories();
```

Add a categories variable:

```js
var elem = document.querySelector('.site-wrap');
const nytapi = 'd7d88f32a04d4c6aab4e46735441d0ee';
const limit = 3;
var categories = ['food', 'fashion', 'travel']; // NEW
```

Minimize the renderStoreis function:

```js
function renderStories(data) {
  console.log(data)
  // var content = (JSON.parse(data.responseText));
  // var stories = content.results.slice(0, limit);
  // //NEW
  // const htmlFrag = stories.map(story => `
  //   <div class="entry">
  //   <div>
  //     <img src="${story.multimedia[0].url}" /> 
  //     <h3><a target="_blank" href="${story.short_url}">${story.title}</a></h3>
  //   </div>
  //   <p>${story.abstract}</p>
  //   </div>
  // `).join('')
  // elem.innerHTML = htmlFrag;
}
```

Reset our requestStories function:

```js
function requestStories(section) {

  // Setup the request URL
  var url = 'https://api.nytimes.com/svc/topstories/v2/' + section + '.json?api-key=' + nytapi;

  // Create the XHR request
  var xhr = new XMLHttpRequest();

  // Setup our listener to process request state changes
  xhr.onreadystatechange = function () {

    // Only run if the request is complete
    if (xhr.readyState !== 4) return;

    // Process the response
    if (xhr.status >= 200 && xhr.status < 300) {
      // If successful
      renderStories(xhr, section);
    }

  };

  // Setup our HTTP request
  xhr.open('GET', url, true);

  // Send the request
  xhr.send();

};
```

Create a new function and call it:

```js
var getArticles = function () {
  categories.forEach(function (category, index) {
    // Make the request
    requestStories(category);
  });
};

getArticles();
```

in the renderStories function

```js
function renderStories(stories, title) {
  stories = JSON.parse(stories.responseText).results.slice(0, limit);
  stories.forEach(function (story) {
    var storyEl = document.createElement('div');
    storyEl.className = 'entry';
    storyEl.innerHTML = `
      <div>
      <img src="${story.multimedia[0].url}" /> 
      <h3><a target="_blank" href="${story.short_url}">${story.title}</a></h3>
      </div>
      <p>${story.abstract}</p>
    `;
    elem.append(storyEl); 
  });
}
```

Create a section heading div:

```js
function renderStories(stories, title) {
  // NEW
  var sectionHead = document.createElement('div');
  sectionHead.id = title;
  sectionHead.innerHTML = `<h3 class="section-head">${title}</h3>`;
  elem.prepend(sectionHead)

  stories = JSON.parse(stories.responseText).results.slice(0, limit);
  stories.forEach(function (story) {
    var storyEl = document.createElement('div');
    storyEl.className = 'entry';
    storyEl.innerHTML = `
      <div>
      <img src="${story.multimedia[0].url}" /> 
      <h3><a target="_blank" href="${story.short_url}">${story.title}</a></h3>
      </div>
      <p>${story.abstract}</p>
    `;
    sectionHead.append(storyEl); // NEW
  });
}
```

Style it:

```css
.section-head {
    text-transform: uppercase;
    padding-bottom: 0.25rem;
    margin-bottom: 1rem;
    color: #666;
    border-bottom: 1px solid #007eb6;
}
```

Replace navitems.js with

```js
const navItems = [
  {
    label: 'LOGO',
    link: '#'
  },
  {
    label: 'Travel',
    link: '#travel'
  },
  {
    label: 'Fashion',
    link: '#fashion'
  },
  {
    label: 'Food',
    link: '#food'
  }
];
```

## GIT and GITHUB

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