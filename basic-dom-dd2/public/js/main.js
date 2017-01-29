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


const navAnchors = document.querySelectorAll('#main ul li a');
for (let i=0; i<navAnchors.length; i++){
  navAnchors[i].addEventListener('click', showContent)
}
const siteWrap = document.querySelector('.site-wrap');
function showContent(e){
	let id = this.dataset.navid;
	siteWrap.innerHTML = `<h2>${navItems[id].header}</h2><p>${navItems[id].content}</p>`;
	e.preventDefault();
}


const listItems = nav.querySelectorAll('li');
if (document.documentElement.clientWidth <= 740) {
	logo.addEventListener('click', showMenu);
}

function showMenu(e){
	listItems.forEach((listItem) => listItem.classList.toggle('show'));
	e.preventDefault();
}