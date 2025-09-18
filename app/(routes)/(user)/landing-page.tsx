"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import FeatureSection from "./components/feature-section";
import { images } from "@/lib/images-var";

export default function LandingPage() {
  return (
    <div className="bg-white ">
      {/* Hero Section */}
      <div className="relative w-full h-[calc(100vh-7rem)] md:h-[calc(100vh-5.2rem)]">
        <Image
          src={images.landingImg}
          alt="Landing Background"
          fill
          className="object-cover object-center brightness-90"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/30" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-start justify-center h-full px-3 sm:px-6 lg:px-8 pb-8 sm:pb-10 md:pb-16">
          <div className="w-full max-w-sm sm:max-w-2xl mx-auto lg:mx-0 lg:ml-8 xl:ml-16 2xl:ml-64 flex flex-col gap-3 sm:gap-6">
            {/* Badge */}
            <div className="flex mb-2 sm:mb-4">
              <motion.div
                className="inline-flex items-center gap-1 sm:gap-2 pl-1 pr-2 sm:pr-3 py-1 rounded-full shadow-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.8, ease: "easeOut" }}
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
              >
                <motion.div
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 bg-black/70 backdrop-blur-sm rounded-full"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5, ease: "backOut" }}
                >
                  <motion.div
                    className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.7, ease: "easeOut" }}
                  />
                  <motion.span className="text-white text-xs sm:text-base font-medium">
                    Mới
                  </motion.span>
                </motion.div>

                <div className="text-white/90 text-xs sm:text-base font-normal min-w-[200px] sm:min-w-[300px]">
                  {"Nền tảng chăm sóc sức khỏe tâm lý toàn diện.".split("").map((char, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        duration: 0.05,
                        delay: 1.0 + index * 0.03,
                        ease: "easeOut",
                      }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Title */}
            <motion.div
              className="font-sans text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold drop-shadow-lg leading-tight text-center lg:text-left"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              <div className="flex">Sức khỏe tâm lý.</div>
              <div className="flex">Quan trọng như thể chất.</div>
            </motion.div>

            {/* Description */}
            <motion.div
              className="text-white/90 text-sm sm:text-base md:text-lg lg:text-xl font-normal drop-shadow-md leading-relaxed max-w-md sm:max-w-xl text-left"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            >
              Hãy quan tâm đến tâm trí của bạn. Đặt lịch khám tâm lý và nhận hỗ trợ trị liệu online
              từ các chuyên gia.
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <section className="w-full flex flex-col lg:flex-row justify-center gap-4 lg:gap-6 mt-12 md:mt-16 lg:mt-20 py-8 md:py-12 px-4 lg:px-8 bg-white">
        <div className="w-full max-w-[500px] flex flex-col items-center lg:items-start text-center lg:text-left mx-auto">
          <h2 className="font-bold text-2xl md:text-3xl lg:text-4xl mb-3 text-gray-900">
            Gợi ý liệu trình phù hợp
          </h2>
          <p className="text-muted-foreground text-sm md:text-lg mb-6 leading-relaxed">
            Đăng nhập để đặt lịch khám, nhận tư vấn tâm lý phù hợp và bắt đầu liệu trình trị liệu
            online.
          </p>
          <button
            className="px-6 py-3 rounded-full border border-indigo-500 text-indigo-600 font-semibold hover:bg-indigo-50 transition-colors"
            onClick={() => {
              window.location.href = "/login";
            }}
          >
            Đặt lịch ngay
          </button>
        </div>

        <div className="w-full max-w-[500px] flex items-center justify-center mx-auto">
          <div className="relative w-[300px] md:w-[360px] lg:w-[400px]">
            <div className="relative rounded-2xl shadow-2xl bg-white overflow-hidden pt-2 pb-4 px-4">
              <div className="absolute -top-8 left-4 flex items-center gap-2 bg-white rounded-full shadow px-4 py-2 z-10">
                <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
                <div className="text-left">
                  <div className="font-semibold text-sm text-gray-900 leading-tight">
                    Lịch khám gợi ý
                  </div>
                  <div className="text-xs text-gray-500">Theo nhu cầu của bạn</div>
                </div>
              </div>
              <Image
                src="/mental-health.jpg"
                width={600}
                height={300}
                alt="Mental Health Consultation"
                className="w-full h-56 object-cover rounded-xl mb-4"
              />
              <div className="font-bold text-lg md:text-2xl text-gray-900 mb-2">
                Khám với chuyên gia
              </div>
              <div className="text-gray-700 text-sm mb-2">
                Tư vấn 1-1, liệu trình trị liệu online an toàn và bảo mật.
              </div>
            </div>
          </div>
        </div>
      </section>

      <FeatureSection />
    </div>
  );
}
