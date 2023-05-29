export const openLoginPrompt = () => {
    cy.get('[data-cy="login-screen"]').should('not.exist');
    cy.document().then((doc) => {
        doc.dispatchEvent(new CustomEvent('stable-diffusion::openLogin'));
    });
    cy.get('[data-cy="login-screen"]').should('exist');
};

export const loginToApi = () => {
    cy.openLoginPrompt();
    cy.get('#replicate-api-key').type(Cypress.env('API_TOKEN'));
    cy.get('[data-cy="login-button"]').should('exist').click();
};
