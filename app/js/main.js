
const nav = document.getElementById('main');

const navLinks = nav.querySelector('#nav-links');

const markup = `${navItems
  .map(listItem => `<li><a href="${listItem.link}">${listItem.label}</a></li>`)
  .join('')}`;

navLinks.innerHTML = markup;