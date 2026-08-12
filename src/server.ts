import { app } from "./app";

export const startServer = (): void => {
  console.log(`${app.name} bootstrap ready`);
};

if (require.main === module) {
  startServer();
}
