window.addEventListener('DOMContentLoaded', function () {
    
    var form = document.forms[0]; 
    var ipInput = document.getElementsByName('ip')[0];          
    var categorySelect = document.getElementsByName('category')[0]; 
    var descriptionArea = document.getElementsByTagName('textarea')[0]; 
    var reportButton = document.querySelector('.button.report'); 

    ipInput.addEventListener('focus', function () {
        ipInput.style.outline = '2px solid #123D15'; 
      });
    ipInput.addEventListener('blur', function () {
        ipInput.style.outline = ''; 
    });

    categorySelect.addEventListener('focus', function () {
        categorySelect.style.outline = '2px solid #123D15'; 
    });
    categorySelect.addEventListener('blur', function () {
        categorySelect.style.outline = ''; 
    });

    descriptionArea.addEventListener('focus', function () {
        descriptionArea.style.outline = '2px solid #123D15'; 
    });
    descriptionArea.addEventListener('blur', function () {
        descriptionArea.style.outline = ''; 
    });
    
    
    reportButton.addEventListener('click', function (e) {
      var ip = ipInput.value.trim();
      var category = categorySelect.value;
      var description = descriptionArea.value.trim();
  
      
      var ipRegex = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;
  
      if (!ipRegex.test(ip) || category === "" || description === "") {
        e.preventDefault(); 
        alert("Por favor, completa todos los campos y asegúrate de que la IP es válida.");
      }
    });
  });
  