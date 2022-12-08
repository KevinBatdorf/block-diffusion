context('Model checks', () => {
    it('Can switch between models', () => {
        cy.addOurBlock();

        cy.maybeLogin();

        // First we should see the stable diffusion model
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

        cy.closeModal();
    });
});
