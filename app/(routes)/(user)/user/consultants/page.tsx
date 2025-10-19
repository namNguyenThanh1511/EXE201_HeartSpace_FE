"use client";

import Image from "next/image";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type ConsultingArea = {
  id: string;
  name: string;
  description: string;
};

type ConsultantInfo = {
  consultingIn: ConsultingArea[];
  specialization: string;
  experienceYears: number;
  hourlyRate: number;
  certifications: string;
};

type Expert = {
  id: string;
  fullName: string;
  bio: string;
  email: string;
  phoneNumber: string;
  username: string;
  dateOfBirth: string;
  avatar: string;
  role: string;
  gender: boolean;
  isActive: boolean;
  createdAt: string;
  consultantInfo: ConsultantInfo;
};

const experts: Expert[] = [
  {
    id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    fullName: "Dr. Ethan Leo",
    bio: "PhD Researcher at the University of Oxford, Environmental Social Scientist specializing in sustainable development",
    email: "ethan.leo@example.com",
    phoneNumber: "+1-555-0123",
    username: "ethan_leo",
    dateOfBirth: "1985-03-15",
    avatar: "/images/landing-bg.png",
    role: "consultant",
    gender: true,
    isActive: true,
    createdAt: "2024-01-15T10:30:00Z",
    consultantInfo: {
      consultingIn: [
        { id: "1", name: "Consulting & Professional Services", description: "Business consulting" },
        { id: "2", name: "Non Profit", description: "Non-profit sector" },
        { id: "3", name: "Energy & Utilities", description: "Energy sector consulting" }
      ],
      specialization: "Environmental Social Science",
      experienceYears: 8,
      hourlyRate: 600,
      certifications: "PhD Environmental Science, Certified Sustainability Professional"
    }
  },
  {
    id: "4fa85f64-5717-4562-b3fc-2c963f66afa7",
    fullName: "Dr. Ava Stone",
    bio: "Carbon Reduction Expert with 10+ years experience in corporate sustainability initiatives",
    email: "ava.stone@example.com",
    phoneNumber: "+1-555-0124",
    username: "ava_stone",
    dateOfBirth: "1982-07-22",
    avatar: "/images/landing-bg.png",
    role: "consultant",
    gender: false,
    isActive: true,
    createdAt: "2024-02-10T14:20:00Z",
    consultantInfo: {
      consultingIn: [
        { id: "4", name: "Process Engineer", description: "Process optimization" },
        { id: "5", name: "Security Engineer", description: "Security systems" },
        { id: "6", name: "Desktop Support", description: "IT support" }
      ],
      specialization: "Carbon Management",
      experienceYears: 10,
      hourlyRate: 550,
      certifications: "MBA Sustainability, Certified Carbon Professional"
    }
  },
  {
    id: "5fa85f64-5717-4562-b3fc-2c963f66afa8",
    fullName: "Dr. Liam Park",
    bio: "Biodiversity Specialist focusing on conservation strategies and ecosystem management",
    email: "liam.park@example.com",
    phoneNumber: "+1-555-0125",
    username: "liam_park",
    dateOfBirth: "1988-11-08",
    avatar: "/images/landing-bg.png",
    role: "consultant",
    gender: true,
    isActive: true,
    createdAt: "2024-03-05T09:15:00Z",
    consultantInfo: {
      consultingIn: [
        { id: "7", name: "Infrastructure Architect", description: "Infrastructure design" },
        { id: "8", name: "Non Profit", description: "Non-profit sector" },
        { id: "9", name: "QA Specialist", description: "Quality assurance" }
      ],
      specialization: "Biodiversity Conservation",
      experienceYears: 6,
      hourlyRate: 500,
      certifications: "PhD Biology, Certified Wildlife Biologist"
    }
  },
  {
    id: "6fa85f64-5717-4562-b3fc-2c963f66afa9",
    fullName: "Dr. Mia Ng",
    bio: "Climate Change Adaptation Expert helping organizations prepare for environmental challenges",
    email: "mia.ng@example.com",
    phoneNumber: "+1-555-0126",
    username: "mia_ng",
    dateOfBirth: "1990-05-12",
    avatar: "/images/landing-bg.png",
    role: "consultant",
    gender: false,
    isActive: true,
    createdAt: "2024-04-20T16:45:00Z",
    consultantInfo: {
      consultingIn: [
        { id: "10", name: "Systems Admin", description: "System administration" },
        { id: "11", name: "Process Engineer", description: "Process optimization" },
        { id: "12", name: "Infrastructure Architect", description: "Infrastructure design" }
      ],
      specialization: "Climate Adaptation",
      experienceYears: 5,
      hourlyRate: 450,
      certifications: "MS Climate Science, Certified Climate Risk Professional"
    }
  },
];

export default function ExpertsPage() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Expert | null>(null);

  const openBooking = (expert: Expert) => {
    setSelected(expert);
    setOpen(true);
  };

  return (
    <div className="container mx-auto max-w-6xl py-[100px]">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold">Choose Your Doctor</h1>
        <p className="text-muted-foreground mt-2">
          Xem danh sách chuyên gia, xem thông tin và đặt lịch khám phù hợp.
        </p>
      </div>

       <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
         {experts.map((expert) => (
           <Card key={expert.id} className="overflow-hidden hover:shadow-lg transition-shadow">
             <CardContent className="p-0 relative">
               {/* Rate Badge */}
               <div className="absolute top-4 left-4 z-10">
                 <Badge className="bg-green-500 text-white">${expert.consultantInfo.hourlyRate}/day</Badge>
               </div>

               {/* More Options */}
               <div className="absolute top-4 right-4 z-10">
                 <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                   ⋯
                 </Button>
               </div>

               {/* Profile Section */}
               <div className="pt-16 pb-4 px-6">
                 <div className="flex justify-center mb-4">
                   <div className="relative h-20 w-20 overflow-hidden rounded-full border-4 border-white shadow-lg">
                     <Image src={expert.avatar} alt={expert.fullName} fill sizes="80px" className="object-cover" />
                   </div>
                 </div>

                 {/* Verification Badges */}
                 <div className="flex justify-center gap-2 mb-3">
                   <Badge className="bg-purple-500 text-white text-xs">
                     ✓ Verified
                   </Badge>
                   {Math.random() > 0.5 && (
                     <Badge className="bg-orange-500 text-white text-xs">
                       🔥 Top
                     </Badge>
                   )}
                 </div>

                 {/* Name and Bio */}
                 <h3 className="text-lg font-semibold text-center mb-2">{expert.fullName}</h3>
                 <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-3 line-clamp-2">
                   {expert.bio}
                 </p>

                 {/* Rating */}
                 <div className="flex justify-center items-center gap-1 mb-4">
                   <Star className="h-4 w-4 fill-yellow-400 stroke-yellow-400" />
                   <span className="text-sm font-medium">4.9</span>
                   <span className="text-xs text-gray-500">(70 ratings)</span>
                 </div>

                 {/* Skills */}
                 <div className="flex flex-wrap gap-1 justify-center mb-4">
                   {expert.consultantInfo.consultingIn.slice(0, 3).map((skill) => (
                     <Badge key={skill.id} variant="outline" className="text-xs">
                       {skill.name}
                     </Badge>
                   ))}
                   {expert.consultantInfo.consultingIn.length > 3 && (
                     <Badge variant="outline" className="text-xs">
                       +{expert.consultantInfo.consultingIn.length - 3}
                     </Badge>
                   )}
                 </div>

                 {/* Platform Logo (simplified) */}
                 <div className="flex justify-center mb-4">
                   <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                     <div className="w-4 h-4 bg-blue-500 rounded"></div>
                   </div>
                 </div>
               </div>
             </CardContent>
           </Card>
         ))}
       </div>

      {/* Booking / Details Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selected ? selected.fullName : "Expert"}</DialogTitle>
            <DialogDescription>
              {selected ? `${selected.consultantInfo.specialization} • ${selected.consultantInfo.experienceYears} years experience` : "Select an expert to continue"}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="details" className="w-full">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="booking">Booking</TabsTrigger>
            </TabsList>

            {/* Details tab */}
            <TabsContent value="details" className="mt-4">
              {selected && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-[120px_1fr]">
                  <div className="relative h-28 w-28 overflow-hidden rounded-full border">
                    <Image src={selected.avatar} alt={selected.fullName} fill sizes="112px" className="object-cover" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm">Specialization: <span className="font-medium">{selected.consultantInfo.specialization}</span></div>
                    <div className="text-sm">Experience: <span className="font-medium">{selected.consultantInfo.experienceYears} years</span></div>
                    <div className="text-sm">Hourly Rate: <span className="font-medium">${selected.consultantInfo.hourlyRate}/day</span></div>
                    <div className="text-sm">Consulting Areas: {selected.consultantInfo.consultingIn.map((area) => (
                      <Badge key={area.id} variant="secondary" className="mr-1">{area.name}</Badge>
                    ))}
                    </div>
                    <div className="text-sm">Bio: <span className="font-medium">{selected.bio}</span></div>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Booking tab */}
            <TabsContent value="booking" className="mt-4">
              <form className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullname">Họ và tên</Label>
                  <Input id="fullname" name="fullname" placeholder="Nguyễn Văn A" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input id="phone" name="phone" placeholder="09xx xxx xxx" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Ngày khám</Label>
                  <Input id="date" name="date" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Khung giờ</Label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Chọn giờ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="08:00">08:00 - 09:00</SelectItem>
                      <SelectItem value="09:00">09:00 - 10:00</SelectItem>
                      <SelectItem value="10:00">10:00 - 11:00</SelectItem>
                      <SelectItem value="14:00">14:00 - 15:00</SelectItem>
                      <SelectItem value="15:00">15:00 - 16:00</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="sm:col-span-2">
                  <Button className="w-full">Xác nhận đặt lịch</Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
