import { prisma } from "../src/prisma.js";
import { seedRolesAndUsers } from "./seeds/01-roles-users.js";
import { seedPictograms } from "./seeds/02-pictograms.js";
import { seedBoards } from "./seeds/03-boards.js";

async function main() {
  await seedRolesAndUsers(prisma);
  await seedPictograms(prisma);
  await seedBoards(prisma);

  console.log("Seed completed successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
