"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Star,
  MapPin,
  Briefcase,
  Quote,
  CheckCircle2,
  Calendar,
  Mail,
  Phone,
  Award,
  Clock,
} from "lucide-react";

import { useParams } from "next/navigation";
import { useConsultant } from "@/hooks/services/use-consultant-service";
import { BookingModal } from "@/components/features/user/booking-modal";

// Mock data for fields not available in API
const mockData = {
  rating: 5.0,
  totalRatings: 10,
  location: "Việt Nam",
  testimonials: [
    {
      id: "1",
      author: "Sarah Jones",
      role: "Tech Founder",
      content:
        "LittleClean is a lifesaver! My baby schedule doesn't leave time for cleaning, but their reliable service has. The cleaners are professional and trustworthy, and booking online is a breeze.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop",
    },
    {
      id: "2",
      author: "David Miller",
      role: "Family Man",
      content:
        "With kids and pets, keeping our house clean felt impossible. LittleClean changed the game! They come in and it's amazing to come home to a spotless haven after a long day.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop",
    },
  ],
  projectsCompleted: [
    {
      id: "1",
      clientName: "Ethan De Jong",
      tags: ["Sustainability", "Fashion"],
      description:
        "This project aims to conduct a comprehensive Life Cycle Assessment (LCA) for various textile products, and implement impact reduction and sustainable practices in the fashion industry.",
    },
  ],
  companies: [
    { name: "Handshake", logo: "https://via.placeholder.com/100x40/6366f1/ffffff?text=Handshake" },
    { name: "Dribbble", logo: "https://via.placeholder.com/100x40/ea4c89/ffffff?text=Dribbble" },
    { name: "Github", logo: "https://via.placeholder.com/100x40/181717/ffffff?text=Github" },
  ],
  skills: [
    "Communicate Your Work",
    "Increase Capacity",
    "Take Action",
    "Get Certified",
    "Get Compliant",
    "Build a Strategy",
  ],
  aboutText: `Rick is a seasoned strategy consultant and leader in sustainable business
  practices. With a strong commitment to change, he primarily serves as an advisor
  to C-suite and board-level professionals. Rick's expertise lies in helping
  companies build or refine robust climate-resilience and sustainability strategies,
  grounded in all regulations. His worldview extends beyond standard corporate (s):
  encouraging (a) recognizing and responsible; he firmly be embedded throughout the
  entire organization—from operations to leadership—recognizing that genuine impact
  requires holistic integration.

  He offers strategic guidance to clients, enabling rapid action within the
  ever-changing regulatory landscape. Rick is passionate about transforming how
  companies engage with sustainability.`,
};

export default function ConsultantProfile() {
  const { id } = useParams();
  const { data: consultantResponse, isLoading, error } = useConsultant(id as string);
  const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const consultant = consultantResponse?.data;

  const formatHourlyRate = (rate: number | null) => {
    if (!rate) return "Chưa cập nhật";
    return `${rate.toLocaleString()} VND/giờ`;
  };

  const formatSchedule = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    return `${start.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "short",
    })} • ${start.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    })} - ${end.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-slate-700 text-lg">Đang tải thông tin...</div>
      </div>
    );
  }

  if (error || !consultant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-red-500 text-lg">Không tìm thấy thông tin tư vấn viên</div>
      </div>
    );
  }

  const getSelectedSchedule = () => {
    if (!selectedSchedule || !consultant) return null;
    return consultant.freeSchedules.find((schedule) => schedule.id === selectedSchedule);
  };

  const selectedScheduleData = getSelectedSchedule();

  const handleBookAppointment = () => {
    if (!selectedSchedule) return;
    setIsBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-200/30 via-transparent to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <Card className="bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl shadow-xl mb-6">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              {/* Avatar */}
              <div className="relative">
                <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-white/30 shadow-2xl ring-4 ring-blue-300/20 backdrop-blur-sm">
                  <AvatarImage src={consultant.avatar || ""} alt={consultant.fullName} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-3xl font-bold">
                    {consultant.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {/* Online indicator */}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 border-2 border-white rounded-full shadow-lg" />
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">
                    {consultant.fullName}
                  </h1>
                  {consultant.isActive && (
                    <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border border-white/20 backdrop-blur-sm">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>

                <p className="text-slate-600 text-lg mb-4 max-w-3xl">
                  {consultant.bio || "Chưa có giới thiệu"}
                </p>

                <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-2 bg-white/30 backdrop-blur-sm rounded-full px-3 py-1 border border-white/40">
                    <Mail className="w-4 h-4 text-blue-500" />
                    <span>{consultant.email}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/30 backdrop-blur-sm rounded-full px-3 py-1 border border-white/40">
                    <Phone className="w-4 h-4 text-blue-500" />
                    <span>{consultant.phoneNumber}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/30 backdrop-blur-sm rounded-full px-3 py-1 border border-white/40">
                    <Briefcase className="w-4 h-4 text-blue-500" />
                    <span>
                      {consultant.consultantInfo.specialization || "Chưa cập nhật chuyên môn"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            {
              icon: Briefcase,
              value: formatHourlyRate(consultant.consultantInfo.hourlyRate),
              label: "Mức phí",
              color: "text-blue-500",
              bg: "from-blue-500/10 to-blue-600/10",
            },
            {
              icon: Star,
              value: mockData.rating,
              label: `${mockData.totalRatings} Đánh giá`,
              color: "text-yellow-500",
              bg: "from-yellow-500/10 to-amber-500/10",
            },
            {
              icon: MapPin,
              value: mockData.location,
              label: "Hồ Chí Minh",
              color: "text-green-500",
              bg: "from-green-500/10 to-emerald-500/10",
            },
          ].map((stat, index) => (
            <Card
              key={index}
              className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg"
            >
              <CardContent className="p-6 text-center">
                <div
                  className={`bg-gradient-to-br ${stat.bg} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-white/30`}
                >
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div className="text-2xl font-bold text-slate-800 mb-1">{stat.value}</div>
                <div className="text-sm text-slate-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <Card className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Giới thiệu</h2>
                <p className="text-slate-700 leading-relaxed mb-4">{mockData.aboutText}</p>

                {consultant.consultantInfo.consultingIn.length > 0 && (
                  <>
                    <div className="text-lg font-semibold text-slate-800 mb-3">
                      Lĩnh vực tư vấn:
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {consultant.consultantInfo.consultingIn.map((category) => (
                        <Badge
                          key={category.id}
                          className="bg-white/30 backdrop-blur-md text-slate-700 border border-white/40 hover:bg-white/40 transition-all duration-200"
                          title={category.description}
                        >
                          {category.name}
                        </Badge>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Testimonials */}
            <Card className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Đánh giá từ khách hàng</h2>
                <div className="space-y-6">
                  {mockData.testimonials.map((testimonial) => (
                    <div
                      key={testimonial.id}
                      className="bg-white/30 backdrop-blur-md rounded-2xl p-6 border border-white/40 shadow-sm"
                    >
                      <Quote className="w-8 h-8 text-purple-500 mb-3" />
                      <div className="flex items-start gap-4">
                        <Avatar className="w-12 h-12 flex-shrink-0 border-2 border-white/50 shadow-md">
                          <AvatarImage src={testimonial.avatar} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                            {testimonial.author[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-bold text-slate-800 mb-1">{testimonial.author}</div>
                          <div className="text-sm text-slate-600 mb-3">{testimonial.role}</div>
                          <p className="text-slate-700 leading-relaxed">{testimonial.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Projects Completed */}
            <Card className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Dự án đã hoàn thành</h2>
                {mockData.projectsCompleted.map((project) => (
                  <div
                    key={project.id}
                    className="bg-white/30 backdrop-blur-md rounded-2xl p-6 border border-white/40 shadow-sm mb-4 last:mb-0"
                  >
                    <h3 className="text-xl font-bold text-slate-800 mb-3">{project.clientName}</h3>
                    <div className="flex gap-2 mb-4">
                      {project.tags.map((tag, idx) => (
                        <Badge
                          key={idx}
                          className="bg-white/40 backdrop-blur-md text-slate-700 border border-white/50"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-slate-700 leading-relaxed">{project.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Companies */}
            <Card className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Đối tác</h2>
                <div className="flex flex-wrap gap-8 items-center justify-center">
                  {mockData.companies.map((company, idx) => (
                    <div
                      key={idx}
                      className="grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer bg-white/30 backdrop-blur-sm rounded-xl p-4 border border-white/40 shadow-sm"
                    >
                      <img src={company.logo} alt={company.name} className="h-8" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border border-white/20 backdrop-blur-sm">
                    Đã xác thực
                  </Badge>
                  <span className="text-xl font-bold text-slate-800">Tôi có thể hỗ trợ bạn</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {mockData.skills.map((skill, idx) => (
                    <Badge
                      key={idx}
                      className="bg-white/30 backdrop-blur-md text-slate-700 border border-white/40 hover:bg-white/40 transition-all duration-200 shadow-sm"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Thông tin nhanh</h3>
                <div className="space-y-4">
                  {[
                    {
                      icon: Award,
                      label: "Kinh nghiệm",
                      value: `${consultant.consultantInfo.experienceYears} năm`,
                      color: "text-purple-500",
                    },
                    {
                      icon: CheckCircle2,
                      label: "Chứng chỉ",
                      value: consultant.consultantInfo.certifications || "Chưa cập nhật",
                      color: "text-green-500",
                    },
                    {
                      icon: Briefcase,
                      label: "Chuyên môn",
                      value: consultant.consultantInfo.specialization || "Chưa cập nhật",
                      color: "text-blue-500",
                    },
                    {
                      icon: Calendar,
                      label: "Tham gia từ",
                      value: new Date(consultant.createdAt).toLocaleDateString("vi-VN"),
                      color: "text-orange-500",
                    },
                  ].map((item, index) => (
                    <div key={index}>
                      <div className="flex items-start gap-3">
                        <div
                          className={`bg-gradient-to-br ${item.color.replace(
                            "text-",
                            ""
                          )}/10 rounded-xl p-2 border border-white/30`}
                        >
                          <item.icon className={`w-5 h-5 ${item.color}`} />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-slate-600">{item.label}</div>
                          <div className="text-slate-800 font-semibold text-sm">{item.value}</div>
                        </div>
                      </div>
                      {index < 3 && <Separator className="bg-white/30 my-4" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Available Schedules */}
            <Card className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl p-2 border border-white/30">
                    <Calendar className="w-5 h-5 text-blue-500" />
                  </div>
                  Lịch trống
                </h3>

                {consultant?.freeSchedules.filter((schedule) => schedule.isAvailable).length > 0 ? (
                  <>
                    <div className="space-y-3 mb-6">
                      {consultant.freeSchedules
                        .filter((schedule) => schedule.isAvailable)
                        .map((schedule) => (
                          <button
                            key={schedule.id}
                            onClick={() => setSelectedSchedule(schedule.id)}
                            className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 backdrop-blur-sm ${
                              selectedSchedule === schedule.id
                                ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-400 text-slate-800 shadow-lg shadow-blue-500/25"
                                : "bg-white/30 border-white/40 text-slate-700 hover:border-blue-300 hover:bg-white/40"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`p-2 rounded-full backdrop-blur-sm ${
                                  selectedSchedule === schedule.id
                                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                                    : "bg-white/50 text-slate-600"
                                }`}
                              >
                                <Clock className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="font-medium">
                                  {formatSchedule(schedule.startTime, schedule.endTime)}
                                </div>
                                <div className="text-sm opacity-75">Thời lượng: 1 giờ</div>
                              </div>
                            </div>
                          </button>
                        ))}
                    </div>

                    <Button
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-6 text-lg font-semibold shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl border border-white/20 backdrop-blur-sm"
                      disabled={!selectedSchedule}
                      onClick={handleBookAppointment}
                      size="lg"
                    >
                      {selectedSchedule ? "Đặt lịch tư vấn" : "Chọn khung giờ"}
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="bg-gradient-to-br from-slate-500/10 to-slate-600/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-white/30">
                      <Calendar className="w-8 h-8 text-slate-500" />
                    </div>
                    <p className="text-slate-600 text-lg">Hiện không có lịch trống</p>
                    <p className="text-slate-500 text-sm mt-1">
                      Vui lòng quay lại sau hoặc liên hệ trực tiếp với tư vấn viên
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Booking Modal */}
            {selectedScheduleData && consultant && (
              <BookingModal
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                scheduleId={selectedScheduleData.id}
                consultantId={consultant.id}
                scheduleTime={formatSchedule(
                  selectedScheduleData.startTime,
                  selectedScheduleData.endTime
                )}
                consultantName={consultant.fullName}
                consultantSpecialization={consultant.consultantInfo.specialization}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
