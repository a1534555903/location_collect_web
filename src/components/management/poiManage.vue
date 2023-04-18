<template>
  <div>
    <el-form ref="searchForm" :model="searchForm" :rules="rules" label-width="80px">
      <el-form-item label="兴趣点名" prop="poiName">
        <el-input v-model="searchForm.poiName"></el-input>
      </el-form-item>
      <el-form-item label="标准地址" prop="address">
        <el-input v-model="searchForm.address"></el-input>
      </el-form-item>
      <el-form-item label="类别" prop="category">
        <el-checkbox-group v-model="searchForm.typeNames">
          <el-checkbox v-for="item in typeList" :label="item.typeId" :key="item.typeId">{{item.typeName}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="handleSearch">搜索</el-button>
    <el-table :data="tableData" v-loading="loading" style="margin-top: 10px;" @selection-change="handleSelectionChange">
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="兴趣点名" prop="poiName"></el-table-column>
      <el-table-column label="兴趣点类别" prop="typeNames"></el-table-column>
      <el-table-column label="标准地址" prop="address"></el-table-column>
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
    <el-dialog v-model="dialogVisible" title="编辑" :close-on-click-modal="false" :before-close="handleCloseDialog">
      <el-form ref="editForm" :model="editForm" :rules="rules" label-width="80px">
        <el-form-item label="兴趣点名" prop="poiName">
          <el-input v-model="editForm.poiName"></el-input>
        </el-form-item>
        <el-form-item label="类别" prop="category">
          <el-checkbox-group v-model="editForm.typeNames">
            <el-checkbox v-for="item in typeList" :label="item.typeId" :key="item.typeId">{{item.typeName}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取消</el-button>
    <el-button type="primary" @click="handleSave">确定</el-button>
  </span>
    </el-dialog>

  </div>
</template>

<script>
import {ref} from 'vue'
import {ElMessage, ElMessageBox, ElLoading} from 'element-plus'

export default {
  name: 'poiManage',
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
        poiName: '',
        typeNames: [],
        id: '',
        title: ''
      },
      searchForm: { // 搜索表单数据
        poiName: '',
        address: '',
        typeNames: []
      },
      typeList: [], // 类别列表
      rules: { // 表单验证规则
        category: [
          {required: true, message: '请输入类别名称', trigger: 'blur'}
        ]
      },
      multipleSelection: [] // 多选数据
    }
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
      this.$axios.get(this.$store.state.url + '/web/poi/getApproved?page=' + this.currentPage + '&size=' + this.pageSize
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
    loadTypes(){
      this.$axios.get(this.$store.state.url + '/web/type/allTypes'
      ).then(resp => {
        console.log(resp)
        this.typeList = resp.data
      }).catch(err => {
        console.error(err)
        ElMessage.error('加载数据失败')
      })
    },
    // 处理页码改变事件
    handleCurrentChange(val) {
      this.currentPage = val
      this.loadData()
    },
// 处理删除
    handleDelete(row) {
      const id = row.typeId
      this.$confirm('确认删除该记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.post(this.$store.state.url + '/web/type/deleteSingle', {
          id: id
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
        const ids = this.multipleSelection.map(item => item.typeId)
        this.$axios.post(this.$store.state.url + '/web/type/deleteMulti', {
          ids: ids
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
      this.loadData()
    },
// 处理重置
    handleReset() {
      this.searchForm.keyword = ''
      this.loadData()
    },
// 处理添加
    handleAdd() {
      this.dialogVisible = true
      console.log(this.editForm, this.dialogVisible)
      this.editForm.title = '添加记录'
      this.editForm.category = ''
      this.editForm.id = ''
      this.loadTypes()
    },
// 处理修改
    handleEdit(row) {
      this.dialogVisible = true
      this.editForm.title = '修改记录'
      console.log(row)
      this.editForm.category = row.typeName
      this.editForm.id = row.typeId
    },
// 处理保存
    handleSave() {
      if (this.editForm.category === '') {
        this.$message({
          type: 'warning',
          message: '请填写类别'
        })
        return
      }
      if (this.editForm.id === '') {
// 添加记录
        this.$axios.post(this.$store.state.url + '/web/type/add', {
          typeName: this.editForm.category
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
        this.$axios.post(this.$store.state.url + '/web/type/update', {
          typeName: this.editForm.category,
          id: this.editForm.id
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
      }
    },
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
    this.loadTypes()
  }
}
</script>