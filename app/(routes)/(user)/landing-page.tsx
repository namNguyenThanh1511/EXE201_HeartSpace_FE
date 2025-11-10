"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Home,
  Users,
  BookOpen,
  Calendar,
  MessageSquare,
  Star,
  Settings,
  HelpCircle,
  Search,
  Bell,
  Menu,
  X,
  MoreVertical,
  CheckCircle2,
  Flame,
  Video,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
  Heart,
} from "lucide-react";
import { Consultant, ConsultantCard } from "./consultants/components/consultant-card";
import { ConsultantList } from "./consultants/components/consultant-list";
import { useConsultants } from "@/hooks/services/use-consultant-service";

const testimonials = [
  {
    quote: "Nhờ tư vấn viên, tôi đã tự tin chọn ngành mơ ước và có kế hoạch rõ ràng!",
    author: "Phương Lan",
    role: "SV năm 2 ĐH Bách Khoa",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop",
  },
  {
    quote:
      "Buổi tư vấn giúp tôi vượt qua khủng hoảng năm nhất. Tôi học cách quản lý thời gian hiệu quả hơn.",
    author: "Minh Tuấn",
    role: "SV năm 1 ĐH Kinh Tế",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop",
  },
  {
    quote:
      "Tư vấn viên không chỉ tư vấn mà còn truyền cảm hứng. Tôi đã tìm được hướng đi cho tương lai!",
    author: "Thu Hà",
    role: "Học sinh lớp 12",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop",
  },
];

export default function HeartspaceLanding() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("consultants");
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const { data: consultantsResponse, isLoading, error } = useConsultants();
  const consultants = consultantsResponse?.data || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-slate-800">
      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {/* Hero Section */}
          <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
            {/* Glass morphism background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-3xl" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-200/30 via-transparent to-transparent" />

            <div className="relative max-w-7xl mx-auto text-center">
              <div className="bg-white/20 backdrop-blur-md rounded-3xl p-8 sm:p-12 border border-white/30 shadow-2xl shadow-blue-200/20 mb-8">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Heartspace –{" "}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Kết Nối Học Sinh, Sinh Viên
                  </span>
                  <br />
                  Với tư vấn viên Đáng Tin Cậy
                </h1>

                <p className="text-lg sm:text-xl text-slate-600 mb-10 max-w-3xl mx-auto">
                  Hỗ trợ định hướng nghề nghiệp, quản lý cảm xúc, phát triển bản thân – Tư vấn trực
                  tuyến từ <span className="font-bold text-green-600">60.000 VNĐ</span>
                </p>

                <Button className="bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/40 text-slate-700 text-lg px-8 py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                  Bắt Đầu Hành Trình
                </Button>
              </div>
            </div>
          </section>

          {/* Consultants Grid Section */}
          <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white/20 backdrop-blur-md rounded-3xl p-8 border border-white/30 shadow-lg mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-center">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Khám Phá Mạng Lưới
                  </span>{" "}
                  Tư vấn viên của chúng tôi
                </h2>
                <p className="text-slate-600 text-lg text-center">
                  Được tin tưởng bởi hàng ngàn học sinh và sinh viên
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
                <ConsultantList consultants={consultants} isLoading={isLoading} error={error} />
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <div className="bg-white/20 backdrop-blur-md rounded-3xl p-8 border border-white/30 inline-block">
                  <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Cách Heartspace
                    </span>{" "}
                    Hoạt Động
                  </h2>
                  <p className="text-slate-600 text-lg">3 bước đơn giản để bắt đầu hành trình</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    icon: Search,
                    title: "1. Chọn tư vấn viên",
                    description: "Tìm tư vấn viên theo chuyên mục và lịch rảnh phù hợp",
                    gradient: "from-blue-500 to-cyan-500",
                  },
                  {
                    icon: Video,
                    title: "2. Đặt Lịch Tư Vấn Trực Tuyến",
                    description: "Tham gia qua Zoom, gửi feedback sau buổi tư vấn",
                    gradient: "from-purple-500 to-pink-500",
                  },
                  {
                    icon: Calendar,
                    title: "3. Thanh Toán",
                    description: "Thanh toán qua QR code",
                    gradient: "from-green-500 to-emerald-500",
                  },
                ].map((step, index) => (
                  <Card
                    key={index}
                    className="bg-white/20 backdrop-blur-md border border-white/30 hover:border-white/50 transition-all duration-300 rounded-2xl shadow-lg hover:shadow-xl"
                  >
                    <CardContent className="p-6 text-center">
                      <div
                        className={`bg-gradient-to-br ${step.gradient} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
                      >
                        <step.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-slate-800">{step.title}</h3>
                      <p className="text-slate-600">{step.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <div className="bg-white/20 backdrop-blur-md rounded-3xl p-8 border border-white/30 inline-block">
                  <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                    Phản Hồi Từ{" "}
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Học Sinh & Sinh Viên
                    </span>
                  </h2>
                </div>
              </div>

              <Card className="bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                <CardContent className="p-8 sm:p-12 relative z-10">
                  <div className="flex justify-center mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-8 h-8 fill-yellow-400 text-yellow-400 drop-shadow-sm"
                      />
                    ))}
                  </div>
                  <p className="text-xl text-center text-slate-700 italic mb-8 leading-relaxed">
                    &quot;{testimonials[currentTestimonial].quote}&quot;
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <Avatar className="w-16 h-16 border-2 border-white/50 shadow-lg">
                      <AvatarImage src={testimonials[currentTestimonial].avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                        {testimonials[currentTestimonial].author[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-slate-800">
                        {testimonials[currentTestimonial].author}
                      </p>
                      <p className="text-sm text-slate-600">
                        {testimonials[currentTestimonial].role}
                      </p>
                    </div>
                  </div>
                </CardContent>

                <button
                  onClick={() =>
                    setCurrentTestimonial((prev) =>
                      prev === 0 ? testimonials.length - 1 : prev - 1
                    )
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/30 backdrop-blur-md hover:bg-white/40 rounded-full transition-all duration-300 border border-white/40 shadow-lg z-20"
                >
                  <ChevronLeft className="w-5 h-5 text-slate-700" />
                </button>
                <button
                  onClick={() =>
                    setCurrentTestimonial((prev) =>
                      prev === testimonials.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/30 backdrop-blur-md hover:bg-white/40 rounded-full transition-all duration-300 border border-white/40 shadow-lg z-20"
                >
                  <ChevronRight className="w-5 h-5 text-slate-700" />
                </button>
              </Card>

              <div className="flex justify-center gap-2 mt-6">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentTestimonial(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentTestimonial === idx
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 w-8 shadow-lg"
                        : "bg-white/30 backdrop-blur-md w-2 border border-white/40"
                    }`}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="bg-white/20 backdrop-blur-md rounded-3xl p-8 border border-white/30 inline-block">
                  <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Chọn Gói Tư Vấn
                    </span>{" "}
                    Phù Hợp
                  </h2>
                  <p className="text-slate-600 text-lg">
                    Bắt đầu hành trình phát triển của bạn ngay hôm nay
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Package 1: 30 minutes */}
                <Card className="bg-white/20 backdrop-blur-md border-2 border-blue-300/50 hover:border-blue-400/70 rounded-3xl shadow-2xl shadow-blue-200/30 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2 text-sm font-bold rounded-bl-2xl shadow-lg">
                    PHỔ BIẾN
                  </div>
                  <CardContent className="p-8">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold mb-4 text-slate-800">Gói 30 Phút</h3>
                      <div className="flex items-baseline justify-center gap-2 mb-2">
                        <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                          60.000
                        </span>
                        <span className="text-slate-600">VNĐ</span>
                      </div>
                      <p className="text-sm text-slate-600">~2.000 VNĐ/phút</p>
                    </div>

                    <ul className="space-y-4 mb-8">
                      {[
                        "Tư vấn nhanh, tập trung vào câu hỏi cụ thể",
                        "Lý tưởng cho định hướng ban đầu",
                        "Video call 1-1 trực tuyến",
                        "Ghi chú tóm tắt sau buổi tư vấn",
                      ].map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-full p-1 mt-0.5 flex-shrink-0 shadow-sm">
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-slate-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button className="w-full bg-white/30 hover:bg-white/40 backdrop-blur-md border border-white/40 text-slate-700 text-lg py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold">
                      Bắt Đầu Ngay
                    </Button>
                  </CardContent>
                </Card>

                {/* Package 2: 60 minutes */}
                <Card className="bg-white/20 backdrop-blur-md border-2 border-purple-300/50 hover:border-purple-400/70 rounded-3xl shadow-2xl shadow-purple-200/30 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 text-sm font-bold rounded-bl-2xl shadow-lg">
                    ĐỀ XUẤT
                  </div>
                  <CardContent className="p-8">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold mb-4 text-slate-800">Gói 60 Phút</h3>
                      <div className="flex items-baseline justify-center gap-2 mb-2">
                        <span className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          120.000
                        </span>
                        <span className="text-slate-600">VNĐ</span>
                      </div>
                      <p className="text-sm text-slate-600">~2.000 VNĐ/phút</p>
                    </div>

                    <ul className="space-y-4 mb-8">
                      {[
                        "Tư vấn sâu, phân tích chi tiết tình huống",
                        "Xây dựng kế hoạch hành động cụ thể",
                        "Video call 1-1 chuyên sâu",
                        "Tài liệu & roadmap chi tiết",
                        "Hỗ trợ follow-up qua chat trong 7 ngày",
                      ].map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-full p-1 mt-0.5 flex-shrink-0 shadow-sm">
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-slate-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button className="w-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 backdrop-blur-md border border-purple-300/50 text-slate-700 text-lg py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold">
                      Bắt Đầu Ngay
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center mt-8">
                <p className="text-slate-600 bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30 inline-block">
                  Tất cả các gói đều được bảo vệ bởi chính sách hoàn tiền 100% nếu không hài lòng
                </p>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-white/10 backdrop-blur-md border-t border-white/20 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="grid md:grid-cols-4 gap-8 mb-8">
                {/* Logo & Description */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-2 rounded-2xl shadow-lg">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-slate-800">Heartspace</span>
                  </div>
                  <p className="text-slate-600 text-sm mb-4">
                    Kết nối học sinh, sinh viên với những tư vấn viên đáng tin cậy
                  </p>
                  <div className="flex gap-3">
                    {[
                      /* Social icons */
                    ].map((_, index) => (
                      <a
                        key={index}
                        href="#"
                        className="bg-white/20 hover:bg-white/30 backdrop-blur-md p-2 rounded-xl border border-white/30 transition-all duration-300 shadow-sm hover:shadow-md"
                      >
                        {/* Social icon SVG */}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Quick Links */}
                <div>
                  <h3 className="font-bold text-lg mb-4 text-slate-800">Về Chúng Tôi</h3>
                  <ul className="space-y-2 text-slate-600">
                    {["Giới Thiệu", "Đội Ngũ", "Blog", "Careers"].map((item) => (
                      <li key={item}>
                        <a href="#" className="hover:text-slate-800 transition-colors duration-200">
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Support */}
                <div>
                  <h3 className="font-bold text-lg mb-4 text-slate-800">Hỗ Trợ</h3>
                  <ul className="space-y-2 text-slate-600">
                    {["FAQ", "Chính Sách Bảo Mật", "Điều Khoản Sử Dụng", "Liên Hệ"].map((item) => (
                      <li key={item}>
                        <a href="#" className="hover:text-slate-800 transition-colors duration-200">
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Contact */}
                <div>
                  <h3 className="font-bold text-lg mb-4 text-slate-800">Liên Hệ</h3>
                  <ul className="space-y-3 text-slate-600">
                    <li className="flex items-center gap-2">
                      <Mail className="w-5 h-5 text-blue-500" />
                      <a
                        href="mailto:support@heartspace.vn"
                        className="hover:text-slate-800 transition-colors duration-200"
                      >
                        support@heartspace.vn
                      </a>
                    </li>
                    <li className="flex items-center gap-2">
                      <Phone className="w-5 h-5 text-blue-500" />
                      <a
                        href="tel:1900xxxx"
                        className="hover:text-slate-800 transition-colors duration-200"
                      >
                        1900 xxxx
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="border-t border-white/20 pt-8 text-center text-slate-600 text-sm">
                <p>© 2025 Heartspace. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
