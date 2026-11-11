
declare global {
    namespace Cypress {
        interface Chainable {
            verifyLocalStorage(): void;
        }
    }
}

export {};
