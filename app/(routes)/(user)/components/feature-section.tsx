import React from "react";
import { useAuth } from "@/hooks/services/use-auth";
import FeatureCard from "./feature-card";

export default function FeatureSection() {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      image: "/mental-health-awareness.svg",
      title: "Hiểu về sức khỏe tâm lý",
      alt: "Sức khỏe tâm lý",
      description:
        "Sức khỏe tâm lý quan trọng không kém thể chất. Nhận thức và chăm sóc đúng cách giúp bạn duy trì cân bằng, hạnh phúc và hiệu quả trong công việc cũng như cuộc sống.",
      buttonText: "Tìm hiểu thêm",
      link: "/mental-health/awareness",
    },
    {
      image: "/online-therapy.svg",
      title: "Hỗ trợ điều trị online",
      alt: "Điều trị online",
      description:
        "Kết nối với các chuyên gia tâm lý bất cứ lúc nào, bất cứ nơi đâu. Chúng tôi mang đến sự tiện lợi và bảo mật trong các buổi tư vấn trực tuyến.",
      buttonText: "Bắt đầu ngay",
      link: isAuthenticated ? "/therapy/online" : "/login?redirect=/therapy/online",
    },
    {
      image: "/appointment.svg",
      title: "Đặt lịch khám tâm lý",
      alt: "Đặt lịch khám",
      description:
        "Chủ động sắp xếp lịch hẹn với bác sĩ và chuyên gia phù hợp. Chúng tôi giúp bạn tiếp cận dịch vụ y tế tâm lý một cách nhanh chóng và dễ dàng.",
      buttonText: "Đặt lịch khám",
      link: "/appointments",
    },
  ];

  return (
    <section className="w-full max-w-8xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-12 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24">
      {features.map((f) => (
        <FeatureCard key={f.title} {...f} />
      ))}
    </section>
  );
}
