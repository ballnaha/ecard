import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const client = await prisma.client.findFirst({
    where: { slug: 'ball-pla' }
  });
  
  if (client) {
    console.log('--- Client Data Record ---');
    console.log('ID:', client.id);
    console.log('GiftSection JSON:', JSON.stringify(client.giftSection, null, 2));
  } else {
    console.log('Client not found');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
