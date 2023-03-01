import { ClassResult } from "@/api/class";
import { defineStore } from "pinia";
import classApi from "@/api/class";
export const useClassStore = defineStore("class", {
  state: () => ({
    currentPage: 1,
    total: 0
  }),
  actions: {
    async fetchClassList(page: number): Promise<ClassResult> {
      const data = await classApi.getList(page);
      this.total = data.pageInfo.total;
      console.log(data);
      return data;
    }
  }
});
