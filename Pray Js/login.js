'use strict';
document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab');
    const signinForm = document.querySelector('.signin-form');
    const signupForm = document.querySelector('.signup-form');

    function activateTab(tabName) {
        tabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });

        if (tabName === 'signin') {
            signinForm.classList.remove('hidden');
            signupForm.classList.add('hidden');
        } else {
            signupForm.classList.remove('hidden');
            signinForm.classList.add('hidden');
        }

        // clear any leftover error messages when switching tabs
        document.getElementById('login-error').textContent = '';
        document.getElementById('signup-error').textContent = '';
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            activateTab(tab.dataset.tab);
        });
    });

    // set default active tab on load
    activateTab('signin');
});
//// feat: register account in and save inforamtion in local stroage

