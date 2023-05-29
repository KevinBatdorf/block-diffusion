beforeEach(() => {
    cy.resetDatabase();
    cy.clearBrowserStorage();
    cy.loginUser();
    cy.visitNewPageEditor();

    cy.loginToApi();
    cy.addBlock('core/image');
    // focus the block
    cy.get('.wp-block[class$="wp-block-image"]').click();
    cy.get('.wp-block[class$="wp-block-image"]').should('have.focus');
    // open the modal
    cy.get('button[aria-label="Generate AI Image"]').click();
});
afterEach(() => {
    cy.closeModal();
    cy.logoutUser();
});

context('Image filter modal', () => {
    it('Can add an image', () => {
        cy.get('[data-cy="login-screen"]').should('not.exist');
        cy.get('[data-cy="modal-controls"]').should('exist');

        // TODO: add a fixture with an image that can be actually imported
    });

    it('Can switch between models', () => {
        // Should see the stable diffusion model
        cy.get('[data-cy="modal-controls"]').should(
            'contain',
            'Stable Diffusion V2',
        );

        cy.get('[data-cy="modal-controls"]').contains('Switch Models').click();

        cy.get('[data-cy="modal-switch"]').should('exist');

        cy.get('[data-cy="model-switch-grid"] button')
            .contains('lambdal/text-to-pokemon')
            .click();

        cy.get('[data-cy="modal-controls"]').should(
            'contain',
            'Text to Pokémon',
        );
    });
});
