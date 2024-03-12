import { Banner } from "@b/models/banner.model";
import { httpClient } from "./http";

export const fetchBanners = async () => {
  const response = await httpClient.get<Banner[]>("/banners");
  return response.data;
};
