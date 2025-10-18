// hooks/useConsultants.ts
import { useQuery } from "@tanstack/react-query";
import {
  consultantService,
  ConsultantQueryParams,
  ConsultantResponse,
  PaginationMetadata,
} from "@/services/api/consultant-service";

interface ConsultantsResponse {
  data: ConsultantResponse[];
  metaData?: PaginationMetadata;
}

export const useConsultants = (queryParams?: ConsultantQueryParams) => {
  return useQuery({
    queryKey: ["consultants", queryParams],
    queryFn: async () => {
      const response = await consultantService.getConsultants(queryParams);
      return {
        data: response.data,
        metaData: response.metaData as PaginationMetadata | undefined,
      };
    },
  });
};

export const useConsultant = (id: string) => {
  return useQuery({
    queryKey: ["consultants", id],
    queryFn: () => consultantService.getConsultantById(id),
    enabled: !!id,
  });
};

export const useConsultingCategories = () => {
  return useQuery({
    queryKey: ["consulting-categories"],
    queryFn: () => consultantService.getConsultingCategories(),
  });
};
