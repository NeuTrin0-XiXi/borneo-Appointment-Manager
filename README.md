# borneo.io Appointment Scheduler

### Schedule Your Appointment with Herr Albert Einstein
- Features drag-and-select and a dropdown selection of slots from the calendar interface.
- Users can edit, delete, and add new slots.
- Double click to edit or delete a slot

### How to Run:
1. Ensure Node.js (latest version recommended) is installed.
2. Open a terminal in the project folder and run:
   ```bash
   npm i && npm run build
3. After the previous process is finished, run:
   ```bash
   npx - y serve -s build

### Future Scope and WIP Features:
- Developing an array-based algorithm to evaluate free slots with O(n) complexity.

### Application Architecture:
- The application is a standalone React app, supported by dummy data for demonstration.

### Significant Design Decisions:
- To prevent ambiguity regarding past bookings, users can only book slots at least one day in advance.
- User login information is used to auto-assign names to booked slots, removing the need to ask for email/name with each booking.

### Algorithms:
- Free slot evaluation uses a simple scan-based approach.
- There's potential for improvement with hash-based flagging for free slots.
- Restrictions for past slots and available slots are enforced via UI, not functionally.

### Third-party Libraries:
- The calendar is built using **react-big-calendar**, with bi-directional UI and functionality integration.

### React Hooks:
- Used to maintain centralized data storage and manage controlled refreshes.
