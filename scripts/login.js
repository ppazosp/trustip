window.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector("form"); 
  const card = document.querySelector(".form-section");
  const signupBtn = document.querySelector(".button.signup");
  const loginBtn = document.querySelector(".button.login");

  

  //si existe la clase expanded, se añade el evento al botón de login
  if (card.classList.contains("expanded")) {
    loginBtn.addEventListener("click", () => {
      signupBtn.type = "button"; 
      loginBtn.type = "submit";
      console.log("loginBtn clicked");
      card.classList.remove("expanded");
    });

    signupBtn.addEventListener("submit",() => {
      const email = form.querySelector('input[name="email"]');                 
      const username = form.querySelector('input[name="username"]');               
      const password = form.querySelector('input[name="password"]');                   
      const confirmPassword = form.querySelector('input[name="confirmPassword"]');
  
      console.log(email.value, username.value, password.value, confirmPassword.value);
  
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
        alert(`Errores en el formulario:\n\n${errorMessage}`);
      }
    });

    
  } else {
    signupBtn.addEventListener("click", () => {
      loginBtn.type = "button"; 
      signupBtn.type = "submit";
      console.log("signupBtn clicked");
      card.classList.add("expanded");
    });
  }

  



  
  

  const inputs = document.querySelectorAll("input");
  inputs.forEach((input) => {
    input.addEventListener("focus", () => {
      input.style.outline = "3px solid #123D15";
    });
    input.addEventListener("blur", () => {
      input.style.outline = "";
    });
  });
});
