# DESCRIPTION

EventBeat is a web application designed to provide users with event details and allow them to sign up for events and add them to their Google Calendar. The app integrates with both Ticketmaster and Firebase events, offering event discovery, signup functionality, and easy calendar integration.

# HOSTING
You can try the app live at:
"whatever.netlify.com"

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

# RUN YOUR LOCAL MACHINE
1) Clone the repositiory:
git clone https://github.com/yourusername/eventbeat.git

2) Navigate into the project directory:
cd EvenBeat

3) Install dependencies:
npm install

4) Set your own environment variables
VITE_TICKETMASTER_API_KEY=your_ticketmaster_api_key
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_CLIENT_ID=your_google_client_id
VITE_GOOGLE_API_KEY=your_google_api_key

5) Run the app:
npm run dev