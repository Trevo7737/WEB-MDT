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
    let registeredUsers = loadRegisteredUsers();
    if (registeredUsers.some((u) => u.email === emailsingup)) {
      error.innerText = "This email is already registered!";
    } else {
      error.innerText = "";
    }
  }
}

function validationpassword() {
  let passwordsingup = document.getElementById("password-singup").value;
  let error = document.getElementById("password-singup-error");

  if (passwordsingup == "") {
    error.innerText = "Password is required";
  } else if (passwordsingup.length < 6) {
    error.innerText = "Please input at less than 6 character";
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
loadRegisteredUsers();

// Sign-up form submission

document.getElementById("singup").addEventListener("submit", (e) => {
  e.preventDefault();

  validationemail();
  validationpassword();
  validationconfirm();

  // Only check errors inside the sign-up form to avoid false blocks from sign-in errors
  let errors = document.querySelectorAll(".error");
  let haserrors = false;

  for (let error of errors) {
    if (error.innerText !== "") {
      haserrors = true;
      break;
    }
  }
  if (!haserrors) {
    let emailset = document.getElementById("email-singup").value.trim();
    let passwordset = document.getElementById("password-singup").value;

    // check email Registered  already
    let registeredUsers = loadRegisteredUsers();

    if (registeredUsers.some((u) => u.email === emailset)) {
      document.getElementById("email-singup-error").innerText =
        "This email is already registered!";
      return;
    }

    // save new user to localStorage
    registeredUsers.push({ email: emailset, password: passwordset });
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

function chekcinput() {
  let emailinput = document.getElementById("email-signin").value.trim();
  let passwordinput = document.getElementById("password-signin").value;
  let emailError = document.getElementById("email-signin-error");
  let passwordError = document.getElementById("password-signin-error");

  let hasEmpty = false;
  if (emailinput === "") {
    emailError.innerText = "Email is required";
    hasEmpty = true;
  } else {
    emailError.innerText = "";
  }
  if (passwordinput === "") {
    passwordError.innerText = "Password is required";
    hasEmpty = true;
  } else {
    passwordError.innerText = "";
  }

  if (hasEmpty) return;

  let registeredUsers = loadRegisteredUsers();
  let matchedUser = registeredUsers.find((u) => u.email === emailinput);

  if (!matchedUser) {
    emailError.innerText =
      "This email is not registered. Please sign up first.";
    passwordError.innerText = "";
    return;
  }

  if (matchedUser.password !== passwordinput) {
    passwordError.innerText = "Incorrect password. Please try again.";
    emailError.innerText = "";
    return;
  }

  // Show success message briefly before redirecting
  let successEl = document.getElementById("success-signin");
  successEl.innerText = " Log in successful!";
  successEl.style.cssText =
    "display:block;color:#4ade80;font-weight:700;font-size:14px; text-align:center;margin-top:8px";
  setTimeout(() => {
    window.location.href = "../SRC/index.html";
  }, 500);
}

// sign in submission
document.getElementById("login").addEventListener("submit", (e) => {
  e.preventDefault();
  chekcinput();
});
