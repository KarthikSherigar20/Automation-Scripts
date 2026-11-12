
const { defineConfig } = require("cypress");
const pdf = require("pdf-parse");
const fs = require("fs");
const path = require("path");

module.exports = defineConfig({

    // MOCHawesome REPORT CONFIGURATION
    reporter: "mochawesome",
    reporterOptions: {
        reportDir: "cypress/reports/json",
        overwrite: false,
        html: false,
        json: true
    },

    e2e: {
        setupNodeEvents(on, config) {

            const authDirectory = path.join(
                config.projectRoot,
                "cypress",
                "auth"
            );

            const authFilePath = path.join(
                authDirectory,
                "localStorage.json"
            );

            on("task", {

                // PARSE XLSX
                parseXlsx({ filePath }) {
                    const xlsx = require("node-xlsx");
                    return xlsx.parse(fs.readFileSync(filePath));
                },

                // READ PDF
                readPdf(filePath) {
                    const dataBuffer = fs.readFileSync(filePath);
                    return pdf(dataBuffer).then((data) => data.text);
                },

                // SAVE LOCAL STORAGE
                saveAuthData(authData) {
                    if (!authData || Object.keys(authData).length === 0) {
                        console.log("No Local Storage keys found to save.");
                        return null;
                    }

                    fs.mkdirSync(authDirectory, {
                        recursive: true
                    });

                    fs.writeFileSync(
                        authFilePath,
                        JSON.stringify(authData, null, 2),
                        "utf8"
                    );

                    console.log(
                        `Saved ${Object.keys(authData).length} Local Storage keys.`
                    );

                    return null;
                },

                // LOAD LOCAL STORAGE
                loadAuthData() {
                    if (!fs.existsSync(authFilePath)) {
                        console.log("Authentication file does not exist.");
                        return null;
                    }

                    const fileContent = fs.readFileSync(
                        authFilePath,
                        "utf8"
                    ).trim();

                    if (!fileContent) {
                        console.log("Authentication file is empty.");
                        return null;
                    }

                    try {
                        const authData = JSON.parse(fileContent);

                        if (!authData || Object.keys(authData).length === 0) {
                            return null;
                        }

                        console.log(
                            `Loaded ${Object.keys(authData).length} Local Storage keys.`
                        );

                        return authData;
                    } catch (error) {
                        console.error(
                            "Invalid authentication JSON, deleting corrupted file:",
                            error.message
                        );

                        fs.unlinkSync(authFilePath);
                        return null;
                    }
                },

                // CLEAR LOCAL STORAGE FILE
                clearAuthData() {
                    if (fs.existsSync(authFilePath)) {
                        fs.unlinkSync(authFilePath);
                        console.log("Authentication file deleted.");
                    }

                    return null;
                }
            });

            return config;
        }
    }
});
