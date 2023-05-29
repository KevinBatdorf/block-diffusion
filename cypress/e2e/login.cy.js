beforeEach(() => {
    cy.resetDatabase();
    cy.clearBrowserStorage();
    cy.loginUser();
});
afterEach(() => {
    cy.logoutUser();
});

context('Login checks', () => {
    it('The login prompt can be opened from plugins API Key', () => {
        cy.visitAdminPage('plugins.php');
        cy.get('[data-cy="api-token-action"]').should('exist').click();
        cy.get('[data-cy="login-screen"]').should('exist');
    });

    it('Can log in properly', () => {
        cy.openLoginPrompt();
        // See no error
        cy.get('[data-cy="login-error"]').should('not.exist');
        // Try to login with no api token
        cy.get('[data-cy="login-button"]').should('exist').click();
        // See error
        cy.get('[data-cy="login-error"]').should('exist');
        // Enter any token
        cy.get('#replicate-api-key').type('123');
        // Login accepts any token, it will force relogin later if it fails
        cy.get('[data-cy="login-button"]').should('exist').click();
        // See no error
        cy.get('[data-cy="login-error"]').should('not.exist');
        // Modal shoudl be closed
        cy.get('[data-cy="login-screen"]').should('not.exist');
        // See toast success
        cy.get('[data-cy="login-success-toast"]')
            .should('exist')
            .contains('The token was successfully saved.');
    });

    it('Opening the modal should prompt login', () => {
        cy.visitNewPageEditor();
        cy.addBlock('core/image');
        cy.get('button[aria-label="Generate AI Image"]').click();

        cy.get('[data-cy="login-screen"]').should('exist');
        // Type wrong token
        cy.get('#replicate-api-key').type('123');
        cy.get('[data-cy="login-button"]').should('exist').click();

        // Prompt leaves
        cy.get('[data-cy="login-screen"]').should('not.exist');

        // prompt should show again
        cy.get('[data-cy="login-screen"]').should('exist');
        cy.get('[data-cy="login-screen"]').should(
            'contain',
            'Please log in to continue',
        );
    });
});
