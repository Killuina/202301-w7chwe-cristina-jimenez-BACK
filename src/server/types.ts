export interface UserLoginCredentials {
  username: string;
  password: string;
}

export interface UserStructure extends UserLoginCredentials {
  email: string;
}

export interface UserRegisterCredentials extends UserStructure {
  avatar: string;
}
