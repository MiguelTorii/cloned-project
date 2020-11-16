// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('login', () => {
  cy.request('POST', `${Cypress.env('api')}/auth/login`, { "email":"felipe.machado+demo10@toptal.com","password":"bababa","school_id":4 })
    .then(user => {
      window.localStorage.setItem('TOKEN', user.body.jwt_token)
      window.localStorage.setItem('REFRESH_TOKEN', user.body.refresh_token)
      window.localStorage.setItem('USER_ID', user.body.user_id)
      window.localStorage.setItem('SEGMENT', user.body.segment)
    })
})
