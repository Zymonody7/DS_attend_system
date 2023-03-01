import { http } from "@/utils/http";
import type { ResType } from "./types";
import { baseUrlApi } from "./utils";

export type StuType = {
  id: number;
  sno: string;
  sclass: string;
  sname: string;
  label: string;
  absent: string;
  sportrait: string;
};
export type StuResult = ResType & {
  data: { list: StuType[] };
};

const getList = async (page: number, limit: number, sclass: string) => {
  return await http.request<StuResult>(
    "get",
    baseUrlApi(`/student/list?page=${page}&limit=${limit}&sclass=${sclass}`)
  );
};
const edit = async (data): Promise<ResType> => {
  return http.request<ResType>("post", baseUrlApi("/student/save"), {
    data
  });
};
const create = async (data): Promise<ResType> => {
  return http.request<ResType>("post", baseUrlApi("/student/save"), {
    data
  });
};
export default {
  getList,
  edit,
  create
};
