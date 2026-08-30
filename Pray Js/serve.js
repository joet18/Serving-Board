'use strict';

document.addEventListener('DOMContentLoaded', async (e) => {

    const welcome = document.getElementById('wel');
    const logoutBtn = document.getElementById('logout');
    const eventForm = document.getElementById('prim-btn');
    const panal = document.getElementById('eventform');
    const esave = document.getElementById('e-save');
    const overlay = document.querySelector('.overlay');
    const searchInput = document.getElementById('s-Panal');
    const filterContainer = document.querySelector('.filter');

    const cardBoard = document.querySelector('#board-view .board');
    const myEventsBoard = document.getElementById('myEventsBoard');
    const myEventsFilter = document.getElementById('myevents-filter');

    const navBoard = document.getElementById('nav-board');
    const navMyEvents = document.getElementById('nav-myevents');
    const boardView = document.getElementById('board-view');
    const myeventsView = document.getElementById('myevents-view');

    const API = 'http://localhost:1324/api';

    //sesion duarde and get
    const SESSION_KEY = 'user.session'
    //for search
    let currentSearch = '';
    ////////// for catagori filter
    let currentCategory = 'all';
    //////
    //my events page
    let myEventsScope = 'created';

    // in-memory cache, refreshed after every mutation
    let allEvents = [];

    const raw = sessionStorage.getItem(SESSION_KEY);
    const session = raw ? JSON.parse(raw) : null;

    //actual guarde
    if (!session) {
        window.location.replace('Login.html');
        return;
    };

    //feat ; welcome and logout
    welcome.textContent = `Welcome ${session.username}`
    logoutBtn.addEventListener('click', (e) => {
        sessionStorage.removeItem(SESSION_KEY);
        window.location.replace('Login.html')
    });

    //reavel and remove the event form
    eventForm.addEventListener('click', (e) => {
        panal.classList.remove('hidden');
        overlay.classList.remove('hidden')
    });
    overlay.addEventListener('click',(e)=>{
         panal.classList.add('hidden');
         overlay.classList.add('hidden');
    })

    async function fetchEvents() {
        const res = await fetch(`${API}/events`);
        allEvents = await res.json();
        return allEvents;
    }

    function getUserEvents() {
        return allEvents.filter(ev => ev.createdBy === session.username);
    };

    function getEnrolledEvents() {
        return allEvents.filter(ev => ev.enrolledUsers.includes(session.username));
    }

    // grab these near the top of the file, alongside your other consts
    const titleInput = document.getElementById('event-title');
    const dateInput = document.getElementById('date');
    const categorySelect = document.getElementById('catagory');
    const capacityInput = document.getElementById('event-capacity');
    const descInput = document.getElementById('event-description');

    panal.addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = titleInput.value.trim();
        const date = dateInput.value;
        const category = categorySelect.value;
        const capacity = Number(capacityInput.value);
        const description = descInput.value.trim();

        if (!title || !date || !capacity) return;

        await fetch(`${API}/events`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, date, category, capacity, description, createdBy: session.username }),
        });

        panal.reset();
        panal.classList.add('hidden');
        overlay.classList.add('hidden');

        await fetchEvents();
        updateBoard();
    });

    function buildCard(ev) {
        const spotsLeft = ev.capacity - ev.enrolledUsers.length;
        const isEnrolled = ev.enrolledUsers.includes(session.username);
        const isOwner = ev.createdBy === session.username;
        // formating the date for render
        const dateObj = new Date(ev.date + 'T00:00:00');
        const dateformatted = dateObj.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        })

        const card = document.createElement('div');
        card.className = 'event-card';

        card.innerHTML = `
    <h2>${ev.title}</h2>
    <span class="tag">${ev.category}</span>
    <p>${ev.description}</p>
    <p>${dateformatted}</p>
    <p>${spotsLeft > 0 ? spotsLeft + ' spots left' : 'Full'}</p>
    <button class="cta" data-id="${ev.id}">
        ${isEnrolled ? 'Cancel my spot' : 'Sign up'}
    </button>
    ${isOwner ? `<button class="cta danger-btn" data-delete-id="${ev.id}">Delete</button>` : ''}
`;
        return card;
    }

    //rendering the events on a card
    function renderEvents(events, container) {
        container.innerHTML = '';
        events.forEach(ev => container.appendChild(buildCard(ev)));
    };

    async function handleEnrollClick(e) {
        if (!e.target.classList.contains('cta')) return;
        if (e.target.dataset.deleteId) return; // skip delete buttons
        const eventId = e.target.dataset.id;
        const ev = allEvents.find(item => item.id === eventId);
        if (!ev) return;

        const isEnrolled = ev.enrolledUsers.includes(session.username);
        if (isEnrolled) {
            await fetch(`${API}/events/${eventId}/unenroll`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: session.username }),
            });
        } else {
            if (ev.enrolledUsers.length >= ev.capacity) return;
            await fetch(`${API}/events/${eventId}/enroll`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: session.username }),
            });
        }

        await fetchEvents();
        updateBoard();
        updateMyEvents();
    }

    cardBoard.addEventListener('click', handleEnrollClick);
    myEventsBoard.addEventListener('click', handleEnrollClick);

    async function handleDelete(e) {
        if (!e.target.dataset.deleteId) return;
        const eventId = e.target.dataset.deleteId;

        await fetch(`${API}/events/${eventId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: session.username }),
        });

        await fetchEvents();
        updateBoard();
        updateMyEvents();
    }

    cardBoard.addEventListener('click', handleDelete);
    myEventsBoard.addEventListener('click', handleDelete);

    searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value.toLowerCase();
        updateBoard()
    });

    filterContainer.addEventListener('click', (e) => {
        if (!e.target.classList.contains('filter-btn')) return;

        currentCategory = e.target.dataset.category;

        const allButtons = document.querySelectorAll('.filter-btn');
        allButtons.forEach(btn => {
            btn.classList.toggle('active', btn === e.target);
        });

        updateBoard();
    });

    //listener for my events
    myEventsFilter.addEventListener('click', (e) => {
        if (!e.target.classList.contains('filter-btn')) return;

        myEventsScope = e.target.dataset.scope;

        const scopeButtons = myEventsFilter.querySelectorAll('.filter-btn');
        scopeButtons.forEach(btn => {
            btn.classList.toggle('active', btn === e.target);
        });

        updateMyEvents();
    });

    //search and filter oulet
    function updateBoard() {
        const visible = allEvents.filter(ev =>
            ev.title.toLowerCase().includes(currentSearch) &&
            (currentCategory === 'all' || ev.category === currentCategory)
        );
        renderEvents(visible, cardBoard);
    }

    //upEV
    function updateMyEvents() {
        const events = myEventsScope === 'created' ? getUserEvents() : getEnrolledEvents();
        renderEvents(events, myEventsBoard);
    }

    navBoard.addEventListener('click', (e) => {
        e.preventDefault();
        boardView.classList.remove('hidden');
        myeventsView.classList.add('hidden');
        navBoard.classList.add('active');
        navMyEvents.classList.remove('active');
    });

    navMyEvents.addEventListener('click', (e) => {
        e.preventDefault();
        myeventsView.classList.remove('hidden');
        boardView.classList.add('hidden');
        navMyEvents.classList.add('active');
        navBoard.classList.remove('active');
        updateMyEvents();
    });

    await fetchEvents();
    updateBoard();

});