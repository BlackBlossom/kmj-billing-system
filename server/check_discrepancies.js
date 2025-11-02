import fs from 'fs';
import mongoose from 'mongoose';
import { connectDB } from './src/config/database.js';
import { Member, User } from './src/models/index.js';

async function checkDiscrepancies() {
  try {
    // Read SQL file
    console.log('📄 Reading SQL dump...');
    const sql = fs.readFileSync('kmjdatabase.sql', 'utf8');
    
    // Count mtable entries in SQL
    const mtableMatches = sql.match(/INSERT INTO `mtable`/g);
    console.log('\n📊 SQL File Analysis:');
    console.log('  mtable INSERT statements:', mtableMatches ? mtableMatches.length : 0);
    
    // Count actual member rows (crude but effective)
    const memberSection = sql.substring(
      sql.indexOf('INSERT INTO `mtable`'),
      sql.indexOf('CREATE TABLE `register`')
    );
    const memberRows = (memberSection.match(/\n\(/g) || []).length;
    console.log('  Estimated mtable rows:', memberRows);
    
    // Count table_login entries
    const loginSection = sql.substring(
      sql.indexOf('INSERT INTO `table_login`'),
      sql.indexOf(';', sql.indexOf('INSERT INTO `table_login`') + 1000)
    );
    const loginRows = (loginSection.match(/\n\(/g) || []).length + 1;
    console.log('  table_login rows:', loginRows);
    
    // Connect to MongoDB
    console.log('\n🔌 Connecting to MongoDB...');
    await connectDB();
    
    // Get MongoDB stats
    console.log('\n📊 MongoDB Database Analysis:');
    const memberCount = await Member.countDocuments();
    console.log('  Members collection:', memberCount);
    
    const userCount = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: 'admin' });
    const regularUserCount = await User.countDocuments({ role: 'user' });
    console.log('  Users collection:', userCount);
    console.log('    - Admin users:', adminCount);
    console.log('    - Regular users:', regularUserCount);
    
    const uniqueHouseholds = await Member.distinct('Mid');
    console.log('  Unique households (Mid):', uniqueHouseholds.length);
    
    // Check for duplicates
    console.log('\n🔍 Checking for Duplicates:');
    const duplicateMembers = await Member.aggregate([
      { $group: { _id: { Mid: '$Mid', Fname: '$Fname', Aadhaar: '$Aadhaar' }, count: { $sum: 1 } } },
      { $match: { count: { $gt: 1 } } },
      { $limit: 10 }
    ]);
    console.log('  Duplicate members found:', duplicateMembers.length > 0 ? 'YES' : 'NO');
    if (duplicateMembers.length > 0) {
      console.log('  Sample duplicates:', duplicateMembers.slice(0, 3));
    }
    
    const duplicateUsers = await User.aggregate([
      { $group: { _id: '$memberId', count: { $sum: 1 } } },
      { $match: { count: { $gt: 1 } } },
      { $limit: 10 }
    ]);
    console.log('  Duplicate users found:', duplicateUsers.length > 0 ? 'YES' : 'NO');
    if (duplicateUsers.length > 0) {
      console.log('  Sample duplicates:', duplicateUsers.slice(0, 3));
    }
    
    // Check specific household
    console.log('\n🏠 Sample Household Check (1/1):');
    const household1Members = await Member.find({ Mid: '1/1' });
    console.log('  Members with Mid="1/1":', household1Members.length);
    
    const household1Users = await User.find({ memberId: '1/1' });
    console.log('  Users with memberId="1/1":', household1Users.length);
    
    // Discrepancy Summary
    console.log('\n⚠️  DISCREPANCIES FOUND:');
    console.log('═'.repeat(60));
    
    if (memberCount !== memberRows) {
      console.log(`❌ Members: SQL has ${memberRows}, MongoDB has ${memberCount}`);
      console.log(`   Difference: ${memberCount - memberRows} (${memberCount > memberRows ? 'DUPLICATES' : 'MISSING'})`);
    } else {
      console.log(`✅ Members: Match (${memberCount})`);
    }
    
    if (userCount !== loginRows + uniqueHouseholds.length - loginRows) {
      console.log(`❌ Users: SQL has ${loginRows}, MongoDB has ${userCount}`);
      console.log(`   Expected: ${loginRows} (from table_login) OR ${uniqueHouseholds.length + 1} (households + admin)`);
      console.log(`   Difference: ${userCount - (uniqueHouseholds.length + 1)}`);
    } else {
      console.log(`✅ Users: Match (${userCount})`);
    }
    
    if (uniqueHouseholds.length !== 765) {
      console.log(`⚠️  Unique households: Expected ~765, found ${uniqueHouseholds.length}`);
    } else {
      console.log(`✅ Unique households: Match (765)`);
    }
    
    console.log('═'.repeat(60));
    
    await mongoose.connection.close();
    console.log('\n✅ Analysis complete');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkDiscrepancies();
