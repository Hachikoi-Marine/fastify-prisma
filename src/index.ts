import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const server = Fastify();

// Route to check if the server is running
server.get("/ping", async (request, reply) => {
  reply.send("Server is running");
});

// Route to get all doggos
server.get("/", async (request, reply) => {
  try {
    const users = await prisma.dog.findMany();
    reply.send(users);
  } catch (error) {
    reply.status(500).send({ error: "Error fetching users" });
  }
});

type IdParam = FastifyRequest<{ Params: { id: string } }>;

// Route to fetch a doggo by ID
server.get("/:id", async (request: IdParam, reply) => {
  const { id } = request.params as { id: string };

  try {
    const dog = await prisma.dog.findUnique({
      where: { id: +id },
    });
    if (dog) {
      reply.send(dog);
    } else {
      reply.status(404).send({ error: "Dog not found" });
    }
  } catch (error) {
    reply.status(500).send({ error: "Error fetching dog" });
  }
});

// Start the server w IIFC/E (Immediately Invoked Function Call/Expression)
(async () => {
  try {
    await prisma.$connect();
    await server.listen({ port: 3000 });
    console.log("Server listening on port 3000");
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
})();

// * or
// const main = async () => {
//   try {
//     await prisma.$connect();
//     await server.listen({ port: 3000 });
//     console.log("Server listening on port 3000");
//   } catch (error) {
//     console.error("Error starting server:", error);
//     process.exit(1);
//   }
// };

// main();
