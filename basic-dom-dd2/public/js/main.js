const nav = document.getElementById('main');


const markup = `
<ul>
${navItems.map( listItem => 
	`<li><a href="${listItem.link}">${listItem.label}</a></li>`
	).join('')}
	</ul>
	`;
	nav.innerHTML = markup;

	const logo = nav.querySelector('ul>li');
	logo.classList.add('logo');
	logo.firstChild.innerHTML = '<img src="img/logo.svg" />';


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
	const navTest = document.querySelectorAll('#main ul li a');
	for (let i=0; i<navTest.length; i++){
  // console.log('hash ', navTest[i].hash);
  navTest[i].addEventListener('click', prepContent)
}

function prepContent(e){
	if (this.hash == "#workbook"){
    // const header = navItems[4].header;
    // const content = navItems[4].content;
    const { header, content } = navItems[4];
    siteWrap.innerHTML = `
    <h2>${header}</h2>
    <p>${content}</p>
    `;
    e.preventDefault();
}
}


const listItems = nav.querySelectorAll('li');
if (document.documentElement.clientWidth <= 740) {
	logo.addEventListener('click', showMenu);
}

function showMenu(e){
	console.log(e)
	listItems.forEach((listItem) => listItem.classList.toggle('show'));
	e.preventDefault();
}