# DESCRIPTION

EventBeat is a web application designed to provide users with event details and allow them to sign up for events and add them to their Google Calendar. The app integrates with both Ticketmaster and Firebase events, offering event discovery, signup functionality, and easy calendar integration.

# HOSTING
You can try the app live at:
https://ggirassol.github.io/EventBeat/

# FEATURES
- View events from Ticketmaster or Firebase.
- Users and Staff can sign up for events.
- Signed up users and staff can add events to Google Calendar.
- Google OAuth login.
- Only staff can add events.

# TEST ACCOUNTS
- USER:
email: usertesting1190@gmail.com

- STAFF:
email: stafftesting1190@gmail.com

password for both: canyoufeelthebeat1190

To login on this email accounts and google accounts (so you are able to add an event to the google calendar and check your google calendar online) the emails and passwords are also the same

# RUN YOUR LOCAL MACHINE

node v>=18.18

1) Clone the repository
- git clone https://github.com/Ggirassol/EventBeat.git

2) Navigate into the project directory
- cd EvenBeat

3) Install dependencies
- npm install

4) You will need to create a .env file for your project and set your own environment variables:
- VITE_TICKETMASTER_API_KEY=your_ticketmaster_api_key
- VITE_FIREBASE_API_KEY=your_firebase_api_key
- VITE_CLIENT_ID=your_google_client_id
- VITE_GOOGLE_API_KEY=your_google_api_key

5) Run the app:
- npm run dev