'use strict';

document.addEventListener('DOMContentLoaded', ()=>{
const signinForm = document.querySelector('.signin-form');
const signupForm = document.getElementById('sup');
const signinError = document.getElementById('login-error');
const signupError = document.getElementById('signup-error');

const API = 'http://localhost:1324/api';

//signup
signupForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    signupError.textContent = '';
    const [usernameField,passwordField]= signupForm.querySelectorAll('.input-field');
    const username = usernameField.value.trim();
    const password = passwordField.value;

    if(!username || !password){
        signupError.textContent = 'Please fill out both fields.';
        return;
    }

    try {
        const res = await fetch(`${API}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        const data = await res.json();
        if (!res.ok) {
            signupError.textContent = data.error;
            return;
        }
        signupForm.reset();
        signupError.style.color = 'var(--brand)';
        signupError.textContent = data.message;
    } catch (err) {
        signupError.textContent = 'Could not reach the server.';
    }
});

//log in
signinForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    signinError.textContent = '';

    const [usernameField,passwordField] = signinForm.querySelectorAll('.input-field');
    const username = usernameField.value.trim();
    const password = passwordField.value;

    try {
        const res = await fetch(`${API}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        const data = await res.json();
        if (!res.ok) {
            signinError.textContent = data.error;
            return;
        }
        const SESSION_KEY = 'user.session';
        sessionStorage.setItem(SESSION_KEY, JSON.stringify({ username: data.username }));
        window.location.replace('board.html');
    } catch (err) {
        signinError.textContent = 'Could not reach the server.';
    }
});
});
