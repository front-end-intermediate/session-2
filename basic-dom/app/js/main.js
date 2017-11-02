const nav = document.getElementById('main');
const navLinks = document.getElementById('nav-links');
const markup = `<ul>${navItems.map( listItem => `<li><a href="${listItem.link}">${listItem.label}</a></li>`).join('')}</ul>`;
navLinks.innerHTML = markup;


let topOfNav = nav.offsetTop;
window.addEventListener('scroll', fixNav);

function fixNav() {
  if(window.scrollY >= topOfNav) {
    document.body.style.paddingTop = nav.offsetHeight + 'px';
    document.body.classList.add('fixed-nav');
  } else {
    document.body.classList.remove('fixed-nav');
    document.body.style.paddingTop = 0;
  }
}

// const logo = document.querySelector('#main ul li');
// logo.classList.add('logo');
// logo.firstChild.innerHTML = '<img src="img/logo.svg" />';

