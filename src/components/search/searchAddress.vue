<template>
  <div>
    <el-form ref="searchForm" :model="searchForm" label-width="80px" :rules="rules">
      <el-form-item label="请输入" prop="searchWord">
        <el-input v-model="searchForm.searchWord" style="width: 300px" placeholder="请输入标准地址或兴趣点"></el-input>
      </el-form-item>
      <el-form-item label="类别:" prop="category">
        <el-checkbox-group v-model="searchForm.typeNames">
          <el-checkbox v-for="item in typeList" :label="item.typeId" :key="item.typeId">{{ item.typeName }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="handleSearch">搜索</el-button>
    <el-button type="primary" @click="handleReset">重置</el-button>
    <el-table :data="tableData" v-loading="loading" style="margin-top: 10px;">
      <el-table-column label="兴趣点名" prop="poiName"></el-table-column>
      <el-table-column label="兴趣点类别" prop="typeNames"></el-table-column>
      <el-table-column label="标准地址" prop="address"></el-table-column>
      <el-table-column label="区名" prop="districtName"></el-table-column>
      <el-table-column label="经度" prop="longitude"></el-table-column>
      <el-table-column label="纬度" prop="latitude"></el-table-column>
    </el-table>
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>
  </div>
</template>

<script>
import {ElMessage} from 'element-plus'

export default {
  name: 'poiManage',
  data() {
    return {
      tableData: [], // 列表数据
      loading: false, // 是否在加载中
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页条数
      total: 0, // 总条数
      searchForm: { // 搜索表单数据
        searchWord: '',
        typeNames: []
      },
      typeList: [], // 类别列表
      rules: { // 表单验证规则
        searchWord: [
          {required: true, message: '请输入标准地址', trigger: 'blur'}
        ],
      }
    }
  },
  methods: {
    // 加载数据
    loadData() {
      this.loading = true
      this.$axios.post(this.$store.state.url + '/web/common/search', {
            searchWord: this.searchForm.searchWord,
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
// 处理搜索
    handleSearch() {
      this.currentPage = 1
      this.$refs.searchForm.validate((valid) => {
        if (valid) {
          this.loadData()
        } else {
          return false
        }
      })

    },
// 处理重置
    handleReset() {
      this.searchForm.poiName = ''
      this.searchForm.address = ''
      this.searchForm.typeNames = []
      this.loadData()
    }
  },
  mounted() {
    this.loadTypes()
  }
}
</script>