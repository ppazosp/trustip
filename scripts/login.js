window.addEventListener('DOMContentLoaded', () => {
    // 1. Acceso por querySelector
const form = document.querySelector("form");

// 2. Acceso por getElementsByClassName
const loginButton = document.getElementsByClassName("login")[0];


// Crear formulario de signup dinámicamente
const createSignupForm = () => {
    form.classList.add("fade-out");
  
    setTimeout(() => {
      form.innerHTML = `
        <input type="text" name="email" placeholder="Email..." required>
        <input type="text" name="username" placeholder="Choose a username..." required>
        <input type="password" name="password" placeholder="Create a password..." required>
        <input type="password" name="confirmPassword" placeholder="Confirm password..." required>
        <div class="button-row">
          <div><button class="button signup" type="submit">Signup</button></div>
        </div>
      `;
  
      form.classList.remove("fade-out");
      form.classList.add("fade-in");
  
      addEventListeners(); // Reasigna eventos
    }, 400); // Duración de la animación
  };
  

// 1. Evento click
function addEventListeners() {
  const loginBtn = document.querySelector(".login");
  const signupBtn = document.getElementsByClassName("button signup")[0];



  if (signupBtn.type === "button") {
    signupBtn.addEventListener("click", createSignupForm);
    
  }

  const allInputs = document.querySelectorAll("input");
  allInputs.forEach(input => {
    input.addEventListener("focus", () => {
      input.style.outline = "2px solid #123D15";
    });
    input.addEventListener("blur", () => {
      input.style.outline = ""; 
    });
  });

    // Validación al enviar el formulario en modo signup
  form.addEventListener("submit", (e) => {
    const email = form.querySelector('input[name="email"]');
    const username = form.getElementsByName("username")[0];
    const password = form.getElementsByTagName("input")[2]; 
    const confirmPassword = form.querySelector('input[name="confirmPassword"]');
  
    // Si no estamos en el formulario de signup, no validamos
    if (!email || !confirmPassword) return;
  
    let valid = true;
    let errorMessage = "";
  
    // 1. Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value.trim())) {
      valid = false;
      errorMessage += "- Introduce un email válido.\n";
    }
  
    // 2. Validación de username mínimo 4 caracteres
    if (username.value.trim().length < 4) {
      valid = false;
      errorMessage += "- El nombre de usuario debe tener al menos 4 caracteres.\n";
    }
  
    // 3. Validación de password mínimo 4 caracteres
    if (password.value.trim().length < 4) {
      valid = false;
      errorMessage += "- La contraseña debe tener al menos 4 caracteres.\n";
    }
  
    // 4. Coincidencia de contraseñas
    if (password.value !== confirmPassword.value) {
      valid = false;
      errorMessage += "- Las contraseñas no coinciden.\n";
    }  
  
    if (!valid) {
      e.preventDefault(); // ⚠️ Aquí se bloquea correctamente
      alert("Errores en el formulario:\n\n" + errorMessage);
    }
  });
  
}

// Inicializar eventos en primera carga
addEventListeners();

});