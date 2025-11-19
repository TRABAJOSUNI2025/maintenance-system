import axiosInstance from './axiosInstance';

export type HealthResponse = {
  status: string;
  timestamp: string;
};

export async function getHealth(): Promise<HealthResponse> {
  const { data } = await axiosInstance.get<HealthResponse>('/health');
  return data;
}
