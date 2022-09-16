context('Login checks', () => {
    it('The wrong API key will show an error', () => {
        // Adds our block
        cy.addOurBlock();

        // Click the login with nothing entered
        cy.get('[data-cy="login-button"]').should('exist').click();

        // See no error
        cy.get('[data-cy="login-error"]').should('not.exist');

        // Type in random stuff and click login
        cy.get('#replicate-api-key').type('random');
        cy.get('[data-cy="login-button"]').should('exist').click();

        // See error
        cy.get('[data-cy="login-error"]').should('exist');

        cy.closeModal();
    });

    it('Successful login will show the select screen', () => {
        // Adds our block
        cy.addOurBlock();

        // Confirm model screen is not there
        cy.get('[data-cy="model-screen"]').should('not.exist');

        // Type in real API Token
        cy.get('#replicate-api-key').type(Cypress.env('API_TOKEN'));
        cy.get('[data-cy="login-button"]').should('exist').click();

        // See model select screen
        cy.get('[data-cy="model-select"]').should('exist');

        cy.closeModal();
    });
});
