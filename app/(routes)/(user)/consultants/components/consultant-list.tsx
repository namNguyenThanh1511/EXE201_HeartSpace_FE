"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ConsultantCard, Consultant } from "./consultant-card";

interface ConsultantListProps {
  consultants: Consultant[];
  isLoading?: boolean;
  error?: Error | null;
  onConsultantMoreClick?: (consultant: Consultant) => void;
  onClearFilters?: () => void;
  onRetry?: () => void;
}

export function ConsultantList({
  consultants,
  isLoading = false,
  error = null,
  onConsultantMoreClick,
  onClearFilters,
  onRetry,
}: ConsultantListProps) {
  // Loading State
  if (isLoading) {
    return (
      <div className="text-center py-16">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-slate-700 border-t-purple-500 rounded-full animate-spin"></div>
          <p className="text-slate-400 text-lg">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="text-center py-16">
        <div className="flex flex-col items-center gap-4">
          <svg
            className="w-16 h-16 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <p className="text-red-400 text-lg font-semibold mb-2">Có lỗi xảy ra khi tải dữ liệu</p>
            <p className="text-slate-400 text-sm">{error.message || "Vui lòng thử lại sau"}</p>
          </div>
          <Button onClick={onRetry} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  // Empty State
  if (consultants.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="flex flex-col items-center gap-4">
          <svg
            className="w-16 h-16 text-slate-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <div>
            <p className="text-slate-400 text-lg font-semibold mb-2">
              Không tìm thấy tư vấn viên phù hợp
            </p>
            <p className="text-slate-500 text-sm">
              Thử điều chỉnh bộ lọc hoặc xóa tất cả để xem danh sách đầy đủ
            </p>
          </div>
          {onClearFilters && (
            <Button
              onClick={onClearFilters}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Xóa bộ lọc
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Consultant Cards Grid
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 animate-fadeIn">
      {consultants.map((consultant) => (
        <ConsultantCard
          key={consultant.id}
          consultant={consultant}
          onMoreClick={onConsultantMoreClick}
        />
      ))}
    </div>
  );
}
