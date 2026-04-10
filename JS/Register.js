const btnregister = document.querySelector(".register");

console.log(btnregister);

btnregister.addEventListener("click", function (e) {
  document.getElementById("form-register").style.display = "block";
  document.getElementById("form-login").style.display = "none";
});
