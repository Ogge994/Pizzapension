import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { db } from "@db";
import { registrations, insertRegistrationSchema } from "@db/schema";
import { fromZodError } from "zod-validation-error";
import { eq } from "drizzle-orm";

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  app.post("/api/register-event", async (req, res) => {
    const result = insertRegistrationSchema.safeParse(req.body);
    if (!result.success) {
      const error = fromZodError(result.error);
      return res.status(400).send(error.toString());
    }

    const registration = await db.insert(registrations).values(result.data).returning();
    res.status(201).json(registration[0]);
  });

  app.get("/api/registrations", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    const allRegistrations = await db.select().from(registrations);
    res.json(allRegistrations);
  });

  app.delete("/api/registrations/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).send("Invalid ID");
    }

    await db.delete(registrations).where(eq(registrations.id, id));
    res.sendStatus(200);
  });

  const httpServer = createServer(app);
  return httpServer;
}