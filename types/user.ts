export interface UserSchema {
  username: string;
  password: string;
  email: string;
  token?: string;
  profileIcon?: string;
}

export interface SignInRequestBody {
  email: string;
  password: string;
}


export interface changeUserRequestBody {
  profileIcon?: string;
}
