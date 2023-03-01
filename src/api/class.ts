import { http } from "@/utils/http";

export type ClassResult = {};
const getList = async page => {
  return await http.request<ClassResult>(
    "get",
    baseUrlApi("/admin/park/page?curPage=" + page)
  );
};
export default {
  getList
};
