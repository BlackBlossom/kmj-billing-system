# 🚀 Firebase Setup Guide

Complete guide to set up Firebase for the KMJ Billing System.

## 📋 Prerequisites

- Node.js 18+ installed
- Firebase CLI installed globally (`npm install -g firebase-tools`)
- Git installed
- Text editor (VS Code recommended)

## Step 1: Create Firebase Project

1. **Go to Firebase Console**
   - Visit [console.firebase.google.com](https://console.firebase.google.com)
   - Click "Add Project"

2. **Project Setup**
   - **Project name**: `kmj-billing-system`
   - **Enable Google Analytics**: Yes (recommended)
   - Click "Create Project"

## Step 2: Enable Firebase Services

### A. Authentication
1. Go to **Authentication** → Get Started
2. Click **Sign-in method** tab
3. Enable **Email/Password**
4. Save

### B. Firestore Database
1. Go to **Firestore Database** → Create Database
2. **Start mode**: Production mode
3. **Location**: Choose closest region (e.g., asia-south1 for India)
4. Click "Enable"

### C. Storage
1. Go to **Storage** → Get Started
2. **Start mode**: Production mode
3. Click "Done"

### D. Hosting
1. Go to **Hosting** → Get Started
2. Follow the wizard (we'll do actual setup via CLI)

## Step 3: Get Firebase Configuration

1. Go to **Project Settings** (⚙️ icon)
2. Scroll to **Your apps** section
3. Click **Web** icon (`</>`)
4. **Register app**:
   - **App nickname**: `KMJ Billing Web`
   - **Firebase Hosting**: Check this box
   - Click "Register app"

5. **Copy the config object**:
```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "kmj-billing-system.firebaseapp.com",
  projectId: "kmj-billing-system",
  storageBucket: "kmj-billing-system.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123",
  measurementId: "G-ABC123"
};
```

## Step 4: Configure Environment Variables

1. **Create `.env` file** in the Revamp folder:
```bash
cd d:\VS Code\Billing\Revamp
copy .env.example .env
```

2. **Edit `.env`** with your Firebase config:
```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=kmj-billing-system.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=kmj-billing-system
VITE_FIREBASE_STORAGE_BUCKET=kmj-billing-system.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_FIREBASE_MEASUREMENT_ID=G-ABC123
```

3. **Update `.firebaserc`**:
```json
{
  "projects": {
    "default": "kmj-billing-system"
  }
}
```

## Step 5: Initialize Firebase CLI

```bash
# Login to Firebase
firebase login

# Verify login
firebase projects:list

# Should show your project: kmj-billing-system
```

## Step 6: Deploy Firebase Configuration

```bash
cd d:\VS Code\Billing\Revamp

# Deploy Firestore rules and indexes
firebase deploy --only firestore:rules,firestore:indexes

# Deploy Storage rules
firebase deploy --only storage
```

**Expected output:**
```
✔ Deploy complete!
Firestore Rules: deployed
Firestore Indexes: deployed (may take a few minutes)
Storage Rules: deployed
```

## Step 7: Setup Data Migration

1. **Download Service Account Key**:
   - Go to Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Save as `serviceAccountKey.json` in `scripts/` folder

2. **Install migration dependencies**:
```bash
cd scripts
npm install
```

3. **Verify SQL data**:
   - Ensure `kmjdatabase.sql` is in the Revamp root folder

4. **Run migration**:
```bash
npm run migrate
```

**Migration will:**
- Create ~150 user accounts
- Migrate ~500 member records
- Import ~5000+ bill records
- Set up counters and settings

⏱️ **Expected time**: 5-10 minutes

## Step 8: Test Firebase Connection

1. **Start development server**:
```bash
cd ..
npm run dev
```

2. **Open browser**: http://localhost:5173

3. **Test Firebase services**:
   - Try to sign up/login
   - Check browser console for errors
   - Verify Firestore reads/writes

## Step 9: Deploy to Firebase Hosting

```bash
# Build production app
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

**Your app will be live at:**
- `https://kmj-billing-system.web.app`
- `https://kmj-billing-system.firebaseapp.com`

## 🔍 Verification Checklist

After setup, verify:

- [ ] Firebase project created
- [ ] Authentication enabled (Email/Password)
- [ ] Firestore database created
- [ ] Storage bucket created
- [ ] Hosting enabled
- [ ] `.env` file created with correct values
- [ ] `.firebaserc` updated with project ID
- [ ] Firestore rules deployed
- [ ] Firestore indexes deployed (check status in console)
- [ ] Storage rules deployed
- [ ] Service account key downloaded
- [ ] Data migration completed successfully
- [ ] Development server runs without errors
- [ ] Can login/signup in the app
- [ ] Production build successful
- [ ] App deployed to Firebase Hosting

## 📊 Firebase Console Quick Links

After setup, bookmark these:

- **Authentication**: [console.firebase.google.com/project/kmj-billing-system/authentication/users](https://console.firebase.google.com/project/kmj-billing-system/authentication/users)
- **Firestore**: [console.firebase.google.com/project/kmj-billing-system/firestore/data](https://console.firebase.google.com/project/kmj-billing-system/firestore/data)
- **Storage**: [console.firebase.google.com/project/kmj-billing-system/storage](https://console.firebase.google.com/project/kmj-billing-system/storage)
- **Hosting**: [console.firebase.google.com/project/kmj-billing-system/hosting/main](https://console.firebase.google.com/project/kmj-billing-system/hosting/main)

## 🐛 Troubleshooting

### Issue: Firebase CLI not found
```bash
npm install -g firebase-tools
```

### Issue: Permission denied during deploy
```bash
firebase login --reauth
```

### Issue: Index creation stuck
- Indexes can take 5-30 minutes
- Check status: [console.firebase.google.com/project/kmj-billing-system/firestore/indexes](https://console.firebase.google.com/project/kmj-billing-system/firestore/indexes)

### Issue: Migration fails with "Invalid date"
- Some SQL dates may be malformed
- Check migration logs for specific records
- Script will skip invalid dates and continue

### Issue: Can't login after migration
- Users need to reset passwords
- Temporary password: Aadhaar number or "password123"
- Create password reset flow in the app

## 📚 Next Steps

1. **Setup Admin Account**:
   - Login with admin credentials
   - Complete profile
   - Test admin features

2. **Configure Settings**:
   - Update organization details
   - Customize receipt template
   - Enable required features

3. **Test All Features**:
   - Member registration
   - Bill generation
   - Report viewing
   - Profile editing

4. **Custom Domain** (Optional):
   - Go to Hosting → Add custom domain
   - Follow DNS setup instructions

## 🔒 Security Reminders

- ⚠️ Never commit `.env` file
- ⚠️ Never commit `serviceAccountKey.json`
- ⚠️ Keep Firebase project settings private
- ⚠️ Review security rules regularly
- ⚠️ Enable App Check for production

## 📞 Support

For issues:
1. Check Firebase Console logs
2. Review browser console errors
3. Check Firestore rules debugger
4. Review migration script output

---

**Ready to go!** 🎉

Your KMJ Billing System is now powered by Firebase with real-time capabilities, offline support, and automatic scaling!
