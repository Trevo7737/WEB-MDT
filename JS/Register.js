console.log(openregister);
console.log(closelogin);
console.log(btnregister);

function showregister() {
  const openregister = document.querySelector(".form-register");
  const closelogin = document.querySelector(".form-login");
  if (closelogin.style.display == "block" || closelogin.style.display == " ") {
    openregister.style.display = "block";
    closelogin.style.display = "none";
  }
}
