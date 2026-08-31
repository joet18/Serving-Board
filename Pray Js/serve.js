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


    //sesion duarde and get
    const SESSION_KEY = 'user.session'
    const EVENTS_KEY = 'app_events'
    //for search
    let currentSearch = '';
    ////////// for catagori filter
    let currentCategory = 'all';
    //////
    //my events page
    let myEventsScope = 'created';

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

    function getEvents() {
        const raw = localStorage.getItem(EVENTS_KEY);
        return raw ? JSON.parse(raw) : [];
    }

    function saveEvents(events) {
        localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
    }

    function getUserEvents() {
        const allEvents = getEvents();
        return allEvents.filter(ev => ev.createdBy === session.username);
    };

    function getEnrolledEvents() {
        const allEvents = getEvents();
        return allEvents.filter(ev => ev.enrolledUsers.includes(session.username));
    }

    // grab these near the top of the file, alongside your other consts
    const titleInput = document.getElementById('event-title');
    const dateInput = document.getElementById('date');
    const categorySelect = document.getElementById('catagory');
    const capacityInput = document.getElementById('event-capacity');
    const descInput = document.getElementById('event-description');

    panal.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = titleInput.value.trim();
        const date = dateInput.value;
        const category = categorySelect.value;
        const capacity = Number(capacityInput.value);
        const description = descInput.value.trim();

        if (!title || !date || !capacity) return;

        const events = getEvents();

        events.push({
            id: Date.now().toString(),
            title,
            date,
            category,
            capacity,
            description,
            createdBy: session.username,
            enrolledUsers: []
        });

        saveEvents(events);

        panal.reset();
        panal.classList.add('hidden');
        overlay.classList.add('hidden');

        updateBoard();
    });

    //fetching the default-events from the .json file in Datas
    async function DefaultEvents() {
        const existing = getEvents();
        if (existing.length > 0) return;
        try {
            const res = await fetch('../Data/default-events.json');
            const data = await res.json();
            saveEvents(data);
        } catch (err) { console.log(`Failed to load default events`, err) }
    };

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
    <div class="card-actions">
        <button class="cta" data-id="${ev.id}">
            ${isEnrolled ? 'Cancel my spot' : 'Sign up'}
        </button>
        ${isOwner ? `<button class="danger-btn" data-delete-id="${ev.id}">Delete</button>` : ''}
    </div>
`;
        return card;
    }

    //rendering the events on a card
    function renderEvents(events, container) {
        container.innerHTML = '';
        events.forEach(ev => container.appendChild(buildCard(ev)));
    };

    cardBoard.addEventListener('click', (e) => {
        if (!e.target.classList.contains('cta')) return;
        const eventId = e.target.dataset.id;
        const events = getEvents();
        const ev = events.find(item => item.id === eventId);
        if (!ev) return;

        const isEnrolled = ev.enrolledUsers.includes(session.username);
        if (isEnrolled) {
            ev.enrolledUsers = ev.enrolledUsers.filter(u => u !== session.username);
        } else {
            if (ev.enrolledUsers.length >= ev.capacity) return;
            ev.enrolledUsers.push(session.username);
        }

        saveEvents(events);
        updateBoard()
    });

    myEventsBoard.addEventListener('click', (e) => {
        if (!e.target.classList.contains('cta')) return;
        const eventId = e.target.dataset.id;
        const events = getEvents();
        const ev = events.find(item => item.id === eventId);
        if (!ev) return;

        const isEnrolled = ev.enrolledUsers.includes(session.username);
        if (isEnrolled) {
            ev.enrolledUsers = ev.enrolledUsers.filter(u => u !== session.username);
        } else {
            if (ev.enrolledUsers.length >= ev.capacity) return;
            ev.enrolledUsers.push(session.username);
        }

        saveEvents(events);
        updateMyEvents();
    });

    function handleDelete(e) {
        if (!e.target.dataset.deleteId) return;
        const eventId = e.target.dataset.deleteId;
        let events = getEvents();
        events = events.filter(ev => ev.id !== eventId);
        saveEvents(events);
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
        const events = getEvents();
        const visible = events.filter(ev =>
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

    await DefaultEvents();
    updateBoard();

});