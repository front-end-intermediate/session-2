const nav = document.getElementById('main');
const navLinks = document.getElementById('nav-links');
const markup = `
<ul>
  ${navItems.map( listItem =>
    `<li><a data-navid="${listItem.navid}" href="${listItem.link}">${listItem.label}</a></li>`
    ).join('')}
</ul>
`;
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
const navAnchors = navLinks.querySelectorAll('a');
for (let i=0; i<navAnchors.length; i++){
  navAnchors[i].addEventListener('click', function(e){
    console.log(location.hash);
    let id = this.dataset.navid;
    siteWrap.innerHTML = `<h2>${navItems[id].header}</h2><p>${navItems[id].content}</p>`;
    // e.preventDefault();
  })
}
