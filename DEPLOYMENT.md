# Production Deployment Guide

## 🚀 Deploying Fitness Freak Gym Management System

This guide covers deploying both the Flask backend and Next.js frontend to production.

## Backend Deployment (Flask)

### Option 1: Render (Recommended)

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up and connect your GitHub

2. **Create Web Service**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Set the following:

   **Build Settings:**
   ```
   Build Command: pip install -r flask/requirements.txt
   Start Command: python flask/app.py
   ```

   **Environment Variables:**
   ```
   FLASK_ENV=production
   SECRET_KEY=your-secure-random-secret-key-here
   PORT=10000
   DATABASE_URL=sqlite:///members.db
   CORS_ORIGIN=https://your-frontend-domain.com
   DEBUG=False
   ```

3. **Deploy**
   - Render will automatically build and deploy
   - Your API will be available at: `https://your-service-name.onrender.com`

### Option 2: Railway

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)

2. **Deploy from GitHub**
   - Connect your repository
   - Railway will auto-detect Python
   - Set environment variables as above

3. **Database**
   - Add PostgreSQL plugin for production database

## Frontend Deployment (Next.js)

### Option 1: Vercel (Recommended)

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Connect your GitHub

2. **Import Project**
   - Click "Import Project"
   - Select your repository
   - Vercel will auto-detect Next.js

3. **Configure Environment**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.com
   ```

4. **Deploy**
   - Vercel will build and deploy automatically
   - Your app will be available at: `https://your-project.vercel.app`

### Option 2: Netlify

1. **Create Netlify Account**
   - Go to [netlify.com](https://netlify.com)

2. **Deploy from GitHub**
   - Connect your repository
   - Set build command: `npm run build`
   - Set publish directory: `.next`

3. **Environment Variables**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.com
   ```

## Database Migration (Production)

### From SQLite to PostgreSQL

1. **Install PostgreSQL**
   ```bash
   # On Ubuntu/Debian
   sudo apt-get install postgresql postgresql-contrib

   # On macOS
   brew install postgresql
   ```

2. **Update Flask Configuration**
   ```python
   # In flask/.env
   DATABASE_URL=postgresql://username:password@localhost:5432/gym_db
   ```

3. **Install PostgreSQL Driver**
   ```bash
   pip install psycopg2-binary
   ```

4. **Create Database**
   ```sql
   CREATE DATABASE gym_db;
   CREATE USER gym_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE gym_db TO gym_user;
   ```

5. **Run Migrations**
   ```python
   from flask import Flask
   from flask_sqlalchemy import SQLAlchemy

   app = Flask(__name__)
   app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://...'
   db = SQLAlchemy(app)

   with app.app_context():
       db.create_all()
   ```

## Security Checklist

### Pre-Deployment
- [ ] Change `SECRET_KEY` to secure random string (64+ characters)
- [ ] Set `FLASK_ENV=production`
- [ ] Set `DEBUG=False`
- [ ] Configure proper CORS origins
- [ ] Use HTTPS (free SSL from deployment platforms)
- [ ] Remove or secure `.env` files
- [ ] Update database credentials

### Post-Deployment
- [ ] Test all CRUD operations
- [ ] Verify CORS is working
- [ ] Check logs for errors
- [ ] Test form validation
- [ ] Verify mobile responsiveness
- [ ] Test error handling

## Monitoring & Maintenance

### Logs
- **Flask**: Check deployment platform logs
- **Next.js**: Check Vercel/Netlify deployment logs

### Backups
```bash
# SQLite backup (if using SQLite)
sqlite3 instance/members.db ".backup backup.db"

# PostgreSQL backup
pg_dump gym_db > backup.sql
```

### Updates
1. Make changes locally
2. Test thoroughly
3. Commit and push
4. Deployment platforms auto-deploy

## Troubleshooting

### Common Issues

**CORS Errors**
- Check `CORS_ORIGIN` in Flask config
- Ensure frontend URL is correct

**API Connection Failed**
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check if backend is running
- Test API endpoints directly

**Database Errors**
- Check database URL format
- Verify credentials
- Ensure database exists

**Build Failures**
- Check Node.js/Python versions
- Verify dependencies are installed
- Check for TypeScript errors

### Support
- Check browser console for errors
- Test API endpoints with curl/Postman
- Review deployment platform logs
- Verify environment variables are set

## Performance Optimization

### Frontend
- Enable Next.js optimizations
- Use proper image optimization
- Implement proper caching strategies

### Backend
- Use Gunicorn for production serving
- Implement database connection pooling
- Add Redis for session storage (if needed)

### Database
- Add proper indexes
- Optimize queries
- Consider read replicas for high traffic

## Cost Optimization

### Free Tiers
- **Frontend**: Vercel/Netlify free tier
- **Backend**: Render free tier (750 hours/month)
- **Database**: Railway/Render free PostgreSQL

### Scaling
- Monitor usage and upgrade plans as needed
- Implement caching to reduce database load
- Use CDN for static assets