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
  rating: 4.9,
  totalRatings: 70,
  location: "United Kingdom",
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-lg">Đang tải thông tin...</div>
      </div>
    );
  }

  if (error || !consultant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-400 text-lg">Không tìm thấy thông tin tư vấn viên</div>
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
    <div className="min-h-screen relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <Card className="bg-transparent backdrop-blur-sm border border-slate-700/50 mb-6">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              {/* Avatar */}
              <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-slate-700/50 shadow-xl ring-4 ring-purple-500/20">
                <AvatarImage src={consultant.avatar || ""} alt={consultant.fullName} />
                <AvatarFallback className="text-white text-3xl font-bold">
                  {consultant.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-3xl sm:text-4xl font-bold text-white">
                    {consultant.fullName}
                  </h1>
                  {consultant.isActive && (
                    <Badge className="bg-blue-600 text-white">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Đang hoạt động
                    </Badge>
                  )}
                </div>

                <p className="text-slate-300 text-lg mb-4 max-w-3xl">
                  {consultant.bio || "Chưa có giới thiệu"}
                </p>

                <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{consultant.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{consultant.phoneNumber}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
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
          <Card className="bg-transparent backdrop-blur-sm border border-slate-700/50">
            <CardContent className="p-6 text-center">
              <Briefcase className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white mb-1">
                {formatHourlyRate(consultant.consultantInfo.hourlyRate)}
              </div>
              <div className="text-sm text-slate-400">Mức phí</div>
            </CardContent>
          </Card>

          <Card className="bg-transparent backdrop-blur-sm border border-slate-700/50">
            <CardContent className="p-6 text-center">
              <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2 fill-yellow-400" />
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-2xl font-bold text-white">{mockData.rating}</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(mockData.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-slate-600"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="text-sm text-slate-400">{mockData.totalRatings} Đánh giá</div>
            </CardContent>
          </Card>

          <Card className="bg-transparent backdrop-blur-sm border border-slate-700/50">
            <CardContent className="p-6 text-center">
              <MapPin className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white mb-1">{mockData.location}</div>
              <div className="text-sm text-slate-400">Địa điểm</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <Card className="bg-transparent backdrop-blur-sm border border-slate-700/50">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-white mb-4">Giới thiệu</h2>
                <p className="text-slate-300 leading-relaxed mb-4">{mockData.aboutText}</p>

                {consultant.consultantInfo.consultingIn.length > 0 && (
                  <>
                    <div className="text-lg font-semibold text-white mb-3">Lĩnh vực tư vấn:</div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {consultant.consultantInfo.consultingIn.map((category) => (
                        <Badge
                          key={category.id}
                          className="bg-slate-700 text-slate-200 hover:bg-slate-600"
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
            <Card className="bg-transparent backdrop-blur-sm border border-slate-700/50">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Đánh giá từ khách hàng</h2>
                <div className="space-y-6">
                  {mockData.testimonials.map((testimonial) => (
                    <div
                      key={testimonial.id}
                      className="bg-slate-900/50 rounded-lg p-6 border border-slate-700/30"
                    >
                      <Quote className="w-8 h-8 text-purple-400 mb-3" />
                      <div className="flex items-start gap-4">
                        <Avatar className="w-12 h-12 flex-shrink-0">
                          <AvatarImage src={testimonial.avatar} />
                          <AvatarFallback>{testimonial.author[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-bold text-white mb-1">{testimonial.author}</div>
                          <div className="text-sm text-slate-400 mb-3">{testimonial.role}</div>
                          <p className="text-slate-300 leading-relaxed">{testimonial.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Projects Completed */}
            <Card className="bg-transparent backdrop-blur-sm border border-slate-700/50">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Dự án đã hoàn thành</h2>
                {mockData.projectsCompleted.map((project) => (
                  <div
                    key={project.id}
                    className="bg-slate-900/50 rounded-lg p-6 border border-slate-700/30"
                  >
                    <h3 className="text-xl font-bold text-white mb-3">{project.clientName}</h3>
                    <div className="flex gap-2 mb-4">
                      {project.tags.map((tag, idx) => (
                        <Badge key={idx} className="bg-slate-700 text-slate-200">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-slate-300 leading-relaxed">{project.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Companies */}
            <Card className="bg-transparent backdrop-blur-sm border border-slate-700/50">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Đối tác</h2>
                <div className="flex flex-wrap gap-8 items-center justify-center">
                  {mockData.companies.map((company, idx) => (
                    <div
                      key={idx}
                      className="grayscale hover:grayscale-0 transition-all cursor-pointer"
                    >
                      <img src={company.logo} alt={company.name} className="h-10" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="bg-transparent backdrop-blur-sm border border-slate-700/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Badge className="bg-orange-500 text-white">Đã xác thực</Badge>
                  <span className="text-xl font-bold text-white">Tôi có thể hỗ trợ bạn</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {mockData.skills.map((skill, idx) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
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
            <Card className="bg-transparent backdrop-blur-sm border border-slate-700/50">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">Thông tin nhanh</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-purple-400 mt-1" />
                    <div>
                      <div className="text-sm text-slate-400">Kinh nghiệm</div>
                      <div className="text-white font-semibold">
                        {consultant.consultantInfo.experienceYears} năm
                      </div>
                    </div>
                  </div>
                  <Separator className="bg-slate-700" />
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400 mt-1" />
                    <div>
                      <div className="text-sm text-slate-400">Chứng chỉ</div>
                      <div className="text-white font-semibold text-sm">
                        {consultant.consultantInfo.certifications || "Chưa cập nhật"}
                      </div>
                    </div>
                  </div>
                  <Separator className="bg-slate-700" />
                  <div className="flex items-start gap-3">
                    <Briefcase className="w-5 h-5 text-blue-400 mt-1" />
                    <div>
                      <div className="text-sm text-slate-400">Chuyên môn</div>
                      <div className="text-white font-semibold">
                        {consultant.consultantInfo.specialization || "Chưa cập nhật"}
                      </div>
                    </div>
                  </div>
                  <Separator className="bg-slate-700" />
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-orange-400 mt-1" />
                    <div>
                      <div className="text-sm text-slate-400">Tham gia từ</div>
                      <div className="text-white font-semibold">
                        {new Date(consultant.createdAt).toLocaleDateString("vi-VN")}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Available Schedules */}
            <Card className="bg-transparent backdrop-blur-sm border border-slate-700/50">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-400" />
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
                            className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                              selectedSchedule === schedule.id
                                ? "bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/25"
                                : "bg-slate-800/30 border-slate-600 text-slate-300 hover:border-slate-500 hover:bg-slate-700/30"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`p-2 rounded-full ${
                                  selectedSchedule === schedule.id ? "bg-blue-500" : "bg-slate-600"
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
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 text-lg font-semibold shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!selectedSchedule}
                      onClick={handleBookAppointment}
                      size="lg"
                    >
                      {selectedSchedule ? "Đặt lịch tư vấn" : "Chọn khung giờ"}
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400 text-lg">Hiện không có lịch trống</p>
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
