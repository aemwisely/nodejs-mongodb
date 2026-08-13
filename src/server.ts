import http from "node:http";

import { app } from "./app";
import { disconnectDatabase, connectDatabase } from "./config/database";
import { env } from "./config/env";
import { initializeDatabase } from "./database";

let server: http.Server | undefined;
let isShuttingDown = false;

const startDatabase = async (): Promise<void> => {
  try {
    await connectDatabase();

    if (env.AUTO_INIT_DATABASE) {
      await initializeDatabase();
      console.log("MongoDB collections initialized");
    }

    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed", error);

    if (env.NODE_ENV === "production") {
      throw error;
    }

    console.warn("Continuing without MongoDB outside production");
  }
};

const shutdown = (signal: NodeJS.Signals): void => {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  console.log(`${signal} received. Shutting down gracefully.`);

  const forceExitTimer = setTimeout(() => {
    console.error("Graceful shutdown timed out");
    process.exit(1);
  }, 10000);
  forceExitTimer.unref();

  const closeServer = server
    ? new Promise<void>((resolve, reject) => {
        server?.close((error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      })
    : Promise.resolve();

  closeServer
    .then(() => disconnectDatabase())
    .then(() => {
      clearTimeout(forceExitTimer);
      process.exit(0);
    })
    .catch((error) => {
      console.error("Graceful shutdown failed", error);
      clearTimeout(forceExitTimer);
      process.exit(1);
    });
};

export const startServer = async (): Promise<http.Server> => {
  await startDatabase();

  server = app.listen(env.PORT, () => {
    console.log(`HTTP server listening on port ${env.PORT}`);
  });

  return server;
};

if (require.main === module) {
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  startServer().catch((error) => {
    console.error("Failed to start server", error);
    process.exit(1);
  });
}
