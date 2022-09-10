// Check support/globals.js for some default checks
// as well as start up and clean up methods
context('Block checks', () => {
    it('Adds the block', () => {
        cy.addBlock('stable-diffusion');
        // Check the loading text is gone.
        // cy.getPostContent().contains('Loading').should('not.exist')
        // Check the block is there
        cy.getPostContent('.wp-block[class$="stable-diffusion"]').should('exist');
    });
});
