# Chatter 💬

Chatter is a modern real-time multi-channel chat application built with React, Node.js, Express, and Socket.IO.

It allows users to:
- Create accounts
- Login securely
- Edit their profiles
- Upload profile pictures
- Join channels
- Create channels
- Send real-time messages
- Search messages instantly
- Switch between light and dark mode

The application is responsive and works on both desktop and mobile devices.

---

# Features

## Authentication
- User registration
- User login
- Logout functionality

## User Profiles
- Display name editing
- Bio/description editing
- Profile picture upload
- Profile picture URL support

## Real-Time Chat
- Multi-channel support
- Instant messaging using Socket.IO
- Real-time updates across devices/tabs

## Channel System
- Create channels dynamically
- Join channels instantly
- Shared channels across users

## Search
- Search messages
- Search users by display name

## UI/UX
- Mobile responsive
- Dark mode
- Light mode
- Modern chat interface

---

# Technologies Used

## Frontend
- React
- Vite
- Socket.IO Client

## Backend
- Node.js
- Express
- Socket.IO

## Deployment
- Vercel (Frontend)
- Render (Backend)

---

# Live Demo

Frontend:
https://chatter-seven-azure.vercel.app/

Backend:
https://chater-fvl2.onrender.com/

---

# Project Structure

```txt
client/
├── public/
├── src/
│   ├── assets/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
server/
├── server.js
├── package.json
```

---

# Installation

## Clone Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_LINK
```

---

# Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend runs on:
```txt
http://localhost:5173
```

---

# Backend Setup

```bash
cd server
npm install
node server.js
```

Backend runs on:
```txt
http://localhost:5000
```

---

# Environment Variables

Inside the frontend create:

```txt
client/.env
```

Add:

```env
VITE_API_URL=http://localhost:5000
```

For production:

```env
VITE_API_URL=https://chater-fvl2.onrender.com
```

---

# How To Use

## Register
Create a new account using username and password.

## Login
Login with your credentials.

## Edit Profile
Click the Profile button to:
- Change display name
- Add bio
- Upload profile picture

## Create Channel
Type a new channel name and press `+`.

## Send Message
Type a message and press Send or Enter.

## Search
Click the search icon to search messages.

---

# Future Improvements

- Message persistence/database
- Typing indicators
- Online/offline status
- Emoji support
- File sharing
- Voice/video calls
- Notifications

---

# Author

Built by:
YOUR_NAME_HERE

---

# License

This project is for educational purposes.