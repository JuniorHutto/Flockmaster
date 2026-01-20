<img  width="250" height="250" alt="image" src="https://github.com/user-attachments/assets/565ee07f-6db9-4597-ab6c-2ef425dc54c8" />




## 🚀 Quick Start Guide
Flockmaster is a web-based management tool designed to take the robust calculations of the Oklahoma State Extension Service sheep records and move them into a mobile-friendly, self-hosted environment.

### Prerequisites
Before deploying, ensure you have the following ready in your environment:

Docker & Docker Compose (Tested on Ubuntu/Fedora)

Internal Network Access (If using Proxmox/Nginx Proxy Manager)

### Deployment
Clone the repository and bring up the stack:
Bash
```
git clone https://github.com/JuniorHutto/Flockmaster.git
cd Flockmaster
docker-compose up -d
```
### Initial Configuration
Once the container is running, access the UI at http://<your-ip>:port.

Sync Spreadsheet Data: If you are migrating from the OSU Excel sheet, use the Import tool (currently supporting CSV).

Define Your Flock: Head to the Flock Overview to verify your initial counts for Ewes, Rams, and Lambs.

### Key Features
Extension Logic: Automatically handles adjusted weaning weights based on OSU standards.

Health Tracking: Log vaccinations, deworming, and weight checks directly from your phone while in the field.

Visual Insights: Live dashboard showing average weights and flock composition.
