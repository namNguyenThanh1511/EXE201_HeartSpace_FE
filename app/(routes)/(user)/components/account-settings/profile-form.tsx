"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format, parse } from "date-fns";
import { useState } from "react";
import { Loader2, CheckCircle2, CircleAlert } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { ControllerRenderProps } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { User, UserUpdatingRequest, ConsultantProfile } from "@/services/api/user-service";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateProfile } from "@/hooks/services/use-user-service";
import { useAuthStore } from "@/store/zustand/auth-store";

// Tạo schema validation phù hợp với User
const profileFormSchema = z.object({
  fullName: z.string().optional(),
  email: z.string().email("Email không hợp lệ"),
  bio: z.string().optional(),
  phoneNumber: z.string().optional(),
  userName: z.string().optional(),
  dateOfBirth: z.string().optional(),
  identifier: z.string().optional(),
  avatar: z.string().optional(),
  gender: z.boolean().optional(),
  consultantInfo: z
    .object({
      specialization: z.string().optional(),
      experienceYears: z.number().min(0).optional(),
      hourlyRate: z.number().min(0).optional(),
      certifications: z.string().optional(),
      consultingIn: z
        .array(
          z.object({
            id: z.string(),
            name: z.string(),
            description: z.string(),
          })
        )
        .optional(),
    })
    .optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
  profile: User;
  onSuccess?: () => void;
  onCancel?: () => void;
}

// Utility function to create birthdate string
export const isValidVNPhone = (phone: string): boolean => {
  if (!phone) return true; // Cho phép trống
  if (!/^\d+$/.test(phone)) return false; // chỉ chữ số
  if (!phone.startsWith("0")) return false; // bắt đầu bằng 0
  if (phone.length !== 10) return false; // đủ 10 số
  return true;
};

function BirthdateField({
  field,
}: {
  field: ControllerRenderProps<ProfileFormValues, "dateOfBirth">;
}) {
  const parseBirthdate = (dateString: string | undefined): Date | undefined => {
    if (!dateString) return undefined;

    try {
      // Handle ISO format from API (e.g., "2003-08-21T17:00:00Z")
      if (dateString.includes("T")) {
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? undefined : date;
      }

      // Handle simple date format (e.g., "2003-08-21")
      const parsed = parse(dateString, "yyyy-MM-dd", new Date());
      return isNaN(parsed.getTime()) ? undefined : parsed;
    } catch (error) {
      console.error("Error parsing birthdate:", error);
      return undefined;
    }
  };

  return (
    <FormItem className="flex flex-col">
      <FormLabel>Ngày sinh</FormLabel>
      <FormControl>
        <Input
          type="date"
          value={field.value || ""}
          onChange={(e) => field.onChange(e.target.value)}
          max={format(new Date(), "yyyy-MM-dd")}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}

function FieldLabelWithStatus({
  label,
  verified,
  icon,
  hint,
}: {
  label: string;
  verified: boolean;
  icon?: React.ReactNode;
  hint?: string;
}) {
  const Badge = (
    <div
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium
        ${verified ? "border-emerald-500 text-emerald-600" : "border-amber-500 text-amber-600"}`}
      aria-label={verified ? "Đã xác thực" : "Chưa xác thực"}
    >
      {verified ? (
        <CheckCircle2 className="h-3.5 w-3.5" />
      ) : (
        <CircleAlert className="h-3.5 w-3.5" />
      )}
      <span>{verified ? "Đã xác thực" : "Chưa xác thực"}</span>
    </div>
  );

  return (
    <div className="flex items-center gap-2">
      {icon}
      <FormLabel className="m-0">{label}</FormLabel>

      {hint ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{Badge}</TooltipTrigger>
            <TooltipContent side="top">{hint}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        Badge
      )}
    </div>
  );
}

export function ProfileForm({ profile, onSuccess, onCancel }: ProfileFormProps) {
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const { user } = useAuthStore();

  // Khởi tạo form với giá trị từ profile
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: profile.fullName || "",
      email: profile.email || "",
      bio: profile.bio || "",
      phoneNumber: profile.phoneNumber || "",
      userName: profile.userName || "",
      dateOfBirth: profile.dateOfBirth || "",
      identifier: profile.identifier || "",
      avatar: profile.avatar || "",
      gender: profile.gender ?? true,
      consultantInfo: {
        specialization: profile.consultantInfo?.specialization || "",
        experienceYears: profile.consultantInfo?.experienceYears || 0,
        hourlyRate: profile.consultantInfo?.hourlyRate || 0,
        certifications: profile.consultantInfo?.certifications || "",
        consultingIn: profile.consultantInfo?.consultingIn || [],
      },
    },
  });

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      // Validate phone number if provided
      if (values.phoneNumber && values.phoneNumber.trim() !== "") {
        if (!isValidVNPhone(values.phoneNumber)) {
          toast.error("Số điện thoại không hợp lệ (phải có 10 chữ số, đúng đầu số VN)");
          return;
        }
      }

      // Chuẩn bị dữ liệu để gửi lên API - chỉ gửi các field có thay đổi
      const profileData: Partial<UserUpdatingRequest> = {};

      // Chỉ thêm các field có giá trị thay đổi so với giá trị ban đầu
      if (values.fullName !== profile.fullName) profileData.fullName = values.fullName;
      if (values.email !== profile.email) profileData.email = values.email;
      if (values.bio !== profile.bio) profileData.bio = values.bio;
      if (values.phoneNumber !== profile.phoneNumber) profileData.phoneNumber = values.phoneNumber;
      if (values.userName !== profile.userName) profileData.userName = values.userName;
      if (values.dateOfBirth !== profile.dateOfBirth) profileData.dateOfBirth = values.dateOfBirth;
      if (values.identifier !== profile.identifier) profileData.identifier = values.identifier;
      if (values.avatar !== profile.avatar) profileData.avatar = values.avatar;
      if (values.gender !== profile.gender) profileData.gender = values.gender;

      // Thêm thông tin consultant nếu role là consultant và có thay đổi
      if (user?.role.toLowerCase() === "consultant" && values.consultantInfo) {
        const currentConsultantInfo = profile.consultantInfo || {
          specialization: "",
          experienceYears: 0,
          hourlyRate: 0,
          certifications: "",
          consultingIn: [],
        };

        const consultantInfoChanged =
          values.consultantInfo.specialization !== currentConsultantInfo.specialization ||
          values.consultantInfo.experienceYears !== currentConsultantInfo.experienceYears ||
          values.consultantInfo.hourlyRate !== currentConsultantInfo.hourlyRate ||
          values.consultantInfo.certifications !== currentConsultantInfo.certifications ||
          JSON.stringify(values.consultantInfo.consultingIn) !==
            JSON.stringify(currentConsultantInfo.consultingIn);

        if (consultantInfoChanged) {
          profileData.consultantInfo = {
            specialization: values.consultantInfo.specialization || "",
            experienceYears: values.consultantInfo.experienceYears || 0,
            hourlyRate: values.consultantInfo.hourlyRate || 0,
            certifications: values.consultantInfo.certifications || "",
            consultingsAt:
              values.consultantInfo.consultingIn?.map((consulting) => parseInt(consulting.id)) ||
              [],
          };
        }
      }

      // Chỉ gửi request nếu có ít nhất một field thay đổi
      if (Object.keys(profileData).length === 0) {
        toast.info("Không có thay đổi nào để cập nhật");
        return;
      }

      updateProfile(profileData, {
        onSuccess: (data) => {
          if (data.isSuccess) {
            toast.success(data.message || "Cập nhật thông tin thành công");
            onSuccess?.();
          } else {
            toast.error(data.message || "Có lỗi xảy ra khi cập nhật thông tin");
          }
        },
        onError: (error: any) => {
          console.error("Update profile error:", error);
          toast.error(error.message || "Có lỗi xảy ra khi cập nhật thông tin");
        },
      });
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Đã xảy ra lỗi khi gửi form.");
    }
  };

  const [linkTarget, setLinkTarget] = useState<"email" | "phone" | null>(null);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Họ và tên</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập họ và tên" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="userName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên người dùng</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tên người dùng" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => {
              const hasEmail = !!(field.value && field.value.trim());
              const verified = hasEmail;
              return (
                <FormItem>
                  <FieldLabelWithStatus
                    label="Email"
                    verified={verified}
                    hint={
                      verified ? "Email đã liên kết tài khoản" : "Nhấn Thêm mới để liên kết email"
                    }
                  />
                  <FormControl>
                    <Input type="email" placeholder="Nhập email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => {
              const hasPhone = !!(field.value && field.value.trim());
              const verified = hasPhone;
              return (
                <FormItem>
                  <FieldLabelWithStatus
                    label="Số điện thoại"
                    verified={verified}
                    hint={
                      verified
                        ? "Số điện thoại đã liên kết tài khoản"
                        : "Nhấn Thêm mới để liên kết số điện thoại"
                    }
                  />
                  <FormControl>
                    <Input placeholder="Nhập số điện thoại" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => <BirthdateField field={field} />}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giới tính</FormLabel>
                <FormControl>
                  <RadioGroup
                    value={field.value?.toString()} // Convert boolean to string for RadioGroup
                    onValueChange={(value) => {
                      // Convert string back to boolean
                      if (value === "true") {
                        field.onChange(true);
                      } else if (value === "false") {
                        field.onChange(false);
                      }
                    }}
                    className="flex gap-4"
                  >
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value="true" />
                      </FormControl>
                      <FormLabel className="font-normal">Nam</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value="false" />
                      </FormControl>
                      <FormLabel className="font-normal">Nữ</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="identifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CMND/CCCD</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập số CMND/CCCD" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tiểu sử (Bio)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tiểu sử ngắn gọn..."
                  className="min-h-20 resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Consultant Information Section - Chỉ hiển thị nếu role là consultant */}
        {user?.role.toLowerCase() === "consultant" && (
          <div className="space-y-6 border-t pt-6">
            <h3 className="text-lg font-semibold">Thông tin tư vấn viên</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="consultantInfo.specialization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chuyên môn</FormLabel>
                    <FormControl>
                      <Input placeholder="Chuyên môn chính" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="consultantInfo.experienceYears"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số năm kinh nghiệm</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        min="0"
                        max="50"
                        {...field}
                        onChange={(e) =>
                          field.onChange(e.target.value ? parseInt(e.target.value) : 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="consultantInfo.hourlyRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mức phí theo giờ (VND)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        min="0"
                        {...field}
                        onChange={(e) =>
                          field.onChange(e.target.value ? parseInt(e.target.value) : 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="consultantInfo.certifications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chứng chỉ</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Các chứng chỉ có được..."
                        className="min-h-20 resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Hiển thị danh sách lĩnh vực tư vấn (read-only) */}
            {form.watch("consultantInfo.consultingIn") &&
              form.watch("consultantInfo.consultingIn")!.length > 0 && (
                <FormItem>
                  <FormLabel>Lĩnh vực tư vấn</FormLabel>
                  <div className="space-y-2">
                    {form.watch("consultantInfo.consultingIn")!.map((consulting) => (
                      <div
                        key={consulting.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{consulting.name}</p>
                          <p className="text-sm text-muted-foreground">{consulting.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
          </div>
        )}

        <div className="flex gap-3 justify-end pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
              Hủy
            </Button>
          )}
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang lưu
              </>
            ) : (
              "Lưu thay đổi"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
