# MyRDPApp - Production-Ready Windows Web RDP Platform

A complete, enterprise-grade browser-based Remote Desktop application for Windows environments. Users login with Windows credentials and access full interactive RDP sessions directly in their browser using HTML5 Canvas rendering.

## Features

- **Native RDP Protocol**: Direct RDP communication (not VNC/WebRTC streaming)
- **Windows Authentication**: Integrated with Windows local accounts and Active Directory
- **Multi-Session Support**: Multiple concurrent RDP sessions via RDPWrap
- **Real-time Rendering**: HTML5 Canvas-based desktop rendering with WebSocket communication
- **Full Input Support**: Keyboard, mouse, clipboard synchronization
- **Admin Dashboard**: Session monitoring, user management, activity logs
- **Enterprise Security**: HTTPS/WSS, CSRF protection, rate limiting, audit logging
- **Dynamic Resolution**: Automatic desktop resolution adjustment
- **Session Management**: Reconnect support, idle timeout handling

## Tech Stack

### Backend
- **Node.js + Express** (primary)
- **Alternative**: ASP.NET Core 7+
- WebSocket server (ws library)
- Native RDP communication layer
- Windows authentication (SSPI/LDAP)

### Frontend
- **HTML5 Canvas** rendering
- **Tailwind CSS** styling
- **Vanilla JavaScript** (with optional React components)
- **WebSocket** real-time communication

### Database
- **SQLite** (default - easy deployment)
- **PostgreSQL** (optional - for scaling)

### Infrastructure
- **Windows Server 2022**
- **RDPWrap** for multiple concurrent RDP sessions
- **IIS/Nginx** reverse proxy
- **HTTPS/WSS** encryption

## Project Structure

```
MyRDPApp/
├── backend/                    # Node.js/Express backend
│   ├── src/
│   │   ├── config/            # Configuration management
│   │   ├── auth/              # Authentication layer
│   │   ├── rdp/               # RDP protocol implementation
│   │   ├── websocket/         # WebSocket handlers
│   │   ├── session/           # Session management
│   │   ├── api/               # REST API endpoints
│   │   ├── middleware/        # Express middleware
│   │   ├── utils/             # Utility functions
│   │   ├── database/          # Database initialization
│   │   └── app.js             # Main Express app
│   ├── package.json
│   ├── .env.example
│   └── server.js
├── frontend/                   # HTML5 frontend
│   ├── public/
│   │   ├── index.html
│   │   ├── css/
│   │   │   ├── tailwind.css
│   │   │   └── custom.css
│   │   ├── js/
│   │   │   ├── app.js
│   │   │   ├── rdp-client.js
│   │   │   ├── auth.js
│   │   │   ├── ui-manager.js
│   │   │   ├── websocket-manager.js
│   │   │   └── utils.js
│   │   └── assets/
│   └── pages/
│       ├── login.html
│       ├── dashboard.html
│       └── rdp-viewer.html
├── database/                   # Database schema & migrations
│   ├── schema.sql
│   └── init.sql
├── deployment/                 # Deployment scripts & configs
│   ├── windows-service/
│   ├── iis-config/
│   ├── nginx-config/
│   ├── ssl-setup/
│   └── installation-scripts/
├── docs/                       # Documentation
│   ├── ARCHITECTURE.md
│   ├── DEPLOYMENT.md
│   ├── SECURITY.md
│   ├── API.md
│   └── TROUBLESHOOTING.md
├── .env.example
├── .gitignore
└── package.json               # Root package.json
```

## Quick Start

### Prerequisites
- Windows Server 2022
- Node.js 18+
- RDPWrap installed and configured
- SSL certificate (self-signed or CA)

### Installation

1. **Clone repository**
   ```bash
   git clone https://github.com/jayd33p/MyRDPApp.git
   cd MyRDPApp
   ```

2. **Install dependencies**
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. **Configure environment**
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env with your settings
   ```

4. **Initialize database**
   ```bash
   npm run db:init
   ```

5. **Start backend**
   ```bash
   cd backend && npm start
   ```

6. **Access application**
   ```
   https://localhost:8443
   ```

## API Endpoints

- `POST /api/auth/login` - User authentication
- `POST /api/auth/logout` - Logout
- `GET /api/sessions` - List user sessions
- `POST /api/sessions` - Create new RDP session
- `GET /api/sessions/:id` - Get session details
- `DELETE /api/sessions/:id` - Disconnect session
- `GET /api/admin/users` - List active users (admin)
- `GET /api/admin/logs` - Activity logs (admin)

## WebSocket Events

**Client → Server:**
- `keyboard` - Keyboard input
- `mouse` - Mouse movement/clicks
- `clipboard-read` - Request clipboard data
- `clipboard-write` - Send clipboard data
- `keepalive` - Session keepalive

**Server → Client:**
- `frame` - RDP frame data
- `clipboard` - Clipboard data
- `resolution-change` - Resolution update
- `session-info` - Session metadata
- `error` - Connection errors

## Security Features

- ✅ HTTPS/WSS encryption
- ✅ CSRF protection
- ✅ Rate limiting (login attempts, API calls)
- ✅ Secure session tokens (JWT)
- ✅ Password never stored in database
- ✅ Windows token impersonation
- ✅ Audit logging (all actions)
- ✅ IP logging and validation
- ✅ Brute force protection
- ✅ Session expiration (configurable)
- ✅ Secure cookie handling

## Configuration

Key environment variables:
```
# Server
NODE_ENV=production
PORT=8443
HTTPS=true
SSL_KEY_PATH=/path/to/key.pem
SSL_CERT_PATH=/path/to/cert.pem

# Database
DB_TYPE=sqlite
DB_PATH=./data/app.db

# RDP
RDP_ENABLE_AUDIO=false
RDP_ENABLE_CLIPBOARD=true
RDP_ENABLE_FILE_TRANSFER=false

# Security
SESSION_TIMEOUT=3600000
IDLE_TIMEOUT=1800000
MAX_LOGIN_ATTEMPTS=5
RATE_LIMIT_WINDOW=900000

# RDPWrap
RDPWRAP_MAX_SESSIONS=10
```

## Deployment

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for:
- Windows Service setup
- IIS reverse proxy configuration
- Nginx reverse proxy configuration
- SSL certificate setup
- Firewall rules
- Performance tuning

## Admin Features

- View active users and sessions
- Force disconnect users
- Configure idle timeout
- Set max concurrent sessions
- View detailed activity logs
- Monitor system health

## Documentation

- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - System design and components
- **[DEPLOYMENT.md](docs/DEPLOYMENT.md)** - Production setup guide
- **[SECURITY.md](docs/SECURITY.md)** - Security hardening checklist
- **[API.md](docs/API.md)** - Complete API reference
- **[TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)** - Common issues and solutions

## System Requirements

- Windows Server 2022
- 4GB RAM minimum (8GB recommended)
- 2 CPU cores minimum (4+ recommended)
- 100GB disk space
- RDPWrap properly configured
- Valid SSL certificate

## Performance

- Optimized Canvas rendering
- Binary WebSocket packets
- Connection pooling
- Session caching
- Low-latency frame delivery (<50ms)

## Browser Support

- ✅ Chrome/Chromium 90+
- ✅ Edge 90+
- ✅ Firefox 88+
- ✅ Opera 76+

## License

Proprietary - All rights reserved

## Support

For issues and documentation, see [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)

---

**Version**: 1.0.0  
**Last Updated**: 2026-05-24
