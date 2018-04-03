// create the dynamic nav based on the navItems array
const nav = document.getElementById('main');
const navLinks = nav.querySelector('#nav-links');
const markup = `${navItems.map(listItem => `<li><a href="${listItem.link}">${listItem.label}</a></li>`).join('')}`;
navLinks.innerHTML = markup;

const logo = document.querySelector('#main ul li');
logo.classList.add('logo');
logo.firstChild.innerHTML = '<img src="img/logo.svg" />';

// sticky nav
let topOfNav = nav.offsetTop;

window.addEventListener('scroll', fixNav)

function fixNav() {
  // console.log(topOfNav);
  // console.log(window.scrollY);
  if (window.scrollY >= topOfNav) {
    document.body.style.paddingTop = nav.offsetHeight + 'px';
    document.body.classList.add('fixed-nav')
  } else {
    document.body.style.paddingTop = 0;
    document.body.classList.remove('fixed-nav')
  }
}

// hashes
const siteWrap = document.querySelector('.site-wrap');

window.onhashchange = function() {
  let newloc = window.location.hash;
  // console.log(newloc)
  let newContent = navItems.filter(
    navItem => navItem.link == newloc
  )
  siteWrap.innerHTML = `
    <h2>${newContent[0].header}</h2>
    ${newContent[0].content}
  `
}

