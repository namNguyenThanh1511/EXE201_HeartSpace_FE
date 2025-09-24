import type React from "react";
import type { Metadata } from "next";
import "@/app/globals.css";
import Header from "@/components/composite/header";
import Footer from "@/components/composite/footer";

//import { Inter } from 'next/font/google';

//const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "HeartSpace - Nền Tảng hỗ trợ tâm lý ",
  description:
    "HeartSpace - Giải pháp hỗ trợ tâm lý toàn diện, đáng tin cậy. Chuyên cung cấp dịch vụ tư vấn tâm lý, trị liệu và hỗ trợ sức khỏe tâm thần với đội ngũ chuyên gia uy tín, tận tâm.",
};

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className=" ">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
