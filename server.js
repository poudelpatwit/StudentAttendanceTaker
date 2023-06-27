/**
 * This is the main Node.js server script for your project
 * Check out the two endpoints this back-end API provides in fastify.get and fastify.post below
 */

const fs = require("fs");
const path = require("path");

// Require the fastify framework and instantiate it
const fastify = require("fastify")({
  // Set this to true for detailed logging:
  logger: true,
});
// Run the server and report out to the logs

const port = 3001;

fastify.listen({ port: port, host: '0.0.0.0' }).then(() => {
  console.log(`Server listening on http://0.0.0.0:${port}`);
}).catch(err => {
  fastify.log.error(err);
  process.exit(1);
});

// ADD FAVORITES ARRAY VARIABLE FROM TODO HERE

// Setup our static files
fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "public"),
  prefix: "/", // optional: default '/'
});

// Formbody lets us parse incoming forms
fastify.register(require("@fastify/formbody"));

// View is a templating manager for fastify
fastify.register(require("@fastify/view"), {
  engine: {
    handlebars: require("handlebars"),
  },
});

// Load and parse SEO data
const seo = require("./src/seo.json");
if (seo.url === "glitch-default") {
  seo.url = `https://${process.env.PROJECT_DOMAIN}.glitch.me`;
}

/**
 * Our home page route
 *
 * Reeturns the login page
 */
fastify.get("/", function (request, reply) {
  // params is an object we'll pass to our handlebars template
  let params = { seo: seo };
  // The Handlebars code will be able to access the parameter values and build them into the page
  return reply.view("/src/pages/login/login.hbs", params);
});


//user register route 
fastify.get("/register", async (request, reply) => {
  let params = { seo: seo };

  // Send the register page
  return reply.view("/src/pages/register/register.hbs", params);
});


//dashboard page
fastify.get('/dashboard', (request, reply) => {
  let params = { seo: seo }; // define 'seo' appropriately
  return reply.view("/src/pages/dashboard/dashboard.hbs", params)
});

//semester page
fastify.get('/semester', (request, reply) => {
  let params = { seo: seo }; // define 'seo' appropriately
  return reply.view("/src/pages/semester/semester.hbs", params)
});



