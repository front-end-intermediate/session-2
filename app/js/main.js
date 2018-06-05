const nav = document.getElementById('main');
const navbar = nav.querySelector('.navitems');

const markup = `
    <ul>
      ${navItems.map(
        navItem => `<li><a href="${navItem.link}">${navItem.label}</a></li>` 
        ).join('')}
    </ul>
    `;

navbar.innerHTML = markup;

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

const logo = document.querySelector('#main ul li');
logo.classList.add('logo');
logo.firstChild.innerHTML = '<img src="img/logo.svg" />';

window.addEventListener('scroll', fixNav);