<template>
  <div>
    <el-upload
        ref="upload"
        :auto-upload="false"
        :limit="1"
        :action="uploadUrl"
        :data="{'title': title}"
        :on-exceed="handleExceed"
        :before-upload="beforeUpload"
    >
      <el-button slot="trigger" size="small">选择文件</el-button>
      <template #tip>
        <div class="el-upload__tip">
          请选择一个xlsx或xls文件，上传成功10秒后刷新页面，请耐心等待
        </div>
      </template>
    </el-upload>

    <el-button size="small" type="primary" @click="uploadFile">上传文件</el-button>
    <el-button size="small" @click="downloadFile">导出选择项</el-button>
  </div>
</template>

<script>
import {ref} from 'vue';
import axios from 'axios';
import {ElMessage} from 'element-plus';

export default {
  name: 'FileUploader',
  components: {},
  props: {
    title: String,
    selection: Array,
    load: Function
  },
  data() {
    return {
      uploadUrl: this.$store.state.url + '/web/common/upload',
      downloadUrl: this.$store.state.url + '/web/common/download',
    }
  },
  methods: {
    uploadFile() {
      this.$refs.upload.submit()
      ElMessage.success('上传成功！')
      console.log(this.load)
      //10秒后刷新页面
      setTimeout(() => {
        this.load()
      }, 10000)
    },
    handleExceed() {
      ElMessage.error('只能上传一个文件！')
    },

    beforeUpload(file) {
      const isXls = file.type === 'application/vnd.ms-excel';
      const isXlsx = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      const validType = isXls || isXlsx;
      if (!validType) {
        ElMessage.error('只能上传xls和xlsx文件格式！');
        return false;
      }
    },
    async downloadFile() {
      if (this.selection.length === 0) {
        ElMessage.error('请选择要导出的数据！')
        return;
      }
      let ids=[]
      if(this.title=== '街道信息'){
        ids=this.selection.map(item => item.streetCode)
      }
      else if (this.title==='标准地址信息'){
        ids=this.selection.map(item => item.addressId)
      }
      else if(this.title==='兴趣点信息'){
        ids=this.selection.map(item => item.poiId)
      }
      else if(this.title==='兴趣点类别信息'){
        ids=this.selection.map(item => item.typeId)
      }
      const {data} = await this.$axios.post(this.downloadUrl, {
        ids: ids,
        title: this.title
      });
      console.log(data)
      const blob = new Blob([data], {type: 'text/csv;charset=utf-8'})
      const fileName = "example" + '.csv'
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = fileName
      link.click()
      window.URL.revokeObjectURL(link.href)
      link.remove()
    }
  },
}
</script>

<style scoped>
</style>
