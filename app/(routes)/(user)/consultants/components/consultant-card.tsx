import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MoreVertical, CheckCircle2, Flame } from "lucide-react";

interface ConsultingCategory {
  id: string;
  name: string;
  description: string;
}

interface ConsultantInfo {
  specialization: string;
  experienceYears: number;
  hourlyRate: number | null;
  certifications: string | null;
  consultingIn: ConsultingCategory[];
}

interface FreeSchedule {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface Consultant {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  gender: boolean;
  bio: string;
  avatar: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
  consultantInfo: ConsultantInfo;
  freeSchedules: FreeSchedule[];
}

interface ConsultantCardProps {
  consultant: Consultant;
  onMoreClick?: (consultant: Consultant) => void;
}

export function ConsultantCard({ consultant, onMoreClick }: ConsultantCardProps) {
  // Format hourly rate for display
  const formatHourlyRate = (rate: number | null) => {
    if (rate == null) return "Chưa cập nhật";

    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(rate);
  };

  // Default rating to 5 stars
  const rating = 5;
  const totalRatings = consultant.freeSchedules.filter((s) => s.isAvailable).length * 10 || 70;

  return (
    <Card className="relative overflow-hidden bg-transparent backdrop-blur-sm border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10">
      <CardContent className="p-5">
        {/* Price Tag */}
        {consultant.consultantInfo.hourlyRate && (
          <div className="absolute top-4 left-4 z-10">
            <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-3 py-1.5 text-sm shadow-lg">
              {formatHourlyRate(consultant.consultantInfo.hourlyRate) + "/giờ"}
            </Badge>
          </div>
        )}

        {/* More Options */}
        <button
          onClick={() => onMoreClick?.(consultant)}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-700/50 hover:bg-slate-600/50 transition-colors"
        >
          <MoreVertical className="w-4 h-4 text-slate-300" />
        </button>

        {/* Avatar */}
        <div className="flex flex-col items-center mt-8 mb-4">
          <Avatar className="w-24 h-24 border-4 border-slate-700/50 shadow-xl ring-2 ring-purple-500/20">
            <AvatarImage
              src={consultant.avatar || ""}
              alt={consultant.fullName}
              className="object-cover"
            />
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-2xl font-bold">
              {consultant.fullName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          {/* Verified Badge */}
          <div className="flex gap-2 mt-3">
            {consultant.isActive && (
              <Badge className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 flex items-center gap-1.5 shadow-md">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified
              </Badge>
            )}
          </div>
        </div>

        {/* Name */}
        <div className="text-center mb-3">
          <h3 className="text-xl font-bold text-white mb-2">{consultant.fullName}</h3>
          <p className="text-sm text-slate-300 leading-relaxed line-clamp-2 px-2">
            {consultant.bio || "Chưa có giới thiệu"}
          </p>
        </div>

        {/* Rating - Always 5 stars */}
        <div className="flex items-center justify-center gap-1.5 mb-4">
          <span className="text-lg font-bold text-white">{rating.toFixed(1)}</span>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <div className="text-xs text-slate-400 ml-1">{totalRatings} ratings</div>
        </div>

        {/* Category Tags */}
        {consultant.consultantInfo.consultingIn.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mb-3 min-h-[32px]">
            {consultant.consultantInfo.consultingIn.slice(0, 2).map((category) => (
              <Badge
                key={category.id}
                className="bg-slate-700/80 hover:bg-slate-600/80 text-slate-200 border-none text-xs px-3 py-1 font-normal"
                title={category.name}
              >
                {category.name}
              </Badge>
            ))}
            {consultant.consultantInfo.consultingIn.length > 2 && (
              <Badge className="bg-slate-600/80 text-slate-200 border-none text-xs px-3 py-1">
                +{consultant.consultantInfo.consultingIn.length - 2}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
