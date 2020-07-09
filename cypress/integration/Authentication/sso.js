const url = 'https://dev-app2.circleinapp.com/'


describe('Authentication', () => {
  it('login using sso', () => {
    cy.request('GET', 'https://dev-api.circleinapp.com/v1/search/school?query=arts').then(res => {
      const s = res.body.schools[0]
      const responseType = 'code';
      const obj = {
        uri: s.uri,
        lms_type_id: s.lms_type_id,
        response_type: responseType,
        client_id: s.client_id,
        redirect_uri: `${url}oauth`
      };
      const buff = Buffer.from(JSON.stringify(obj)).toString('hex');
      const nextUrl = `${s.auth_uri}?client_id=${s.client_id}&response_type=${responseType}&redirect_uri=${url}oauth&state=${buff}&scope=${s.scope}`
      cy.visit(nextUrl)
      cy.get('#pseudonym_session_unique_id').type('jon+190@circleinapp.com')
      cy.get('#pseudonym_session_password').type('abcd1234{enter}')
      cy.contains('Authorize').click()
      cy.contains('Workflow')
    })
  })
})
