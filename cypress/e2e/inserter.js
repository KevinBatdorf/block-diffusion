context('Inserter checks', () => {
    it('The image block is inserted', () => {
        // Adds our block
        cy.addBlock('stable-diffusion');

        // Check the core image block is there
        cy.getPostContent('.wp-block[class$="wp-block-image"]').should('exist');

        // Closes our modal
        cy.get(
            '.stable-diffusion-editor.stable-diffusion-modal button[aria-label="Close"]',
        ).click();

        // Check the core image block is there
        cy.getPostContent('.wp-block[class$="wp-block-image"]').should(
            'not.exist',
        );
    });
});
