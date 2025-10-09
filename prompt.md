
> Create a complete **Biometric Face Voting System** using **Python (backend)**, **MongoDB (database)**, and **React.js (frontend)**.
>
> The project should be **locally hosted and offline-capable**, using **MongoDB local instance** (not cloud). It must feature a **modern, professional, and attractive UI design** with a **clean dark/light theme toggle** and a **smooth, responsive layout**.
>
> ---
>
> ### 🧠 **System Overview**
>
> * The system should allow **secure voter authentication using face recognition** before allowing any vote submission.
> * Each user can **vote only once**, verified by their **unique face data** stored in the database.
> * The system should store and track votes in MongoDB.
> * It should include **admin and user panels**:
>
>   * **User panel:** For voters to register face data and cast votes.
>   * **Admin panel:** To view total votes, voter data, and manage candidates.
>

>
> ### 🧩 **Tech Stack**
>
> * **Frontend:** React.js, Tailwind CSS (or Material UI)
> * **Backend:** Python (Flask or FastAPI)
> * **Database:** MongoDB (local/offline mode)
> * **Face Recognition:** `face_recognition` or `OpenCV` + `dlib`

>
> ### 🎨 **UI/UX Requirements**
>
> * Modern, clean, and responsive layout
> * Dashboard-style admin panel
> * Attractive landing and login pages
> * Smooth animations (using Framer Motion or CSS transitions)
> * Consistent theme with proper color contrast
> * Toast notifications (success, error, warnings)
>
> ---
>
> ### ⚙️ **Core Features**
>
> 1. **Face Registration:** Capture and store user’s face with name, ID, and other info.
> 2. **Login with Face Recognition:** Authenticate user via webcam image match.
> 3. **Vote Casting:** Allow user to select a candidate and cast a single vote.
> 4. **Vote Storage:** Store all votes securely in MongoDB.
> 5. **Admin Dashboard:**
>
>    * View candidates and their vote counts
>    * Manage candidate list (add/edit/remove)
>    * View registered users
> 6. **Security:** Prevent multiple voting by same face ID.
> 7. **Offline Database:** Use local MongoDB instance (not MongoDB Atlas).
> 8. **Export Reports:** Admin can export voting results as CSV/PDF.
>

> ### 🧪 **Extra Enhancements**
> * Proper error handling (missing camera, DB errors, etc.)
> * use python virtual env, create env file (for easy setup in different devices)



> ### 🧰 **Development Notes**
>
> * Use modular folder structure (`frontend/`, `backend/`, `db/`, etc.)
> * Include setup instructions (how to run backend, frontend, and connect DB).
> * Ensure the app runs **fully offline** with all dependencies installed locally.
> * Provide sample data for quick testing.

> ✅ **Goal:**
> Build a **fully functional biometric face voting web app** that runs locally, looks professional, and demonstrates real-world use of AI, databases, and full-stack integration.
