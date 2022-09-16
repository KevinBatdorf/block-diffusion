// Preserve WP cookies
Cypress.Cookies.defaults({
    preserve: /wordpress/,
});

// Make sure no errors
Cypress.on('window:before:load', (win) => {
    cy.spy(win.console, 'error');
});

beforeEach(() => {
    cy.loginUser();
    cy.visitNewPageEditor();
});

afterEach(() => {
    cy.saveDraft(); // so we can leave without an alert
    // cy.uninstallPlugin('stable-diffusion')
    cy.logoutUser();
});
