"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConsultantList } from "./components/consultant-list";
import { ConsultantFilter } from "./components/consultants-filter";

import { ConsultantQueryParams } from "@/services/api/consultant-service";
import { useConsultants } from "@/hooks/services/use-consultant-service";
import { Consultant } from "./components/consultant-card";

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

  const handleConsultantMoreClick = (consultant: Consultant) => {
    console.log("More options clicked for:", consultant.fullName);
    // Implement your action here (e.g., open modal, navigate to detail page)
  };

  const handlePageChange = (pageNumber: number) => {
    setFilters((prev) => ({ ...prev, pageNumber }));
  };

  const handleClearFilters = () => {
    setFilters({ pageNumber: 1, pageSize: 8 });
  };

  const handleRetry = () => {
    window.location.reload();
  };

  const consultants = consultantsResponse?.data || [];
  const metaData = consultantsResponse?.metaData;

  return (
    <div className="min-h-screen relative overflow-hidden">
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

        {/* Results Count */}
        {!isLoading && !error && consultants.length > 0 && (
          <div className="text-slate-400 mb-6 mt-8">
            Hiển thị {consultants.length} trên tổng số {metaData?.totalCount || 0} tư vấn viên
          </div>
        )}

        {/* Consultant List Component */}
        <ConsultantList
          consultants={consultants}
          isLoading={isLoading}
          error={error}
          onConsultantMoreClick={handleConsultantMoreClick}
          onClearFilters={handleClearFilters}
          onRetry={handleRetry}
        />

        {/* Pagination */}
        {!isLoading && !error && metaData && metaData.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            <Button
              variant="outline"
              onClick={() => handlePageChange(metaData.currentPage - 1)}
              disabled={!metaData.hasPrevious}
              className="bg-slate-800/50 border-slate-700 text-white hover:bg-slate-700/50 px-5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </Button>

            {/* Dynamic page numbers */}
            {(() => {
              const totalPages = metaData.totalPages;
              const currentPage = metaData.currentPage;
              const maxPagesToShow = 5;

              let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
              const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

              if (endPage - startPage < maxPagesToShow - 1) {
                startPage = Math.max(1, endPage - maxPagesToShow + 1);
              }

              const pages = [];

              // First page
              if (startPage > 1) {
                pages.push(
                  <Button
                    key={1}
                    onClick={() => handlePageChange(1)}
                    variant="outline"
                    className="bg-slate-800/50 border-slate-700 text-white hover:bg-slate-700/50 px-4"
                  >
                    1
                  </Button>
                );
                if (startPage > 2) {
                  pages.push(
                    <span key="dots-start" className="px-2 text-slate-400">
                      ...
                    </span>
                  );
                }
              }

              // Middle pages
              for (let i = startPage; i <= endPage; i++) {
                pages.push(
                  <Button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={
                      currentPage === i
                        ? "bg-blue-600 hover:bg-blue-700 text-white px-4"
                        : "bg-slate-800/50 border-slate-700 text-white hover:bg-slate-700/50 px-4"
                    }
                    variant={currentPage === i ? "default" : "outline"}
                  >
                    {i}
                  </Button>
                );
              }

              // Last page
              if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                  pages.push(
                    <span key="dots-end" className="px-2 text-slate-400">
                      ...
                    </span>
                  );
                }
                pages.push(
                  <Button
                    key={totalPages}
                    onClick={() => handlePageChange(totalPages)}
                    variant="outline"
                    className="bg-slate-800/50 border-slate-700 text-white hover:bg-slate-700/50 px-4"
                  >
                    {totalPages}
                  </Button>
                );
              }

              return pages;
            })()}

            <Button
              variant="outline"
              onClick={() => handlePageChange(metaData.currentPage + 1)}
              disabled={!metaData.hasNext}
              className="bg-slate-800/50 border-slate-700 text-white hover:bg-slate-700/50 px-5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sau
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
