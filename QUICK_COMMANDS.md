# 🚀 Quick Start Commands

Fast reference for common Firebase and development commands.

## 🔥 Firebase Commands

```bash
# Login to Firebase
firebase login

# List all your projects
firebase projects:list

# Use specific project
firebase use kmj-billing-system

# Initialize Firebase in project
firebase init

# Deploy everything
firebase deploy

# Deploy specific services
firebase deploy --only hosting
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
firebase deploy --only storage
firebase deploy --only functions

# Start Firebase emulators
firebase emulators:start

# Open Firebase console
firebase open
```

## 📦 Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🔄 Data Migration Commands

```bash
# Install migration dependencies
cd scripts
npm install

# Run migration
npm run migrate

# Return to project root
cd ..
```

## 🧪 Testing Firebase Connection

```bash
# Test Firestore connection
firebase firestore:indexes

# Test hosting
firebase hosting:channel:deploy preview

# Check security rules
firebase firestore:rules:get
```

## 📊 Project Management

```bash
# Check project status
firebase projects:list

# Get project info
firebase projects:get kmj-billing-system

# Check current project
firebase use

# Switch project
firebase use <project-id>
```

## 🔍 Debugging Commands

```bash
# View Firestore logs
firebase firestore:logs

# View function logs
firebase functions:log

# Test security rules
firebase emulators:exec --only firestore "npm test"
```

## 🌐 Hosting Commands

```bash
# Deploy hosting
firebase deploy --only hosting

# Create preview channel
firebase hosting:channel:deploy preview

# List hosting releases
firebase hosting:releases:list

# Rollback to previous version
firebase hosting:clone <source>:<target>
```

## 🗄️ Firestore Commands

```bash
# Deploy rules
firebase deploy --only firestore:rules

# Deploy indexes
firebase deploy --only firestore:indexes

# Export data
firebase firestore:export gs://your-bucket/export-folder

# Import data
firebase firestore:import gs://your-bucket/export-folder
```

## 🔐 Authentication Commands

```bash
# List auth users (via admin SDK in script)
# Create users via migration script
# Manage via Firebase Console
```

## 🛠️ Useful Combinations

```bash
# Clean build and deploy
npm run build ; firebase deploy --only hosting

# Start emulators with specific ports
firebase emulators:start --only firestore,auth --import=./emulator-data

# Deploy rules and test
firebase deploy --only firestore:rules ; npm test

# Full production deploy
npm run build ; firebase deploy
```

## 📝 Git Commands

```bash
# Initialize git (if not done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Firebase setup complete"

# Push to remote
git push origin main
```

## 🔄 Environment Commands

```bash
# Copy environment template
copy .env.example .env

# View environment variables (PowerShell)
Get-Content .env

# Set environment variable
$env:VITE_FIREBASE_API_KEY="your-key"
```

## 📱 Mobile Development (Future)

```bash
# Add Android app
firebase apps:create android com.kmj.billing

# Add iOS app
firebase apps:create ios com.kmj.billing

# List all apps
firebase apps:list
```

## 🎯 Common Workflows

### First Time Setup
```bash
firebase login
firebase use kmj-billing-system
npm install
copy .env.example .env
# Edit .env with your values
firebase deploy --only firestore:rules,firestore:indexes,storage
cd scripts
npm install
npm run migrate
cd ..
npm run dev
```

### Daily Development
```bash
npm run dev
# Make changes
# Test in browser
git add .
git commit -m "Description"
git push
```

### Deploy to Production
```bash
npm run build
firebase deploy --only hosting
# Or deploy everything:
firebase deploy
```

### Update Security Rules
```bash
# Edit firestore.rules
firebase deploy --only firestore:rules
# Verify in Firebase Console
```

### Add New Features
```bash
# Create feature branch
git checkout -b feature/new-feature
# Develop and test
npm run dev
# Deploy to preview
firebase hosting:channel:deploy preview
# Merge and deploy
git checkout main
git merge feature/new-feature
npm run build
firebase deploy
```

## 🆘 Emergency Commands

```bash
# Stop all Firebase processes
taskkill /F /IM node.exe

# Clear Firebase cache
firebase logout
Remove-Item -Recurse -Force .firebase
firebase login

# Reset Firestore emulator data
Remove-Item -Recurse -Force .firebase/emulator-data
firebase emulators:start

# Rollback hosting deployment
firebase hosting:clone <source>:<target>

# Check service status
firebase status
```

## 📊 Monitoring Commands

```bash
# View real-time logs
firebase functions:log --follow

# Check quota usage
# (Use Firebase Console → Usage tab)

# View performance
# (Use Firebase Console → Performance Monitoring)
```

## 🔧 Configuration

```bash
# View current config
firebase functions:config:get

# Set environment config
firebase functions:config:set someservice.key="THE KEY"

# Clone config between projects
firebase functions:config:clone --from <source-project>
```

---

**Tip**: Bookmark this file for quick reference! 📌

**PowerShell Users**: All commands work in PowerShell. Use `;` instead of `&&` to chain commands.
