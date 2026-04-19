function showError(input, message) {
  const inputid = input.parentElement;
  const error = inputid.querySelector("");
  error.textContent = message;
}
const singup = document.getElementById("button");

singup.addEventListener("button", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmpw = document.getElementById("confirmpw").value;

  const emailpattern = / ^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailpattern.test(email)) {
    showError("email", "Please Input your like this :(example123@gmail.com)");
    return;
  }

  if (password == " ") {
    alert("Please input password");
  } else if (password.lenght < 6) {
    showError(
      "password",
      "Please Input Your Password at less more than 6 characters.",
    );
    return;
  }

  if (confirmpw !== password) {
    showError("confirmpw", "Password not the same of above password.");
    return;
  } else if (confirmpw === password) {
    alert("Successfull Sing Up .");
  }
});
