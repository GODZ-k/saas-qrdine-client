export enum role {
    ADMIN='ADMIN',
    USER='USER',
    STAFF='STAFF'     
}

declare global {
    interface CustomJwtSessionClaims {
      metadata: {
        role?: role
      }
    }
  }