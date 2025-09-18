import type React from "react";
import type { Metadata } from "next";
import "@/app/globals.css";
import Header from "@/components/composite/header";
import Footer from "@/components/composite/footer";

//import { Inter } from 'next/font/google';

//const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Revoland - Nền Tảng Công Nghệ Bất Động Sản Toàn Diện",
  description:
    "Revoland - Giải pháp bất động sản toàn diện, đáng tin cậy. Chuyên cung cấp dịch vụ mua bán, cho thuê nhà đất, biệt thự, căn hộ và đất nền với đội ngũ chuyên gia uy tín, tận tâm.",
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
