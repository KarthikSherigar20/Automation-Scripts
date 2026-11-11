Cypress.Commands.add("parseXlsx", (inputFile) => {
    return cy.task('parseXlsx', { filePath: inputFile });
});

Cypress.Commands.add("saveAuthData", () => {
    cy.window().then((win) => {
        const authData = {};
        for (let i = 0; i < win.localStorage.length; i++) {
            const key = win.localStorage.key(i);
            authData[key] = win.localStorage.getItem(key);
        }
        cy.task("saveAuthData", authData);
    });
});