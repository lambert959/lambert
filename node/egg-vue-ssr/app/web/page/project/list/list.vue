<template>
  <Layout :title="$t('menu.projects')">
    <HomeContainer :user-name="userName" :role-type="roleType" :menu-type="2" :version="version">
      <div class="content-header">
        <div>
          <span class="content-title choosed">{{ $t('project.list') }}</span>
        </div>
        <div class="content-operation">
          <el-input
            v-model="params.name"
            class="search-input"
            :placeholder="$t('project.searchByProName')"
            @change="handleSearch"
          >
            <i slot="prefix" class="iconfont iconsousuo" />
          </el-input>
        </div>
      </div>
      <div v-loading="loading" class="content-box">
        <el-table
          :data="tableData"
          stripe
          style="width: 100%"
        >
          <el-table-column prop="id" :label="$t('project.number')" />
          <el-table-column prop="name" :label="$t('project.name')" />
          <el-table-column prop="type" :label="$t('project.proType')">
            <template slot-scope="scope">
              {{ typeMap[scope.row.type] }}
            </template>
          </el-table-column>
          <!-- <el-table-column prop="members" label="项目成员">
          </el-table-column> -->
          <el-table-column prop="createdAt" :label="$t('project.proTime')">
            <template slot-scope="scope">
              {{ $dateFormat(scope.row.createdAt) }}
            </template>
          </el-table-column>
          <el-table-column prop="updatedAt" :label="$t('project.proUpdateTime')">
            <template slot-scope="scope">
              {{ $dateFormat(scope.row.updatedAt) }}
            </template>
          </el-table-column>
          <el-table-column prop="description" :label="$t('project.description')" />
          <el-table-column :label="$t('operation')">
            <template slot-scope="scope">
              <!-- <el-button
                class="handle-btn btn1"
                type="text"
                size="small"
                @click="handleEdit(scope.row.id)"
              >
                编辑
              </el-button> -->
              <!-- <el-button
                class="handle-btn btn1"
                type="text"
                size="small"
              >
                {{$t('detail')}}
              </el-button> -->
              <el-button
                class="handle-btn btn2"
                type="text"
                size="small"
                @click="handleDelete(scope.row.id)"
              >
                {{ $t('delete') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="pagination-container"
          background
          :current-page="params.pageNum"
          :page-sizes="[10, 20, 30]"
          :page-size="params.pageSize"
          layout="total, prev, pager, next, sizes, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <el-dialog
        :title="$t('update')"
        width="50%"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
      >
        <el-form
          ref="projectForm" :model="choosedProject" label-width="100px" label-position="top"
          class="demo-ruleForm"
        >
          <el-form-item label="" prop="name">
            <el-input v-model="choosedProject.name" :placeholder="$t('project.enterName')" />
          </el-form-item>
          <el-form-item label="">
            <el-input
              v-model="choosedProject.description"
              type="textarea"
              :rows="5"
              show-word-limit
              maxlength="500"
              resize="none"
            />
          </el-form-item>
          <el-form-item label="" prop="pass">
            <el-button type="success" style="width:100%;background-color:#31364a;border-color:#31364a;" @click="confirm">
              {{ $t('ok') }}
            </el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </HomeContainer>
  </Layout>
</template>

<script type="text/babel">
export default {
  components: {},
  data () {
    return {
      params: {
        pageNum: 1,
        pageSize: 10,
        name: ''
      },
      total: 0,
      dialogVisible: false,
      projectId: '',
      choosedProject: {},
      typeMap: {
        1: 'prolin',
        2: 'android'
      },
      tableData: [],
      loading: false
    }
  },
  computed: {
  },
  mounted () {
    this.getData()
  },
  methods: {
    handleSizeChange (val) {
      this.params.pageSize = val
      this.params.pageNum = 1
      this.getData()
    },
    handleCurrentChange (val) {
      this.params.pageNum = val
      this.getData()
    },
    handleSearch () {
      this.getData()
    },
    getData () {
      if (this.loading) return
      this.loading = true
      this.$request.get(`/api/project`, this.params).then(res => {
        this.loading = false
        if (res.code === 0) {
          console.log(res)
          this.tableData = res.data.rows
          this.total = res.data.count
        } else {
          this.$message.warning(res.msg)
        }
      }).catch(e => {
        this.loading = false
      })
    },
    handleEdit (id) {
      this.dialogVisible = true
      this.projectId = id
      this.choosedProject = Object.assign({}, this.tableData.find((item) => item.id === id))
    },
    confirm () {
      this.$request.put(`/api/project/${this.projectId}`, this.choosedProject).then(res => {
        console.log(res)
        if (res.code === 0) {
          console.log(res)
          this.dialogVisible = false
          this.getData()
        } else {
          this.$message.warning(res.msg)
        }
      })
    },
    handleDelete (id) {
      this.$confirm(this.$t('project.delProTip'), this.$t('delete'), {
        confirmButtonText: this.$t('ok'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        this.$request.delete(`/api/project/${id}`).then(res => {
          console.log(res)
          if (res.code === 0) {
            console.log(res)
            this.$message.success(this.$t('delSucc'))
            this.getData()
          } else {
            this.$message.warning(res.msg)
          }
        })
      }).catch(() => {})
    }
  }
}
</script>
