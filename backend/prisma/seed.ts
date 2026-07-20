import { PrismaClient, Role, AccountStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'kavithamohan084@gmail.com';

  const existingAdmin = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingAdmin) {
    console.log(' Admin already exists.');
    return;
  }

  const hashedPassword = await bcrypt.hash('@Kavitha2001', 10);

  await prisma.user.create({
    data: {
      name: 'Kavitha',
      email,
      password: hashedPassword,

      role: Role.ADMIN,

      accountStatus: AccountStatus.ACTIVE,

      isEmailVerified: true,
    },
  });

  console.log('🎉 Admin created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });