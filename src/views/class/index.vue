<template>
  <div>
    <el-card
      class="relative pb-12 box-border"
      element-loading-svg-view-box="-10, -10, 50, 50"
      v-loading="false"
      :element-loading-svg="svg"
      element-loading-background="rgba(0, 0, 0, 0.4)"
    >
      <el-card>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-input v-model="searchByName">
              <template #prepend>
                <el-select style="width: 100px" placeholder="查询方式">
                  <el-option label="园区名称" value="1" />
                  <el-option label="园区ID" value="2" />
                </el-select>
              </template>
              <template #append>
                <el-button @click="handleSearchByName">
                  <IconifyIconOnline
                    icon="material-symbols:search-rounded"
                    width="20px"
                    height="20px"
                /></el-button>
              </template>
            </el-input>
          </el-col>
          <el-col :span="2"
            ><el-button type="success" @click="handleCreate"> 新增 </el-button>
          </el-col>
          <el-col :span="4">
            <el-button
              v-if="!multipleSelection"
              type="danger"
              @click="multipleSelection = true"
            >
              批量删除
            </el-button>

            <el-button-group v-if="multipleSelection">
              <el-button @click="multipleSelection = false">取消</el-button>
              <el-button type="danger" @click="handleDelete(deleteList)">
                确认删除
              </el-button>
            </el-button-group>
          </el-col>
          <el-col :span="4" />
          <el-col :span="2"
            ><el-button @click="exportToExcel">导出</el-button>
          </el-col>
          <el-col :span="2"
            ><el-button @click="handleUpload">上传</el-button>
          </el-col>
        </el-row>
      </el-card>
      <el-table
        id="oIncomTable"
        :data="classTable"
        row-key="id"
        stripe
        border
        resizable
        highlight-current-row
        fit
        style="width: 100%"
        @expand-change="handleExpand"
        :expand-row-keys="expands"
        @selection-change="getSelectionRows"
        ref="classForm"
      >
        <el-table-column
          align="center"
          v-if="multipleSelection"
          type="selection"
          width="55"
        />
        <el-table-column
          width="55"
          v-if="!multipleSelection"
          label="#"
          type="expand"
        >
          <template #default="props">
            <Motion>
              <div class="flex flex-col items-center">
                <h1 class="mb-8">{{ props.row.className }}</h1>
                <div class="flex justify-center gap-8 w-9/12 flex-wrap">
                  <img :src="props.row.sportrait" class="h-40 object-contain" />
                  <div class="max-w-lg mb-6">
                    <div>
                      {{
                        props.row.label
                          ? props.row.label
                          : "该学生很低调，没有个性签名"
                      }}
                    </div>
                  </div>
                </div>
              </div>
            </Motion>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="id"
          label="序号"
          width="70"
          size="large"
        />
        <el-table-column prop="sclass" min-width="160" label="班级" />
        <el-table-column prop="sno" label="学号" />
        <el-table-column prop="sname" label="姓名" />
        <!-- <el-table-column
          prop="classType"
          label="园区类型"
          width="90"
          :filters="[
            { text: '厂房', value: '厂房' },
            { text: '写字楼', value: '写字楼' },
            { text: '其他', value: '其他' }
          ]"
          :filter-method="handleFilter"
          filter-placement="bottom-end"
        >
          <template #default="scope">
            <el-tag
              round
              :type="scope.row.classType === '厂房' ? 'warning' : 'success'"
              >{{ scope.row.classType }}</el-tag
            >
          </template>
        </el-table-column> -->
        <el-table-column sortable prop="label" width="200" label="评价" />
        <el-table-column sortable prop="absent" width="200" label="缺勤次数" />
        <el-table-column width="140">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope)">编辑</el-button>
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.row.classId)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <edit-dialog
        v-if="showDialog"
        :show="showDialog"
        :data="editData"
        @close="onDialogClose"
        @confirm="handleConfirm"
      />
      <el-pagination
        small
        background
        :total="classStore.total"
        v-model:current-page="classStore.currentPage"
        @current-change="renderclassTable(classStore.currentPage)"
        layout="prev, pager, next"
        class="absolute right-20 bottom-4"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import Motion from "./utils/motion";
// import { classCreateRequest, classType } from "@/api/class";
import classApi from "@/api/class";
import { ElButton, ElTable, ElTableColumn } from "element-plus";
import { onMounted, ref, reactive, getCurrentInstance } from "vue";
import { useEditDialog } from "@/hooks/useEditDialog";
import editDialog from "./edit.vue";
import { message } from "@/utils/message";
import { useClassStore } from "@/store/modules/class";
import { svg } from "./utils/loadingSvg";
// import FileSaver from "file-saver";
// import * as XLSX from "xlsx";
import { useRoute } from "vue-router";
defineOptions({
  name: "Class"
});
const { proxy } = getCurrentInstance();
const classTable = ref([]);
const route = useRoute();
const sclass = route.name.toString();

onMounted(async () => {
  await renderclassTable(classStore.currentPage);
});
const loading = ref(true);
const renderclassTable = async (page: number) => {
  loading.value = true;
  const data = await classStore.fetchClassList(page, 10, sclass);
  classTable.value = data.data.list;
  loading.value = false;
};
const searchByName = ref("");
// 简单筛选
// 增加或修改
const handleSearchByName = () => {};
const { handleCreate, handleEdit, showDialog, onDialogClose, handleConfirm } =
  useEditDialog<stuType, stuCreateRequest>(classApi, "学生");
// 批量删除
const classForm = ref();
const multipleSelection = ref(false);
const deleteList = reactive(new Set<string>());
const getSelectionRows = (selection: classType[]) => {
  deleteList.clear();
  selection.forEach(item => {
    deleteList.add(item.classId);
  });
};
// 下拉表格
const expands = ref([]);
const handleExpand = async (row, expandedRows) => {
  expands.value = [];
  if (expandedRows.length > 0) {
    row ? expands.value.push(row.id) : "";
  }
};
// 分页
const classStore = useClassStore();
// 上传文件的对话框是否可见
// const uploadDialogVisiable = ref(false);
// // 将el-table转excel下载至本地
// const exportToExcel = () => {
//   // 检验是否导入成功
//   // console.log('XLSX',XLSX,FileSaver)
//   // 使用 this.$nextTick 是在dom元素都渲染完成之后再执行
//   proxy.$nextTick(function () {
//     // 设置导出的内容是否只做解析，不进行格式转换     false：要解析， true:不解析
//     const xlsxParam = { raw: true };
//     const wb = XLSX.utils.table_to_book(
//       document.querySelector("#oIncomTable"),
//       xlsxParam
//     );
//     // 导出excel文件名
//     const fileName = "class" + new Date().getTime() + ".xlsx";
//     const wbout = XLSX.write(wb, {
//       bookType: "xlsx",
//       bookSST: true,
//       type: "array"
//     });
//     try {
//       // 下载保存文件
//       FileSaver.saveAs(
//         new Blob([wbout], { type: "application/octet-stream" }),
//         fileName
//       );
//     } catch (e) {
//       if (typeof console !== "undefined") {
//         console.log(e, wbout);
//       }
//     }
//     return wbout;
//   });
// };
// 处理excel上传
// const handleUpload = () => {
//   uploadDialogVisiable.value = true;
// };
</script>

<style scoped></style>
