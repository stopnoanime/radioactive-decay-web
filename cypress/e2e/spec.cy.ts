describe('radioactive-decay-web', () => {
  it('Visits the project page', () => {
    cy.visit('/');
    cy.contains('Start');
  });

  it('Disables start button on invalid form data', () => {
    cy.visit('/');

    //Invalid particles
    cy.contains('mat-form-field', 'particles').type(
      '{selectall}{backspace}10000000'
    );
    cy.contains('button', 'Start').should('be.disabled');

    //Valid particles
    cy.contains('mat-form-field', 'particles').type(
      '{selectall}{backspace}1000'
    );
    cy.contains('button', 'Start').should('be.enabled');

    //Invalid time
    cy.contains('mat-form-field', 'life').type('{selectall}{backspace}0.001');
    cy.contains('button', 'Start').should('be.disabled');

    //Valid time
    cy.contains('mat-form-field', 'life').type('{selectall}{backspace}1');
    cy.contains('button', 'Start').should('be.enabled');
  });

  it('Starts the simulation', () => {
    cy.visit('/');

    cy.contains('mat-form-field', 'life').type('{selectall}{backspace}1000');
    cy.contains('mat-form-field', 'particles').type('{selectall}{backspace}10');
    cy.contains('Start').click();

    //Sim data should be shown in header
    cy.get('[data-test="particles"]').should('include.text', 10);

    //Particle visualization should be initialized
    cy.get('app-visualize svg').children().should('have.length', 10);

    //Form should be disabled
    cy.get('mat-form-field').should('have.class', 'mat-form-field-disabled');
  });

  it('Stops the simulation', () => {
    cy.visit('/');

    cy.contains('Start').click();

    //Form should be disabled
    cy.get('mat-form-field').should('have.class', 'mat-form-field-disabled');

    cy.contains('Stop').click();

    //Form should be reenabled
    cy.get('mat-form-field').should(
      'not.have.class',
      'mat-form-field-disabled'
    );
  });

  it('Simulates particle decay', () => {
    cy.visit('/');

    cy.contains('mat-form-field', 'life').type('{selectall}{backspace}0.5');
    cy.contains('mat-form-field', 'particles').type('{selectall}{backspace}10');

    cy.contains('Start').click();

    //Wait for half of particles to decay
    cy.get('[data-test="particles"]').should('include.text', 5);

    //Decayed particles should have different color
    cy.get('svg > [fill="#ff6384"]').should('have.length', 5);
  });
});
