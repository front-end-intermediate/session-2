const nav = document.getElementById('main');

fetchData(null, function(content) {
  const markup =
    `<ul>
    ${content.map(
      listItem => `<li><a href="${listItem.link}">${listItem.label}</a></li>`
    ).join('')}
    </ul>`;
  nav.innerHTML = markup;

  const logo = document.querySelector('#main ul li');
  logo.classList.add('logo');
  logo.firstChild.innerHTML = '<img src="img/logo.svg" />';
  
})

// const markup = `
// <ul>
// ${navItems.map(
//   navItem => `<li><a href="${navItem.link}">${navItem.label}</a></li>` 
// ).join('')}
// </ul>
// `;

// nav.innerHTML = markup;

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

// const logo = document.querySelector('#main ul li');
// logo.classList.add('logo');
// logo.firstChild.innerHTML = '<img src="img/logo.svg" />';

window.addEventListener('scroll', fixNav);

// content

const siteWrap = document.querySelector('.site-wrap');

function fetchData(hash, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    callback(JSON.parse(xhr.response));
  };
  xhr.open('GET', 'http://localhost:3004/content', true);
  xhr.send();
}

function navigate() {
  let newloc = window.location.hash;
  fetchData(newloc, function (content) {
    let newContent = content.filter( contentItem => contentItem.link == newloc );
    siteWrap.innerHTML = `
    <h2>${newContent[0].header}</h2>
    ${newContent[0].image}
    ${newContent[0].content}
    `;
  })
}

// function navigate(){
//   let newloc = window.location.hash;
//   let newContent = navItems.filter( navItem => navItem.link == newloc );
//   siteWrap.innerHTML = `
//   <h2>${newContent[0].header}</h2>
//   ${newContent[0].content}
//   `;
// }

if(!location.hash) {
  location.hash = "#watchlist";
}

navigate();

window.addEventListener("hashchange", navigate)