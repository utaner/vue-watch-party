export interface UserSchema {
  username: string;
  password: string;
  email: string;
  token?: string;
}

export interface SignInRequestBody {
  email: string;
  password: string;
}
