const nav = document.getElementById('main');
const navLinks = document.getElementById('nav-links');
const markup = `${navItems.map(listItem => `<li><a href="${listItem.link}">${listItem.label}</a></li>`).join('')}`;
navLinks.innerHTML = markup;

// const inventors = [
// 	{ first: 'Albert', last: 'Einstein', year: 1879, passed: 1955 },
// 	{ first: 'Isaac', last: 'Newton', year: 1643, passed: 1727 },
// 	{ first: 'Galileo', last: 'Galilei', year: 1564, passed: 1642 },
// 	{ first: 'Marie', last: 'Curie', year: 1867, passed: 1934 },
// 	{ first: 'Johannes', last: 'Kepler', year: 1571, passed: 1630 },
// 	{ first: 'Nicolaus', last: 'Copernicus', year: 1473, passed: 1543 },
// 	{ first: 'Max', last: 'Planck', year: 1858, passed: 1947 }
// ];
