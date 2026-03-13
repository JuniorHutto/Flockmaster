# Flockmaster - Sheep Herd Management System

A comprehensive web application for managing sheep herds, tracking breeding records, and monitoring herd profitability.

## Features

### Current Features
- **Dashboard**: Overview of your entire flock with key metrics
- **Sheep Management**: Add, edit, view, and delete sheep records
- **Sheep Listing**: Browse all sheep in your herd with search and filtering
- **Task Management**: Track tasks related to herd management
- **Data Storage**: Local storage for sheep data persistence

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

Build and run with Docker:
```bash
docker build -t flockmaster .
docker run -p 80:80 flockmaster
```

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
