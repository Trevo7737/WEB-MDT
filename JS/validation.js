// var email = new Array();
// var pw = new Array();
// var repw = new Array();
// var x = 0;

// // storing input from register-form
// function registervalidate() {
//   email[x] = document.getElementById("regis-email").value.trim();
//   pw[x] = document.getElementById("regis-password").value.trim();
//   repw[x] = document.getElementById("re-password").value.trim();
//   var showmassage = document.getElementById("show");
//   var passwordpattern =
//     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
//   if (email[x] == " ") {
//     showmassage.innerText = "Please input email to register.";
//   } else if (!pw[x].test(passwordpattern)) {
//     showmassage.innerText = "please input lastest  6 characters.";
//   } else if (repw.test(!pw)) {
//     showmassage.innerText = "Wrong check your password";
//   }
//   x++;
// }

// // check if stored data from register-form is equal to entered data in the   login-form

//   // entered data from the login-form
//   var userName = document.getElementById("userName");
//   var userPw = document.getElementById("userPw");

//   // check if stored data from register-form is equal to data from login form
//   if (userName.value == storedName && userPw.value == storedPw) {
//     window.location.href("../WEB/laptop.html");
//   } else {
//     alert("Error! Enter correct Username and Password");
//   }
// }

// make validation Singup-form

const registerform = document.getElementById("Register");
const emailregister = document.getElementById("regis-email");
const pwregister = document.getElementById("regis-pw");
const repw = document.getElementById("re-pw");

registerform.addEventListener("submit", (e) => {
  e.preventDefault();

  validateInputs();
});

const form = document.getElementById("form");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const password2 = document.getElementById("password2");

form.addEventListener("submit", (e) => {});

const setError = (element, message) => {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector(".error");

  errorDisplay.innerText = message;
  inputControl.classList.add("error");
  inputControl.classList.remove("success");
};

const setSuccess = (element) => {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector(".error");

  errorDisplay.innerText = "";
  inputControl.classList.add("success");
  inputControl.classList.remove("error");
};

const isValidEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const validateInputs = () => {
  const usernameValue = username.value.trim();
  const emailValue = email.value.trim();
  const passwordValue = password.value.trim();
  const password2Value = password2.value.trim();

  if (usernameValue === "") {
    setError(username, "Username is required");
  } else {
    setSuccess(username);
  }

  if (emailValue === "") {
    setError(email, "Email is required");
  } else if (!isValidEmail(emailValue)) {
    setError(email, "Provide a valid email address");
  } else {
    setSuccess(email);
  }

  if (passwordValue === "") {
    setError(password, "Password is required");
  } else if (passwordValue.length < 8) {
    setError(password, "Password must be at least 8 character.");
  } else {
    setSuccess(password);
  }

  if (password2Value === "") {
    setError(password2, "Please confirm your password");
  } else if (password2Value !== passwordValue) {
    setError(password2, "Passwords doesn't match");
  } else {
    setSuccess(password2);
  }
};

function login() {
  // stored data from tshe register-form
  var storedName = JSON.parse(
    localStorage.getItem("email", JSON.stringify(email)) || [],
  );
  var storedPw = JSON.parse(
    localStorage.getItem("pw", JSON.stringify(pw)) || [],
  );
}
