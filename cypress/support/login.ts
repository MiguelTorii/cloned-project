export type TestCredentials = {
  email: string;
  password: string;
  userId?: string;
};

type TestSchool = {
  name: string;
  id: number;
};

export type SessionData = {
  TOKEN?: string;
  REFRESH_TOKEN?: string;
  USER_ID?: string;
};

function loginUser(
  school: TestSchool,
  credentials: TestCredentials,
  inputSessionData: SessionData
): void {
  const sessionData: SessionData = inputSessionData || {};

  cy.request('POST', `${Cypress.env('api')}/auth/login`, {
    email: credentials.email,
    password: credentials.password,
    school_id: school.id
  }).then((user) => {
    sessionData.TOKEN = user.body.jwt_token;
    sessionData.REFRESH_TOKEN = user.body.refresh_token;
    sessionData.USER_ID = user.body.user_id;
    setSessionInLocalStorage(sessionData);
  });
}

function setSessionInLocalStorage(sessionData: SessionData): void {
  if (sessionData?.TOKEN) {
    window.localStorage.setItem('TOKEN', sessionData.TOKEN);
    window.localStorage.setItem('REFRESH_TOKEN', sessionData.REFRESH_TOKEN);
    window.localStorage.setItem('USER_ID', sessionData.USER_ID);
  }
}

export function addCypressLoginCommands() {
  const testSchool: TestSchool = Cypress.env('TEST_SCHOOL') || {
    name: 'Kori Sandbox',
    id: 121
  };

  Cypress.Commands.add('loginAdmin', (sessionData: SessionData) => {
    const adminTestUser: TestCredentials = Cypress.env('ADMIN_TEST_USER') || {
      email: 'kori+sandbox@circleinapp.com',
      password: Cypress.env('PASSWORD')
    };
    loginUser(testSchool, adminTestUser, sessionData);
  });

  Cypress.Commands.add('loginUser1', (sessionData: SessionData) => {
    const testUser1: TestCredentials = Cypress.env('TEST_USER_1') || {
      email: 'kori+cb@circleinapp.com',
      password: Cypress.env('PASSWORD')
    };
    loginUser(testSchool, testUser1, sessionData);
  });

  Cypress.Commands.add('loginUser2', (sessionData: SessionData) => {
    const testUser2: TestCredentials = Cypress.env('TEST_USER_2') || {
      email: 'kori+hs@circleinapp.com',
      password: Cypress.env('PASSWORD')
    };
    loginUser(testSchool, testUser2, sessionData);
  });

  Cypress.Commands.add('setSessionInLocalStorage', (sessionData: SessionData) => {
    setSessionInLocalStorage(sessionData);
  });
}
