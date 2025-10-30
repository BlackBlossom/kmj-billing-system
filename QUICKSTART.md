# 🚀 QUICK START GUIDE - KMJ Billing System

## Get Running in 5 Minutes!

### ✅ Prerequisites Checklist
- [ ] Windows PC
- [ ] Internet connection (for XAMPP download)
- [ ] 500 MB free disk space

---

## 📥 Step 1: Install XAMPP (3 minutes)

1. **Download XAMPP**
   - Go to: https://www.apachefriends.org
   - Download XAMPP for Windows (PHP 7.4 or higher)
   - File size: ~150 MB

2. **Install XAMPP**
   - Run the installer
   - Install to: `C:\xampp` (default)
   - Select components: Apache, MySQL, PHP, phpMyAdmin
   - Click "Next" through all prompts

3. **Start Services**
   - Open "XAMPP Control Panel" from Start Menu
   - Click "Start" next to Apache
   - Click "Start" next to MySQL
   - Both should show green "Running" status

---

## 🗄️ Step 2: Setup Database (2 minutes)

1. **Open phpMyAdmin**
   - Open browser
   - Go to: `http://localhost/phpmyadmin`

2. **Create Database**
   - Click "New" in left sidebar
   - Database name: `kmjdatabase`
   - Collation: `utf8mb4_general_ci`
   - Click "Create"

3. **Import SQL Script**
   - Select `kmjdatabase` from left sidebar
   - Click "SQL" tab at top
   - Click "Choose File"
   - Navigate to: `d:\VS Code\Billing\database_setup.sql`
   - Click "Go" button at bottom
   - Wait for "Success" message

✅ You should see 10 tables created!

---

## 📂 Step 3: Move Files to Web Directory

### Option A: Copy to XAMPP Directory (Recommended)
1. Open File Explorer
2. Copy entire folder: `d:\VS Code\Billing`
3. Paste into: `C:\xampp\htdocs\`
4. Result: `C:\xampp\htdocs\Billing\`

### Option B: Keep Current Location (Advanced)
If you want to keep files at `d:\VS Code\Billing\`:
1. Open: `C:\xampp\apache\conf\extra\httpd-vhosts.conf`
2. Add at end:
```apache
<VirtualHost *:80>
    DocumentRoot "d:/VS Code/Billing"
    ServerName billing.local
    <Directory "d:/VS Code/Billing">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```
3. Open: `C:\Windows\System32\drivers\etc\hosts` (as Administrator)
4. Add line: `127.0.0.1 billing.local`
5. Restart Apache in XAMPP Control Panel
6. Access via: `http://billing.local`

---

## 🔧 Step 4: Configure Database Connection

Since you'll use default XAMPP (root user with no password):

1. **Update Database Configuration in Key Files**
   
   Open these files and make sure the connection uses root:
   
   **File: `login.php`** (Line 18)
   ```php
   // Comment this line:
   // $conn = mysqli_connect('localhost','kmjdatabase','kmjdatabase','kmjdatabase');
   
   // Uncomment this line:
   $conn = mysqli_connect('localhost','root','','kmjdatabase');
   ```

   Do the same for these files:
   - `index.php`
   - `membership.php`
   - `register.php`
   - `Bill.php`
   - `Userpage.php`
   - And any other PHP files with database connections

   **Quick Find & Replace:**
   - Find: `$conn = mysqli_connect('localhost','kmjdatabase','kmjdatabase','kmjdatabase');`
   - Replace with: `$conn = mysqli_connect('localhost','root','','kmjdatabase');`

---

## 🌐 Step 5: Access the Application

1. **Open Browser**
   - Chrome, Firefox, or Edge

2. **Navigate to Application**
   - If using Option A: `http://localhost/Billing/`
   - If using Option B: `http://billing.local/`

3. **You Should See**
   - Homepage with KMJ logo
   - Navigation menu
   - Notice board

---

## 🔐 Step 6: Login

### Default Admin Login:
- **Username:** `admin`
- **Password:** `admin123`
- **URL:** `http://localhost/Billing/login.php`

After login, you'll access the admin dashboard where you can:
- Manage members
- Process bills
- View reports
- Add notices

---

## 🎯 Quick Test Checklist

Test these URLs to verify everything works:

- [ ] Homepage: `http://localhost/Billing/index.php`
- [ ] Login: `http://localhost/Billing/login.php`
- [ ] Register: `http://localhost/Billing/register.php`
- [ ] About: `http://localhost/Billing/about.php`
- [ ] Contact: `http://localhost/Billing/contact.php`

---

## ❌ Troubleshooting

### Problem: "Can't connect to database"
**Solution:**
1. Check MySQL is running (green in XAMPP)
2. Verify database name is `kmjdatabase`
3. Check database connection in PHP files uses `root` with empty password

### Problem: "404 Not Found"
**Solution:**
1. Verify Apache is running (green in XAMPP)
2. Check file path: `C:\xampp\htdocs\Billing\`
3. Try: `http://localhost/` to see if XAMPP dashboard loads

### Problem: "Blank white page"
**Solution:**
1. Enable error display:
   - Open: `C:\xampp\php\php.ini`
   - Find: `display_errors = Off`
   - Change to: `display_errors = On`
   - Restart Apache
2. Check PHP error log: `C:\xampp\apache\logs\error.log`

### Problem: "Access Denied for user"
**Solution:**
- Make sure database connection uses: `mysqli_connect('localhost','root','','kmjdatabase')`
- Verify MySQL port is 3306 (check XAMPP config)

### Problem: Images/CSS not loading
**Solution:**
1. Clear browser cache (Ctrl + Shift + Delete)
2. Check file paths are correct
3. Verify folders exist:
   - `css/`
   - `js/`
   - `images/`
   - `kmj_css/`

---

## 📱 Create Your First User Account

1. Go to: `http://localhost/Billing/register.php`
2. Fill in:
   - Name: Your full name
   - Address: Your address
   - Aadhaar: Any 12 digit number (e.g., 123456789012)
   - Ward: 1
   - House No: 1
   - Phone: Your phone number
3. Click "Register"
4. Your login will be: `1/1` (Ward/HouseNo)
5. Password: Your Aadhaar number

---

## 🎉 Success!

You should now be able to:
- ✅ Access the homepage
- ✅ Login as admin
- ✅ Register new users
- ✅ Add member details
- ✅ Process bills
- ✅ Print receipts

---

## 📚 Next Steps

1. Read full documentation: `README.md`
2. Change admin password
3. Add real member data
4. Customize logo and branding
5. Setup backup system

---

## 🆘 Need Help?

If you encounter issues:

1. **Check XAMPP**
   - Both Apache and MySQL should be green/running
   - Port 80 (Apache) and 3306 (MySQL) should be free

2. **Check Database**
   - Open phpMyAdmin: `http://localhost/phpmyadmin`
   - Verify `kmjdatabase` exists
   - Verify 10 tables exist

3. **Check Files**
   - All files in: `C:\xampp\htdocs\Billing\`
   - Database connections updated to use `root`

4. **Browser Console**
   - Press F12 to open developer tools
   - Check Console tab for JavaScript errors
   - Check Network tab for failed requests

---

## 📧 Contact

For KMJ system support:
- Email: kmjsecretary@kmjinfo.com
- Phone: +91-703 48 29292

---

**Happy Billing! 🚀**

*Last updated: October 20, 2025*
