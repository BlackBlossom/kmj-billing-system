# ⚡ Quick Start Guide - React + Firebase Setup
## KMJ Billing System Revamp

This guide will help you set up the development environment and start building in 30 minutes.

---

## 📋 Prerequisites

```bash
# Required Software
✅ Node.js 18+ (https://nodejs.org/)
✅ npm or yarn
✅ Git
✅ VS Code (recommended)
✅ Firebase CLI

# Check versions
node --version   # v18.0.0 or higher
npm --version    # 9.0.0 or higher
```

---

## 🚀 Step 1: Create React Project

### Option A: Using Vite (Recommended - Faster)
```bash
# Create project
npm create vite@latest kmj-billing-system -- --template react-ts

# Navigate to project
cd kmj-billing-system

# Install dependencies
npm install
```

### Option B: Using Create React App
```bash
npx create-react-app kmj-billing-system --template typescript
cd kmj-billing-system
```

---

## 🔥 Step 2: Setup Firebase

### 2.1 Install Firebase CLI
```bash
npm install -g firebase-tools

# Login to Firebase
firebase login
```

### 2.2 Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Project name: `kmj-billing-system`
4. Disable Google Analytics (or enable if you want)
5. Click "Create Project"

### 2.3 Enable Firebase Services

**Authentication:**
1. Go to Authentication → Get Started
2. Enable Email/Password sign-in method
3. Enable Email link (passwordless) if needed

**Firestore Database:**
1. Go to Firestore Database → Create Database
2. Start in **Test Mode** (for development)
3. Select location: `asia-south1` (Mumbai) or closest
4. Click "Enable"

**Storage:**
1. Go to Storage → Get Started
2. Start in **Test Mode**
3. Click "Done"

**Hosting:**
1. Go to Hosting → Get Started
2. Follow setup steps (we'll do this via CLI)

### 2.4 Initialize Firebase in Project
```bash
# In your project directory
firebase init

# Select:
✅ Firestore
✅ Functions
✅ Hosting
✅ Storage

# Configuration:
- Use existing project → kmj-billing-system
- Firestore rules: firestore.rules (default)
- Firestore indexes: firestore.indexes.json (default)
- Functions language: TypeScript
- ESLint: Yes
- Install dependencies: Yes
- Hosting public directory: dist (for Vite) or build (for CRA)
- Single-page app: Yes
- GitHub actions: No (for now)
- Storage rules: storage.rules (default)
```

### 2.5 Get Firebase Config
1. Go to Project Settings (gear icon)
2. Scroll to "Your apps"
3. Click web icon (</>)
4. Register app: `kmj-web-app`
5. Copy the firebaseConfig object

```javascript
// Example config (yours will be different)
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "kmj-billing-system.firebaseapp.com",
  projectId: "kmj-billing-system",
  storageBucket: "kmj-billing-system.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

---

## 📦 Step 3: Install Dependencies

```bash
# Firebase SDK
npm install firebase

# UI Framework (Material-UI)
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material

# Routing
npm install react-router-dom

# State Management
npm install @reduxjs/toolkit react-redux

# Forms & Validation
npm install react-hook-form yup @hookform/resolvers

# Date Handling
npm install date-fns

# Table
npm install @tanstack/react-table

# PDF Generation
npm install jspdf jspdf-autotable

# Number to Words
npm install number-to-words
npm install -D @types/number-to-words

# Notifications
npm install react-hot-toast

# Charts
npm install recharts

# Dev Dependencies
npm install -D @types/node
```

---

## 📁 Step 4: Project Structure

Create the following folder structure:

```bash
src/
├── assets/
│   ├── images/
│   │   └── logo.jpg           # Copy from current project
│   └── fonts/
├── components/
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   └── LoadingSpinner.tsx
│   ├── forms/
│   │   ├── FormInput.tsx
│   │   ├── FormSelect.tsx
│   │   └── FormDatePicker.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Sidebar.tsx
│   │   └── Layout.tsx
│   └── tables/
│       ├── DataTable.tsx
│       └── Pagination.tsx
├── pages/
│   ├── auth/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── ForgotPassword.tsx
│   ├── dashboard/
│   │   ├── AdminDashboard.tsx
│   │   └── UserDashboard.tsx
│   ├── members/
│   │   ├── MemberList.tsx
│   │   ├── MemberProfile.tsx
│   │   └── CensusForm.tsx
│   ├── billing/
│   │   ├── QuickPay.tsx
│   │   ├── BillingHistory.tsx
│   │   └── ReceiptView.tsx
│   └── public/
│       ├── Home.tsx
│       ├── About.tsx
│       ├── Events.tsx
│       └── Contact.tsx
├── services/
│   ├── firebase.config.ts     # Firebase initialization
│   ├── auth.service.ts        # Authentication functions
│   ├── firestore.service.ts   # Database operations
│   └── storage.service.ts     # File uploads
├── hooks/
│   ├── useAuth.ts             # Auth state hook
│   ├── useMembers.ts          # Members data hook
│   └── useBills.ts            # Bills data hook
├── store/
│   ├── store.ts               # Redux store config
│   ├── authSlice.ts           # Auth state
│   └── membersSlice.ts        # Members state
├── types/
│   ├── user.types.ts
│   ├── member.types.ts
│   └── bill.types.ts
├── utils/
│   ├── constants.ts           # Account types, etc.
│   ├── helpers.ts             # Utility functions
│   └── validators.ts          # Validation schemas
├── App.tsx
├── main.tsx
└── vite-env.d.ts
```

---

## ⚙️ Step 5: Configure Firebase

### Create `src/services/firebase.config.ts`
```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
```

### Create `.env` file in project root
```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=kmj-billing-system.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=kmj-billing-system
VITE_FIREBASE_STORAGE_BUCKET=kmj-billing-system.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

**⚠️ Important:** Add `.env` to `.gitignore`!

---

## 🔐 Step 6: Create Auth Service

### Create `src/services/auth.service.ts`
```typescript
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase.config';

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  aadhaar: string;
  ward: string;
  address: string;
}

export const authService = {
  // Register new user
  async register(data: RegisterData, password: string) {
    try {
      // Create auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        password
      );
      
      const user = userCredential.user;
      
      // Update display name
      await updateProfile(user, { displayName: data.name });
      
      // Create Firestore user document
      const memberId = `${data.ward}/${Date.now()}`; // Generate unique ID
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: data.name,
        email: data.email,
        phone: data.phone,
        aadhaar: data.aadhaar,
        ward: data.ward,
        address: data.address,
        memberId: memberId,
        role: 'user',
        isActive: true,
        profileComplete: false,
        createdAt: new Date(),
      });
      
      return { user, memberId };
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  // Login
  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      
      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      return {
        user: userCredential.user,
        userData: userDoc.data()
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  // Logout
  async logout() {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  // Password reset
  async resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  // Get current user
  getCurrentUser(): User | null {
    return auth.currentUser;
  },
};
```

---

## 🎨 Step 7: Setup Routing

### Update `src/App.tsx`
```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { Toaster } from 'react-hot-toast';

// Pages
import Home from './pages/public/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import UserDashboard from './pages/dashboard/UserDashboard';

// Theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50', // Green for Islamic theme
    },
    secondary: {
      main: '#2196F3',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      
      {/* Toast Notifications */}
      <Toaster position="top-right" />
    </ThemeProvider>
  );
}

export default App;
```

---

## 🔥 Step 8: Create Login Page

### Create `src/pages/auth/Login.tsx`
```typescript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Link,
} from '@mui/material';
import toast from 'react-hot-toast';
import { authService } from '../../services/auth.service';

// Validation schema
const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
}).required();

type FormData = yup.InferType<typeof schema>;

function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const { userData } = await authService.login(data.email, data.password);
      
      toast.success('Login successful!');
      
      // Redirect based on role
      if (userData?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            KMJ Billing System
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" gutterBottom>
            Login
          </Typography>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              margin="normal"
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Link href="/register" underline="hover">
                Don't have an account? Register
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default Login;
```

---

## 🏃 Step 9: Run Development Server

```bash
# Start Vite dev server
npm run dev

# Open browser
# http://localhost:5173
```

---

## 🔥 Step 10: Setup Firestore Security Rules

### Edit `firestore.rules`
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated() && 
                     (request.auth.uid == userId || isAdmin());
      allow write: if request.auth.uid == userId || isAdmin();
    }
    
    // Members collection
    match /members/{memberId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update: if isAuthenticated() && 
                       (resource.data.userId == request.auth.uid || isAdmin());
      allow delete: if isAdmin();
    }
    
    // Bills collection
    match /bills/{billId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    // Notices collection
    match /notices/{noticeId} {
      allow read: if true; // Public
      allow write: if isAdmin();
    }
  }
}
```

### Deploy rules
```bash
firebase deploy --only firestore:rules
```

---

## 📊 Step 11: Create TypeScript Types

### Create `src/types/user.types.ts`
```typescript
export interface User {
  uid: string;
  name: string;
  email: string;
  phone: string;
  memberId: string;
  ward: string;
  address: string;
  aadhaar: string;
  role: 'admin' | 'user';
  isActive: boolean;
  profileComplete: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface UserRegistration {
  name: string;
  email: string;
  phone: string;
  aadhaar: string;
  ward: string;
  address: string;
  password: string;
}
```

### Create `src/types/member.types.ts`
```typescript
export interface Member {
  id: string;
  userId: string;
  memberId: string;
  personalInfo: PersonalInfo;
  contact: ContactInfo;
  education: Education;
  occupation: Occupation;
  government: GovernmentDocs;
  property: Property;
  isHead: boolean;
  familyId: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface PersonalInfo {
  fullName: string;
  dateOfBirth: Date;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  relation: string;
  maritalStatus: string;
  healthStatus: string;
}

export interface ContactInfo {
  address: string;
  phone: string;
  email?: string;
  mahalWard: string;
  panchayath: {
    name: string;
    ward: string;
    district: string;
    areaType: string;
  };
}

export interface Education {
  general: string;
  madrassa: string;
}

export interface Occupation {
  designation: string;
  employer?: string;
}

export interface GovernmentDocs {
  aadhaar: string;
  rationCard: string;
}

export interface Property {
  landOwnership: boolean;
  houseOwnership: boolean;
  residentType: string;
  memberSince: Date;
}
```

---

## 🎯 Step 12: Create Constants

### Create `src/utils/constants.ts`
```typescript
export const ACCOUNT_TYPES = {
  JAMAATH: [
    'Dua_Friday',
    'Donation',
    'Sunnath Fee',
    'Marriage Fee',
    'Product Turnover',
    'Rental_Basis',
    'Devotional Dedication',
    'Dead Fee',
    'New Membership',
    'Certificate Fee',
    'Eid ul Adha',
    'Eid al-Fitr',
  ],
  MADRASSA: [
    'Annual Fee',
    'Monthly Fee',
    'Madrassa Building',
    'Madrassa Others',
  ],
  LAND: [
    'Land Purchase',
    'Land Maintenance',
    'Land Others',
  ],
  NERCHA: [
    'Ramadhan',
    '27 Ravu',
    'Meladhun Nabi',
    'Others',
  ],
  SADHU: [
    'Building Maintenance',
    'General Expenses',
  ],
};

export const RELATIONS = [
  'Self',
  'Father',
  'Mother',
  'Son',
  'Daughter',
  'Wife',
  'Husband',
  'Brother',
  'Sister',
  'Grandfather',
  'Grandmother',
  'Other',
];

export const MARITAL_STATUS = [
  'Single',
  'Married',
  'Divorced',
  'Widow',
  'Widower',
];

export const EDUCATION_LEVELS = [
  'No Formal Education',
  'Primary (1-5)',
  'Upper Primary (6-8)',
  'SSLC (10th)',
  'Plus Two (12th)',
  'Diploma',
  'Degree',
  'Post Graduation',
  'PhD',
];

export const RATION_CARD_TYPES = [
  'APL (Above Poverty Line)',
  'BPL (Below Poverty Line)',
  'AAY (Antyodaya Anna Yojana)',
  'Not Applicable',
];
```

---

## ✅ Next Steps

### Immediate Development Tasks
1. ✅ Complete Login & Register pages
2. ✅ Create Protected Route wrapper
3. ✅ Build User Dashboard
4. ✅ Build Admin Dashboard
5. ✅ Create Census Form (multi-step)
6. ✅ Build Member Directory
7. ✅ Create Quick Pay system
8. ✅ Implement Receipt generation

### Testing
```bash
# Install testing libraries
npm install -D vitest @testing-library/react @testing-library/jest-dom

# Run tests
npm run test
```

### Deployment
```bash
# Build for production
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting

# Your app will be live at:
# https://kmj-billing-system.web.app
```

---

## 📚 Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Firebase
firebase login           # Login to Firebase
firebase deploy          # Deploy everything
firebase deploy --only hosting     # Deploy only hosting
firebase deploy --only firestore   # Deploy only Firestore rules
firebase serve           # Test locally

# Git
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

---

## 🆘 Common Issues & Solutions

### Issue: Firebase import error
```typescript
// ❌ Wrong
import firebase from 'firebase';

// ✅ Correct
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
```

### Issue: Environment variables not working
```bash
# Vite uses VITE_ prefix
# ✅ Correct: VITE_FIREBASE_API_KEY
# ❌ Wrong: REACT_APP_FIREBASE_API_KEY
```

### Issue: CORS error
```javascript
// Add to firebase.config.ts
import { connectFirestoreEmulator } from 'firebase/firestore';

if (import.meta.env.DEV) {
  connectFirestoreEmulator(db, 'localhost', 8080);
}
```

### Issue: Build size too large
```bash
# Use dynamic imports for routes
const AdminDashboard = lazy(() => import('./pages/dashboard/AdminDashboard'));
```

---

## 🎉 You're Ready!

You now have:
- ✅ React + TypeScript project
- ✅ Firebase integrated
- ✅ Authentication setup
- ✅ Routing configured
- ✅ Material-UI theming
- ✅ Project structure ready

**Start building your first feature! 🚀**

---

**Created:** October 22, 2025  
**Version:** 1.0  
**Next:** Build the Census Form component
