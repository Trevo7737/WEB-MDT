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
