"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ConsultantQueryParams } from "@/services/api/consultant-service";
import { debounce } from "lodash";
import { useConsultingCategories } from "@/hooks/services/use-consultant-service";

interface Category {
  id: string;
  name: string;
}

interface ConsultantFilterProps {
  onFilterChange?: (filters: ConsultantQueryParams) => void;
}

export function ConsultantFilter({ onFilterChange }: ConsultantFilterProps) {
  const { data: categoriesData } = useConsultingCategories();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGender, setSelectedGender] = useState<boolean | undefined>(undefined);
  const [selectedConsultings, setSelectedConsultings] = useState<number[]>([]);

  // Debounced search to avoid too many API calls
  const debouncedSearch = useCallback(
    debounce((filters: ConsultantQueryParams) => {
      onFilterChange?.(filters);
    }, 500),
    [onFilterChange]
  );

  // Update filters when any filter changes
  useEffect(() => {
    const filters: ConsultantQueryParams = {
      searchTerm: searchTerm || undefined,
      gender: selectedGender,
      consultingsAt: selectedConsultings.length > 0 ? selectedConsultings : undefined,
    };

    debouncedSearch(filters);
  }, [searchTerm, selectedGender, selectedConsultings, debouncedSearch]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleGenderChange = (value: string) => {
    if (value === "all") {
      setSelectedGender(undefined);
    } else {
      setSelectedGender(value === "true");
    }
  };

  const handleConsultingChange = (values: string[]) => {
    const consultingIds = values.map((v) => parseInt(v));
    setSelectedConsultings(consultingIds);
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedGender(undefined);
    setSelectedConsultings([]);
  };

  const categories = categoriesData?.data || [];

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder="Tìm kiếm tư vấn viên theo tên, email..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 h-12 pl-12 rounded-full backdrop-blur-sm"
          />
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Dropdown Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Select value={selectedGender?.toString() || "all"} onValueChange={handleGenderChange}>
          <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white h-11 rounded-lg">
            <SelectValue placeholder="Tất cả giới tính" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả giới tính</SelectItem>
            <SelectItem value="true">Nam</SelectItem>
            <SelectItem value="false">Nữ</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={selectedConsultings[0]?.toString() ?? "all"}
          onValueChange={(value) => {
            if (value === "all") {
              setSelectedConsultings([]);
            } else {
              setSelectedConsultings([parseInt(value)]);
            }
          }}
        >
          <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white h-11 rounded-lg">
            <SelectValue placeholder="Lĩnh vực tư vấn" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả lĩnh vực</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Active Filter Tags */}
      <div className="flex items-center gap-2 flex-wrap">
        {searchTerm && (
          <Badge className="bg-slate-700/80 hover:bg-slate-600/80 text-white border-none px-4 py-2 text-sm flex items-center gap-2">
            Tìm kiếm: {searchTerm}
            <button className="hover:text-red-400" onClick={() => setSearchTerm("")}>
              ×
            </button>
          </Badge>
        )}

        {selectedGender !== undefined && (
          <Badge className="bg-slate-700/80 hover:bg-slate-600/80 text-white border-none px-4 py-2 text-sm flex items-center gap-2">
            Giới tính: {selectedGender ? "Nam" : "Nữ"}
            <button className="hover:text-red-400" onClick={() => setSelectedGender(undefined)}>
              ×
            </button>
          </Badge>
        )}

        {selectedConsultings.map((consultingId) => {
          const category = categories.find((c) => parseInt(c.id) === consultingId);
          return (
            <Badge
              key={consultingId}
              className="bg-slate-700/80 hover:bg-slate-600/80 text-white border-none px-4 py-2 text-sm flex items-center gap-2"
            >
              {category?.name || `Lĩnh vực ${consultingId}`}
              <button
                className="hover:text-red-400"
                onClick={() =>
                  setSelectedConsultings((prev) => prev.filter((id) => id !== consultingId))
                }
              >
                ×
              </button>
            </Badge>
          );
        })}

        {(searchTerm || selectedGender !== undefined || selectedConsultings.length > 0) && (
          <button
            onClick={clearAllFilters}
            className="text-red-400 hover:text-red-300 text-sm ml-2"
          >
            × Xóa tất cả
          </button>
        )}
      </div>
    </div>
  );
}
