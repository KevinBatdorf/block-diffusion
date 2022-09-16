context('Starting up', () => {
    afterEach(() => {
        cy.window().then((win) => {
            expect(win.console.error).to.have.callCount(0);
        });
    });

    it('The image block is inserted', () => {
        // Adds our block
        cy.addOurBlock();
        cy.closeModal();
    });
});
