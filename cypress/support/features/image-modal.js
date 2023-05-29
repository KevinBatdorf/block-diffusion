export const closeModal = () => {
    const modalButton =
        '.stable-diffusion-editor.stable-diffusion-modal button[aria-label="Close"]';
    cy.get(modalButton).click();
};
