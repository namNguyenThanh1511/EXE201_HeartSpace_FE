"use client";

import { useState, useRef, useLayoutEffect } from "react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Key, Camera, Loader2, Phone, Mail, AlertCircle, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { toast } from "sonner";

import { useAuth } from "@/hooks/services/use-auth";
import { AccountSettingsLayout } from "./account-settings-layout";
import { ProfileForm } from "./profile-form";
import { useUserProfile } from "@/hooks/services/use-user-service";
import { images } from "@/lib/images-var";

const tabs = [
  {
    name: "Thông tin cá nhân",
    value: "profile",
    icon: User,
  },
  {
    name: "Bảo mật",
    value: "password",
    icon: Key,
  },
];

export function AccountSettings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isChangingAvatar, setIsChangingAvatar] = useState(false);
  const [isChangingCover, setIsChangingCover] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });

  const { isAuthenticated } = useAuth();
  const { data: profileResponse, isLoading, error, refetch } = useUserProfile();

  //   const { mutate: updateAvatar } = useUpdateAvatar();
  //   const { mutate: updateCoverPhoto } = useUpdateCoverPhoto();

  useLayoutEffect(() => {
    const activeIndex = tabs.findIndex((tab) => tab.value === activeTab);
    const activeTabElement = tabRefs.current[activeIndex];

    if (activeTabElement) {
      const { offsetLeft, offsetWidth } = activeTabElement;

      setUnderlineStyle({
        left: offsetLeft,
        width: offsetWidth,
      });
    }
  }, [activeTab]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  //   const handleAvatarChange = (file: File) => {
  //     setIsChangingAvatar(true);
  //     updateAvatar(file, {
  //       onSuccess: (data) => {
  //         if (data.status) {
  //           toast.success("Avatar đã được cập nhật");
  //           refetch();
  //         } else {
  //           toast.error(data.message || "Có lỗi xảy ra khi cập nhật avatar");
  //         }
  //       },
  //       onError: (_error) => {
  //         toast.error("Có lỗi xảy ra khi cập nhật avatar");
  //       },
  //       onSettled: () => {
  //         setIsChangingAvatar(false);
  //       },
  //     });
  //   };

  //   const handleCoverChange = (file: File) => {
  //     setIsChangingCover(true);
  //     updateCoverPhoto(file, {
  //       onSuccess: (data) => {
  //         if (data.status) {
  //           toast.success("Ảnh bìa đã được cập nhật");
  //           refetch();
  //         } else {
  //           toast.error(data.message || "Có lỗi xảy ra khi cập nhật ảnh bìa");
  //         }
  //       },
  //       onError: (_error) => {
  //         toast.error("Có lỗi xảy ra khi cập nhật ảnh bìa");
  //       },
  //       onSettled: () => {
  //         setIsChangingCover(false);
  //       },
  //     });
  //   };

  if (!isAuthenticated) {
    return (
      <AccountSettingsLayout
        title="Vui lòng đăng nhập"
        description="Bạn cần đăng nhập để xem thông tin tài khoản"
      >
        <div className="text-center py-8">
          <p className="text-muted-foreground">Vui lòng đăng nhập để tiếp tục</p>
        </div>
      </AccountSettingsLayout>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-8">
            {/* Loading Header */}
            <div className="relative bg-white rounded-2xl overflow-hidden animate-pulse">
              {/* Cover Image Skeleton */}
              <div className="relative h-56 md:h-96 rounded-2xl w-full overflow-hidden bg-gray-200" />

              {/* Profile Content Skeleton */}
              <div className="relative px-4 sm:px-6 lg:px-8 pt-4">
                <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
                  {/* Avatar Skeleton */}
                  <div className="relative flex-shrink-0 -mt-16 mb-1">
                    <div className="size-32 sm:size-36 md:size-48 lg:size-52 border-4 border-white bg-gray-200 rounded-full" />
                  </div>

                  {/* Profile Info Skeleton */}
                  <div className="flex-1 flex flex-col md:flex-row md:justify-between md:items-start md:h-48">
                    <div className="flex-1 md:pr-8 flex flex-col justify-center space-y-3">
                      <div className="h-8 bg-gray-200 rounded w-64" />
                      <div className="h-4 bg-gray-200 rounded w-32" />
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-48" />
                        <div className="h-4 bg-gray-200 rounded w-40" />
                      </div>
                      <div className="flex gap-2">
                        <div className="h-6 bg-gray-200 rounded-full w-24" />
                        <div className="h-6 bg-gray-200 rounded-full w-32" />
                      </div>
                    </div>

                    {/* Action buttons skeleton */}
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-6 md:mt-0 md:min-w-[280px] md:self-center">
                      <div className="h-10 bg-gray-200 rounded flex-1" />
                      <div className="h-10 bg-gray-200 rounded flex-1" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs Skeleton */}
              <Card className="border-0 bg-white rounded-2xl">
                <CardContent className="p-6">
                  <div className="space-y-8">
                    {/* Tabs skeleton */}
                    <div className="flex space-x-8 border-b pb-4">
                      <div className="h-6 bg-gray-200 rounded w-32" />
                      <div className="h-6 bg-gray-200 rounded w-20" />
                    </div>

                    {/* Content skeleton */}
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-24" />
                        <div className="h-10 bg-gray-200 rounded" />
                      </div>
                      <div className="space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-32" />
                        <div className="h-10 bg-gray-200 rounded" />
                      </div>
                      <div className="space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-28" />
                        <div className="h-10 bg-gray-200 rounded" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Loading indicator */}
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-lg font-medium">Đang tải thông tin tài khoản...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[60vh]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-6 max-w-md mx-auto px-4"
            >
              <div className="relative">
                <div className="mx-auto h-24 w-24 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-12 w-12 text-red-600" />
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-gray-900">Không thể tải thông tin</h3>
                <p className="text-gray-600 text-lg">
                  Đã xảy ra lỗi khi tải thông tin tài khoản của bạn. Vui lòng thử lại.
                </p>
                {error && (
                  <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                    {(error as Error)?.message || "Lỗi không xác định"}
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => refetch()} className="flex items-center gap-2" size="lg">
                  <RefreshCw className="h-4 w-4" />
                  Thử lại
                </Button>
                <Button variant="outline" onClick={() => (window.location.href = "/")} size="lg">
                  Về trang chủ
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {profileResponse && (
          <div className="space-y-8">
            {/* Profile Header - Seller Style */}
            <div className="relative bg-white rounded-2xl overflow-hidden ">
              {/* Cover Image */}
              <div className="relative h-56 md:h-96 rounded-2xl w-full overflow-hidden">
                <Image
                  src={images.landingImg}
                  alt="Cover"
                  fill
                  className="object-cover"
                  priority
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src !== "/bg_hero.jpg") {
                      target.src = "/bg_hero.jpg";
                    }
                  }}
                />

                {/* Cover Photo Upload Button */}
                <div className="absolute top-6 right-6">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="backdrop-blur-sm bg-white/20 hover:bg-white/30 border-white/20 text-white/50"
                    onClick={() => {
                      const input = document.createElement("input");
                      input.type = "file";
                      input.accept = "image/*";
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        // if (file) handleCoverChange(file);
                      };
                      input.click();
                    }}
                    disabled={isChangingCover}
                  >
                    {isChangingCover ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Camera className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Profile Content */}
              <div className="relative px-4 sm:px-6 lg:px-8 pt-4">
                {/* Content area with avatar and info side by side */}
                <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
                  {/* Avatar - larger size with partial overlap */}
                  <div className="relative flex-shrink-0 -mt-16 mb-1">
                    <Avatar className="size-32 sm:size-36 md:size-48 lg:size-52 border-4 border-white">
                      <AvatarImage
                        src={profileResponse.profile.avatar}
                        alt={profileResponse.profile.fullName || "User"}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-red-50 text-red-500 text-lg sm:text-xl md:text-2xl lg:text-5xl font-bold">
                        {getInitials(profileResponse.profile.fullName || "User")}
                      </AvatarFallback>
                    </Avatar>

                    {/* Avatar Upload Button */}
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute -bottom-1 -right-1 h-12 w-12 rounded-full p-0 shadow-lg border-2 border-white"
                      onClick={() => {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.accept = "image/*";
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          //   if (file) handleAvatarChange(file);
                        };
                        input.click();
                      }}
                      disabled={isChangingAvatar}
                    >
                      {isChangingAvatar ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Camera className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  {/* Right side - All Profile Info */}
                  <div className="flex-1 flex flex-col md:flex-row md:justify-between md:items-start md:h-48">
                    {/* Profile Info - aligned with avatar height */}
                    <div className="flex-1 md:pr-8 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-xl sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
                          {profileResponse.profile.fullName}
                        </h1>
                      </div>

                      <p className="text-gray-600 text-xs md:text-sm mb-3">
                        @{profileResponse.profile.userName}
                      </p>

                      {/* Contact Information */}
                      <div className="flex flex-col space-y-2 text-xs md:text-sm text-gray-600 mb-4">
                        {profileResponse.profile.email && (
                          <div className="flex items-center space-x-2">
                            <Mail className="size-3 md:size-4" />
                            <span>{profileResponse.profile.email}</span>
                          </div>
                        )}
                        {profileResponse.profile.phoneNumber && (
                          <div className="flex items-center space-x-2">
                            <Phone className="size-3 md:size-4" />
                            <span>{profileResponse.profile.phoneNumber}</span>
                          </div>
                        )}
                      </div>

                      {/* Additional Info Tags */}
                      <div className="flex flex-wrap gap-2">
                        {profileResponse.profile.consultantInfo.experienceYears && (
                          <div className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1">
                            <span className="text-xs font-medium">
                              {profileResponse.profile.consultantInfo.experienceYears} năm kinh
                              nghiệm
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action buttons - aligned to center of profile info */}
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-6 md:mt-0 md:min-w-[280px] md:self-center">
                      <Button
                        variant="outline"
                        className="flex-1 px-6 py-2"
                        onClick={() => setActiveTab("profile")}
                      >
                        Chỉnh sửa hồ sơ
                      </Button>
                      <Button
                        className="flex-1 bg-black hover:bg-gray-800 text-white px-6 py-2"
                        onClick={() => setActiveTab("password")}
                      >
                        Đổi mật khẩu
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <Card className="border-0 bg-white rounded-2xl">
                <CardContent className="">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="relative rounded-none border-b p-0 h-auto bg-transparent mb-8">
                      {tabs.map((tab, index) => {
                        const IconComponent = tab.icon;
                        return (
                          <TabsTrigger
                            key={tab.value}
                            value={tab.value}
                            ref={(el) => {
                              tabRefs.current[index] = el;
                            }}
                            className="bg-background dark:data-[state=active]:bg-background relative z-10 rounded-none border-0 data-[state=active]:shadow-none flex items-center gap-3 px-6 py-4 font-medium text-muted-foreground data-[state=active]:text-foreground transition-colors duration-200"
                          >
                            <IconComponent className="h-5 w-5" />
                            {tab.name}
                          </TabsTrigger>
                        );
                      })}

                      <motion.div
                        className="bg-primary absolute bottom-0 z-20 h-0.5"
                        layoutId="underline"
                        style={{
                          left: underlineStyle.left,
                          width: underlineStyle.width,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 40,
                        }}
                      />
                    </TabsList>

                    <AnimatePresence mode="wait">
                      <TabsContent value="profile" className="mt-0">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.4, ease: "easeInOut" }}
                        >
                          <ProfileForm
                            profile={profileResponse.profile}
                            onSuccess={() => refetch()}
                          />
                        </motion.div>
                      </TabsContent>
                      {/* 
                      <TabsContent value="password" className="mt-0">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.4, ease: "easeInOut" }}
                        >
                          <PasswordForm />
                        </motion.div>
                      </TabsContent> */}
                    </AnimatePresence>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Settings Tabs */}
          </div>
        )}
      </div>
    </div>
  );
}
