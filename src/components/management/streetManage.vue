<template>
    <div>
      <el-form ref="searchForm" :model="searchForm" label-width="80px">
        <el-form-item label="街道号" prop="streetCode">
          <el-input v-model="searchForm.streetCode" @keyup.enter="handleSearch" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="街道名" prop="streetName">
          <el-input v-model="searchForm.streetName" @keyup.enter="handleSearch" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="区名" prop="districtName">
            <el-input v-model="searchForm.districtName" @keyup.enter="handleSearch" style="width: 300px"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="handleSearch">搜索</el-button>
      <el-table :data="tableData" v-loading="loading" style="margin-top: 10px;" @selection-change="handleSelectionChange">
        <el-table-column type="selection"></el-table-column>
        <el-table-column label="街道号" prop="streetCode"></el-table-column>
        <el-table-column label="街道名" prop="streetName"></el-table-column>
        <el-table-column label="区名" prop="districtName"></el-table-column>
        <el-table-column label="操作" width="300px" v-if="multipleSelection.length===0">
          <template #default="{ row }">
            <el-button type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
      <el-button type="success" @click="handleBatchDelete" v-if="multipleSelection.length>0">
        删除选中
      </el-button>
      <el-button type="primary" @click="handleAdd">添加</el-button>
      <el-dialog v-model="dialogVisible" :title="editForm.title" :close-on-click-modal="false" :before-close="handleCloseDialog">
        <el-form ref="editForm" :model="editForm" :rules="rules" label-width="80px">
            <el-form-item label="街道号" prop="streetCode">
          <el-input v-model="editForm.streetCode" type="number"></el-input>
        </el-form-item>
        <el-form-item label="街道名" prop="streetName">
          <el-input v-model="editForm.streetName"></el-input>
        </el-form-item>
        <el-form-item label="区名" prop="districtName">
            <el-input v-model="editForm.districtName"></el-input>
        </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleSave">确定</el-button>
    </span>
      </el-dialog>
    <FileUploader :selection="multipleSelection" :title="'街道信息'" :load="loadData"></FileUploader>
    </div>
  </template>
  
  <script>
  import {ref} from 'vue'
  import {ElMessage, ElMessageBox, ElLoading} from 'element-plus'
  import FileUploader from "@/components/common/FileUploader.vue";
  export default {
    name: 'streetManage',
    data() {
      return {
        tableData: [], // 列表数据
        loading: false, // 是否在加载中
        currentPage: 1, // 当前页码
        pageSize: 10, // 每页条数
        total: 0, // 总条数
        dialogVisible: false, // 编辑对话框是否可见
        addDialogVisible: false, // 添加对话框是否可见
        editForm: { // 编辑表单数据
            streetCode: '',
            streetName: '',
            districtName: '',
            title: '',
        },
        searchForm: { // 搜索表单数据
            streetCode: '',
            streetName: '',
            districtName: '',
        },
        typeList: [], // 类别列表
        rules: { // 表单验证规则
          streetCode: [
            {required: true, message: '请输入街道号', trigger: 'blur'}
          ],
            streetName: [
                {required: true, message: '请输入街道名', trigger: 'blur'}
            ],
            districtName: [
                {required: true, message: '请输入区名', trigger: 'blur'}
            ]
        },
        multipleSelection: [] // 多选数据
      }
    },
    components: {
      FileUploader
    },
    methods: {

      handleSelectionChange(selection) {
        this.multipleSelection = selection;
        console.log(selection)
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.currentPage = 1
        this.loadData()
      },
      // 加载数据
      loadData() {
        this.loading = true
        this.$axios.get(this.$store.state.url + '/web/street/all?pageNum=' + this.currentPage + '&pageSize=' + this.pageSize
        ).then(resp => {
          console.log(resp)
          this.tableData = resp.data.list
          this.total = this.tableData.length
        }).catch(err => {
          console.error(err)
          ElMessage.error('加载数据失败')
        }).finally(() => {
          this.loading = false
        })
      },
      // 处理页码改变事件
      handleCurrentChange(val) {
        this.currentPage = val
        this.loadData()
      },
  // 处理删除
      handleDelete(row) {
        const id = row.streetCode
        this.$confirm('确认删除该记录吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.post(this.$store.state.url + '/web/street/deleteSingle', {
            streetCode: id
          }).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
  // 删除成功后重新加载数据
            this.loadData()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
  // 处理批量删除
      handleBatchDelete() {
        if (this.multipleSelection.length === 0) {
          this.$message({
            message: '请至少选择一条记录',
            type: 'warning'
          })
          return
        }
        this.$confirm(`确认删除这 ${this.multipleSelection.length} 条记录吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const ids = this.multipleSelection.map(item => item.streetCode)
          this.$axios.post(this.$store.state.url + '/web/street/deleteMulti', {
            streetCodes: ids
          }).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
  // 删除成功后重新加载数据
            this.loadData()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
  // 处理搜索
      handleSearch() {
        this.currentPage = 1
        this.loading = true
        this.$axios.post(this.$store.state.url + '/web/street/search',
          {
            streetCode: this.searchForm.streetCode,
            streetName: this.searchForm.streetName,
            districtName: this.searchForm.districtName,
            pageNum: this.currentPage,
            pageSize: this.pageSize
          }
        ).then(resp => {
          console.log(resp)
          this.tableData = resp.data.list
          this.total = this.tableData.length
        }).catch(err => {
          console.error(err)
          ElMessage.error('加载数据失败')
        }).finally(() => {
          this.loading = false
        })
      },
  // 处理重置
      handleReset() {
        this.searchForm.streetCode = ''
        this.searchForm.streetName = ''
        this.searchForm.districtName = ''
        this.currentPage = 1
        this.loadData()
      },
  // 处理添加
      handleAdd() {
        this.dialogVisible = true
        console.log(this.editForm, this.dialogVisible)
        this.editForm.streetCode = ''
        this.editForm.streetName = ''
        this.editForm.districtName = ''
        this.editForm.title = '添加记录'
        this.loadTypes()
      },
  // 处理修改
      handleEdit(row) {
        this.dialogVisible = true
        this.editForm.title = '修改记录'
        // console.log(row)
        this.editForm.origin= row.streetCode
        this.editForm.streetCode = row.streetCode
        this.editForm.streetName = row.streetName
        this.editForm.districtName = row.districtName
        this.loadTypes()
      },
  // 处理保存
      handleSave() {
        this.$refs.editForm.validate((valid) => {
          if (valid) {
        if (this.editForm.title === '添加记录') {
  // 添加记录
          this.$axios.post(this.$store.state.url + '/web/street/add', {
            streetCode: this.editForm.streetCode,
            streetName: this.editForm.streetName,
            districtName: this.editForm.districtName
          }).then(() => {
            this.$message({
              type: 'success',
              message: '添加成功!'
            })
  // 添加成功后关闭对话框，重新加载数据
            this.dialogVisible = false
            this.loadData()
          }).catch(err => {
            ElMessage.error('添加失败,请检查添加的内容是否正确')
          })
        } else {
  // 修改记录
          this.$axios.post(this.$store.state.url + '/web/street/edit', {
            streetCode: this.editForm.streetCode,
            streetName: this.editForm.streetName,
            districtName: this.editForm.districtName,
            origin: this.editForm.origin
          }).then(() => {
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
  // 修改成功后关闭对话框，重新加载数据
            this.dialogVisible = false
            this.loadData()
          }).catch(err => {
            ElMessage.error('修改失败,请检查修改的内容是否正确')
          })
        }}
      })},
  // 处理关闭对话框
      handleCloseDialog(done) {
        this.$confirm('确认关闭？')
            .then(_ => {
              done()
            })
            .catch(_ => {
            })
      }
    },
    mounted() {
      this.loadData()
    }
  }
  </script>