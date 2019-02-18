export const getSignupMutation = (
  email: string,
  name: string,
  password: string
) => `
  mutation {
      signup(email: "${email}", password: "${password}", name: "${name}") {
          token
          person {
              id
          }
      }
  }
`;

export const getLoginMutation = (email: string, password: string) => `
  mutation {
    login(email: "${email}", password: "${password}") {
      token
      person {
        id
      }
    }
  }
`;
