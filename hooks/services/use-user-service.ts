import userService, { User, UserUpdatingRequest } from "@/services/api/user-service";
import { useAuthStore } from "@/store/zustand/auth-store";
import { ApiResponse } from "@/types/api-type";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

/**
 * Hook to fetch current user's profile
 */
export function useUserProfile() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ["users", "profile"],
    queryFn: () => userService.getUserProfile(),
    enabled: isAuthenticated,
    select: (data: ApiResponse<User>) => ({
      profile: data.data,
      message: data.message,
    }),
    retry: (failureCount, error: unknown) => {
      // Don't retry on 401 errors
      if (error && typeof error === "object" && "status" in error && error.status === 401) {
        return false;
      }
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },
  });
}

/**
 * Hook to update user profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profileData: Partial<UserUpdatingRequest>) =>
      userService.updateUserProfile(profileData),
    onSuccess: (data: ApiResponse<string>) => {
      if (data.isSuccess) {
        queryClient.invalidateQueries({ queryKey: ["users", "profile"] });
      }
      toast.success(data.message || "Cập nhật thông tin thành công");
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Có lỗi xảy ra khi cập nhật thông tin";
      toast.error(message);
    },
  });
}

/**
 * Hook to export user data
 */
export function useExportUserData() {
  return useMutation({
    mutationFn: () => userService.exportUserData(),
    onSuccess: (data) => {
      if (data.status) {
        toast.success(data.message || "Yêu cầu xuất dữ liệu đã được gửi");
        if (data.downloadUrl) {
          // Trigger download if URL is provided
          window.open(data.downloadUrl, "_blank");
        }
      } else {
        toast.error(data.message || "Có lỗi xảy ra khi xuất dữ liệu");
      }
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "Có lỗi xảy ra khi xuất dữ liệu";
      toast.error(message);
    },
  });
}

export function useGetAllUsers(pageNumber?: number, pageSize?: number) {
  return useQuery({
    queryKey: ["users", "all", pageNumber, pageSize],
    queryFn: () => userService.getAllUsers(pageNumber, pageSize),
    select: (data: ApiResponse<User[]>) => ({
      users: data.data,
      message: data.message,
      metaData: data.metaData,
    }),
  });
}
