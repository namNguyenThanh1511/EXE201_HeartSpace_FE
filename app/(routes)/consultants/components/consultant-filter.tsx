// components/ConsultantFilter.tsx
"use client";

import { useState } from "react";

import { ConsultantQueryParams } from "@/services/api/consultant-service";
import { useConsultants, useConsultingCategories } from "@/hooks/services/use-consultant-service";

export function ConsultantFilter() {
  const [filters, setFilters] = useState<ConsultantQueryParams>({
    pageNumber: 1,
    pageSize: 10,
  });

  const { data: consultantsResponse, isLoading } = useConsultants(filters);
  const { data: categoriesData } = useConsultingCategories();

  const handleSearch = (searchTerm: string) => {
    setFilters((prev) => ({ ...prev, searchTerm, pageNumber: 1 }));
  };

  const handleGenderFilter = (gender: boolean | undefined) => {
    setFilters((prev) => ({ ...prev, gender, pageNumber: 1 }));
  };

  const handleConsultingFilter = (consultingIds: number[]) => {
    setFilters((prev) => ({ ...prev, consultingsAt: consultingIds, pageNumber: 1 }));
  };

  const handlePageChange = (pageNumber: number) => {
    setFilters((prev) => ({ ...prev, pageNumber }));
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="space-y-4">
        {/* Search input */}
        <input
          type="text"
          placeholder="Tìm kiếm consultant..."
          onChange={(e) => handleSearch(e.target.value)}
          className="border p-2 rounded"
        />

        {/* Gender filter */}
        <select
          onChange={(e) =>
            handleGenderFilter(e.target.value ? JSON.parse(e.target.value) : undefined)
          }
          className="border p-2 rounded"
        >
          <option value="">Tất cả giới tính</option>
          <option value="true">Nam</option>
          <option value="false">Nữ</option>
        </select>

        {/* Consulting categories filter */}
        {categoriesData?.data && (
          <select
            multiple
            onChange={(e) => {
              const selectedIds = Array.from(e.target.selectedOptions, (option) =>
                parseInt(option.value)
              );
              handleConsultingFilter(selectedIds);
            }}
            className="border p-2 rounded"
          >
            {categoriesData.data.map((category) => (
              <option key={category.id} value={parseInt(category.id)}>
                {category.name}
              </option>
            ))}
          </select>
        )}

        {/* Consultants list */}
        <div className="space-y-4">
          {consultantsResponse?.data.map((consultant) => (
            <div key={consultant.id} className="border p-4 rounded-lg">
              <h3 className="font-semibold text-lg">{consultant.fullName}</h3>
              <p className="text-gray-600">{consultant.bio}</p>
              <div className="mt-2 grid grid-cols-2 gap-4">
                <div>
                  <p>
                    <strong>Email:</strong> {consultant.email}
                  </p>
                  <p>
                    <strong>SĐT:</strong> {consultant.phoneNumber}
                  </p>
                  <p>
                    <strong>Giới tính:</strong> {consultant.gender ? "Nam" : "Nữ"}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Chuyên môn:</strong> {consultant.consultantInfo.specialization}
                  </p>
                  <p>
                    <strong>Kinh nghiệm:</strong> {consultant.consultantInfo.experienceYears} năm
                  </p>
                  <p>
                    <strong>Mức phí:</strong>{" "}
                    {consultant.consultantInfo.hourlyRate
                      ? `${consultant.consultantInfo.hourlyRate} VND/giờ`
                      : "Chưa cập nhật"}
                  </p>
                </div>
              </div>

              {/* Consulting areas */}
              {consultant.consultantInfo.consultingIn.length > 0 && (
                <div className="mt-3">
                  <p className="font-medium">Lĩnh vực tư vấn:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {consultant.consultantInfo.consultingIn.map((consulting) => (
                      <span
                        key={consulting.id}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                      >
                        {consulting.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Free schedules */}
              {consultant.freeSchedules.length > 0 && (
                <div className="mt-3">
                  <p className="font-medium">Lịch trống:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {consultant.freeSchedules
                      .filter((schedule) => schedule.isAvailable)
                      .map((schedule) => (
                        <span
                          key={schedule.id}
                          className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm"
                        >
                          {new Date(schedule.startTime).toLocaleString()} -{" "}
                          {new Date(schedule.endTime).toLocaleString()}
                        </span>
                      ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pagination */}
        {consultantsResponse?.metaData && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600">
              Hiển thị {consultantsResponse.data.length} trên tổng số{" "}
              {consultantsResponse.metaData.totalCount} consultant
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(consultantsResponse.metaData!.currentPage - 1)}
                disabled={!consultantsResponse.metaData.hasPrevious}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Previous
              </button>

              <span className="px-3 py-1 border rounded">
                Trang {consultantsResponse.metaData.currentPage} /{" "}
                {consultantsResponse.metaData.totalPages}
              </span>

              <button
                onClick={() => handlePageChange(consultantsResponse.metaData!.currentPage + 1)}
                disabled={!consultantsResponse.metaData.hasNext}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
