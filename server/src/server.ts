import app from "./app";
import { config } from "./config";

export const server = app.listen(config.port, () => {
  console.log(`🚀 Server running on port ${config.port}`);
  console.log(`📚 API Documentation: http://localhost:${config.port}/api/docs`);
});
