"use client";
import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MoreVertical, CheckCircle2 } from "lucide-react";

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

export function ConsultantCard({ consultant }: ConsultantCardProps) {
  const formatHourlyRate = (rate: number | null) => {
    if (rate == null) return "Chưa cập nhật";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(rate);
  };

  const rating = 5;
  const totalRatings = consultant.freeSchedules.filter((s) => s.isAvailable).length * 10 || 70;

  return (
    <Card className="relative overflow-hidden bg-white/20 backdrop-blur-md border border-white/30 hover:border-white/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-200/20 rounded-2xl group">
      <CardContent className="p-5">
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-200/10 to-purple-200/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Price Tag */}
        {consultant.consultantInfo.hourlyRate && (
          <div className="absolute top-4 left-4 z-10">
            <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-bold px-3 py-1.5 text-sm shadow-lg border border-white/20 backdrop-blur-sm">
              {formatHourlyRate(consultant.consultantInfo.hourlyRate) + "/giờ"}
            </Badge>
          </div>
        )}

        {/* More Options → Navigate to detail page */}
        <Link
          href={`/consultants/${consultant.id}`}
          className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-white/20 backdrop-blur-md hover:bg-white/30 border border-white/30 transition-all duration-300 shadow-sm hover:shadow-md"
        >
          <MoreVertical className="w-4 h-4 text-slate-700" />
        </Link>

        {/* Avatar */}
        <div className="flex flex-col items-center mt-8 mb-4">
          <div className="relative">
            <Avatar className="w-24 h-24 border-4 border-white/30 shadow-2xl ring-2 ring-blue-300/20 backdrop-blur-sm">
              <AvatarImage src={consultant.avatar || ""} alt={consultant.fullName} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-2xl font-bold">
                {consultant.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            {/* Online indicator */}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 border-2 border-white rounded-full shadow-lg" />
          </div>
        </div>

        <div className="text-center mb-3 relative z-10">
          <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-slate-900 transition-colors">
            {consultant.fullName}
          </h3>
          <p className="text-sm text-slate-600 line-clamp-2 px-2 group-hover:text-slate-700 transition-colors">
            {consultant.bio || "Chưa có giới thiệu"}
          </p>
        </div>

        {/* Rating */}
        <div className="flex items-center justify-center gap-1.5 mb-4 relative z-10">
          <span className="text-lg font-bold text-slate-800">{rating.toFixed(1)}</span>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400 drop-shadow-sm" />
            ))}
          </div>
          <div className="text-xs text-slate-600 ml-1">({totalRatings})</div>
        </div>

        {/* Experience */}
        <div className="text-center mb-4 relative z-10">
          <Badge className="bg-white/30 backdrop-blur-md text-slate-700 border border-white/40 text-xs px-3 py-1 font-medium">
            {consultant.consultantInfo.experienceYears} năm kinh nghiệm
          </Badge>
        </div>

        {/* Consulting tags */}
        {consultant.consultantInfo.consultingIn.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mb-3 min-h-[32px] relative z-10">
            {consultant.consultantInfo.consultingIn.slice(0, 2).map((category) => (
              <Badge
                key={category.id}
                className="bg-white/30 backdrop-blur-md hover:bg-white/40 text-slate-700 border border-white/40 text-xs px-3 py-1 font-normal transition-all duration-200 shadow-sm"
              >
                {category.name}
              </Badge>
            ))}
            {consultant.consultantInfo.consultingIn.length > 2 && (
              <Badge className="bg-white/20 backdrop-blur-md text-slate-600 border border-white/30 text-xs px-3 py-1">
                +{consultant.consultantInfo.consultingIn.length - 2}
              </Badge>
            )}
          </div>
        )}

        {/* Available slots */}
        <div className="text-center relative z-10">
          <div className="inline-flex items-center gap-1 bg-blue-500/10 backdrop-blur-sm rounded-full px-3 py-1 border border-blue-200/30">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-slate-600 font-medium">
              {consultant.freeSchedules.filter((s) => s.isAvailable).length} slot trống
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
