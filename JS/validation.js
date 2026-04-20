// real-time valdiation-form
document
  .getElementById("email-singup")
  .addEventListener("input", validationemail);
document
  .getElementById("password-singup")
  .addEventListener("input", validationpassword);
document
  .getElementById("password-Re-singup")
  .addEventListener("input", validationconfirm);

// validation-singup-form
function validationemail() {
  let emailsingup = document.getElementById("email-singup").value.trim();
  let error = document.getElementById("email-singup-error");

  if (emailsingup === "") {
    error.innerText = "email is required";
  } else if (
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailsingup)
  ) {
    error.innerText = "Please input (example@gmail.net)";
  } else {
    error.innerText = "";
  }
}

function validationpassword() {
  let passwordsingup = document.getElementById("password-singup").value;
  let error = document.getElementById("password-singup-error");

  if (passwordsingup == "") {
    error.innerText = "Password is required";
  } else if (passwordsingup.length < 6) {
    error.innerText = "Please input at less than 6 character ";
  } else {
    error.innerText = "";
  }
}

function validationconfirm() {
  let confirmsingup = document.getElementById("password-Re-singup").value;
  let error = document.getElementById("password-Re-error");

  if (confirmsingup === "") {
    error.innerText = "confirm password is required";
  } else if (passwordsingup !== confirmsingup) {
    error.innerText = "Password is not match";
  } else {
    error.innerText = "";
  }
}

// create form submission check
document.getElementById("singup").addEventListener("submit", (e) => {
  e.preventDefault();
  validationemail();
  validationpassword();
  validationconfirm();

  let errors = document.querySelectorAll(".error");
  let haserrors = false;

  errors.forEach((error) => {
    if (error.innerText !== "") {
      haserrors = true;
    }
  });

  if (!haserrors) {
    document.getElementById("success").innerText = "Sing up successful.";
    document.getElementById("success").style.display = "block";

    setTimeout(() => {
      document.getElementById("success").style.display = "none";
    }, 2000);
  }
});
