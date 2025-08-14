import { defineConfig } from "drizzle-kit"

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl)
    throw new Error("DATABASE_URL is not defined in environment variables")

// export the Drizzle config using defineConfig helper
export default defineConfig({
    // Path to your schema definitions (Drizzle ORM will scan this file)
    schema: "./drizzle/schema.ts",
    // Directory where Drizzle will output migration files
    out: "./drizzle/migrations",
    // Specify which SQL dialect you are using
    dialect: "postgresql",
    // Enable strict mode to enforce stricter validation and type safety
    strict: true,
    // Enable verbose logging to get more information during CLI actions
    verbose: true,
    // Pass in database credentials
    dbCredentials: {
        // safe to use now because we checked above that it's defined
        url: databaseUrl
    },
})
