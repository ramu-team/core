// Only export the prisma client instance.
// Do NOT re-export from @prisma/client here because @prisma/client is a
// CommonJS module and Turbopack cannot handle `export *` from CJS modules.
// Import Prisma types directly from "@prisma/client" where needed.
export { prisma } from "./client"
