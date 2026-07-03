const containerlogin = document.getElementById("container-login");

const openlogin = document.getElementById("login-btn");
const closeform = document.getElementById("closeform");
const btnregister = document.getElementById("btnsingup");
const displayregister = document.getElementById("singup");
const displaylogin = document.getElementById("login");
const backlogin = document.getElementById("backlogin");
const btnsingin = document.getElementById("sing-in");
const showsing = document.querySelector(".show");
const showbtnsingin = document.querySelector(".showbtnsingin");

// show singup form

btnregister.addEventListener("click", function (e) {
  e.preventDefault();
  displayregister.style.display = "block";
  backlogin.style.display = "block";
  displaylogin.style.display = "none";
  showsing.style.display = "block";
  showbtnsingin.style.display = "none";
});

// back to login form

backlogin.addEventListener("click", function (e) {
  e.preventDefault();
  displayregister.style.display = "none";
  backlogin.style.display = "none";
  displaylogin.style.display = "block";
  showsing.style.display = "none";
  showbtnsingin.style.display = "block";
});

//back to login form with singin-button

btnsingin.onclick = (e) => {
  e.preventDefault();
  displayregister.style.display = "none";
  backlogin.style.display = "none";
  displaylogin.style.display = "block";
  showsing.style.display = "none";
  showbtnsingin.style.display = "block";
};

function sawpassword() {
  let input = document.querySelector(".showpassword");
  let toggle = document.getElementById("toggle");
  if (input.type === "text") {
    input.type = "password";
    toggle.classList.remove("fa-unlock");
    toggle.classList.add("fa-lock");
  } else {
    input.type = "text";
    toggle.classList.remove("fa-lock");
    toggle.classList.add("fa-unlock");
  }
}

// end-section-of-interactive with login and register form
