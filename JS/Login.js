const containerlogin = document.getElementById("container-login");
const openlogin = document.getElementById("login-btn");

openlogin.addEventListener("click", (e) => {
  e.stopPropagation();
  if (containerlogin.style.visibility == "hidden") {
    containerlogin.classlist.add("active");
  } else {
    containerlogin.classList.toggle("active");
  }
});

// show singup form
const btnregister = document.querySelector(".singup");
const displayregister = document.getElementById("form-singup");
const displaylogin = document.getElementById("form-login");
const backlogin = document.getElementById("backlogin");
btnregister.addEventListener("click", function (e) {
  e.preventDefault();
  displayregister.style.display = "block";
  backlogin.style.visibility = "visible";
  displaylogin.style.display = "none";
});

// back to login form

backlogin.addEventListener("click", function (e) {
  displayregister.style.display = "none";
  backlogin.style.visibility = "hidden";
  displaylogin.style.display = "block";
});
