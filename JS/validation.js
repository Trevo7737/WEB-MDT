// real-time  validation form sign up
document
  .getElementById("email-singup")
  .addEventListener("input", validationemail);
document
  .getElementById("password-singup")
  .addEventListener("input", validationpassword);
document
  .getElementById("password-Re-singup")
  .addEventListener("input", validationconfirm);

// validation-singup-form c
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
  let passwordsingup = document.getElementById("password-singup").value;
  let confirmsingup = document.getElementById("password-Re-singup").value;
  let error = document.getElementById("password-Re-error");

  if (confirmsingup === "") {
    error.innerText = "Confirm password is required";
  } else if (passwordsingup !== confirmsingup) {
    error.innerText = "Password does not match";
  } else {
    error.innerText = "";
  }
}

// load registered users from localStorage
function loadRegisteredUsers() {
  return JSON.parse(localStorage.getItem("registeredUsers")) || [];
}

// Sign-up form submission

document.getElementById("singup").addEventListener("submit", (e) => {
  e.preventDefault();

  validationemail();
  validationpassword();
  validationconfirm();

  let errors = document.querySelectorAll(".error");
  let haserrors = false;

  for (let error of errors) {
    if (error.innerText !== "") {
      haserrors = true;
      break;
    }
  }
  if (!haserrors) {
    let emailInput = document.getElementById("email-singup").value.trim();
    let passwordInput = document.getElementById("password-singup").value;

    // check email duplicate
    let registeredUsers = loadRegisteredUsers();

    if (registeredUsers.some((u) => u.email === emailInput)) {
      document.getElementById("email-singup-error").innerText =
        "This email is already registered!";
      return;
    }

    // save new user to localStorage
    registeredUsers.push({ email: emailInput, password: passwordInput });
    localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));

    let successEl = document.getElementById("success-signup");
    successEl.innerText = "Sign up successful!";
    successEl.style.cssText =
      "display:block;color:#4ade80;font-weight:700;font-size:14px; text-align:center;margin-top:8px";
    setTimeout(() => {
      successEl.style.display = "none";
      successEl.innerText = "";
      document.getElementById("singup").reset();
    }, 3000);
  }
});

// real-time validation-form  login
document.getElementById("email-signin").addEventListener("input", checkemail);
document.getElementById("password-signin").addEventListener("input", checkpass);

function checkemail() {
  let email = document.getElementById("email-signin").value.trim();
  let error = document.getElementById("email-signin-error");

  if (email == "") {
    error.innerText = "Plese Input  @Email";
  } else {
    error.innerText = "";
  }
}

function checkpass() {
  let password = document.getElementById("password-signin").value;
  let error = document.getElementById("password-signin-error");

  if (password == "") {
    error.innerText = "Please Input Password";
  } else {
    error.innerText = "";
  }
}

// sign in  submission
document.getElementById("login").addEventListener("submit", (e) => {
  e.preventDefault();
  checkemail();
  checkpass();

  // get data from sign up stored in localStorage
  let email = document.getElementById("email-signin").value.trim();
  let password = document.getElementById("password-signin").value;
  let getuser = loadRegisteredUsers();
  let user = getuser.find((u) => u.email === email && u.password === password);

  if (!user) {
    document.getElementById("email-signin-error").innerText =
      "@email or password is incorrect";
    return;
  }

  window.location.href = "../WEB/laptop.html";
});
