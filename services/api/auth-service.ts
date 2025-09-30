import { ApiResponse } from "@/types/api-type";
import apiService from "./core";

export interface LoginCredentials {
  keyLogin: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponseData {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  accessTokenExpiry: Date;
  refreshTokenExpiry: Date;
}

export interface RegisterCredentials {
  fullName: string;
  email: string;
  phoneNumber: string;
  userName: string;
  password: string;
  //   dateOfBirth: string;
  //   identifier: string;
  confirmPassword: string;
  //   role: Roles;
}

export const AuthService = {
  // Signin method
  login: async (credentials: LoginCredentials): Promise<ApiResponse<LoginResponseData>> => {
    // Implement login logic here
    const response = await apiService.post<ApiResponse<LoginResponseData>, LoginCredentials>(
      "api/auth/login",
      credentials
    );
    return response.data;
  },
  // SignUp method
  register: async (credentials: RegisterCredentials) => {
    // Implement registration logic here
    const response = await apiService.post<ApiResponse<null>, RegisterCredentials>(
      "api/auth/register",
      credentials
    );
    return response.data;
  },
};
