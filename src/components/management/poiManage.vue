<template>
  <div>
    <el-form ref="searchForm" :model="searchForm" label-width="80px">
      <el-form-item label="兴趣点名" prop="poiName">
        <el-input v-model="searchForm.poiName"></el-input>
      </el-form-item>
      <el-form-item label="标准地址" prop="address">
        <el-input v-model="searchForm.address"></el-input>
      </el-form-item>
      <el-form-item label="类别" prop="category">
        <el-checkbox-group v-model="searchForm.typeNames">
          <el-checkbox v-for="item in typeList" :label="item.typeId" :key="item.typeId">{{ item.typeName }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="handleSearch">搜索</el-button>
    <el-button type="primary" @click="handleReset">重置</el-button>
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
    <el-dialog v-model="dialogVisible" title="编辑" :close-on-click-modal="false" :before-close="handleCloseDialog">
      <el-form ref="editForm" :model="editForm" :rules="rules" label-width="80px">
        <el-form-item label="兴趣点名" prop="poiName">
          <el-input v-model="editForm.poiName"></el-input>
        </el-form-item>
        <el-form-item label="类别" prop="typeNames">
          <el-checkbox-group v-model="editForm.typeNames">
            <el-checkbox v-for="item in typeList" :label="item.typeName" :key="item.typeId" ref="typeCheckbox" @change="handleCheckboxChange">{{item.typeName}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleAddSave">确定</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
  </span>
    </el-dialog>
    <el-button type="primary" @click="handleAdd">添加</el-button>
    <el-dialog v-model="addDialogVisible" title="添加" :close-on-click-modal="false" :before-close="handleCloseDialog">
      <el-form ref="addForm" :model="addForm" :rules="rules" label-width="80px">
        <el-form-item label="兴趣点名" prop="poiName">
          <el-input v-model="addForm.poiName"></el-input>
        </el-form-item>
        <el-form-item label="标准地址" prop="address">
          <el-input v-model="addForm.address"></el-input>
        </el-form-item>
        <el-form-item label="类别" prop="category">
          <el-checkbox-group v-model="addForm.typeNames">
            <el-checkbox v-for="item in typeList" :label="item.typeId" :key="item.typeId">{{ item.typeName }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取消</el-button>
    <el-button type="primary" @click="handleEditSave">确定</el-button>
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
      },
      addForm: { // 编辑表单数据
        poiName: '',
        typeNames: [],
        address: '',
      },
      searchForm: { // 搜索表单数据
        poiName: '',
        address: '',
        typeNames: []
      },
      typeList: [], // 类别列表
      rules: { // 表单验证规则
        poiName: [
          {required: true, message: '请输入兴趣点名', trigger: 'blur'}
        ],
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
    loadTypes() {
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
      this.loading = true
      this.$axios.post(this.$store.state.url + '/web/poi/search', {
            searchPOI: this.searchForm.poiName,
            searchAddress: this.searchForm.address,
            typeIds: this.searchForm.typeNames,
            page: this.currentPage,
            size: this.pageSize
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
      this.searchForm.poiName = ''
      this.searchForm.address = ''
      this.searchForm.typeNames = []
      this.loadData()
    },
// 处理添加
    handleAdd() {
      this.addDialogVisible = true
      this.addForm.poiName = ''
      this.addForm.typeNames = []
      this.addForm.address = ''
      this.loadTypes()
    },
// 处理修改
    handleEdit(row) {
      this.dialogVisible = true
      this.editForm.poiName = row.poiName
      this.editForm.typeNames = row.typeNames

      this.editForm.id = row.poiId
      this.loadTypes()
    },
// 处理保存
    handleAddSave() {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          this.$axios.post(this.$store.state.url + '/web/poi/add', {
            poiName: this.addForm.poiName,
            typeNames: this.addForm.typeNames,
            address: this.addForm.address
          }).then(resp => {
            console.log(resp)
            if (resp.data.code === 200) {
              this.$message({
                type: 'success',
                message: '添加成功!'
              })
              this.addDialogVisible = false
              this.loadData()
            } else {
              this.$message({
                type: 'error',
                message: '添加失败!'
              })
            }
          }).catch(err => {
            console.error(err)
            ElMessage.error('添加失败')
          })
        } else {
          return false
        }
      })
    },
// 处理保存
    handleEditSave() {
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          this.$axios.post(this.$store.state.url + '/web/poi/update', {
            poiName: this.editForm.poiName,
            typeNames: this.editForm.typeNames,
            poiId: this.editForm.id
          }).then(resp => {
            console.log(resp)
            if (resp.data.code === 200) {
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
              this.dialogVisible = false
              this.loadData()
            } else {
              this.$message({
                type: 'error',
                message: '修改失败!'
              })
            }
          }).catch(err => {
            console.error(err)
            ElMessage.error('修改失败')
          })
        } else {
          return false
        }
      })
    },
// 处理关闭对话框
    handleCloseDialog(done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            done()
          })
          .catch(_ => {
          })
    },
    handleCheckboxChange(checkedItems) {
      const selectedTypeIds = checkedItems.map(item => item.label);
      this.editForm.typeNames = selectedTypeIds.join(',');
    }
  },
  mounted() {
    this.loadData()
    this.loadTypes()
  }
}
</script>