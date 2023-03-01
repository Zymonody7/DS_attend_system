import { defineStore } from "pinia";
export const useClassStore = defineStore("class", {
  state: () => ({
    currentPage: 1,
    total: 0
  }),
  actions: {
    async fetchClassList(page: number): Promise<ClassResult> {
      // const data = await parkApi.getList(page);
      // this.total = data.pageInfo.total;
      // console.log(data);
      // return data;
    }
  }
});
