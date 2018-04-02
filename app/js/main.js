// create the dynamic nav based on the navItems array
const nav = document.getElementById('main');
const navLinks = document.querySelector('#nav-links');
const markup = `${navItems.map(listItem => `<li><a href="${listItem.link}">${listItem.label}</a></li>`).join('')}`;
navLinks.innerHTML = markup;

