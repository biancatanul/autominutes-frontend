# AutoMinutes — Frontend

React + TypeScript client for AutoMinutes, a meeting management app with AI-powered transcript processing. Talks exclusively to the backend REST API, no local business logic or persistence.

## Tech Stack

- React 19 + TypeScript, built with Vite
- React Router v7 (client-side routing, protected routes)
- React Context API (auth, meetings, theme)
- CSS custom properties for theming (light + dark mode)
- react-icons

## Features

- **Auth**: signup/login, JWT stored client-side, protected routes via `ProtectedRoute`
- **Meetings**: create/edit/delete, list with search, date sort, pagination, status badges
- **Attendees**: add/edit/remove per meeting
- **Transcript & AI processing**: upload transcript, trigger processing, live status (idle/processing/completed/failed), reprocessing
- **Action items**: view/edit/delete per meeting, status toggle, filters by status/assignee
- **Profile**: edit name/avatar icon, change password, all wired to the backend
- **Responsive design**: mobile and desktop layouts, collapsible sidebar/hamburger nav
- **Dark mode**: toggle with dedicated CSS variables per theme

## Project Structure

Follows Atomic Design (strict hierarchy: molecules are built from atoms, organisms from molecules/atoms):

```
src/
  assets/
  components/
    atoms/        # Button, Spinner, DarkModeToggle
    molecules/     # Pagination, DatePicker, FilterDropdown, ActionItemRow, StatCard, ActionItemFilters
    organisms/     # Sidebar, Header, MeetingTable, MeetingForm, NewMeetingModal, ActionItemsList, ProfileCard, RecentMeetings, StatsRow, Searchbar, MeetingOptions
    templates/     # ProfileTemplate
    pages/         # Landing, Login, Signup, Home, Meetings, MeetingDetail, ActionItems, ProfilePage, HowItWorks
  context/         # AuthContext, MeetingsContext, ThemeContext
  lib/             # api.ts, meetings.ts, attendees.ts, actionItems.ts, transcripts.ts, processing.ts, authStorage.ts, profileIcons.tsx, formatDate.ts
  routes/          # ProtectedRoute
  App.tsx
  main.tsx
```

## Conventions

- **Atomic Design**: molecules only combine atoms; organisms only combine molecules/atoms. No skipping levels.
- **BEM** for CSS class naming.
- **Conventional Commits** (`feat`, `fix`, `chore`, `style`, `refactor`, with scope).

## Setup

```bash
git clone https://github.com/biancatanul/autominutes-frontend.git
cd autominutes-frontend
npm install
```

Create a `.env` file in the project root:

```
VITE_API_BASE_URL=http://localhost:3500/api
```

Make sure the backend is running first (see backend README) so API calls resolve.

## Running the app

```bash
npm run dev
```

App runs at `http://localhost:5173` by default.

## Other scripts

```bash
npm run build     # type-check + production build
npm run lint       # ESLint
npm run preview    # preview production build
```

## Routes

| Path | Page | Protected |
| --- | --- | --- |
| `/` | Landing | No |
| `/signup` | Signup | No |
| `/login` | Login | No |
| `/home` | Home (stats + recent meetings) | Yes |
| `/meetings` | Meetings list | Yes |
| `/meetings/:id` | Meeting detail | Yes |
| `/action-items` | Action items | Yes |
| `/profile` | Profile (edit info, change password) | Yes |
| `/how-it-works` | How it works | Yes |
