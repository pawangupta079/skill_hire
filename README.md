# SkillHire - AI-Powered Job Matching Platform

A full-stack MERN application that connects talented professionals with amazing job opportunities using AI-powered matching algorithms.

## 🚀 Features

### Core Features
- **User Authentication**: JWT-based authentication with role-based access control
- **Job Management**: Post, search, and filter job listings
- **AI-Powered Matching**: Smart algorithm matches candidates with relevant jobs
- **Real-time Chat**: Socket.IO powered messaging between candidates and recruiters
- **Application Tracking**: Complete application lifecycle management
- **Profile Management**: Comprehensive user profiles with skills and experience
- **File Upload**: Resume and document upload functionality

### User Roles
- **Candidates**: Job seekers looking for opportunities
- **Recruiters**: Employers posting jobs and managing applications
- **Admin**: Platform administrators with full access

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Socket.IO** for real-time communication
- **Multer** for file uploads
- **bcrypt** for password hashing
- **Redis** for caching and queues

### Frontend
- **React 19** with modern hooks
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API calls
- **Socket.IO Client** for real-time features
- **React Hook Form** for form management
- **React Hot Toast** for notifications

## 📁 Project Structure

```
skillhire/
├── skillhire-server/          # Backend API
│   ├── models/                # MongoDB models
│   ├── routes/                # API routes
│   ├── middleware/            # Custom middleware
│   └── app.js                 # Express server
├── skillhire-client/          # Frontend React app
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── contexts/         # React contexts
│   │   ├── utils/            # Utility functions
│   │   └── App.jsx           # Main app component
│   └── public/               # Static assets
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- Redis (optional, for caching)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd skillhire
   ```

2. **Install backend dependencies**
   ```bash
   cd skillhire-server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../skillhire-client
   npm install
   ```

4. **Set up environment variables**
   
   Backend (skillhire-server/.env):
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/skillhire
   JWT_SECRET=your-super-secret-jwt-key
   CLIENT_URL=http://localhost:3000
   ```

   Frontend (skillhire-client/.env):
   ```env
   VITE_API_URL=http://localhost:5000
   VITE_SOCKET_URL=http://localhost:5000
   ```

5. **Start MongoDB**
   ```bash
   mongod
   ```

6. **Start the backend server**
   ```bash
   cd skillhire-server
   npm run dev
   ```

7. **Start the frontend development server**
   ```bash
   cd skillhire-client
   npm run dev
   ```

8. **Open your browser**
   Navigate to `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Job Endpoints
- `GET /api/jobs` - Get all jobs with filtering
- `GET /api/jobs/:id` - Get job by ID
- `POST /api/jobs` - Create new job (recruiter only)
- `PUT /api/jobs/:id` - Update job (recruiter only)
- `DELETE /api/jobs/:id` - Delete job (recruiter only)

### Application Endpoints
- `POST /api/applications` - Apply for a job
- `GET /api/applications/my-applications` - Get user's applications
- `GET /api/applications/job/:jobId` - Get applications for a job
- `PUT /api/applications/:id/status` - Update application status

### Chat Endpoints
- `POST /api/chat/room` - Create or get chat room
- `GET /api/chat/rooms` - Get user's chat rooms
- `GET /api/chat/room/:roomId/messages` - Get room messages

## 🎯 Key Features Implementation

### AI-Powered Job Matching
The platform uses a sophisticated matching algorithm that considers:
- Skills compatibility
- Experience level alignment
- Location preferences
- Salary expectations
- Job requirements vs. candidate profile

### Real-time Communication
- Instant messaging between candidates and recruiters
- Real-time notifications
- Online/offline status indicators
- Message read receipts

### Application Management
- Complete application lifecycle tracking
- Status updates and notifications
- Interview scheduling
- Notes and communication history

## 🔧 Development

### Backend Development
```bash
cd skillhire-server
npm run dev          # Start with nodemon
npm start           # Start production server
```

### Frontend Development
```bash
cd skillhire-client
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
```

### Database Management
```bash
# Connect to MongoDB
mongosh

# Use skillhire database
use skillhire

# View collections
show collections
```

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or your preferred MongoDB hosting
2. Configure environment variables
3. Deploy to your preferred platform (Heroku, AWS, DigitalOcean, etc.)

### Frontend Deployment
1. Build the production version: `npm run build`
2. Deploy the `dist` folder to your hosting platform
3. Configure environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Express.js team for the robust backend framework
- MongoDB team for the flexible database
- Tailwind CSS team for the utility-first CSS framework

## 📞 Support

For support, email support@skillhire.com or create an issue in the repository.

---

**SkillHire** - Connecting talent with opportunity through AI-powered matching.