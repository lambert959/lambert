<template>
  <Layout :title="$t('menu.users')">
    <HomeContainer :user-name="userName" :role-type="roleType" :menu-type="3" :version="version">
      <div class="content-header">
        <div>
          <span :class="{'content-title': true, choosed: type === '4'}" @click="handleTab('4')">{{ $t('userManage.unactive') }}</span>
          <span :class="{'content-title': true, choosed: type === '2'}" @click="handleTab('2')">{{ $t('userManage.underReview') }}</span>
          <span :class="{'content-title': true, choosed: type === '1'}" @click="handleTab('1')">{{ $t('userManage.passed') }}</span>
          <span :class="{'content-title': true, choosed: type === '3'}" @click="handleTab('3')">{{ $t('userManage.rejected') }}</span>
        </div>
        <div class="content-operation">
          <el-input
            v-model="keyword"
            class="search-input"
            :placeholder="$t('userManage.enterNameTip')"
          >
            <i slot="prefix" class="iconfont iconsousuo" />
          </el-input>
        </div>
      </div>
      <div v-loading="loading" class="content-box">
        <div v-if="type === '4'">
          <el-table
            v-show="tableData !== undefined"
            v-loading="loading"
            :data="tableData"
            stripe
            style="width: 100%"
          >
            <el-table-column prop="username" :label="$t('userManage.username')" />
            <el-table-column prop="email" :label="$t('userManage.email')" />
            <el-table-column prop="phone" :label="$t('userManage.phone')" />
            <el-table-column prop="createdAt" :label="$t('userManage.createTime')">
              <template slot-scope="scope">
                {{ $dateFormat(scope.row.createdAt) }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('operation')">
              <template slot-scope="scope">
                <el-button
                  class="handle-btn btn1"
                  type="text"
                  size="small"
                  @click="sendEmail(scope.row.id)"
                >
                  {{ $t('userManage.resend') }}
                </el-button>
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
        </div>
        <div v-if="type === '2'">
          <el-table
            v-show="tableData !== undefined"
            v-loading="loading"
            :data="tableData"
            stripe
            style="width: 100%"
          >
            <el-table-column prop="username" :label="$t('userManage.username')" />
            <el-table-column prop="email" :label="$t('userManage.email')" />
            <el-table-column prop="phone" :label="$t('userManage.phone')" />
            <el-table-column prop="createdAt" :label="$t('userManage.createTime')">
              <template slot-scope="scope">
                {{ $dateFormat(scope.row.createdAt) }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('operation')">
              <template slot-scope="scope">
                <el-button
                  class="handle-btn btn1"
                  type="text"
                  size="small"
                  @click="handlePass(scope.row.id)"
                >
                  {{ $t('userManage.pass') }}
                </el-button>
                <el-button
                  class="handle-btn btn2"
                  type="text"
                  size="small"
                  @click="handleReject(scope.row.id)"
                >
                  {{ $t('userManage.reject') }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-if="type === '1'">
          <el-table
            v-show="tableData !== undefined"
            v-loading="loading"
            :data="tableData"
            stripe
            style="width: 100%"
          >
            <el-table-column prop="username" :label="$t('userManage.username')" />
            <el-table-column prop="email" :label="$t('userManage.email')" />
            <el-table-column prop="phone" :label="$t('userManage.phone')" />
            <el-table-column prop="createdAt" :label="$t('userManage.createTime')">
              <template slot-scope="scope">
                {{ $dateFormat(scope.row.createdAt) }}
              </template>
            </el-table-column>
            <el-table-column prop="updatedAt" :label="$t('userManage.updateTime')">
              <template slot-scope="scope">
                {{ $dateFormat(scope.row.updatedAt) }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('operation')">
              <template slot-scope="scope">
                <el-button
                  class="handle-btn btn1"
                  type="text"
                  size="small"
                  @click="handleEdit(scope.row.id)"
                >
                  {{ $t('update') }}
                </el-button>
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
        </div>
        <div v-if="type === '3'">
          <el-table
            v-show="tableData !== undefined"
            v-loading="loading"
            :data="tableData"
            stripe
            style="width: 100%"
          >
            <el-table-column prop="username" :label="$t('userManage.username')" />
            <el-table-column prop="email" :label="$t('userManage.email')" />
            <el-table-column prop="phone" :label="$t('userManage.phone')" />
            <el-table-column prop="createdAt" :label="$t('userManage.createTime')">
              <template slot-scope="scope">
                {{ $dateFormat(scope.row.createdAt) }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('operation')">
              <template slot-scope="scope">
                <el-button
                  class="handle-btn btn1"
                  type="text"
                  size="small"
                  @click="handlePass(scope.row.id)"
                >
                  {{ $t('project.pass') }}
                </el-button>
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
        </div>
        <el-pagination
          class="pagination-container"
          background
          :current-page="pageNum"
          :page-sizes="[10, 20, 30]"
          :page-size="pageSize"
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
          ref="userForm" :model="userForm" label-width="100px" label-position="top"
          class="demo-ruleForm"
        >
          <el-form-item label="" prop="email">
            <el-input v-model="userForm.email" :placeholder="$t('userManage.emailTip')" />
          </el-form-item>
          <el-form-item label="" prop="phone">
            <el-input v-model="userForm.phone" :placeholder="$t('userManage.phoneTip')" />
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
import './list.scss'
export default {
  components: {},
  data () {
    return {
      tableData: undefined,
      loading: false,
      keyword: '',
      dialogVisible: false,
      selId: '',
      userForm: {
        email: '',
        phone: ''
      },
      pageNum: 1,
      pageSize: 10,
      total: 0,
      operating: false
    }
  },
  computed: {
  },
  watch: {
    /* type(val) {
        window.location.href = `/userManage/list/${val}`
      } */
  },
  mounted () {
    this.getData()
  },
  methods: {
    handleTab (val) {
      window.location.href = `/users/list/${val}`
    },
    getData () {
      const that = this
      this.loading = true
      this.tableData = []
      this.$request.get(`/api/users`, { status: this.type }).then(res => {
        this.loading = false
        if (res.code === 0) {
          this.tableData = res.data.rows || []
          this.total = res.data.count
        } else {
          that.$message.warning(res.msg)
        }
      }).catch(e => {
        this.loading = false
      })
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.pageNum = 1
      this.getData()
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.getData()
    },
    handleEdit (id) {
      this.dialogVisible = true
      this.selId = id
      this.userForm = Object.assign({}, this.tableData.find((item) => item.id === id))
    },
    confirm () {
      this.$request.put(`/api/users/${this.selId}`, this.userForm).then(res => {
        if (res.code === 0) {
          this.dialogVisible = false
          this.getData()
        } else {
          this.$message.warning(res.msg)
        }
      })
    },
    handleDelete (id) {
      this.$confirm(this.$t('userManage.delTip'), this.$t('Delete'), {
        confirmButtonText: this.$t('ok'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        if (this.operating) return
        this.operating = true
        this.$request.delete(`/api/users/${id}`).then(res => {
          this.operating = false
          if (res.code === 0) {
            this.$message.success($t('delSucc'))
            this.getData()
          } else {
            this.$message.error(res.msg)
          }
        }).catch(() => { this.operating = false })
      }).catch(() => {})
    },
    handlePass (id) {
      this.$request.post(`/api/users/pass/${id}`, { status: 1 }).then(res => {
        if (res.code === 0) {
          this.$message.success('userManage.passSucc')
          window.location.href = '/users/list/1'
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleReject (id) {
      this.$request.post(`/api/users/pass/${id}`, { status: 3 }).then(res => {
        if (res.code === 0) {
          this.$message.success('userManage.passSucc')
          window.location.href = '/users/list/3'
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    sendEmail (id) {
      this.$request.get(`/api/users/email/${id}`).then(res => {
        if (res.code === 0) {
          this.$message.success('userManage.sendSucc')
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  }
}
</script>
