# PEPTIDE.CLUB - Research Peptides E-Commerce Platform

A modern, full-stack e-commerce platform for research peptides and compounds, built with Next.js 16, TypeScript, and Redux Toolkit.

## 🚀 Features

### 🛒 E-Commerce Functionality

- **Product Catalog**: Browse research peptides with detailed specifications, pricing, and references
- **Advanced Search**: Real-time product search with debounced queries
- **Shopping Cart**: Persistent cart with Redux state management
- **Secure Checkout**: Stripe-powered payment processing with order management
- **Order History**: Complete order tracking and repeat purchase functionality

### 👤 User Management

- **Authentication**: Secure login/register with JWT tokens and refresh token handling
- **User Dashboard**: Personal dashboard with order history, profile management, and referral codes
- **Tier System**: Member, VIP, and Founder tiers with different discounts and benefits
- **Referral Program**: Invite-based registration with commission rewards

### 🛡️ Admin Panel

- **Product Management**: Create, edit, and manage peptide inventory
- **Order Management**: View and process customer orders
- **User Administration**: Manage user accounts and permissions
- **Analytics Dashboard**: Business insights and reporting

### 🎨 User Experience

- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Dark Theme**: Modern dark UI optimized for laboratory research
- **Real-time Updates**: Live search, cart updates, and status notifications
- **Progressive Web App**: Fast loading with optimized performance

## 🛠️ Tech Stack

### Frontend

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework
- **Redux Toolkit** - State management with RTK Query
- **React Hook Form** - Form handling with Zod validation
- **Lucide React** - Modern icon library

### State Management

- **Redux Persist** - Persistent state across sessions
- **RTK Query** - API state management and caching
- **Automatic Re-authentication** - Token refresh handling

### UI/UX

- **Responsive Design** - Mobile-first approach
- **Loading States** - Skeleton screens and progress indicators
- **Error Handling** - Comprehensive error boundaries
- **Toast Notifications** - User feedback system

## 📋 Prerequisites

- **Node.js** 18+ and npm
- **Backend API** running on port 5049 (see environment variables)
- **Stripe Account** for payment processing

## 🚀 Getting Started

### 1. Clone and Install

```bash
git clone <repository-url>
cd peptide-frontend
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
NEXT_PUBLIC_BASE_API=http://localhost:5049
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
```

### 3. Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### 4. Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
peptide-frontend/
├── app/                          # Next.js App Router
│   ├── (admin)/                  # Admin routes (protected)
│   ├── (auth)/                   # Authentication routes
│   ├── (root)/                   # Main application routes
│   ├── components/               # Reusable UI components
│   ├── contexts/                 # React contexts
│   ├── hooks/                    # Custom React hooks
│   ├── lib/                      # Utility libraries
│   ├── providers/                # Context providers
│   ├── redux/                    # State management
│   │   ├── api/                  # RTK Query APIs
│   │   ├── features/             # Redux slices
│   │   └── store.ts              # Store configuration
│   ├── types/                    # TypeScript definitions
│   └── utils/                    # Helper functions
├── public/                       # Static assets
├── tailwind.config.ts           # Tailwind configuration
├── next.config.ts               # Next.js configuration
└── package.json                 # Dependencies and scripts
```

## 🔐 Authentication Flow

### User Registration

1. **Invitation Required**: Users need a valid invitation code to register
2. **Tier Assignment**: New users start as "Member" tier
3. **Email Verification**: OTP verification for account activation

### Login Process

1. **JWT Authentication**: Secure token-based authentication
2. **Auto-refresh**: Automatic token renewal for seamless experience
3. **Persistent Sessions**: Redux Persist maintains login state

### Route Protection

- **Public Routes**: Product catalog, authentication pages
- **Protected Routes**: Dashboard, checkout, admin panel
- **Role-based Access**: Admin-only sections with permission checks

## 🛒 Shopping Experience

### Product Discovery

- **Search Functionality**: Real-time product search
- **Pagination**: Efficient loading of large product catalogs
- **Product Details**: Comprehensive peptide information with references

### Cart Management

- **Persistent Cart**: Cart state survives page refreshes
- **Quantity Controls**: Easy adjustment of product quantities
- **Price Calculation**: Dynamic pricing based on user tier

### Checkout Process

- **Order Preview**: Review items before payment
- **Stripe Integration**: Secure payment processing
- **Order Confirmation**: Email notifications and order tracking

## 👑 Tier System

| Tier    | Discount | Commission | Free Shipping |
| ------- | -------- | ---------- | ------------- |
| Member  | 10%      | 0%         | No            |
| VIP     | 20%      | 10%        | Yes           |
| Founder | 20%      | 15%        | Yes           |

### Benefits

- **Progressive Discounts**: Higher tiers get better pricing
- **Commission Rewards**: Earn from successful referrals
- **Shipping Perks**: Free shipping for premium members

## 🛡️ Admin Features

### Product Management

- **CRUD Operations**: Create, read, update, delete products
- **Inventory Control**: Stock level management
- **Pricing Management**: Dynamic pricing across sizes

### Order Processing

- **Order Status Tracking**: Monitor order lifecycle
- **Customer Communication**: Order updates and notifications
- **Analytics**: Sales and performance metrics

### User Administration

- **User Management**: Account administration and permissions
- **Referral Tracking**: Monitor referral program effectiveness
- **Tier Management**: User tier assignments and upgrades

## 🔧 API Integration

### Backend Requirements

The application expects a REST API with the following endpoints:

#### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh-token` - Token refresh
- `GET /api/auth/me` - Get current user

#### Products

- `GET /api/products` - List products with pagination/search
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)

#### Orders

- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order details

#### Payments

- `POST /api/payments/create-session` - Create Stripe checkout session
- `GET /api/payments/session/:id` - Get payment session status

## 🎨 Styling Guidelines

### Color Scheme

- **Primary**: Cyan (#00FFFF) for accents and highlights
- **Background**: Dark gradient from navy to blue
- **Text**: White and gray variants for readability
- **Success**: Green variants for confirmations
- **Error**: Red variants for errors

### Design Principles

- **Minimalist**: Clean, uncluttered interface
- **Accessible**: High contrast ratios and keyboard navigation
- **Mobile-First**: Responsive design for all screen sizes
- **Performance**: Optimized loading and smooth animations

## 🚀 Deployment

### Environment Variables for Production

```env
NEXT_PUBLIC_BASE_API=https://your-api-domain.com
NEXT_PUBLIC_FRONTEND_URL=https://your-frontend-domain.com
```

### Build Commands

```bash
npm run build    # Create production build
npm run start    # Start production server
npm run lint     # Run ESLint checks
```

### Deployment Platforms

- **Vercel**: Recommended for Next.js applications
- **Netlify**: Alternative with good Next.js support
- **Docker**: Containerized deployment options

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting and formatting
- **Prettier**: Consistent code formatting
- **Conventional Commits**: Standardized commit messages

## 📄 License

This project is private and proprietary. All rights reserved.

## 📞 Support

For support and inquiries:

- **Email**: Hello@Peptide.Club
- **Website**: https://peptide.club

---

Built with ❤️ for the research community
