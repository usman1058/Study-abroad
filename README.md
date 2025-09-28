# Study Abroad Mentor - Complete Website Solution

A modern, feature-rich mentor-style consultant website built with Next.js 15, TypeScript, and Prisma. This platform helps students find and apply to universities abroad while providing a comprehensive admin panel for managing all aspects of the business.

## 🌟 Features

### Public Website
- **🏠 Homepage**: Stunning hero section with 3D animations, featured universities carousel, and lucky draw widget
- **👤 About Page**: Mentor biography with animated testimonials and parallax effects
- **🇮🇹 Study in Italy**: Dynamic university listings with advanced filters
- **🇩🇪 Study in Germany**: Dynamic university listings with advanced filters
- **📧 Contact Form**: Comprehensive contact form with pre-filled university selection
- **🎯 Lucky Draw**: Interactive lucky draw with email validation

### Admin Panel
- **🔐 Secure Authentication**: Admin login with session management
- **📊 Dashboard**: Overview statistics and quick actions
- **🎓 University Management**: Full CRUD operations for universities
- **📧 Contact Management**: View, filter, and manage contact submissions
- **🎲 Lucky Draw Management**: Run draws and manage entries
- **📝 Testimonials**: Manage student testimonials

### Technical Features
- **🎨 Modern Design**: Framer Motion animations, 3D effects, and responsive design
- **⚡ Performance**: Optimized with Next.js 15 and TypeScript
- **🗄️ Database**: Prisma ORM with SQLite
- **🔒 Security**: Input validation, CSRF protection, and secure admin access
- **📱 Responsive**: Mobile-first design with Tailwind CSS

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd study-abroad-mentor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   # Push the database schema
   npm run db:push
   
   # Generate Prisma client
   npm run db:generate
   
   # Seed the database with sample data
   npm run db:seed
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Admin Access

### Login Credentials
- **Email**: `admin@studyabroad.com`
- **Password**: `admin123`

### Admin Panel Features
- **Dashboard**: Overview of all system statistics
- **University Management**: Add, edit, delete universities
- **Contact Submissions**: View and manage student inquiries
- **Lucky Draw**: Run draws and manage participant entries

## 🗄️ Database Schema

### Core Models
- **Users**: Admin users with role-based access
- **Universities**: University information with featured status
- **ContactSubmissions**: Student contact form submissions
- **LuckyDrawEntries**: Lucky draw participants and winners
- **Testimonials**: Student testimonials for the about page

### API Endpoints

#### Universities
- `GET /api/universities` - List universities with filtering
- `POST /api/universities` - Create new university (admin)
- `GET /api/universities/[id]` - Get university details
- `PUT /api/universities/[id]` - Update university (admin)
- `DELETE /api/universities/[id]` - Delete university (admin)

#### Contact Form
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - List submissions (admin)

#### Lucky Draw
- `POST /api/luckydraw/enter` - Enter lucky draw
- `POST /api/luckydraw/run` - Run lucky draw (admin)
- `GET /api/luckydraw/entries` - List entries (admin)

#### Authentication
- `POST /api/auth/login` - Admin login

## 🎨 Design System

### Animations & Interactions
- **Framer Motion**: Smooth animations and transitions
- **3D Effects**: Interactive elements with perspective transforms
- **Scroll Animations**: Parallax scrolling and reveal effects
- **Hover States**: Micro-interactions for better UX

### Color Palette
- **Primary**: Blue to Purple gradient
- **Secondary**: Green and Yellow accents
- **Neutral**: Gray tones for text and backgrounds

### Components
- **Shadcn/UI**: Modern, accessible UI components
- **Custom Animations**: Floating elements and background effects
- **Responsive Design**: Mobile-first approach

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### Development Scripts
```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Database operations
npm run db:push
npm run db:generate
npm run db:seed

# Code linting
npm run lint
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── about/             # About page
│   ├── admin/             # Admin panel
│   ├── api/               # API routes
│   ├── contact/           # Contact page
│   ├── study-in-uk/      # UK study page
│   ├── study-in-italy/    # Italy study page
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   └── ui/               # Shadcn UI components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
│   ├── db.ts             # Database client
│   └── utils.ts          # Helper functions
└── prisma/               # Database schema and migrations
    └── seed/             # Database seed script
```

## 🚀 Deployment

### Production Build
```bash
# Build the application
npm run build

# Start production server
npm run start
```

### Environment Setup for Production
1. Set up a production database
2. Configure environment variables
3. Run database migrations
4. Build and deploy the application

## 🛡️ Security Features

- **Input Validation**: All form inputs are validated and sanitized
- **CSRF Protection**: Built-in Next.js CSRF protection
- **Admin Authentication**: Secure admin panel with session management
- **Rate Limiting**: Protection against form spam
- **SQL Injection Prevention**: Prisma ORM parameterized queries

## 📈 Performance Optimizations

- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic code splitting for better performance
- **Caching**: Efficient caching strategies
- **Lazy Loading**: Components and images loaded on demand
- **Optimized Animations**: Hardware-accelerated animations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review the code comments
- Create an issue in the repository

## 🎯 Future Enhancements

- **Email Integration**: Automated email notifications
- **Payment Processing**: Integration with payment gateways
- **Multi-language Support**: Internationalization
- **Advanced Search**: Full-text search capabilities
- **Mobile App**: React Native companion app
- **Analytics**: User behavior tracking and insights

---

Built with ❤️ using Next.js, TypeScript, Prisma, and modern web technologies.