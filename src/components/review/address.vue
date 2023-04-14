<template>
  <div>
    <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"/>
      <el-table-column label="路" prop="road"></el-table-column>
      <el-table-column label="号" prop="door"></el-table-column>
      <el-table-column label="街道" prop="streetCode"></el-table-column>
      <el-table-column label="经度" prop="longitude"></el-table-column>
      <el-table-column label="纬度" prop="latitude"></el-table-column>
<!--      <el-table-column label="提交人" prop="userId"></el-table-column>-->
      <el-table-column label="操作" width="180" v-if="selectedRows.length===0">
        <template #default="{row}">
          <el-button type="success" @click="approve(row)" v-if="!selectedRows.includes(row)">
            通过
          </el-button>
          <el-button type="danger" @click="reject(row)" v-if="!selectedRows.includes(row)">
            拒绝
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 50]"
        :page-size="pageSize"
        :total="total">
    </el-pagination>

    <el-button-group v-if="selectedRows.length>0">
      <el-button type="success" @click="approveSelected" :disabled="selectedRows.length === 0">
        通过选中
      </el-button>
      <el-button type="danger" @click="rejectSelected" :disabled="selectedRows.length === 0">
        拒绝选中
      </el-button>
    </el-button-group>
  </div>
</template>

<script>
import {ElMessage} from 'element-plus'

export default {
  name: 'AuditList',
  data() {
    return {
      tableData: [],
      pageSize: 10,
      currentPage: 1,
      total: 0,
      selectedRows: []
    }
  },
  computed: {},
  mounted() {
    this.getData()
  },
  methods: {
    handleSelectionChange(selection) {
      this.selectedRows = selection;
      console.log(selection)
    },
    getData() {
      let page= this.currentPage;
      let size= this.pageSize;
      this.$axios.get(this.$store.state.url + '/web/address/getUnapproved?page=' + page + '&size=' + size)
          .then((res) => {
            console.log(res)
            this.tableData = res.data.list
            this.total = this.tableData.length
          })
          .catch((error) => {
            if (error.response && error.response.status === 401) {
              ElMessage.error('登录信息已失效，请重新登录')
              this.$router.push('/login/loginPage')
            } else {
              ElMessage.error('获取数据失败')
            }
          })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.getData()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getData()
    },
    approve(row) {
      let id=row.addressId
      this.$axios.post(this.$store.state.url + '/web/address/approveSingle', {
          id
      })
          .then(() => {
            ElMessage.success('已通过审核')
            this.getData()
          })
          .catch((error) => {
            if (error.response && error.response.status === 401) {
              ElMessage.error('登录信息已失效，请重新登录')
              this.$router.push('/login/loginPage')
            } else {
              ElMessage.error('操作失败')
            }
          })
    },
    reject(row) {
      let id=row.addressId
      this.$axios.post(this.$store.state.url + '/web/address/rejectSingle', {
        id
      })
          .then(() => {
            ElMessage.success('已拒绝审核')
            this.tableData.splice(this.tableData.indexOf(row), 1)
            this.total = this.tableData.length
          })
          .catch((error) => {
            if (error.response && error.response.status === 401) {
              ElMessage.error('登录信息已失效，请重新登录')
              this.$router.push('/login/loginPage')
            } else {
              ElMessage.error('操作失败')
            }
          })
    },
    approveSelected() {
      this.$axios.post(this.$store.state.url + '/web/address/approveMulti', {ids: this.selectedRows.map(row => row.addressId)}
      )
          .then(() => {
            ElMessage.success('已通过审核')
            this.getData()
          })
          .catch((error) => {
            if (error.response && error.response.status === 401) {
              ElMessage.error('登录信息已失效，请重新登录')
              this.$router.push('/login/loginPage')
            } else {
              ElMessage.error('操作失败')
            }
          })
    },
    rejectSelected() {
      this.$axios.post(this.$store.state.url + '/web/address/rejectMulti', {ids: this.selectedRows.map(row => row.addressId)}, )
          .then(() => {
            ElMessage.success('已拒绝审核')
            this.selectedRows.forEach(row => {
              this.tableData.splice(this.tableData.indexOf(row), 1)
            })
            this.total = this.tableData.length
            this.selectedRows = []
          })
          .catch((error) => {
            if (error.response && error.response.status === 401) {
              ElMessage.error('登录信息已失效，请重新登录')
              this.$router.push('/login/loginPage')
            } else {
              ElMessage.error('操作失败')
            }
          })
    }
  }
}
</script>
<style scoped>

</style>