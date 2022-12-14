export const closeWelcomeGuide = () => {
    cy.window().then((win) => {
        // If it's not open, open it first
        cy.waitUntil(() => {
            if (
                win.wp.data
                    .select('core/edit-post')
                    .isFeatureActive('welcomeGuide')
            ) {
                return true;
            }
            win.wp.data
                .dispatch('core/edit-post')
                .toggleFeature('welcomeGuide');
            return false;
        });
        const className = '[aria-label="Welcome to the block editor"]';
        // It's important we open it then wait for the animation to finish
        cy.get(className).should('be.visible');
        // Then close it
        cy.waitUntil(() => {
            if (
                !win.wp.data
                    .select('core/edit-post')
                    .isFeatureActive('welcomeGuide')
            ) {
                return true;
            }
            win.wp.data
                .dispatch('core/edit-post')
                .toggleFeature('welcomeGuide');

            // And wait again for the animation to finish
            cy.get(className).should('not.exist');
        });
    });
};

export const saveDraft = () => {
    cy.get('body').then((body) => {
        if (body.find('.editor-post-save-draft').length > 0) {
            cy.get('.editor-post-save-draft').click();
            cy.get('.editor-post-saved-state.is-saved');
        }
    });
};

export const setPostContent = (content) => {
    cy.window().then((win) => {
        const { dispatch } = win.wp.data;
        const blocks = win.wp.blocks.parse(content);
        dispatch('core/block-editor').resetBlocks(blocks);
    });
};
export const openBlockInserter = () => {
    cy.get('button[aria-label="Toggle block inserter"]').then((button) => {
        if (button.attr('aria-pressed') === 'false') {
            button.click();
        }
    });
    cy.get('.block-editor-inserter__main-area').should('exist');
};
export const closeBlockInserter = () => {
    cy.get('button[aria-label="Toggle block inserter"]').then((button) => {
        if (button.attr('aria-pressed') === 'true') {
            button.click();
        }
    });
};
export const addBlock = (slug) => {
    cy.openBlockInserter();
    cy.window().then((win) => {
        cy.waitUntil(() =>
            win.document.querySelector(`button[class*="${slug}"]`),
        );
        cy.get(`button[class*="${slug}"]`).should('exist');
        cy.get(`button[class*="${slug}"]`).click({ force: true });
    });
};
export const wpDataSelect = (store, selector, ...parameters) => {
    cy.window().then((win) => {
        return win.wp.data.select(store)[selector](...parameters);
    });
};
