const nav = document.getElementById('main');
const navbar = nav.querySelector('.navitems');
const siteWrap = document.querySelector('.site-wrap');
const logo = document.querySelector('.logo')

logo.addEventListener('click', showMenu);


function showMenu(e) {
  dump();
  const navLinks = document.querySelectorAll('.navitems a');
  navLinks.forEach(link => link.addEventListener('click', dump))
  e.preventDefault();
}

function dump(){
  document.body.classList.toggle('show');
}

fetchData(null, function(content) {
  const markup =
    `<ul>
    ${content.map(
      listItem => `<li><a href="${listItem.link}">${listItem.label}</a></li>`
    ).join('')}
    </ul>`;
  navbar.innerHTML = markup;
})

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

function fetchData(hash, callback) {
  var xhr = new XMLHttpRequest();
  
  xhr.onload = function () {
    callback(JSON.parse(xhr.response));
  };
  
  xhr.open('GET', 'http://localhost:3004/content', true);
  xhr.send();
}


function navigate(){
  let newloc = window.location.hash;
  fetchData(newloc, function (content) {
  let newContent = content.filter( contentItem => contentItem.link == newloc );
  // let newContent = content.filter( function(contentItem) {
  //   contentItem.link === newloc 
    // return newContent
  // });
  siteWrap.innerHTML = `
  <h2>${newContent[0].header}</h2>
  ${newContent[0].image}
  ${newContent[0].content}
  `;
  })
}

// function navigate() {
//   let newloc = window.location.hash;
//   fetchData(newloc, function (content) {
//     let newContent = content.filter( contentItem => contentItem.link == newloc );
//     siteWrap.innerHTML = `
//     <h2>${newContent[0].header}</h2>
//     ${newContent[0].image}
//     ${newContent[0].content}
//     `;
//   })
// }

if(!location.hash) {
  location.hash = "#watchlist";
}

navigate();

window.addEventListener('scroll', fixNav);
window.addEventListener("hashchange", navigate)