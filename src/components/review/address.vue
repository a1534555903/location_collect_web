<template>
  <div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="Column 1" prop="column1"></el-table-column>
      <el-table-column label="Column 2" prop="column2"></el-table-column>
      <el-table-column label="操作" width="180">
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

    <el-button-group>
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
import {mapActions, mapState} from 'vuex'
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
  computed: {
    ...mapState(['token'])
  },
  mounted() {
    this.getData()
  },
  methods: {
    ...mapActions(['setToken']),
    getData() {
      this.$axios.get(`/api/audit?page=${this.currentPage}&size=${this.pageSize}`, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      })
          .then((res) => {
            this.tableData = res.data.content
            this.total = res.data.totalElements
          })
          .catch((error) => {
            if (error.response && error.response.status === 401) {
              ElMessage.error('登录信息已失效，请重新登录')
              this.setToken(null)
              this.$router.push('/login')
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
      this.$axios.put('/api/audit/${row.id}/approve', {}, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      })
          .then(() => {
            ElMessage.success('已通过审核')
            this.tableData.splice(this.tableData.indexOf(row), 1)
          })
          .catch((error) => {
            if (error.response && error.response.status === 401) {
              ElMessage.error('登录信息已失效，请重新登录')
              this.setToken(null)
              this.$router.push('/login')
            } else {
              ElMessage.error('操作失败')
            }
          })
    },
    reject(row) {
      this.$axios.put('/api/audit/${row.id}/reject', {}, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      })
          .then(() => {
            ElMessage.success('已拒绝审核')
            this.tableData.splice(this.tableData.indexOf(row), 1)
          })
          .catch((error) => {
            if (error.response && error.response.status === 401) {
              ElMessage.error('登录信息已失效，请重新登录')
              this.setToken(null)
              this.$router.push('/login')
            } else {
              ElMessage.error('操作失败')
            }
          })
    },
    approveSelected() {
      this.$axios.put('/api/audit/approve', {ids: this.selectedRows.map(row => row.id)}, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      })
          .then(() => {
            ElMessage.success('已通过审核')
            this.selectedRows.forEach(row => {
              this.tableData.splice(this.tableData.indexOf(row), 1)
            })
            this.selectedRows = []
          })
          .catch((error) => {
            if (error.response && error.response.status === 401) {
              ElMessage.error('登录信息已失效，请重新登录')
              this.setToken(null)
              this.$router.push('/login')
            } else {
              ElMessage.error('操作失败')
            }
          })
    },
    rejectSelected() {
      this.$axios.put('/api/audit/reject', {ids: this.selectedRows.map(row => row.id)}, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      })
          .then(() => {
            ElMessage.success('已拒绝审核')
            this.selectedRows.forEach(row => {
              this.tableData.splice(this.tableData.indexOf(row), 1)
            })
            this.selectedRows = []
          })
          .catch((error) => {
            if (error.response && error.response.status === 401) {
              ElMessage.error('登录信息已失效，请重新登录')
              this.setToken(null)
              this.$router.push('/login')
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