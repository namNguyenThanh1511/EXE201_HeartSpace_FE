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

// Mock data - replace with actual API call
const mockConsultant = {
  id: "1",
  fullName: "Courtney Henry",
  bio: "Sustainability consultant specializing in ESG reporting with 8 years experience in financial services",
  email: "courtney.henry@example.com",
  phoneNumber: "+44 20 1234 5678",
  username: "courtney.henry",
  dateOfBirth: "1990-05-15",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
  role: "CONSULTANT",
  gender: false,
  isActive: true,
  createdAt: "2023-01-15",
  consultantInfo: {
    consultingIn: [
      { id: "1", name: "Sustainability", description: "Environmental consulting" },
      { id: "2", name: "Fashion", description: "Fashion industry consulting" },
    ],
    specialization: "ESG & Sustainability",
    experienceYears: 8,
    hourlyRate: 60000,
    certifications: "Certified Sustainability Professional (CSP), ESG Analyst",
  },
  freeSchedules: [
    {
      id: "1",
      startTime: "2025-10-20T09:00:00",
      endTime: "2025-10-20T11:00:00",
      isAvailable: true,
    },
    {
      id: "2",
      startTime: "2025-10-21T14:00:00",
      endTime: "2025-10-21T16:00:00",
      isAvailable: true,
    },
    {
      id: "3",
      startTime: "2025-10-22T10:00:00",
      endTime: "2025-10-22T12:00:00",
      isAvailable: true,
    },
  ],
};

const testimonials = [
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
];

const projectsCompleted = [
  {
    id: "1",
    clientName: "Ethan De Jong",
    tags: ["Sustainability", "Fashion"],
    description:
      "This project aims to conduct a comprehensive Life Cycle Assessment (LCA) for various textile products, and implement impact reduction and sustainable practices in the fashion industry.",
  },
];

const companies = [
  { name: "Handshake", logo: "https://via.placeholder.com/100x40/6366f1/ffffff?text=Handshake" },
  { name: "Dribbble", logo: "https://via.placeholder.com/100x40/ea4c89/ffffff?text=Dribbble" },
  { name: "Github", logo: "https://via.placeholder.com/100x40/181717/ffffff?text=Github" },
];

const skills = [
  "Communicate Your Work",
  "Increase Capacity",
  "Take Action",
  "Get Certified",
  "Get Compliant",
  "Build a Strategy",
];

export default function ConsultantProfile() {
  const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null);
  const rating = 4.9;
  const totalRatings = 70;

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

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <Card className="bg-transparent backdrop-blur-sm border border-slate-700/50 mb-6">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              {/* Avatar */}
              <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-slate-700/50 shadow-xl ring-4 ring-purple-500/20">
                <AvatarImage src={mockConsultant.avatar || ""} alt={mockConsultant.fullName} />
                <AvatarFallback className=" text-white text-3xl font-bold">
                  {mockConsultant.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-3xl sm:text-4xl font-bold text-white">
                    {mockConsultant.fullName}
                  </h1>
                  {mockConsultant.isActive && (
                    <Badge className="bg-blue-600 text-white">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>

                <p className="text-slate-300 text-lg mb-4 max-w-3xl">{mockConsultant.bio}</p>

                <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{mockConsultant.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{mockConsultant.phoneNumber}</span>
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
                ${Math.floor((mockConsultant.consultantInfo.hourlyRate || 60000) / 1000)}/day
              </div>
              <div className="text-sm text-slate-400">Session</div>
            </CardContent>
          </Card>

          <Card className="bg-transparent backdrop-blur-sm border border-slate-700/50">
            <CardContent className="p-6 text-center">
              <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2 fill-yellow-400" />
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-2xl font-bold text-white">{rating}</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-slate-600"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="text-sm text-slate-400">{totalRatings} Ratings</div>
            </CardContent>
          </Card>

          <Card className="bg-transparent backdrop-blur-sm border border-slate-700/50">
            <CardContent className="p-6 text-center">
              <MapPin className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white mb-1">United Kingdom</div>
              <div className="text-sm text-slate-400">Location</div>
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
                <h2 className="text-2xl font-bold text-white mb-4">About</h2>
                <p className="text-slate-300 leading-relaxed mb-4">
                  Rick is a seasoned strategy consultant and leader in sustainable business
                  practices. With a strong commitment to change, he primarily serves as an advisor
                  to C-suite and board-level professionals. Rick's expertise lies in helping
                  companies build or refine robust climate-resilience and sustainability strategies,
                  grounded in all regulations. His worldview extends beyond standard corporate (s):
                  encouraging (a) recognizing and responsible; he firmly be embedded throughout the
                  entire organization—from operations to leadership—recognizing that genuine impact
                  requires holistic integration.
                </p>
                <p className="text-slate-300 leading-relaxed mb-4">
                  He offers strategic guidance to clients, enabling rapid action within the
                  ever-changing regulatory landscape. Rick is passionate about transforming how
                  companies engage with sustainability.
                </p>

                <div className="flex flex-wrap gap-2 mt-4">
                  {mockConsultant.consultantInfo.consultingIn.map((category) => (
                    <Badge
                      key={category.id}
                      className="bg-slate-700 text-slate-200 hover:bg-slate-600"
                    >
                      {category.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Testimonials */}
            <Card className="bg-transparent backdrop-blur-sm border border-slate-700/50">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Testimonials</h2>
                <div className="space-y-6">
                  {testimonials.map((testimonial) => (
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
                <h2 className="text-2xl font-bold text-white mb-6">Projects Completed</h2>
                {projectsCompleted.map((project) => (
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
                <h2 className="text-2xl font-bold text-white mb-6">Companies</h2>
                <div className="flex flex-wrap gap-8 items-center justify-center">
                  {companies.map((company, idx) => (
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
                  <Badge className="bg-orange-500 text-white">Verified</Badge>
                  <span className="text-xl font-bold text-white">I work with you to</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, idx) => (
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
                <h3 className="text-xl font-bold text-white mb-4">Quick Info</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-purple-400 mt-1" />
                    <div>
                      <div className="text-sm text-slate-400">Experience</div>
                      <div className="text-white font-semibold">
                        {mockConsultant.consultantInfo.experienceYears} years
                      </div>
                    </div>
                  </div>
                  <Separator className="bg-slate-700" />
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400 mt-1" />
                    <div>
                      <div className="text-sm text-slate-400">Certifications</div>
                      <div className="text-white font-semibold text-sm">
                        {mockConsultant.consultantInfo.certifications || "N/A"}
                      </div>
                    </div>
                  </div>
                  <Separator className="bg-slate-700" />
                  <div className="flex items-start gap-3">
                    <Briefcase className="w-5 h-5 text-blue-400 mt-1" />
                    <div>
                      <div className="text-sm text-slate-400">Specialization</div>
                      <div className="text-white font-semibold">
                        {mockConsultant.consultantInfo.specialization}
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
                  Available Times
                </h3>
                <div className="space-y-2">
                  {mockConsultant.freeSchedules
                    .filter((schedule) => schedule.isAvailable)
                    .map((schedule) => (
                      <button
                        key={schedule.id}
                        onClick={() => setSelectedSchedule(schedule.id)}
                        className={`w-full text-left p-3 rounded-lg border transition-all ${
                          selectedSchedule === schedule.id
                            ? "bg-blue-600 border-blue-500 text-white"
                            : "bg-slate-900/50 border-slate-700 text-slate-300 hover:border-slate-600"
                        }`}
                      >
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4" />
                          {formatSchedule(schedule.startTime, schedule.endTime)}
                        </div>
                      </button>
                    ))}
                </div>
                <Button
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-6"
                  disabled={!selectedSchedule}
                >
                  Book Session
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
