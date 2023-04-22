<template>
  <div>
    <el-form ref="searchForm" :model="searchForm" label-width="80px">
      <el-form-item label="标准地址" prop="address">
        <el-input v-model="searchForm.address" @keyup.enter="handleSearch"></el-input>
      </el-form-item>
      <el-form-item label="街道名" prop="streetName">
        <el-input v-model="searchForm.streetName" @keyup.enter="handleSearch"></el-input>
      </el-form-item>
      <el-form-item label="区名" prop="districtName">
        <el-input v-model="searchForm.districtName" @keyup.enter="handleSearch"></el-input>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="handleSearch">搜索</el-button>
    <el-button type="primary" @click="handleReset">重置</el-button>
    <el-table :data="tableData" v-loading="loading" style="margin-top: 10px;" @selection-change="handleSelectionChange">
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="标准地址">
        <template #default="{ row }">
          {{ row.road + row.door }}
        </template>
      </el-table-column>
      <el-table-column label="街道" prop="streetName"></el-table-column>
      <el-table-column label="区" prop="districtName"></el-table-column>
      <el-table-column label="经度" prop="longitude"></el-table-column>
      <el-table-column label="纬度" prop="latitude"></el-table-column>
      <el-table-column label="操作" width="300px" v-if="multipleSelection.length === 0">
        <template #default="{ row }">
          <el-button type="primary" @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" @click="handleDelete(row)">删除</el-button>
          <el-button type="info" @click="findPoi(row)">查看兴趣点</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 50]"
      :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    <el-button type="success" @click="handleBatchDelete" v-if="multipleSelection.length > 0">
      删除选中
    </el-button>
    <el-button type="primary" @click="handleAdd">添加</el-button>
    <el-dialog v-model="dialogVisible" :title="title" :close-on-click-modal="false" :before-close="handleCloseDialog">
      <el-form ref="editForm" :model="editForm" :rules="rulesEdit" label-width="80px">
        <el-form-item label="路" prop="road">
          <el-input v-model="editForm.road"></el-input>
        </el-form-item>
        <el-form-item label="号" prop="door">
          <el-input v-model="editForm.door"></el-input>
        </el-form-item>
        <el-form-item label="街道名" prop="streetName">
          <el-input v-model="editForm.streetName"></el-input>
        </el-form-item>
        <el-form-item label="经度" prop="longitude">
          <el-input v-model="editForm.longitude" type="number"></el-input>
        </el-form-item>
        <el-form-item label="纬度" prop="latitude">
          <el-input v-model="editForm.latitude" type="number"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog v-model="dialogVisiblePOI" title="兴趣点" :close-on-click-modal="false" :before-close="handleCloseDialog">
      <el-table :data="poiData" v-loading="loading" style="margin-top: 10px;">
        <el-table-column label="兴趣点名" prop="poiName"></el-table-column>
        <el-table-column label="兴趣点类别" prop="typeNames"></el-table-column>
        <el-table-column label="操作" width="300px" v-if="multipleSelection.length === 0">
          <template #default="{ row }">
            <el-button type="primary" @click="handleEditPOI(row)">编辑</el-button>
            <el-button type="danger" @click="handleDeletePOI(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" @click="handleAddPOI">添加兴趣点</el-button>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisiblePOI = false">取消</el-button>
      </span>
    </el-dialog>
    <el-dialog v-model="dialogVisibleAddPOI" :title="addPOIForm.poiTitle" :close-on-click-modal="false"
      :before-close="handleCloseDialog">
      <el-form ref="addPOIForm" :model="addPOIForm" :rules="rulesAddPOI" label-width="80px">
        <el-form-item label="兴趣点名" prop="poiName">
          <el-input v-model="addPOIForm.poiName"></el-input>
        </el-form-item>
        <el-form-item label="类别" prop="typeNames">
          <el-checkbox-group v-model="addPOIForm.typeIds">
            <el-checkbox v-for="item in typeList" :label="item.typeId" :key="item.typeId" ref="typeCheckbox">
              {{ item.typeName }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleAddPOI = false">取消</el-button>
        <el-button type="primary" @click="handleSaveAddPOI">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
  
<script>
import { ref } from 'vue'
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'

export default {
  name: 'addressManage',
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
        road: '',
        door: '',
        streetName: '',
        title: '',
        longitude: '',
        latitude: '',
        addressId: ''
      },
      dialogVisiblePOI: false,
      poiData: [],
      dialogVisibleAddPOI: false,
      addPOIForm: {
        poiName: '',
        typeNames: [],
        addressId: '',
        poiTitle: '',
        poiId: ''
      },
      searchForm: { // 搜索表单数据
        address: '',
        streetName: '',
        districtName: ''
      },
      typeList: [], // 类别列表
      rulesEdit: { // 表单验证规则
        road: [
          { required: true, message: '请输入路名称', trigger: 'blur' }
        ],
        door: [
          { required: true, message: '请输入号', trigger: 'blur' }
        ],
        streetName: [
          { required: true, message: '请输入街道名', trigger: 'blur' }
        ],
        longitude: [
          { required: true, message: '请输入经度', trigger: 'blur' }
        ],
        latitude: [
          { required: true, message: '请输入纬度', trigger: 'blur' }
        ]
      },
      rulesAddPOI: {
        poiName: [
          { required: true, message: '请输入兴趣点名', trigger: 'blur' }
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
      this.$axios.get(this.$store.state.url + '/web/address/getApproved?page=' + this.currentPage + '&size=' + this.pageSize
      ,{}).then(resp => {
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
      const id = row.addressId
      this.$confirm('确认删除该记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.post(this.$store.state.url + '/web/address/rejectSingle', {
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
        const ids = this.multipleSelection.map(item => item.addressId)
        this.$axios.post(this.$store.state.url + '/web/address/rejectMulti', {
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
      this.$axios.post(this.$store.state.url + '/web/address/searchApproved'
          ,{
            address: this.searchForm.address,
            street: this.searchForm.streetName,
            district: this.searchForm.districtName,
            page: this.currentPage,
            size: this.pageSize
          }).then(resp => {
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
      this.searchForm.address = ''
      this.searchForm.streetName = ''
      this.searchForm.districtName = ''
      this.loadData()
    },
    // 处理添加
    handleAdd() {
      this.dialogVisible = true
      console.log(this.editForm, this.dialogVisible)
      this.editForm.title = '添加记录'
      this.editForm.road = ''
      this.editForm.door = ''
      this.editForm.streetName = ''
      this.editForm.longitude = ''
      this.editForm.latitude = ''
    },
    // 处理修改
    handleEdit(row) {
      this.dialogVisible = true
      this.editForm.title = '修改记录'
      console.log(row)
      this.editForm.road = row.road
      this.editForm.door = row.door
      this.editForm.streetName = row.streetName
      this.editForm.longitude = row.longitude
      this.editForm.latitude = row.latitude
      this.editForm.addressId = row.addressId
    },
    // 处理保存
    handleSave() {
      this.$refs.editForm.validate((valid) => {
        if (this.editForm.title === '添加记录') {
          // 添加记录
          this.$axios.post(this.$store.state.url + '/web/address/add', {
            road: this.editForm.road,
            door: this.editForm.door,
            streetName: this.editForm.streetName,
            longitude: this.editForm.longitude,
            latitude: this.editForm.latitude
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
          this.$axios.post(this.$store.state.url + '/web/address/edit', {
            addressId: this.editForm.addressId,
            road: this.editForm.road,
            door: this.editForm.door,
            streetName: this.editForm.streetName,
            longitude: this.editForm.longitude,
            latitude: this.editForm.latitude
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
      })
    },
    handleAddPOI() {
      this.dialogVisibleAddPOI = true
      this.addPOIForm.poiName=''
      this.addPOIForm.typeIds=[]
      this.addPOIForm.poiTitle='添加兴趣点'
      this.addPOIForm.addressId=this.editForm.addressId
      this.loadTypes()
    },
    handleDeletePOI(row){
      const id = row.poiId
      this.$confirm('确认删除该记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.post(this.$store.state.url + '/web/poi/rejectSingle', {
          id: id
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
// 删除成功后重新加载数据
          this.loadPOI(this.editForm.addressId)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleEditPOI(row){
      this.dialogVisibleAddPOI = true
      this.addPOIForm.poiTitle = '编辑兴趣点'
      this.addPOIForm.poiName = row.poiName
      this.addPOIForm.poiId = row.poiId
      let typeNames = []
      if(row.typeNames !== null){
        //typeNames是一个字符串,按','分割成数组
        typeNames = row.typeNames.split(',')
      }
      //遍历typeNames数组,将每个typeName转换成typeId,对应关系在typeList中
      let typeIds = []
      for (let i = 0; i < typeNames.length; i++) {
        for (let j = 0; j < this.typeList.length; j++) {
          if (typeNames[i] === this.typeList[j].typeName) {
            typeIds.push(this.typeList[j].typeId)
          }
        }
      }
      this.addPOIForm.typeIds = typeIds
      this.addPOIForm.addressId = this.editForm.addressId
      this.loadTypes()
      //设置ref=typeCheckbox中label在typeIds中的checkbox为选中状态
      this.$nextTick(() => {
        this.$refs.typeCheckbox.setCheckedNodes(typeIds)
      })
    },
    findPoi(row){
      this.dialogVisiblePOI=true
      this.editForm.addressId=row.addressId
      let addressId=row.addressId
      this.loadPOI(addressId)
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
    handleSaveAddPOI(){
      this.$refs.addPOIForm.validate((valid) => {
          // 添加记录
        if(this.addPOIForm.poiTitle==='添加兴趣点'){
          this.$axios.post(this.$store.state.url + '/web/poi/addById', {
            poiName: this.addPOIForm.poiName,
            typeIds: this.addPOIForm.typeIds,
            addressId: this.addPOIForm.addressId
          }).then(() => {
            this.$message({
              type: 'success',
              message: '添加成功!'
            })
            // 添加成功后关闭对话框，重新加载数据
            this.dialogVisibleAddPOI = false
            this.loadPOI(this.addPOIForm.addressId)
          }).catch(err => {
            ElMessage.error('添加失败,请检查添加的内容是否正确')
          })
        }
        else{
          this.$axios.post(this.$store.state.url + '/web/poi/updateSingle', {
            poiId: this.addPOIForm.poiId,
            poiName: this.addPOIForm.poiName,
            typeIds: this.addPOIForm.typeIds,
          }).then(() => {
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            // 修改成功后关闭对话框，重新加载数据
            this.dialogVisibleAddPOI = false
            this.loadPOI(this.addPOIForm.addressId)
          }).catch(err => {
            ElMessage.error('修改失败,请检查修改的内容是否正确')
          })
        }

      })
    },
    loadPOI(addressId){
        this.$axios.post(this.$store.state.url + '/web/address/findPoiByAddressId', {
          addressId: addressId
        }).then((res) => {
          this.poiData=res.data
        }).catch(err => {
          ElMessage.error('添加失败,请检查添加的内容是否正确')
        })
    }
  },
  mounted() {
    this.loadData()
    this.loadTypes()
  }
}
</script>