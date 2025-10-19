import { ApiResponse } from "@/types/api-type";
import apiService from "./core";

export interface User {
  fullName: string;
  email: string;
  bio: string;
  phoneNumber: string;
  userName: string;
  dateOfBirth: string;
  identifier: string;
  avatar: string;
  userRole: string;
  isActive: boolean;
  role: string;
  gender: boolean;
  consultantInfo: ConsultantProfile;
}
export interface ConsultantProfile {
  specialization: string;
  experienceYears: number;
  hourlyRate: number;
  certifications: string;
  consultingIn: Consulting[];
}

export interface ConsultantProfileRequest {
  specialization: string;
  experienceYears: number;
  hourlyRate: number;
  certifications: string;
  consultingIn: number[];
}

export interface Consulting {
  id: string;
  name: string;
  description: string;
}

export interface UserUpdatingRequest {
  fullName: string;
  email: string;
  bio: string;
  phoneNumber: string;
  userName: string;
  dateOfBirth: string;
  identifier: string;
  avatar: string;
  role: string;
  gender: boolean;
  consultantInfo?: ConsultantProfileRequest;
}

export enum UserRole {
  ADMIN = "Admin",
  CONSULTANT = "Consultant",
  CLIENT = "Client",
}

// User service with profile-related API methods
export const userService = {
  // Get current user profile
  getUserProfile: async (): Promise<ApiResponse<User>> => {
    const response = await apiService.get<ApiResponse<User>>("/api/users/profile");
    return response.data;
  },

  // Update current user profile
  updateUserProfile: async (
    profileData: Partial<UserUpdatingRequest>
  ): Promise<ApiResponse<string>> => {
    const response = await apiService.put<ApiResponse<string>, Partial<UserUpdatingRequest>>(
      "/api/users/profile",
      profileData
    );
    return response.data;
  },

  // Update user avatar
  //   updateUserAvatar: async (avatarFile: File): Promise<UserUpdateResponse> => {
  //     const formData = new FormData();
  //     formData.append("avatarFile", avatarFile);

  //     const response = await apiService.put<UserUpdateResponse, FormData>(
  //       "/api/users/update-avatar",
  //       formData
  //     );
  //     return response.data;
  //   },

  // Update user cover photo
  //   updateUserCoverPhoto: async (coverPhotoFile: File): Promise<UserUpdateResponse> => {
  //     const formData = new FormData();
  //     formData.append("coverPhotoFile", coverPhotoFile);

  //     const response = await apiService.put<UserUpdateResponse, FormData>(
  //       "/api/users/update-cover-photo",
  //       formData
  //     );
  //     return response.data;
  //   },

  // Change password
  changePassword: async (passwordData: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<string> => {
    const response = await apiService.put<string, typeof passwordData>(
      "/api/users/change-password",
      passwordData
    );
    return response.data;
  },

  // Export user data
  exportUserData: async (): Promise<{ status: boolean; message: string; downloadUrl?: string }> => {
    const response = await apiService.post<{
      status: boolean;
      message: string;
      downloadUrl?: string;
    }>("/api/users/export-data");
    return response.data;
  },

  // Delete user account
  deleteAccount: async (confirmationText: string): Promise<string> => {
    const response = await apiService.delete<string>("/api/users/delete-account", {
      confirmationText,
    });
    return response.data;
  },
};

export default userService;
