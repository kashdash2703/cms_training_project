import Fastify from "fastify";

const app = Fastify({ logger: true });

app.get("/", async () => {
  return { message: "CMS API running" };
});

const start = async () => {
  try {
    await app.listen({ port: 3000 });
    console.log("Server running at http://localhost:3000");
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

start();