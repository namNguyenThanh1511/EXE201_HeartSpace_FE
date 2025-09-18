"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Home,
  Building2,
  LandPlot,
  Building,
  Store,
  HomeIcon,
  StoreIcon,
  HousePlus,
  BedDouble,
  Warehouse,
  ChevronDownIcon,
  ClockIcon,
  Bookmark as BookmarkIcon,
  Eye as EyeIcon,
  Calendar as CalendarIcon,
  Search as SearchIcon,
  Send,
  Bell as BellIcon,
  Settings as SettingsIcon,
  PiggyBank as PiggyBankIcon,
  UserSearch as UserSearchIcon,
  Phone as PhoneCallIcon,
  Users as UsersIcon,
  Scale as ScaleIcon,
  ClipboardList as ClipboardListIcon,
  Truck as TruckIcon,
  Armchair,
  Handshake,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Navigation items data structure
const navigationData = {
  mua: {
    title: "Mua",
    href: "/properties?transactionType=ForSale",
    column1: {
      title: "Chọn Mua",
      items: [
        {
          title: "Chung cư",
          href: "/properties?propertyType=Apartment&transactionType=ForSale",
          icon: Building2,
        },
        {
          title: "Nhà phố",
          href: "/properties?propertyType=ShopHouse&transactionType=ForSale",
          icon: Home,
        },
        {
          title: "Đất nền",
          href: "/properties?propertyType=LandPlot&transactionType=ForSale",
          icon: LandPlot,
        },
        {
          title: "Biệt thự",
          href: "/properties?propertyType=Villa&transactionType=ForSale",
          icon: HomeIcon,
        },
      ],
    },
    column2: {
      title: "Loại khác",
      items: [
        {
          title: "Shop house",
          href: "/properties?propertyType=ShopHouse&transactionType=ForSale",
          icon: Store,
        },
        {
          title: "Nhà kho",
          href: "/properties?propertyType=Warehouse&transactionType=ForSale",
          icon: Warehouse,
        },

        {
          title: "Văn phòng",
          href: "/properties?propertyType=Office&transactionType=ForSale",
          icon: Building,
        },
        {
          title: "Condotel",
          href: "/properties?propertyType=Hotel&transactionType=ForSale",
          icon: Building,
        },
        {
          title: "Chung cư mini",
          href: "/properties?propertyType=Apartment&transactionType=ForSale",
          icon: LandPlot,
        },
        {
          title: "Kho xưởng",
          href: "/properties?propertyType=Warehouse&transactionType=ForSale",
          icon: LandPlot,
        },
        {
          title: "Căn hộ dịch vụ",
          href: "/properties?propertyType=NewUrbanArea&transactionType=ForSales",
          icon: LandPlot,
        },
      ],
    },
    spotlight: {
      title: "Xu hướng thị trường bất động sản 2025",
      description:
        "Phân tích chi tiết về xu hướng giá cả và cơ hội đầu tư bất động sản trong năm 2025. Những khu vực nào đang thu hút nhà đầu tư?",
      image: "/banner_auth.jpg",
      readTime: "5 phút đọc",
      href: "/properties",
    },
    description:
      "Tìm kiếm và mua bất động sản phù hợp với nhu cầu của bạn. Từ nhà phố, chung cư đến đất nền với giá cả hợp lý.",
  },
  thue: {
    title: "Thuê",
    href: "/properties?transactionType=ForRent",
    column1: {
      title: "Chọn Thuê",
      items: [
        {
          title: "Phòng trọ",
          href: "/properties?propertyType=ShopHouse&transactionType=ForRent",
          icon: BedDouble,
        },
        {
          title: "Chung cư",
          href: "/properties?propertyType=Apartment&transactionType=ForRent",
          icon: Building2,
        },

        {
          title: "Chung cư mini",
          href: "/properties?propertyType=Apartment&transactionType=ForRent",
          icon: LandPlot,
        },
        {
          title: "Căn hộ dịch vụ",
          href: "/properties?propertyType=NewUrbanArea&transactionType=ForRent",
          icon: LandPlot,
        },
        {
          title: "Nhà phố",
          href: "/properties?propertyType=ShopHouse&transactionType=ForRent",
          icon: Home,
        },
        {
          title: "Văn phòng",
          href: "/properties?propertyType=Office&transactionType=ForRent",
          icon: Building,
        },
        {
          title: "Ở ghép",
          href: "/services/find-roommate",
          icon: Handshake,
        },
      ],
    },
    column2: {
      title: "Loại khác",
      items: [
        {
          title: "Shop house",
          href: "/properties?propertyType=ShopHouse&transactionType=ForRent",
          icon: Store,
        },

        {
          title: "Mặt bằng",
          href: "/properties?propertyType=ShopHouse&transactionType=ForRent",
          icon: StoreIcon,
        },
        {
          title: "Biệt thự",
          href: "/properties?propertyType=Villa&transactionType=ForRent",
          icon: HousePlus,
        },
        {
          title: "Nhà kho",
          href: "/properties?propertyType=Warehouse&transactionType=ForRent",
          icon: Warehouse,
        },
        {
          title: "Kho xưởng",
          href: "/properties?propertyType=Warehouse&transactionType=ForRent",
          icon: LandPlot,
        },
      ],
    },
    spotlight: {
      title: "Hướng dẫn thuê nhà an toàn, hiệu quả",
      description:
        "Những lưu ý quan trọng khi thuê nhà, từ việc kiểm tra giấy tờ pháp lý đến thương lượng giá cả hợp lý.",
      image: "/bg_hero.jpg",
      readTime: "7 phút đọc",
      href: "/properties",
    },
    description:
      "Tìm kiếm nhà thuê với đầy đủ tiện nghi, vị trí thuận lợi và giá cả phù hợp với ngân sách của bạn.",
  },
  ban: {
    title: "Bán",
    href: "/saler/property/new?transactionType=ForSale",
    column1: {
      title: "Chọn Bán",
      items: [
        {
          title: "Đất nền",
          href: "/saler/property/new",
          icon: LandPlot,
        },
        {
          title: "Nhà phố",
          href: "/saler/property/new",
          icon: Home,
        },
        {
          title: "Chung cư",
          href: "/saler/property/new",
          icon: Building2,
        },
        {
          title: "Biệt thự",
          href: "/saler/property/new",
          icon: Building,
        },
      ],
    },
    column2: {
      title: "Loại khác",
      items: [
        {
          title: "Biệt thự",
          href: "/saler/property/new",
          icon: HomeIcon,
        },
        {
          title: "Nhà kho",
          href: "/saler/property/new",
          icon: Warehouse,
        },
        {
          title: "Shop house",
          href: "/saler/property/new",
          icon: Store,
        },
        {
          title: "Căn hộ dịch vụ",
          href: "/saler/property/new",
          icon: LandPlot,
        },
        {
          title: "Condotel",
          href: "/saler/property/new",
          icon: Building,
        },
        {
          title: "Kho xưởng",
          href: "/saler/property/new",
          icon: LandPlot,
        },
        {
          title: "Chung cư mini",
          href: "/saler/property/new",
          icon: LandPlot,
        },
      ],
    },
    spotlight: {
      title: "Bí quyết bán nhà nhanh với giá cao",
      description:
        "Những chiến lược hiệu quả để bán bất động sản nhanh chóng và đạt được mức giá mong muốn trong thị trường hiện tại.",
      image: "/hero.jpg",
      readTime: "6 phút đọc",
      href: "/properties",
    },
    description:
      "Đăng tin bán bất động sản của bạn với hệ thống quảng cáo hiệu quả, tiếp cận hàng triệu khách hàng tiềm năng.",
  },
};

// New arrays from dev branch
const accountItems = [
  {
    title: "Nhà đã lưu",
    href: "/myrevo",
    description: "Xem nhà đã lưu của bạn",
    icon: BookmarkIcon,
    color: "text-yellow-500",
  },
  {
    title: "Đã xem gần đây",
    href: "/myrevo",
    description: "Xem bất động sản đã xem",
    icon: EyeIcon,
    color: "text-green-500",
  },
  {
    title: "Quản lý lịch hẹn",
    href: "/myrevo",
    description: "Xem lịch hẹn của bạn",
    icon: CalendarIcon,
    color: "text-blue-500",
  },
  {
    title: "Tìm kiếm đã lưu",
    href: "/myrevo",
    description: "Xem tìm kiếm đã lưu của bạn",
    icon: SearchIcon,
    color: "text-purple-500",
  },
  {
    title: "Tin nhắn của bạn",
    href: "/myrevo/messenger",
    description: "Xem tin nhắn của bạn",
    icon: Send,
    color: "text-orange-500",
  },
  {
    title: "Thông báo",
    href: "/myrevo",
    description: "Xem thông báo của bạn",
    icon: BellIcon,
    color: "text-pink-500",
  },
  {
    title: "Cài đặt tài khoản",
    href: "/myrevo",
    description: "Quản lý cài đặt tài khoản của bạn",
    icon: SettingsIcon,
    color: "text-teal-500",
  },
];

const services = [
  {
    title: "Vay mua nhà",
    href: "/services/loan",
    description: "Hỗ trợ vay mua nhà với lãi suất ưu đãi",
    icon: PiggyBankIcon,
    color: "text-purple-500",
  },
  {
    title: "Tìm người bán",
    href: "/services/find-seller",
    description: "Kết nối với chủ bất động sản",
    icon: UserSearchIcon,
    color: "text-indigo-500",
  },
  {
    title: "Tư vấn nhà ở",
    href: "/services/consultation",
    description: "Được tư vấn bởi chuyên gia bất động sản",
    icon: PhoneCallIcon,
    color: "text-teal-500",
  },
  {
    title: "Tìm bạn ở ghép",
    href: "/services/find-roommate",
    description: "Tìm bạn ở ghép để chia tiền phòng",
    icon: UsersIcon,
    color: "text-green-500",
  },
  {
    title: "Định giá nhà",
    href: "/services/property-valuation",
    description: "Định giá bất động sản chính xác và nhanh chóng",
    icon: ScaleIcon,
    color: "text-red-500",
  },
  {
    title: "Quản lý nhà",
    href: "/services/property-management",
    description: "Dịch vụ quản lý tài sản chuyên nghiệp",
    icon: ClipboardListIcon,
    color: "text-blue-500",
  },
  {
    title: "Dịch vụ chuyển nhà",
    href: "/services/moving",
    description: "Dịch vụ chuyển nhà nhanh chóng và an toàn",
    icon: TruckIcon,
    color: "text-yellow-500",
  },
  {
    title: "Thiết kế nội thất",
    href: "/services/interior-design",
    description: "Thiết kế nội thất sáng tạo và hiện đại",
    icon: Armchair,
    color: "text-orange-500",
  },
];

interface DropdownContentProps {
  data: typeof navigationData.mua;
  onMouseLeave?: () => void;
}

function DropdownContent({ data }: DropdownContentProps) {
  return (
    <motion.div
      key={data.title} // Force re-animation when switching between menu items
      className="w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-full h-full flex items-start justify-center px-32 py-8">
        <div className="w-full max-w-7xl grid grid-cols-4 gap-8">
          {/* Column 1 */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h3
              className="font-normal text-sm text-muted-foreground pl-2 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {data.column1.title}
            </motion.h3>
            <div className="space-y-2">
              {data.column1.items.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className="flex items-center gap-2 p-2 rounded-md transition-colors group"
                  >
                    <span className="font-medium text-lg text-foreground group-hover:text-red-600">
                      {item.title}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Column 2 */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h3
              className="font-normal text-sm text-muted-foreground pl-2 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {data.column2.title}
            </motion.h3>
            <div className="space-y-2">
              {data.column2.items.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.08 }}
                >
                  <Link
                    href={item.href}
                    className="flex items-center gap-2 p-2 rounded-md transition-colors group"
                  >
                    <span className="font-medium text-sm text-foreground group-hover:text-red-600">
                      {item.title}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Column 3 - Spotlight */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h3
              className="font-normal text-sm text-muted-foreground mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              Spotlight
            </motion.h3>
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link href={data.spotlight.href} className="block group">
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 group-hover:text-red-600 transition-colors leading-tight">
                    {data.spotlight.title}
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                    {data.spotlight.description}
                  </p>
                  <div className="relative aspect-video rounded-lg overflow-hidden">
                    <Image
                      src={data.spotlight.image}
                      alt={data.spotlight.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <ClockIcon className="h-3 w-3" />
                    <span>{data.spotlight.readTime}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          </motion.div>

          {/* Column 4 - Description */}
          <motion.div
            className="border-l-2 border-gray-200 pl-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-4">
              <motion.h3
                className="font-normal text-sm text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                Về {data.title}
              </motion.h3>
              <motion.p
                className="text-sm text-gray-600 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                {data.description}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <Link
                  href="/properties"
                  className="inline-flex items-center text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                >
                  Xem tất cả →
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

interface NavigationBarProps {
  activeDropdown: string | null;
  onMouseEnter: (key: string) => void;
  onMouseLeave: () => void;
}

export function NavigationBar({ activeDropdown, onMouseEnter }: NavigationBarProps) {
  const navigationItems = [
    { key: "mua", label: "Mua", hasDropdown: true },
    { key: "thue", label: "Thuê", hasDropdown: true },
    { key: "ban", label: "Bán", hasDropdown: true },
    // { key: 'taikhoan', label: 'Tài khoản', hasDropdown: false, href: '/myrevo' },
    // { key: 'sosanh', label: 'So sánh', hasDropdown: false, href: '/comparison' },
  ];

  return (
    <nav className="relative">
      <ul className="flex items-center gap-8 font-medium">
        {navigationItems.map((item) => (
          <li key={item.key} className="relative">
            {item.hasDropdown ? (
              <button
                className={cn(
                  "flex items-center gap-1 px-3 py-2 text-sm transition-colors hover:text-red-600",
                  activeDropdown === item.key ? "text-red-600" : "text-foreground"
                )}
                onMouseEnter={() => onMouseEnter(item.key)}
              >
                {item.label}
                <ChevronDownIcon
                  className={cn(
                    "h-4 w-4 transition-transform",
                    activeDropdown === item.key ? "rotate-180" : ""
                  )}
                />
              </button>
            ) : (
              // <Link
              //   href={item.href || '#'}
              //   className="flex items-center px-3 py-2 text-sm text-foreground transition-colors hover:text-red-600"
              // >
              //   {item.label}
              // </Link>
              <></>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

// Export the navigation data and DropdownContent for use in Header
export { navigationData, DropdownContent, accountItems, services };
