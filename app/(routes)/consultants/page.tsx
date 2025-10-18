"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ConsultantCard } from "./components/consultant-card";
import { ConsultantFilter } from "./components/consultants-filter";

import { ConsultantQueryParams } from "@/services/api/consultant-service";
import { useConsultants } from "@/hooks/services/use-consultant-service";

export default function ConsultantsPage() {
  const [filters, setFilters] = useState<ConsultantQueryParams>({
    pageNumber: 1,
    pageSize: 8,
  });

  const { data: consultantsResponse, isLoading, error } = useConsultants(filters);

  const handleFilterChange = (newFilters: ConsultantQueryParams) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      pageNumber: 1, // Reset to first page when filters change
    }));
  };

  const handleConsultantMoreClick = (consultant: any) => {
    console.log("More options clicked for:", consultant.fullName);
    // Implement your action here (e.g., open modal, navigate to detail page)
  };

  const handlePageChange = (pageNumber: number) => {
    setFilters((prev) => ({ ...prev, pageNumber }));
  };

  const consultants = consultantsResponse?.data || [];
  const metaData = consultantsResponse?.metaData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Mạng lưới tư vấn viên</h1>
            <p className="text-slate-400">
              Khám phá mạng lưới tư vấn viên chuyên nghiệp của HeartSpace
            </p>
          </div>
        </div>

        {/* Filter Component */}
        <ConsultantFilter onFilterChange={handleFilterChange} />

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-16">
            <p className="text-slate-400 text-lg">Đang tải dữ liệu...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <p className="text-red-400 text-lg">Có lỗi xảy ra khi tải dữ liệu</p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-4 bg-blue-600 hover:bg-blue-700"
            >
              Thử lại
            </Button>
          </div>
        )}

        {/* Results Count */}
        {!isLoading && !error && (
          <div className="text-slate-400 mb-6 mt-8">
            Hiển thị {consultants.length} trên tổng số {metaData?.totalCount || 0} tư vấn viên
          </div>
        )}

        {/* Consultant Cards Grid */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {consultants.map((consultant) => (
              <ConsultantCard
                key={consultant.id}
                consultant={consultant}
                onMoreClick={handleConsultantMoreClick}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && consultants.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-400 text-lg">Không tìm thấy tư vấn viên phù hợp</p>
            <Button
              onClick={() => setFilters({ pageNumber: 1, pageSize: 8 })}
              className="mt-4 bg-blue-600 hover:bg-blue-700"
            >
              Xóa bộ lọc
            </Button>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && !error && metaData && metaData.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            <Button
              variant="outline"
              onClick={() => handlePageChange(metaData.currentPage - 1)}
              disabled={!metaData.hasPrevious}
              className="bg-slate-800/50 border-slate-700 text-white hover:bg-slate-700/50 px-5 disabled:opacity-50"
            >
              Trước
            </Button>

            {[...Array(Math.min(metaData.totalPages, 5))].map((_, i) => {
              const pageNum = i + 1;
              return (
                <Button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={
                    metaData.currentPage === pageNum
                      ? "bg-blue-600 hover:bg-blue-700 text-white px-4"
                      : "bg-slate-800/50 border-slate-700 text-white hover:bg-slate-700/50 px-4"
                  }
                  variant={metaData.currentPage === pageNum ? "default" : "outline"}
                >
                  {pageNum}
                </Button>
              );
            })}

            <Button
              variant="outline"
              onClick={() => handlePageChange(metaData.currentPage + 1)}
              disabled={!metaData.hasNext}
              className="bg-slate-800/50 border-slate-700 text-white hover:bg-slate-700/50 px-5 disabled:opacity-50"
            >
              Sau
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
