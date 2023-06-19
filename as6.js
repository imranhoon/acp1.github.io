let e2=document.getElementById("e1");
e2.addEventListener('click',function () {
    localStorage.setItem('username',e2); 
});

function login(){
    window.location.href = "http://127.0.0.1:5500/assignment/as6/login_signup.html";
}
function signup() {
    window.location.href = "http://127.0.0.1:5500/assignment/as6/login_signup.html";
    register();
}
