window.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector("form"); 

  let submitHandler; 

  function addEventListeners() {
    const card = document.getElementsByClassName("form-section")[0];
    const signupBtn = document.getElementsByClassName("button signup")[0];
    const loginBtn = document.getElementsByClassName("button login")[0];

    signupBtn.addEventListener('click', () => {
      loginBtn.type = "button"; 
      form.addEventListener("submit", submitHandler); 
      signupBtn.type = "submit";
      card.classList.add('expanded');
    });

    loginBtn.addEventListener('click', () => {
      signupBtn.type = "button";
      form.removeEventListener("submit", submitHandler); 
      loginBtn.type = "submit"; 
      card.classList.remove('expanded');
    });

    const allInputs = document.querySelectorAll("input"); 
    allInputs.forEach(input => {
      input.addEventListener("focus", () => {
        input.style.outline = "3px solid #123D15";
      });
      input.addEventListener("blur", () => {
        input.style.outline = "";
      });
    });

    
    submitHandler = function (e) {
      const email = form.querySelector('input[name="email"]');                 
      const username = document.getElementsByName("username")[0];               
      const password = form.getElementsByTagName("input")[2];                   
      const confirmPassword = form.querySelector('input[name="confirmPassword"]');

      if (!email || !confirmPassword) return;

      let valid = true;
      let errorMessage = "";

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value.trim())) {
        valid = false;
        errorMessage += "- Introduce un email válido.\n";
      }
      if (username.value.trim().length < 4) {
        valid = false;
        errorMessage += "- El nombre de usuario debe tener al menos 4 caracteres.\n";
      }
      if (password.value.trim().length < 4) {
        valid = false;
        errorMessage += "- La contraseña debe tener al menos 4 caracteres.\n";
      }
      if (password.value !== confirmPassword.value) {
        valid = false;
        errorMessage += "- Las contraseñas no coinciden.\n";
      }

      if (!valid) {
        e.preventDefault();
        alert("Errores en el formulario:\n\n" + errorMessage);
      }
    };

    form.addEventListener("submit", submitHandler); // ✅ Añadimos listener con referencia
  }

  addEventListeners();
});
