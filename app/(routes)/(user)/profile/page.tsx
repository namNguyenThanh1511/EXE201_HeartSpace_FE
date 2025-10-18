"use client";
import { useState, useRef, useLayoutEffect, useEffect, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart,
  Search,
  MessageSquare,
  Settings,
  Clock,
  Calendar,
  ArrowLeft,
  Bookmark,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { useIsMobile } from "@/hooks/utils/useMobile";
import { useAuth } from "@/hooks/services/use-auth";
import { AccountSettings } from "../components/account-settings/account-settings";
import { useAuthHook } from "@/context/providers/auth-provider";
import { useAuthStore } from "@/store/zustand/auth-store";

function useIsTablet() {
  const [isTablet, setIsTablet] = useState(false);
  useEffect(() => {
    const checkTablet = () => {
      if (typeof window !== "undefined") {
        setIsTablet(window.innerWidth <= 1024 && window.innerWidth > 640);
      }
    };
    checkTablet();
    window.addEventListener("resize", checkTablet);
    return () => window.removeEventListener("resize", checkTablet);
  }, []);
  return isTablet;
}

export default function ProfilePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [selectedTab, setSelectedTab] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("saved-homes");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [underlineStyle, setUnderlineStyle] = useState({ top: 0, height: 0 });
  const [backgroundStyle, setBackgroundStyle] = useState({ top: 0, height: 0 });
  const isMobile = useIsMobile();
  const { isAuthenticated } = useAuthStore();
  const isTablet = useIsTablet();

  const tabs = useMemo(
    () => [
      {
        name: "Cài đặt tài khoản",
        value: "account-settings",
        icon: Settings,
        content: <AccountSettings />,
      },
      //   {
      //     name: "Quản lý lịch hẹn",
      //     value: "appointments",
      //     icon: Calendar,
      //     content: <Appointments />,
      //   },
    ],
    []
  );

  // Initialize tab from URL params
  useEffect(() => {
    const tabParam = searchParams.get("tab");

    if (tabParam) {
      setActiveTab(tabParam);
      if (isMobile || isTablet) {
        setSelectedTab(tabParam);
      }
    } else if (tabParam) {
      // Invalid tab param, redirect to default
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set("tab", "saved-homes");
      router.replace(`${pathname}?${newSearchParams.toString()}`);
    }
  }, [searchParams, isMobile, isTablet, router, pathname]);

  // useEffect(() => {
  //   console.log("authenticated : ", isAuthenticated);
  //   if (!isAuthenticated) {
  //     // Redirect to login page instead of showing auth dialog

  //     router.push("/login?redirect=/profile");
  //   }
  // }, [isAuthenticated, router]);

  // Handle logout events - redirect to main page
  useEffect(() => {
    const handleLogout = () => {
      router.push("/");
    };

    window.addEventListener("logout", handleLogout);
    return () => window.removeEventListener("logout", handleLogout);
  }, [router]);

  const updateTabInURL = (tabValue: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("tab", tabValue);
    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  const handleTabClick = (tabValue: string) => {
    updateTabInURL(tabValue);
    if (isMobile || isTablet) {
      setSelectedTab(tabValue);
    }
    setActiveTab(tabValue);
  };

  const handleBackClick = () => {
    if (isMobile || isTablet) {
      setSelectedTab(null);
      // Remove tab param from URL when going back to main view
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete("tab");
      const newURL = newSearchParams.toString()
        ? `${pathname}?${newSearchParams.toString()}`
        : pathname;
      router.push(newURL);
    }
  };

  // Animated underline effect for vertical tabs
  useLayoutEffect(() => {
    const activeIndex = tabs.findIndex((tab) => tab.value === activeTab);
    const activeTabElement = tabRefs.current[activeIndex];

    if (activeTabElement) {
      const { offsetTop, offsetHeight } = activeTabElement;

      setUnderlineStyle({
        top: offsetTop,
        height: offsetHeight,
      });

      setBackgroundStyle({
        top: offsetTop,
        height: offsetHeight,
      });
    }
  }, [activeTab, tabs]);

  const selectedTabData = tabs.find((tab) => tab.value === selectedTab);

  // Mobile view
  if (isMobile) {
    return (
      <div className="min-h-screen flex flex-col pt-4">
        <div className="px-4">
          <h1 className="text-lg md:text-xl font-semibold mb-4 text-center">Tài khoản của tôi</h1>
        </div>

        <AnimatePresence mode="wait">
          {!selectedTab ? (
            <motion.div
              key="tabs"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-1 px-4"
            >
              <div className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => handleTabClick(tab.value)}
                    className="w-full flex items-center p-4 rounded-lg border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <tab.icon className="h-5 w-5 mr-3 shrink-0" />
                    <span className="text-sm font-medium">{tab.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="flex-1 px-4"
            >
              <div className="mb-4">
                <Button
                  variant="ghost"
                  onClick={handleBackClick}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Quay lại
                </Button>
              </div>
              <div className="mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  {selectedTabData?.icon && <selectedTabData.icon className="h-5 w-5" />}
                  {selectedTabData?.name}
                </h2>
              </div>
              <div className="min-h-[500px]">{selectedTabData?.content}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Tablet view
  if (isTablet) {
    return (
      <div className="min-h-screen h-screen flex flex-col pt-16">
        <AnimatePresence mode="wait">
          {selectedTab && (
            <div className="mt-4">
              <Button variant="ghost" onClick={handleBackClick} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Quay lại
              </Button>
            </div>
          )}
          <motion.div
            key="tablet"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1 px-4"
          >
            <div className="mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                {selectedTabData?.icon && <selectedTabData.icon className="h-5 w-5" />}
                {selectedTabData?.name || "Tài khoản của tôi"}
              </h2>
            </div>
            {/* <div className="min-h-[500px]">
              {selectedTab === "inbox" ? (
                <Messenger />
              ) : selectedTab ? (
                tabs.find((tab) => tab.value === selectedTab)?.content
              ) : (
                <div className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.value}
                      onClick={() => handleTabClick(tab.value)}
                      className="w-full flex items-center p-4 rounded-lg border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      <tab.icon className="h-5 w-5 mr-3 shrink-0" />
                      <span className="text-sm font-medium">{tab.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div> */}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // Desktop view - original layout
  return (
    <>
      <div className="min-h-screen flex flex-col pt-[100px] md:pt-[100px]">
        <h1 className="text-2xl font-semibold mb-8 text-left px-8 md:px-16 lg:px-28">
          Tài khoản của tôi
        </h1>
        <Tabs
          orientation="vertical"
          value={activeTab}
          onValueChange={(value) => {
            updateTabInURL(value);
            setActiveTab(value);
          }}
          className="w-full max-w-8xl px-8 md:px-16 lg:px-24"
        >
          <div className="flex gap-6">
            <TabsList className="shrink-0 grid grid-cols-1 p-0 bg-background min-w-[280px] relative">
              {tabs.map((tab, index) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  ref={(el) => {
                    tabRefs.current[index] = el;
                  }}
                  className="bg-background dark:data-[state=active]:bg-background relative z-10 justify-start rounded-none border-0 data-[state=active]:shadow-none py-3 px-4 h-auto"
                >
                  <tab.icon className="h-4 w-4 mr-3 shrink-0" />
                  <span className="text-sm font-medium">{tab.name}</span>
                </TabsTrigger>
              ))}

              <motion.div
                className="bg-primary/5 absolute left-0 right-0 z-0"
                layoutId="background"
                style={{
                  top: backgroundStyle.top,
                  height: backgroundStyle.height,
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 40,
                }}
              />

              <motion.div
                className="bg-primary absolute left-0 z-20 w-0.5"
                layoutId="underline"
                style={{
                  top: underlineStyle.top,
                  height: underlineStyle.height,
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 40,
                }}
              />
            </TabsList>
            <div className="flex-1 min-h-[600px]">
              {tabs.map((tab) => (
                <TabsContent key={tab.value} value={tab.value} className="mt-0">
                  {tab.content}
                </TabsContent>
              ))}
            </div>
          </div>
        </Tabs>
      </div>
    </>
  );
}
