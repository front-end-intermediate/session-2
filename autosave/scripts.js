// Your code goes here...

const formElem = document.getElementById('save-me');
var formElems = formElem.querySelectorAll('input');
var faves = [];
var dataToSave = [];

var saveData = function(){
  
  if(event.target.id){
    var elem = event.target.id;
    var someData = event.target.value;
  } else if (event.target.type == 'radio'){
    var elem = event.target.name;
    var someData = event.target.value;
  } else if (event.target.type == 'checkbox'){
    var elem = 'faves';
    faves.push(event.target.name)
    var someData = faves;
  }
  
  var dataKey = elem;
  var inputData = JSON.stringify(someData);
  
  localStorage.setItem(dataKey, inputData);
}

var saveData = function(key, data){
  console.log('hi')
}

var getData = function(){
  var nameItem = JSON.parse(localStorage.getItem('name'));
  if (nameItem) {
    document.querySelector('#name').value = nameItem;
  } else {
    document.querySelector('#name').placeholder = 'Please enter a name';
  }
}

formElem.addEventListener('input', saveData);
formElemsArr = Array.from(formElems).forEach.addEventListener('blur', saveData);
window.addEventListener('load', getData);
