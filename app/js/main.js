const nav = document.getElementById('main');

const navLinks = nav.querySelector('#nav-links');
const markup = `${navItems.map(listItem => `<li><a href="${listItem.link}">${listItem.label}</a></li>`).join('')}`;

navLinks.innerHTML = markup;


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
    console.log(content)
    let newContent = content.filter( contentItem => contentItem.link == newloc );
    siteWrap.innerHTML = `
    <h2>${newContent[0].header}</h2>
    ${newContent[0].content}
    `;
  })
}

if(!location.hash) {
  location.hash = "#watchlist";
}

navigate();

window.addEventListener("hashchange", navigate)
