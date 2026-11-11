const { defineConfig } = require("cypress");
const pdf = require("pdf-parse");
const fs = require("fs");
const path = require("path");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {

      on("task", {

        // ==============================
        // Existing PDF task
        // ==============================
        readPdf(filePath) {
          const dataBuffer = fs.readFileSync(filePath);

          return pdf(dataBuffer).then((data) => {
            return data.text;
          });
        },

        // ==============================
        // Save authentication cookies
        // ==============================
        saveAuthCookies(cookies) {

          const authDirectory = path.join(
            config.projectRoot,
            "cypress",
            "auth"
          );

          const authFile = path.join(
            authDirectory,
            "session.json"
          );

          // Create cypress/auth if it doesn't exist
          if (!fs.existsSync(authDirectory)) {
            fs.mkdirSync(authDirectory, {
              recursive: true
            });
          }

          fs.writeFileSync(
            authFile,
            JSON.stringify(cookies, null, 2),
            "utf8"
          );

          console.log("Authentication cookies saved.");

          return null;
        },

        // ==============================
        // Load authentication cookies
        // ==============================
        loadAuthCookies() {

          const authFile = path.join(
            config.projectRoot,
            "cypress",
            "auth",
            "session.json"
          );

          if (!fs.existsSync(authFile)) {
            console.log("No saved authentication session found.");

            return null;
          }

          const cookies = JSON.parse(
            fs.readFileSync(authFile, "utf8")
          );

          console.log("Authentication cookies loaded.");

          return cookies;
        },

        // ==============================
        // Clear authentication cookies
        // ==============================
        clearAuthCookies() {

          const authFile = path.join(
            config.projectRoot,
            "cypress",
            "auth",
            "session.json"
          );

          if (fs.existsSync(authFile)) {
            fs.unlinkSync(authFile);
          }

          console.log("Saved authentication session cleared.");

          return null;
        }
      });

      return config;
    }
  }
});