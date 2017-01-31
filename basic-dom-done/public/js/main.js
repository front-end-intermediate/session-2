'use strict';

var nav = document.getElementById('main');
var logo = nav.querySelector('.logo');
var markup = '' + navItems.map(function (listItem) {
	return '<li><a data-navid="' + listItem.navid + '" href="' + listItem.link + '">' + listItem.label + '</a></li>';
}).join('');
var navLinks = document.getElementById('nav-links');
navLinks.innerHTML = markup;

var topOfNav = nav.offsetTop;
function fixNav() {
	if (window.scrollY >= topOfNav) {
		document.body.style.paddingTop = nav.offsetHeight + 'px';
		document.body.classList.add('fixed-nav');
	} else {
		document.body.classList.remove('fixed-nav');
		document.body.style.paddingTop = 0;
	}
}
window.addEventListener('scroll', fixNav);

var siteWrap = document.querySelector('.site-wrap');
window.onload = function () {
	// window.location.hash = '#watchlist'
	setTimeout(function () {
		return window.location.hash = '#watchlist';
	}, 500);
};
window.onhashchange = function () {
	var newloc = window.location.hash;
	var newContent = navItems.filter(function (navItem) {
		return navItem.link == newloc;
	});
	siteWrap.innerHTML = '\n  <h2>' + newContent[0].header + '</h2>\n  <p>' + newContent[0].content + '</p>\n  ';
};

if (document.documentElement.clientWidth <= 740) {
	logo.addEventListener('click', showMenu);
}

function showMenu(e) {
	navLinks.classList.toggle('show');
	e.preventDefault();
}
