const nav = document.getElementById('main');
const navLinks = document.getElementById('nav-links');
const markup = `<ul>${navItems.map( listItem => `<li><a href="${listItem.link}">${listItem.label}</a></li>`).join('')}</ul>`;
navLinks.innerHTML = markup;


let topOfNav = nav.offsetTop;
function fixNav() {
  if(window.scrollY >= topOfNav) {
    document.body.classList.add('fixed-nav');
  } else {
    document.body.classList.remove('fixed-nav');
  }
}
window.addEventListener('scroll', fixNav);
