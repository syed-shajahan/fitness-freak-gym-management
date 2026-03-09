# Fitness Freak Gym Management System

A production-ready full-stack application for managing gym members with comprehensive CRUD operations, built with modern technologies and best practices.

## 🚀 Features

- **Complete Member Management**: Add, view, edit, and delete gym members
- **Plan-based Memberships**: Automatic end date calculation based on selected plans
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Real-time Validation**: Client and server-side form validation
- **Error Handling**: Comprehensive error handling with user feedback
- **Loading States**: Smooth UX with loading indicators
- **Type Safety**: Full TypeScript implementation
- **Production Ready**: Security, logging, and deployment configurations

## 🛠 Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **ShadCN/UI** - Modern component library
- **Lucide React** - Beautiful icons

### Backend
- **Flask** - Python web framework
- **SQLAlchemy** - ORM for database operations
- **SQLite** - Database (easily switchable to PostgreSQL/MySQL)
- **Flask-CORS** - Cross-origin resource sharing

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting (recommended)
- **Git** - Version control

## 📋 Prerequisites

- **Python 3.8+**
- **Node.js 18+**
- **Git**

## 🚀 Quick Start

### 1. Clone and Setup

```bash
git clone <your-repo-url>
cd ff-gym-management
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd flask

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration

# Start the server
# By default this will run in development mode with the Flask reloader enabled.
# If you encounter connection errors or need a single stable process (e.g. for
# containerized environments), disable the reloader or run in production mode:
#
# ```bash
# FLASK_ENV=production python app.py
# ```
python app.py
```

### 3. Frontend Setup

```bash
# In a new terminal, from project root
npm install

# Setup environment variables
cp .env.local.example .env.local
# Edit .env.local with your API URL

# Start development server
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5003
- **API Health Check**: http://localhost:5003/health


### Production Server

To run the backend without the development reloader (recommended for
production or in CI):

```bash
cd flask
FLASK_ENV=production python app.py
```

This will start the app with `debug` disabled and `use_reloader=False`.

## ⚙️ Environment Configuration

### Backend (.env)

```bash
# Flask environment
FLASK_ENV=development

# Security (CHANGE IN PRODUCTION)
SECRET_KEY=your-secure-random-secret-key-here

# Server configuration
PORT=5003

# Database (use PostgreSQL/MySQL in production)
DATABASE_URL=sqlite:///members.db

# CORS (restrict in production)
CORS_ORIGIN=http://localhost:3000

# Debug mode
DEBUG=True
```

### Frontend (.env.local)

```bash
# API endpoint
NEXT_PUBLIC_API_URL=http://localhost:5003
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/members` | Get all members |
| POST | `/members` | Create new member |
| PUT | `/members/<id>` | Update member |
| DELETE | `/members/<id>` | Delete member |
| GET | `/health` | Health check |

### Request/Response Examples

#### Create Member
```bash
POST /members
Content-Type: application/json

{
  "id": "12345",
  "name": "John Doe",
  "phone": "9876543210",
  "plan": "3_months",
  "startDate": "2024-01-15",
  "endDate": "2024-04-15"
}
```

#### Response
```json
{
  "id": "12345",
  "name": "John Doe",
  "phone": "9876543210",
  "plan": "3_months",
  "startDate": "2024-01-15",
  "endDate": "2024-04-15"
}
```

## 🏗 Project Structure

```
ff-gym-management/
├── app/                          # Next.js app directory
│   ├── context/                  # React context providers
│   ├── types/                    # TypeScript type definitions
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   └── globals.css              # Global styles
├── components/                   # Reusable React components
│   ├── ui/                      # ShadCN UI components
│   ├── member-table.tsx         # Members table component
│   ├── member-form.tsx          # Member form component
│   └── add-member-dialog.tsx    # Add member dialog
├── flask/                       # Python Flask backend
│   ├── app.py                   # Main Flask application
│   ├── requirements.txt         # Python dependencies
│   ├── .env.example            # Environment template
│   └── .env                    # Environment variables
├── lib/                         # Utility libraries
│   └── plans.ts                # Gym membership plans
├── public/                      # Static assets
└── instance/                    # SQLite database location
```

## 🔒 Security Considerations

### Production Checklist

- [ ] Change `SECRET_KEY` to a secure random string
- [ ] Set `FLASK_ENV=production`
- [ ] Set `DEBUG=False`
- [ ] Configure proper CORS origins
- [ ] Use HTTPS in production
- [ ] Set up proper logging
- [ ] Use environment-specific databases
- [ ] Implement rate limiting
- [ ] Add input sanitization
- [ ] Set up monitoring and alerts

### Environment Variables

Never commit sensitive data to version control. Use environment variables for:

- Database credentials
- API keys
- Secret keys
- External service URLs

## 🚀 Deployment

### Backend (Recommended: Render)

1. Create a Render Web Service
2. Connect your GitHub repository
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `python app.py`
5. Configure environment variables
6. Deploy!

### Frontend (Recommended: Vercel)

1. Import your repository to Vercel
2. Set `NEXT_PUBLIC_API_URL` to your backend URL
3. Deploy automatically on git push

### Database Migration

For production, consider migrating from SQLite to PostgreSQL:

```python
# In flask/.env
DATABASE_URL=postgresql://user:password@host:port/database
```

## 🧪 Development

### Available Scripts

```bash
# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Backend
python app.py        # Start Flask server
```

### Code Quality

- **ESLint**: Configured for Next.js and TypeScript
- **TypeScript**: Strict mode enabled
- **Prettier**: Recommended for consistent formatting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter issues:

1. Check the console for error messages
2. Verify environment variables are set correctly
3. Ensure both servers are running
4. Check the API health endpoint: `/health`

For production deployments, monitor logs and set up proper error tracking.
