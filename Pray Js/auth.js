'use strict';

document.addEventListener('DOMContentLoaded', ()=>{
const signinForm = document.querySelector('.signin-form');
const signupForm = document.getElementById('sup');
const signinError = document.getElementById('login-error');
const signupError = document.getElementById('signup-error');

const USER_KEY = "app_account";

function getUsers(){
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw):[];
};
function saveUsers(user){
    localStorage.setItem(USER_KEY,JSON.stringify(user))
};
function findUser(username){
   return getUsers().find(u => u.username === username)
};
//signup
signupForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    signupError.textContent = '';
const [usernameField,passwordField]= signupForm.querySelectorAll('.input-field');
const username = usernameField.value.trim();
const password = passwordField.value;

if(!username || !password){

    signupError.textContent = 'Please fill out both fields.';
    return;
}
if (findUser(username)){
  signupError.textContent = 'Username already taken!';
 return ;
}
 const users = getUsers();
        console.log(users);
        users.push({ username, password });
        saveUsers(users);
        signupForm.reset();
        signupError.style.color = 'var(--brand)';
        signupError.textContent = 'Account created! You can now log in.';

});
//log in 
signinForm.addEventListener('submit',(e)=>{

    e.preventDefault();
    signinError.textContent = '';

    const [usernameField,passwordField] = signinForm.querySelectorAll('.input-field');

    const username = usernameField.value.trim();
    const password = passwordField.value;
    const user = findUser(username);

    if (!user|| user.password !== password){
        signinError.textContent = 'Invalide username or password';
        return;
    }
// session for vertifying who
   const SESSION_KEY = 'user.session'
    sessionStorage.setItem(SESSION_KEY,JSON.stringify({username:user.username}));
    window.location.replace('board.html');
});
});

