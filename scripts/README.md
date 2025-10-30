# Data Migration Guide

This folder contains the script to migrate data from MySQL to Firestore.

## Prerequisites

1. **Firebase Project Setup**
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Authentication, Firestore, and Storage

2. **Service Account Key**
   - Go to Project Settings > Service Accounts
   - Click "Generate New Private Key"
   - Save as `serviceAccountKey.json` in this folder
   - ⚠️ **NEVER commit this file to Git!** (Already in .gitignore)

3. **SQL Data File**
   - Ensure `kmjdatabase.sql` is in the Revamp root folder

## Installation

```bash
cd scripts
npm install
```

## Running the Migration

```bash
npm run migrate
```

## What Gets Migrated

### 1. Users (from `register` + `table_login`)
- Creates Firebase Auth accounts
- Creates user profile documents
- Sets custom claims for roles (admin/user)
- Temporary passwords: Uses Aadhaar number or "password123"

### 2. Members (from `mtable`)
- All 25 census fields
- Organized into 6 nested objects
- Links to user accounts via memberId

### 3. Bills
- **Jamaath Bills** (from `bill` table)
- **Madrassa Bills** (from `account_madrassa`)
- **Land Bills** (from `account_land`)
- **Nercha Bills** (from `account_nercha`)
- **Sadhu Bills** (from `account_sadhu`)

### 4. Counters
- Receipt counter (last receipt number)
- Member counter (total members)

### 5. Settings
- Organization info
- Account types configuration
- Receipt template
- Feature toggles

## Migration Output

The script will show progress for each table:

```
📊 Migrating Users...
✅ Migrated user: 1/2 (John Doe)
✅ Users: 150 migrated, 0 errors

📊 Migrating Members (Census Data)...
✅ Migrated member: John Doe (1/2)
✅ Members: 500 migrated, 0 errors

📊 Migrating Bills...
✅ Migrated bill: Receipt #12345
✅ Bills: 5000 migrated, 0 errors
```

## Post-Migration Steps

After migration completes:

```bash
# 1. Deploy Firestore rules
firebase deploy --only firestore:rules

# 2. Deploy Firestore indexes
firebase deploy --only firestore:indexes

# 3. Test the application
cd ..
npm run dev
```

## Troubleshooting

### Error: "ENOENT: no such file or directory"
- Ensure `serviceAccountKey.json` exists in scripts folder
- Ensure `kmjdatabase.sql` exists in Revamp root folder

### Error: "auth/uid-already-exists"
- User already migrated (safe to ignore)
- Script will skip and continue

### Error: "Invalid date"
- Some SQL dates may be malformed (0000-00-00)
- Script will log warnings and continue

### Error: "Permission denied"
- Check serviceAccountKey.json has correct permissions
- Verify Firebase project ID matches

## Data Validation

After migration, verify in Firebase Console:

1. **Authentication** → Should see all users
2. **Firestore** → Check collections:
   - `users` (150+ documents)
   - `members` (500+ documents)
   - `bills` (5000+ documents)
   - `counters` (2 documents)
   - `settings` (1 document)

## Important Notes

- Migration is **additive** - running twice will create duplicates
- To re-migrate, delete Firestore collections first
- Users will need to reset passwords on first login
- Test on a development project before production

## Support

For issues, check:
1. Firebase Console logs
2. Migration script output
3. serviceAccountKey.json validity
