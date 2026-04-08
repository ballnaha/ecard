const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const args = process.argv.slice(2);
  const usernameArg = args.find(a => a.startsWith('--username='))?.split('=')[1];
  const passwordArg = args.find(a => a.startsWith('--password='))?.split('=')[1];

  const newUsername = usernameArg || 'admin'; // Default new admin username
  const newPassword = passwordArg || 'wedding2026';   // Default new admin password

  console.log('--- Wedding E-Card Admin Setup ---');

  try {
    // 1. Create/Update new admin
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const newAdmin = await prisma.admin.upsert({
      where: { username: newUsername },
      update: {
        password: hashedPassword,
        status: 'active',
        role: 'admin'
      },
      create: {
        username: newUsername,
        password: hashedPassword,
        role: 'admin',
        status: 'active'
      }
    });

    console.log(`\n---------------------------------`);
    console.log(`✅ Admin Credential Created:`);
    console.log(`👤 Username: ${newUsername}`);
    console.log(`🔑 Password: ${newPassword}`);
    console.log(`---------------------------------\n`);

    // 2. Delete old admin (username: admin) if it exists and it's not the new one
    if (newUsername !== 'admin') {
      const oldAdmin = await prisma.admin.findUnique({
        where: { username: 'admin' }
      });

      if (oldAdmin) {
        await prisma.admin.delete({
          where: { username: 'admin' }
        });
        console.log('✅ Default "admin" user has been removed.');
      } else {
        console.log('ℹ️ Default "admin" user already gone.');
      }
    } else {
      console.log('ℹ️ New admin is same as old, skipping deletion.');
    }

    console.log('\n✨ Setup Complete! You can now log in with the new credentials.');

  } catch (error) {
    console.error('❌ Error during setup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
