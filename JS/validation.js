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
// function login() {
//   // stored data from tshe register-form
//   var storedName = JSON.parse(
//     localStorage.getItem("email", JSON.stringify(email)) || [],
//   );
//   var storedPw = JSON.parse(
//     localStorage.getItem("pw", JSON.stringify(pw)) || [],
//   );

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

registerform.addEventListener("submit", (e) => {});
