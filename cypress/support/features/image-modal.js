export const closeModal = () => {
    const modalButton =
        '.block-diffusion-editor.stable-diffusion-modal button[aria-label="Close"]';
    cy.get(modalButton).click();
};
