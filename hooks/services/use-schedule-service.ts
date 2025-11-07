import scheduleService, { GetConsultantSchedulesRequest } from "@/services/api/schedule-service";
import { useQuery } from "@tanstack/react-query";

export const useGetConsultantSchedules = (request: GetConsultantSchedulesRequest) => {
  return useQuery({
    queryKey: ["consultant-schedules", request],
    queryFn: async () => {
      const response = await scheduleService.getConsultantSchedules(request);
      return {
        data: response.data,
      };
    },
  });
};
