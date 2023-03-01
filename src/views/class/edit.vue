<script lang="ts" setup>
import { computed, ref, watch, onMounted, reactive } from "vue";
// import type { ClassType } from "@/api/class";
import type { Ref } from "vue";
import {
  ElButton,
  ElDatePicker,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElUpload,
  FormInstance,
  UploadProps,
  UploadUserFile
} from "element-plus";
import { classCreateRequest } from "@/api/class";
import { message } from "@/utils/message";
import { StuType } from "../../api/class";
interface Props {
  show: boolean;
  data: ClassType | null;
}

const props = withDefaults(defineProps<Props>(), {
  show: false
});
console.log(props.data);

const rules = reactive({
  id: [{ required: true, message: "厂房ID不能为空", trigger: "blur" }],
  sno: [{ required: true, message: "学号不能为空", trigger: "blur" }],
  sname: [{ required: true, message: "学生姓名不能为空", trigger: "blur" }],
  sclass: [{ required: true, message: "学生班级不能为空", trigger: "change" }]
  // area: [{ required: true, message: "厂房占地面积不能为空", trigger: "blur" }]
});
const typeOptions = computed(() => {
  return [
    { label: "数科2101班", value: "数科2101班" },
    { label: "数科2102班", value: "数科2102班" },
    { label: "数科2103班", value: "数科2103班" },
    { label: "数科2104班", value: "数科2104班" }
  ];
});
const defaultData: StuType = {
  id: "",
  sname: "",
  sclass: "",
  sno: "",
  label: "",
  absent: "",
  sportrait: ""
};

const classes: Ref<ClassCreateRequest> = ref(props.data || defaultData);

watch(props, newValue => {
  classes.value = newValue.data || defaultData;
});

const emit = defineEmits(["close", "confirm"]);

const visible = computed(() => props.show);

const formRef = ref<FormInstance>();
const fileList = ref<UploadUserFile[]>([]);
const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const handleRemove: UploadProps["onRemove"] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles);
};
const fileBase64 = ref();
const httpRequest = data => {
  // 调用转方法base64
  getBase64(data.file).then(resBase64 => {
    // eslint-disable-next-line vue/no-mutating-props
    // props.data.classes.sportrait = resBase64;
    fileBase64.value = resBase64.split(",")[1];
    classes.value.sportrait = fileBase64.value;

    console.log(fileBase64.value);
  });
};
// 转base64码
const getBase64 = file => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    let fileResult = "";
    reader.readAsDataURL(file);
    // 开始转
    reader.onload = () => {
      fileResult = reader.result;
    };
    // 转 失败
    reader.onerror = error => {
      reject(error);
    };
    // 转 结束
    reader.onloadend = () => {
      resolve(fileResult);
    };
  });
};
// const uploadImage = async (file, filelist) => {
//   console.log(file.url);

//   blobToBase64(file.url).then(res => {
//     console.log(res);
//   });
// };
// const blobToBase64 = blob => {
//   return new Promise((resolve, reject) => {
//     const fileReader = new FileReader();
//     fileReader.onload = e => {
//       resolve(e.target.result);
//     };
//     // readAsDataURL
//     fileReader.readAsDataURL(blob);
//     fileReader.onerror = () => {
//       reject(new Error("文件流异常"));
//     };
//   });
// };
const handlePictureCardPreview: UploadProps["onPreview"] = uploadFile => {
  dialogImageUrl.value = uploadFile.url!;
  dialogVisible.value = true;
};
onMounted(() => {
  if (classes.value.imgList) {
    classes.value.imgList.forEach((item, index) => {
      fileList.value.push({
        name: index + "",
        url: item
      });
    });
  }
});
const handleConfirm = async () => {
  if (!formRef.value) return;
  await formRef.value.validate((valid, _) => {
    if (valid) {
      emit("confirm", classes.value);
    } else {
      message("请确认表单信息无误后再提交", { type: "error" });
    }
  });
};
</script>
<template>
  <el-dialog
    ref="dialog"
    width="50%"
    v-model="visible"
    draggable
    :title="classes.id ? '编辑学生' : '新建学生'"
    @close="$emit('close')"
    destroy-on-close
  >
    <el-form
      ref="formRef"
      class="flex flex-col justify-center"
      :data="classes"
      :rules="rules"
      style="padding: 0 20px"
      :label-width="100"
      :model="classes"
    >
      <el-form-item label="学生姓名" prop="sname">
        <el-input placeholder="请输入学生姓名" v-model="classes.sname" />
      </el-form-item>
      <el-form-item label="学号" prop="sno">
        <el-input
          type="number"
          placeholder="请输入学号"
          v-model="classes.sno"
        />
      </el-form-item>
      <el-form-item label="班级" prop="sclass">
        <el-select
          class="w-full"
          v-model="classes.sclass"
          placeholder="请选择学生班级"
          clearable
        >
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="个性签名" prop="label">
        <el-input type="textarea" autosize v-model="classes.label" />
      </el-form-item>
      <el-form-item label="园区照片" prop="img">
        <el-upload
          v-model:file-list="fileList"
          accept=".jpg, .jpeg, .png"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :http-request="httpRequest"
        >
          <IconifyIconOnline
            icon="material-symbols:add"
            width="60px"
            height="60px"
          />
          <template #tip>
            <div class="el-upload__tip">
              只能上传图片,且单张图片大小不能超过10MB,暂时无法上传
            </div>
          </template>
        </el-upload>
        <el-dialog v-model="dialogVisible">
          <img w-full :src="dialogImageUrl" alt="预览图片" />
        </el-dialog>
      </el-form-item>
      <el-form-item>
        <el-button plain class="w-full" @click="handleConfirm()"
          >提交</el-button
        >
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<style scoped></style>
