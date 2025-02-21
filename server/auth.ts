import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { db } from "./db";
import { adminUsers } from "@shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

// Set up Passport strategy
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const users = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
      const user = users[0];
      
      if (!user) {
        return done(null, false, { message: "Invalid credentials" });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return done(null, false, { message: "Invalid credentials" });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const users = await db.select().from(adminUsers).where(eq(adminUsers.id, id));
    done(null, users[0]);
  } catch (err) {
    done(err);
  }
});

// Middleware to check if user is authenticated
export function requireAuth(req: any, res: any, next: any) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

export default passport;
