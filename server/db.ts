import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from '@neondatabase/serverless';
import * as schema from "@shared/schema";
import ws from 'ws';

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  webSocketConstructor: ws
});
export const db = drizzle(pool, { schema });