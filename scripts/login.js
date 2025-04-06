window.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector("form"); 
  const card = document.querySelector(".form-section");
  const signupBtn = document.querySelector(".button.signup");
  const loginBtn = document.querySelector(".button.login");

  loginBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (card.classList.contains("expanded")) {
      card.classList.remove("expanded");
      console.log("loginBtn clicked: collapsing form (switching to login mode)");
    } else {
      const username = form.querySelector('input[name="username"]');               
      const password = form.querySelector('input[name="password"]');                  
      
      let valid = true;
      let errorMessage = "";
      
      if (username.value.trim().length < 4) {
        valid = false;
        errorMessage += "- El nombre de usuario debe tener al menos 4 caracteres.\n";
      }
      if (password.value.trim().length < 4) {
        valid = false;
        errorMessage += "- La contraseña debe tener al menos 4 caracteres.\n";
      }
      
      if (!valid) {
        alert(`Errores en el formulario:\n\n${errorMessage}`);
      } else {
        console.log("Login submit triggered");
        form.requestSubmit();
      }
    }
  });

  signupBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (card.classList.contains("expanded")) {
      const email = form.querySelector('input[name="email"]');                 
      const username = form.querySelector('input[name="username"]');               
      const password = form.querySelector('input[name="password"]');                   
      const confirmPassword = form.querySelector('input[name="confirmPassword"]');
      
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
        alert(`Errores en el formulario:\n\n${errorMessage}`);
      } else {
        console.log("Signup submit triggered");
        form.requestSubmit();
      }
    } else {
      card.classList.add("expanded");
      console.log("signupBtn clicked: expanding form for signup");
    }
  });

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