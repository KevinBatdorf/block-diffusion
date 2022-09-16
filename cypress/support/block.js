export const closeOurModal = () => {
    const modalButton =
        '.stable-diffusion-editor.stable-diffusion-modal button[aria-label="Close"]';
    cy.get(modalButton).click();

    // Check the core image block is there
    cy.getPostContent('.wp-block[class$="wp-block-image"]').should('not.exist');
};

export const maybeLogin = () => {
    cy.get('body').then((body) => {
        if (body.find('[data-cy="login-button"]').length > 0) {
            cy.get('#replicate-api-key').type(Cypress.env('API_TOKEN'));
            cy.get('[data-cy="login-button"]').should('exist').click();

            // See model select screen
            cy.get('[data-cy="model-screen"]').should('exist');
        }
    });
};

export const maybeLogout = () => {
    cy.get('.stable-diffusion-modal').should('exist');
    cy.get('body').then((body) => {
        if (body.find('[data-cy="logout"]').length > 0) {
            cy.get('[data-cy="logout"]').click();
            cy.get('[data-cy="login-button"').should('exist');
        }
    });
    cy.get('[data-cy="login-screen"]').should('exist');
};
