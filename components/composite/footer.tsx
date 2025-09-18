"use client";

import Link from "next/link";
import { Send, Phone, Mail, MapPin, Facebook, Instagram } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Logo from "../features/logo";

interface FooterProps {
  containerWidth?: number;
}

// Helper function to determine layout based on container width
function getFooterLayout(width: number) {
  return {
    mainGridCols: width >= 1024 ? "grid-cols-5" : width >= 768 ? "grid-cols-2" : "grid-cols-1",
    companyColSpan: width >= 1024 ? "lg:col-span-2" : "",
    rightSideColSpan: width >= 1024 ? "lg:col-span-3" : width >= 768 ? "col-span-2" : "",

    rightSideGrid:
      width >= 1024
        ? "lg:grid-cols-3 lg:grid-rows-2"
        : width >= 768
        ? "md:grid-cols-2"
        : "grid-cols-1",

    servicesRowStart: width >= 1024 ? "lg:row-start-1" : "",
    propertyRowStart: width >= 1024 ? "lg:row-start-1" : "",
    paymentRowStart: width >= 1024 ? "lg:row-start-1" : "",
    newsletterColSpan: width >= 1024 ? "lg:col-span-2 lg:row-start-2" : "",
    platformRowStart: width >= 1024 ? "lg:row-start-2" : "",

    headingSize: width >= 768 ? "md:text-base text-sm" : "text-sm",
    companyNameSize: width >= 768 ? "md:text-sm text-xs" : "text-xs",
    textSize: width >= 768 ? "md:text-sm text-xs" : "text-xs",

    mainGap: width >= 768 ? "gap-12" : "gap-8",
    sectionGap: width >= 768 ? "gap-12" : "gap-8",
  };
}

export default function Footer({ containerWidth = 0 }: FooterProps) {
  const effectiveWidth =
    containerWidth > 0 ? containerWidth : typeof window !== "undefined" ? window.innerWidth : 1200;
  const layout = getFooterLayout(effectiveWidth);

  return (
    <footer className="w-full bg-white text-zinc-900">
      <div className="container mx-auto px-4 pt-16 mb-4">
        <div className={`grid ${layout.mainGap} ${layout.mainGridCols}`}>
          {/* Company Info */}
          <div className={`space-y-6 ${layout.companyColSpan}`}>
            <Logo />
            <div className="space-y-4">
              <div>
                <h3 className={`${layout.companyNameSize} font-semibold text-zinc-900 mb-2`}>
                  HeartSpace – Chăm sóc & Đồng hành cùng sức khỏe tâm lý của bạn
                </h3>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <div className={`${layout.textSize} text-zinc-600`}>
                  <p>Trung tâm tư vấn & hỗ trợ tâm lý trực tuyến</p>
                  <p>Đặt lịch khám, trị liệu và đồng hành cùng chuyên gia</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-red-500 flex-shrink-0" />
                <Link
                  href="tel:+84829017282"
                  className={`${layout.textSize} text-zinc-600 hover:text-red-500`}
                >
                  0829 017 282
                </Link>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-red-500 flex-shrink-0" />
                <Link
                  href="mailto:greenarrow1503@gmail.com"
                  className={`${layout.textSize} text-zinc-600 hover:text-red-500`}
                >
                  greenarrow1503@gmail.com
                </Link>
              </div>
            </div>

            {/* Social Media */}
            <div className="space-y-3">
              <h4 className={`${layout.textSize} font-semibold text-zinc-900`}>
                Kết nối với chúng tôi
              </h4>
              <div className="flex gap-3 flex-wrap">
                <Link href="https://facebook.com/" target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="outline"
                    size="icon"
                    className="hover:bg-blue-50 hover:border-blue-300"
                  >
                    <Facebook className="w-4 h-4 text-blue-600" />
                  </Button>
                </Link>
                <Link href="https://instagram.com/" target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="outline"
                    size="icon"
                    className="hover:bg-pink-50 hover:border-pink-300"
                  >
                    <Instagram className="w-4 h-4 text-pink-600" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Side Container */}
          <div
            className={`${layout.rightSideColSpan} grid ${layout.sectionGap} ${layout.rightSideGrid}`}
          >
            {/* Services */}
            <div className={`space-y-6 ${layout.servicesRowStart}`}>
              <h3 className={`${layout.headingSize} font-semibold text-zinc-900`}>
                Dịch vụ chăm sóc
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/services/booking"
                    className="text-sm text-zinc-600 hover:text-red-500 transition-colors duration-200"
                  >
                    Đặt lịch khám sức khỏe tâm lý
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services/therapy"
                    className="text-sm text-zinc-600 hover:text-red-500 transition-colors duration-200"
                  >
                    Hỗ trợ trị liệu & tư vấn online
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services/resources"
                    className="text-sm text-zinc-600 hover:text-red-500 transition-colors duration-200"
                  >
                    Tài nguyên chăm sóc tinh thần
                  </Link>
                </li>
              </ul>
            </div>

            {/* About Mental Health */}
            <div className={`space-y-6 ${layout.propertyRowStart}`}>
              <h3 className={`${layout.headingSize} font-semibold text-zinc-900`}>
                Tầm quan trọng
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Sức khỏe tâm lý là nền tảng của cuộc sống hạnh phúc. Hãy quan tâm đến cảm xúc, suy
                nghĩ và tinh thần của bạn cũng như cơ thể. Đặt lịch khám và trò chuyện cùng chuyên
                gia ngay hôm nay để chăm sóc bản thân tốt hơn.
              </p>
            </div>

            {/* Payment Methods */}
            <div className={`space-y-6 ${layout.paymentRowStart}`}>
              <h3 className={`${layout.headingSize} font-semibold text-zinc-900`}>Thanh toán</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center justify-center p-3 border border-zinc-200 rounded-lg bg-zinc-50 hover:bg-zinc-100 transition-colors">
                    <span className="text-sm font-medium text-red-600">VNPay</span>
                  </div>
                  <div className="flex items-center justify-center p-3 border border-zinc-200 rounded-lg bg-zinc-50 hover:bg-zinc-100 transition-colors">
                    <span className="text-sm font-medium text-pink-600">MoMo</span>
                  </div>
                  <div className="flex items-center justify-center p-3 border border-zinc-200 rounded-lg bg-zinc-50 hover:bg-zinc-100 transition-colors">
                    <span className="text-sm font-medium text-blue-600">VISA</span>
                  </div>
                  <div className="flex items-center justify-center p-3 border border-zinc-200 rounded-lg bg-zinc-50 hover:bg-zinc-100 transition-colors">
                    <span className="text-sm font-medium text-orange-600">Mastercard</span>
                  </div>
                </div>
                <p className="text-xs text-zinc-500 text-center">
                  Hỗ trợ thanh toán an toàn và bảo mật
                </p>
              </div>
            </div>

            {/* Newsletter Section */}
            <div className={`${layout.newsletterColSpan}`}>
              <div className="space-y-4">
                <h3 className={`${layout.headingSize} font-semibold text-zinc-900`}>
                  Đăng ký nhận tin
                </h3>
                <p className="text-sm text-zinc-600">
                  Nhận chia sẻ hữu ích về sức khỏe tâm lý và các chương trình đặc biệt từ HeartSpace
                </p>
                <div className="flex max-w-md">
                  <Input
                    type="email"
                    placeholder="Nhập email của bạn"
                    className="rounded-r-none bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-l-none border border-l-0 border-zinc-200 bg-red-500 hover:bg-red-600 text-white hover:text-white"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-zinc-200" />

      {/* Bottom Footer */}
      <div className="bg-zinc-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-wrap items-center justify-center gap-6 mb-6">
            <Link
              href="/legal/terms-of-agreement"
              className="text-sm text-zinc-600 hover:text-red-500 transition-colors duration-200"
            >
              Điều khoản dịch vụ
            </Link>
            <Link
              href="/legal/privacy-policy"
              className="text-sm text-zinc-600 hover:text-red-500 transition-colors duration-200"
            >
              Chính sách bảo mật
            </Link>
          </div>

          <Separator className="bg-zinc-200 mb-6" />

          <div className="text-center text-sm text-zinc-500">
            © {new Date().getFullYear()} HeartSpace. Đồng hành cùng sức khỏe tâm lý cộng đồng.
          </div>
        </div>
      </div>
    </footer>
  );
}
