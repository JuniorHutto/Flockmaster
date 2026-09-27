# Flockmaster - Sheep Herd Management System

A comprehensive web application for managing sheep herds, tracking breeding records, and monitoring herd profitability.

## Features

### Current Features
- **Dashboard**: Overview of your entire flock with key metrics
- **Sheep Management**: Add, edit, view, and delete sheep records
- **Sheep Listing**: Browse all sheep in your herd with search and filtering
- **Task Management**: Track tasks related to herd management
- **Data Storage**: PostgreSQL via a small Node API, with offline browser cache
- **Backup / Restore**: Export and import all data as a JSON file

### Planned Features
- **Breeding Records**: Track breeding dates, sire information, and pregnancy checks
- **Herd Profitability Analysis**: Monitor costs and revenue
  - **Expenses**: Feed, bedding, minerals, veterinary care
  - **Revenue**: Meat sales, breeding stock sales
- **Inventory Database**: PostgreSQL database integration for scalable data storage
- **UI Improvements**: Enhanced settings panel and icon placement

## Tech Stack
- **Frontend**: React + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Container**: Docker + Nginx

## Installation

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Run the development server:
   ```
   npm run dev
   ```
4. Open your browser to `http://localhost:5173`

### Docker Deployment

Build and run the app, API and PostgreSQL database:
```bash
docker compose up -d --build
```
Open `http://localhost:81`. Data is stored in PostgreSQL (named volume `pgdata`), so it survives rebuilds.
The browser keeps a local copy and syncs changes when the server is reachable (see the status in the sidebar).

Optional: set `POSTGRES_USER`, `POSTGRES_PASSWORD` and `POSTGRES_DB` in a `.env` file next to `docker-compose.yml`
(defaults are `flockmaster`). Set them before the first start; the database keeps its original credentials afterwards.

**Backup / restore:** use **Backup Data** / **Restore Data** in the sidebar for a JSON file backup.
Do not run `docker compose down -v`: `-v` deletes the database volume.

## Project Structure

```
flockmaster/
├── components/          # React components
│   ├── Dashboard.tsx
│   ├── SheepList.tsx
│   ├── SheepForm.tsx
│   ├── SheepDetail.tsx
│   └── TaskManager.tsx
├── services/           # Business logic
│   ├── storageService.ts
│   └── exportService.ts
├── types.ts           # TypeScript type definitions
├── App.tsx            # Main application component
└── docker/           # Docker configuration
```

## Usage

1. **Add Sheep**: Click the "+" button to add a new sheep to your herd
2. **View Details**: Select a sheep from the list to see detailed information
3. **Edit Records**: Update sheep information as needed
4. **Manage Tasks**: Use the task manager to track breeding and other herd management activities

## Demo
[Flockmaster Demo](https://flockmaster.hutto.io)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

See LICENSE file for details.
