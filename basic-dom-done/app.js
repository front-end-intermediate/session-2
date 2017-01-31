const nav = document.getElementById('main');
const logo = nav.querySelector('.logo');
const markup = `${navItems.map( listItem => `<li><a data-navid="${listItem.navid}" href="${listItem.link}">${listItem.label}</a></li>`).join('')}`;
const navLinks = document.getElementById('nav-links');
navLinks.innerHTML = markup;


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
window.addEventListener('scroll', fixNav);


const siteWrap = document.querySelector('.site-wrap');
window.onload = function(){
  // window.location.hash = '#watchlist'
  setTimeout( () => window.location.hash = '#watchlist' , 500)
}
window.onhashchange = function() {
  let newloc = window.location.hash;
  let newContent = navItems.filter( navItem => navItem.link == newloc );
  siteWrap.innerHTML = `
  <h2>${newContent[0].header}</h2>
  <p>${newContent[0].content}</p>
  `;
}

if (document.documentElement.clientWidth <= 740) {
	logo.addEventListener('click', showMenu);
}

function showMenu(e){
	navLinks.classList.toggle('show');
	e.preventDefault();
}