# Vistula Task Manager

A simple Task Manager web application built with plain HTML, CSS and JavaScript, using **Supabase** (PostgreSQL + auto-generated REST API) as the database and hosted on **GitHub Pages**.

**Student ID:** 79831

## Links

- Live application: https://vistula-team-project-79831.github.io/vistula-task-manager/
- Repository: https://github.com/vistula-team-project-79831/vistula-task-manager
- Contributor page: https://vistula-team-project-79831.github.io/vistula-task-manager/contribution.html
- Contributor JSON: https://vistula-team-project-79831.github.io/vistula-task-manager/contribution.json

## Features

- Display all tasks from the database
- Add a new task (title, description)
- Edit an existing task
- Mark a task as completed / incomplete
- Delete a task
- All changes are stored in Supabase and persist after page refresh
- Error messages are shown in `#status-message` if an operation fails

## Technologies

- HTML, CSS, JavaScript (`fetch()`)
- Supabase REST API (`/rest/v1/tasks`)
- GitHub Pages

## Project files

| File | Purpose |
|------|---------|
| `index.html` | Main Task Manager page |
| `app.js` | Application logic (CRUD via Supabase REST API) |
| `style.css` | Styling |
| `config.json` | Public Supabase configuration |
| `supabase-setup.sql` | SQL used to create the `tasks` table and RLS policies |
| `contribution.html` / `contribution.json` | Added by my partner through a Pull Request |

## REST API operations used

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks?select=*` | Get all tasks |
| POST | `/tasks` | Create a task |
| PATCH | `/tasks?id=eq.{id}` | Update a task |
| DELETE | `/tasks?id=eq.{id}` | Delete a task |

## Team collaboration (Pull Requests)

- My Pull Request to my partner's repository (merged): https://github.com/vistula-team-project-79836/vistula-task-manager/pull/1
- My partner's Pull Request to this repository (merged): https://github.com/vistula-team-project-79831/vistula-task-manager/pull/1
