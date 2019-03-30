export const getSignupMutation = (email: string, name: string, password: string) => `
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

export const getSendPasswordResetMutation = (email: string) => `
mutation {
    sendPasswordReset(email: "${email}")
}
`;

export const getResetPasswordMutation = (passwordResetCode: string, newPassword: string, email: string) => `
mutation {
    resetPassword(
        passwordResetCode: "${passwordResetCode}",
        newPassword: "${newPassword}",
        email: "${email}"
    ) {
        token
    }
}
`;

export const getSearchQuery = (query: string) => `
query {
    searchGroups(searchQuery: "${query}") {
        id
        name
        description
    }
}
`;
