const containerlogin = document.getElementById("container-login");
const openlogin = document.getElementById("login-btn");
const closeform = document.getElementById("closeform");
const btnregister = document.querySelector(".singup");
const displayregister = document.getElementById("form-singup");
const displaylogin = document.getElementById("form-login");
const backlogin = document.getElementById("backlogin");
const btnsingin = document.getElementById("sing-in");

// open && close form

openlogin.onclick = () => {
  containerlogin.classList.add("active");
};
closeform.onclick = () => {
  containerlogin.classList.toggle("active");
};

// show singup form

btnregister.addEventListener("click", function (e) {
  e.preventDefault();
  displayregister.style.display = "block";
  backlogin.style.visibility = "visible";
  closeform.style.visibility = "hidden";
  displaylogin.style.display = "none";
});

// back to login form

backlogin.addEventListener("click", function (e) {
  e.preventDefault();
  displayregister.style.display = "none";
  backlogin.style.visibility = "hidden";
  closeform.style.visibility = "visible";
  displaylogin.style.display = "block";
});

//back to login form with singin-button

btnsingin.onclick = (e) => {
  e.preventDefault();
  displayregister.style.display = "none";
  backlogin.style.visibility = "hidden";
  closeform.style.visibility = "visible";
  displaylogin.style.display = "block";
};

// end-section-of-interactive with login and register form
