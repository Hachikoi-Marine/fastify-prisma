import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// * DOGGOS
const fetchAllDoggos = async () => {
  const dogs = await prisma.dog.findMany({ include: { owner: true } });

  console.log(dogs);
};

const generateDoggos = async () => {
  const dog = await prisma.dog.createMany({
    data: [
      { name: "Pochi", ownerId: 1 },
      { name: "Max", ownerId: 2 },
      { name: "Daisy", ownerId: 3 },
      { name: "Lily", ownerId: 2 },
    ],
  });

  console.log(dog);
};

// * OWNERS
const fetchAllOwners = async () => {
  const owners = await prisma.owner.findMany({ include: { dogs: true } });

  console.log(owners);
};

const generateOwners = async () => {
  const res = await prisma.owner.createMany({
    data: [
      { name: "Alice" },
      { name: "Jhon" },
      { name: "Ruby" },
      { name: "Juan" },
    ],
  });

  console.log(res);
};

async function main() {
  await generateOwners();
  await generateDoggos();
  console.log("Finished :P");
}

// prisma.$disconnect()
// good practice in scripts that only run once
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
