// Your code goes here...
var log = console.log;
const formElem = document.getElementById('save-me');
var formElems = formElem.querySelectorAll('input');
var faves = [];
var dataToSave = [];

var saveData = function(){
  var id = formElem.id;
  var formData = localStorage.getItem('formData-' + id);
  formData = formData ? JSON.parse(formData) : {};
  
  if (event.target.type === 'checkbox') {
    formData[event.target.name] = event.target.checked;
  } else {
    formData[event.target.name] = event.target.value;
	}
  localStorage.setItem('formData-' + id, JSON.stringify(formData));
}


var getData = function () {
	var formData = localStorage.getItem('formData-' + formElem.id);
  formData = JSON.parse(formData);
  
  for (var data in formData) {
    var field = formElem.querySelector('[name="' + data + '"]');
    
    if (field.type === 'checkbox') {
      field.checked = formData[data];
    }
    
    else if (field.type === 'radio') {
      var radios = Array.from(formElem.querySelectorAll('input[type="radio"]'));
      radios.forEach(function (radio) {
        if (radio.value === formData[data]) {
          radio.checked = true;
        }
      });
    }

    else {
      field.value = formData[data];
    }
  }

  log(formData)
  
}

// Reset formData to empty object
var resetData = function (event) {
	var id = formElem.id;
	localStorage.setItem('formData-' + id, JSON.stringify({}));
};

window.addEventListener('load', getData);
formElem.addEventListener('input', saveData);

// Listen for submit event
document.addEventListener('submit', resetData, false);

