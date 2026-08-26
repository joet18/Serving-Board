# Serving-Board

A volunteer event management application designed to help coordinate and manage community service opportunities at churches and non-profit organizations.

## Overview

Serving-Board is a web-based platform that streamlines volunteer coordination by allowing users to create service events, browse available opportunities, and sign up for volunteer roles. The application features role-based filtering, search capabilities, and a personalized dashboard for tracking created and enrolled events.

## Features

- **User Authentication** - Secure login system to manage user sessions
- **Event Creation** - Create new volunteer opportunities with title, date, category, capacity, and description
- **Event Discovery** - Browse all available events with real-time search functionality
- **Category Filtering** - Filter events by category:
  - Setup (pre-event preparation)
  - Worship (service team roles)
  - Kids (children's ministry)
  - Kitchen (food and refreshments)
  - Outreach (community service)
- **Event Management** - View events you've created and events you're enrolled in
- **Sign-up System** - Join events (up to capacity) or cancel enrollment
- **Default Events** - Bootstrap with sample events for demonstration

## Project Structure

```
Serving-Board/
├── Pages/                    # HTML pages
│   ├── Login.html           # User authentication page
│   └── board.html           # Main application board
├── Pray Js/                 # JavaScript modules
│   ├── auth.js              # Authentication logic
│   ├── login.js             # Login form handling
│   └── serve.js             # Main application logic
├── Pray.css/                # Stylesheets
│   └── SS.css               # Main styles
├── Data/
│   └── default-events.json  # Sample events data
└── README.md                # This file
```

## Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Storage:** Browser localStorage and sessionStorage
- **Data Format:** JSON

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- No server or build tools required

### Installation

1. Clone the repository:
```bash
git clone https://github.com/joet18/Serving-Board.git
cd Serving-Board
```

2. Open the application:
   - Start by opening `Pages/Login.html` in your web browser
   - Or serve the project using a local HTTP server:
     ```bash
     # Using Python 3
     python -m http.server 8000
     
     # Using Node.js http-server
     npx http-server
     ```

## Usage

### Logging In
1. Navigate to the login page
2. Enter your username (any non-empty value for demo purposes)
3. Click login - you'll be redirected to the event board

### Creating an Event
1. Click the "Add event" button on the main board
2. Fill in the event details:
   - **Event title** - Name of the volunteer opportunity
   - **Event Date** - When the event takes place
   - **Category** - Type of volunteer work
   - **Spots** - Number of available volunteer positions
   - **Description** - Details about the event
3. Click "Save Event"

### Finding Events
1. Use the **Search bar** to find events by title
2. Click **category buttons** to filter by event type
3. Click **"Sign up"** to join an event (if spots available)
4. Click **"Cancel my spot"** to withdraw from an event

### Managing Your Events
1. Click the **"My events"** tab to view:
   - Events you've created
   - Events you're enrolled in
2. Use the toggle buttons to switch between views
3. Manage your enrollments from this view

## Data Storage

The application uses browser storage to persist data:

- **localStorage** - Stores event data persistently across sessions
- **sessionStorage** - Stores user session information (cleared when browser closes)

Default events are loaded from `Data/default-events.json` on first use.

## Event Object Structure

```json
{
  "id": "unique-event-id",
  "title": "Event Name",
  "date": "2026-08-23",
  "category": "setup|worship|kids|kitchen|outreach",
  "capacity": 5,
  "description": "Event details",
  "createdBy": "username",
  "enrolledUsers": ["username1", "username2"]
}
```

## Key JavaScript Files

### `Pray Js/serve.js`
Main application logic handling:
- Event creation and management
- Card rendering and updates
- Search and filter functionality
- Navigation between board and my events views
- Session management and guards

### `Pray Js/auth.js`
Authentication handling and session verification

### `Pray Js/login.js`
Login form submission and user creation

## Browser Compatibility

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Limitations

- Single-user per browser session
- Data resets if browser cache is cleared
- No server-side persistence
- No actual user authentication (demo only)

## Future Enhancements

- Backend database for data persistence
- User role-based access control
- Email notifications for event updates
- Event capacity notifications
- Past event history
- Recurring events
- Comments and communication system

## License

This project is open source. Feel free to use and modify for your needs.

## Contributing

Contributions are welcome! Please feel free to fork the repository and submit pull requests.

## Support

For issues or questions, please open an issue on the GitHub repository.

---

**Created by:** joet18  
**Repository:** [Serving-Board](https://github.com/joet18/Serving-Board)
