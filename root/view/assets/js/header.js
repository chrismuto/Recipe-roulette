const loginButton = document.getElementById("login");
const signupButton = document.getElementById("signup");
const logoutButton = document.getElementById("logout");

let isLoggedIn = checkLoggedIn();

console.log(document.cookie)
console.log(isLoggedIn)

function goToLogin() {
    document.location.assign("./login.html");
}

function goToSignup() {
    document.location.assign("./signup.html");
}

function logout() {
    fetch('http://localhost:3000/logout', {
        method: 'GET'
    })
    .then(response => {
        if (response.ok) {
            document.location.assign("./index.html");
        } else {
            console.error("logout failed", response.statusText);
        }
    }).catch(error => {
        console.error("Error:", error);
    });
}

function checkLoggedIn() {
    const token = document.cookie.split('; ').find(cookie => cookie.startsWith('token='));
    if (token) {
        return true;
    } else {
        return false;
    }
  }

loginButton.addEventListener("click", goToLogin);
signupButton.addEventListener("click", goToSignup);
logoutButton.addEventListener("click", logout);