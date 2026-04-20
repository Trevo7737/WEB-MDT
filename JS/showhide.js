const containerlogin = document.getElementById("container-login");
const openlogin = document.getElementById("login-btn");
const closeform = document.getElementById("closeform");
const btnregister = document.querySelector(".btnsingup");
const displayregister = document.getElementById("singup");
const displaylogin = document.getElementById("login");
const backlogin = document.getElementById("backlogin");
const btnsingin = document.getElementById("sing-in");
const showsing = document.querySelector(".show");
const showbtnsing = document.querySelector(".showbtnsingin");
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
  showsing.style.display = "block";
  showbtnsing.style.display = "none";
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
  showsing.style.display = "none";
  showbtnsing.style.display = "block";
};

// end-section-of-interactive with login and register form
