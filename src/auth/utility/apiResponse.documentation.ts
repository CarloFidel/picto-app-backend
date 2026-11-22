
export const authTokenExample = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'

export const apiResponseExamples = {
  registeredUserExample: {
    name: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    avatar: '',
    roles: ['user'],
    token: authTokenExample,
  },

  recoveredUserExample: {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    email: 'john.doe@example.com',
    name: 'John',
    lastName: 'Doe',
    roles: ['user'],
    token: authTokenExample,
  },

  loggedInUserExample: {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    name: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    roles: ['user'],
    token: authTokenExample,
  },

  googleLoggedInUserExample: {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    name: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    roles: ['user'],
    avatar: 'https://lh3.googleusercontent.com/a/example',
    token: authTokenExample,
  },

  patchedUserExample: {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    name: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    isActive: true,
    roles: ['user'],
    avatar: 'https://example.com/avatar.png',
    password: null,
    googleSub: null,
    shedule: [],
    photo: [],
    events: [],
    article: [],
    token: authTokenExample,
  },

  deletedUserExample: {
    status: 200,
    message: 'Deleted succesfull',
  },

  validationErrorExample: {
    message: ['email must be an email'],
    error: 'Bad Request',
    statusCode: 400,
  },
}