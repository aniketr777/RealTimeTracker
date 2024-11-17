import { defineConfig } from "vite";
import react from "@vitejs/plugin-react"; // Use this line if you selected React

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:5000",
    },
  },
});
