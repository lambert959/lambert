<template>
  <Layout :title="$t('menu.home')">
    <HomeContainer :user-name="userName" :role-type="roleType" :menu-type="1" :version="version">
      <div class="content-header">
        <div>
          <span :class="{'content-title': true, choosed: chooseType === '1'}" @click="handleTab('1')">{{ $t('project.myCreated') }}</span>
          <span :class="{'content-title': true, choosed: chooseType === '2'}" @click="handleTab('2')">{{ $t('project.myJoined') }}</span>
        </div>
        <div class="content-operation">
          <a v-if="chooseType === '1'" class="operation-btn" href="/project/create">
            <i class="iconfont icon551" :title="$t('project.createPro')" />
          </a>
          <el-input
            v-model="keyword"
            class="search-input"
            :placeholder="$t('project.searchByProName')"
            @input="handleSearch"
          >
            <i slot="prefix" class="iconfont iconsousuo" />
          </el-input>
        </div>
      </div>
      <div v-loading="loading" class="content-box">
        <div v-show="chooseType === '1'">
          <el-card v-for="item in ownProjects" :key="item.id" style="margin-bottom:10px;position:relative;" shadow="hover">
            <div slot="header" class="clearfix">
              <span style="font-size:16px;font-weight:bold;margin-right:20px">{{ item.name }}</span>
              <span>{{ $t('project.proType') }}： {{ typeMap[item.type] }}</span>
              <!-- <el-button style="float: right; padding: 3px 0" type="text" @click="handleShowMembers(item)">
                <i style="color:#FF7335" class="iconfont iconyonghu2" :title="$t('project.proUsers')"></i>
              </el-button> -->
            </div>
            <span style="margin-right:10px">{{ $t('project.proTime') }}：{{ $dateFormat(item.createdAt) }}</span>
            <span>{{ $t('project.proUpdateTime') }}：{{ $dateFormat(item.updatedAt) }}</span>
            <!-- <el-button style="position:absolute;right:60px;bottom:10px;" type="text" @click="closeProject(item)">
              <i class="iconfont iconxiang3" title="关闭项目"></i>
            </el-button> -->
            <el-button style="position:absolute;right:20px;bottom:10px;" type="text" @click="openProject(item)">
              <i class="iconfont iconshiliangzhinengduixiang1" :title="$t('project.openPro')" />
            </el-button>
            <el-button
              class="handle-btn btn1"
              type="text"
              size="small"
              @click="handleEdit(item)"
            >
            <!--  {{ $t('update') }} -->
            </el-button>
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
              @click="handleDeleteProject(item.id)"
            >
              {{ $t('delete') }}
            </el-button>
          </el-card>
        </div>
        <div v-show="chooseType === '2'">
          <el-card v-for="item in joinProjects" :key="item.id" style="margin-bottom:10px;position:relative;">
            <div slot="header" class="clearfix">
              <span style="font-size:16px;font-weight:bold;margin-right:20px">{{ item.name }}</span>
              <span>{{ $t('project.proType') }}{{ typeMap[item.type] }}</span>
              <!-- <el-button style="float: right; padding: 3px 0" type="text" @click="handleShowMembers(item)">
                <i style="color:#FF7335" class="iconfont iconyonghu2" :title="$t('project.proUsers')"></i>
              </el-button> -->
            </div>
            <span style="margin-right:10px">{{ $t('project.proType') }}{{ typeMap[item.type] }}</span>
            <span style="margin-right:10px">{{ $t('project.proTime') }}：{{ $dateFormat(item.createdAt) }}</span>
            <span>{{ $t('project.proUpdateTime') }}：{{ $dateFormat(item.updatedAt) }}</span>
            <el-button style="position:absolute;right:20px;bottom:10px;" type="text" @click="openProject(item)">
              <i class="iconfont iconshiliangzhinengduixiang1" :title="$t('project.openPro')" />
            </el-button>
            <el-button
              class="handle-btn btn1"
              type="text"
              size="small"
              @click="handleDetail(item)"
            >
              {{ $t('detail') }}
            </el-button>
          </el-card>
        </div>
      </div>
      <!-- 查看用户 -->
      <el-dialog
        :title="$t('project.proUsers')"
        width="50%"
        :visible.sync="showUsers"
        :close-on-click-modal="false"
      >
        <!-- <el-autocomplete
          style="margin-bottom: 20px"
          v-show="chooseType === '1'"
          v-model="toAddUserName"
          :fetch-suggestions="querySearchAsync"
          :placeholder="$t('project.userTip')"
          @select="handleSelect"
        >
          <i
            class="el-icon-search el-input__icon"
            slot="prefix">
          </i>
        </el-autocomplete> -->
        <el-table
          :data="memberData"
          style="width: 100%"
          max-height="300"
        >
          <el-table-column prop="username" :label="$t('project.user')" />
          <el-table-column prop="name" :label="$t('project.role')">
            <template slot-scope="scope">
              <span>{{ selProject.created_user_id === scope.row.id ? $t('project.creator') : $t('project.member') }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column :label="$t('operation')" v-if="chooseType === '1'">
            <template slot-scope="scope">
              <el-button
                v-if="selProject.created_user_id !== scope.row.id"
                class="handle-btn btn2"
                type="text"
                size="small"
                @click="handleDeleteMember(scope.row.id)"
              >
                {{$t('delete')}}
              </el-button>
            </template>
          </el-table-column> -->
        </el-table>
      </el-dialog>
      <!-- 修改项目信息 -->
      <el-dialog
        :title="opeType === 'edit' ? $t('update') : $t('detail')"
        width="50%"
        :visible.sync="showOpe"
        :close-on-click-modal="false"
      >
        <!-- :key="(new Date()).getTime()" -->
        <el-form
          ref="projectForm" :model="selProject" label-width="100px" label-position="top"
          class="demo-ruleForm"
        >
          <el-form-item v-if="opeType === 'edit'" :label="$t('project.name')" prop="name">
            <el-input v-model="selProject.name" :placeholder="$t('project.enterName')" />
          </el-form-item>
          <el-form-item :label="$t('project.proUsers')" prop="users">
            <el-select
              v-if="opeType === 'edit'" :key="(new Date()).getTime()" v-model="selProject.users" multiple
              :placeholder="$t('project.selectUsers')" :disabled="opeType === 'detail'"
            >
              <el-option v-for="(user, index) in userList" :key="index" :label="user.username" :value="user.id" />
            </el-select>
            <ul v-else class="user-list form-content-detail">
              <li v-for="(user, index) in userList" :key="index">
                {{ user.username + (index !== userList.length - 1 ? '、' : '') }}
              </li>
            </ul>
          </el-form-item>
          <el-form-item :label="$t('project.description')">
            <el-input
              v-if="opeType === 'edit'"
              v-model="selProject.description"
              type="textarea"
              :rows="3"
              show-word-limit
              maxlength="200"
              resize="none"
              :placeholder="$t('project.enterDetail')"
              :disabled="opeType === 'detail'"
            />
            <span v-else class="form-content-detail">{{ selProject.description }}</span>
          </el-form-item>
          <el-form-item v-if="opeType === 'edit'" label="" prop="pass">
            <el-button
              type="success" :disabled="editDisabled" :loading="opeLoading" style="width:100%;"
              @click="handleEditProject"
            >
              {{ $t('ok') }}
            </el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </HomeContainer>
  </Layout>
</template>

<script type="text/babel">
import cloneDeep from 'lodash/cloneDeep'
import './home.scss'
export default {
  data () {
    return {
      loading: false,
      chooseType: '1',
      keyword: '',
      showUsers: false,
      selProject: {},
      selProjectInit: {},
      memberData: [],
      toAddUserName: '',
      typeMap: {
        1: 'prolin',
        2: 'android'
      },
      showOpe: false,
      opeType: 'edit',
      opeLoading: false,
      userList: []
    }
  },
  computed: {
    editDisabled () {
      return JSON.stringify(this.selProjectInit) === JSON.stringify(this.selProject)
    }
  },
  mounted () {
    // console.log(this.ownProjects);
    // console.log(this.joinProjects)
  },
  methods: {
    handleTab (val) {
      this.chooseType = val
      if (this.keyword) {
        this.keyword = ''
        this.handleSearch()
      }
    },
    handleSearch () {
      if (this.loading) return
      this.loading = true
      const params = {
        chooseType: this.chooseType,
        searchName: this.keyword
      }
      const flag = this.chooseType
      this.$request.get(`/api/project/list`, params).then(res => {
        this.loading = false
        if (res.code === 0) {
          if (flag === '1') {
            this.ownProjects = res.data
          } else {
            this.joinProjects = res.data
          }
        } else {
          this.$message.warning(res.msg)
        }
      }).catch(e => {
        this.loading = false
      })
    },
    closeProject (project) {
      this.$request.get(`/api/project/close`, {
        projectId: project.id
      }).then(res => {
        if (res.code === 0) {
          console.log(res.data)
          this.$message.success(res.msg)
        } else {
          this.$message.warning(res.msg)
        }
      })
    },
    openProject (project) {
      this.loading = true
      this.$request.get(`/api/project/open`, {
        projectId: project.id
      }).then(res => {
        this.loading = false
        if (res.code === 0) {
          console.log(res.data)
          window.open(res.data)
        } else {
          this.$message.warning(res.msg)
        }
      }).catch(() => { this.loading = false })
    },
    handleEdit (item) {
      this.selProject = this.selProjectInit = cloneDeep(item)
      this.showOpe = true
      this.opeType = 'edit'
      this.getAllUsers(this.selProject)
      this.getMembers(this.selProject, true)
    },
    handleEditProject () {
      if (this.opeLoading) return
      this.opeLoading = true
      this.$request.put(`/api/project/${this.selProject.id}`, this.selProject).then(res => {
        this.opeLoading = false
        if (res.code === 0) {
          this.showOpe = false
          this.$message.success(this.$t('updateSucc'))
          this.handleSearch()
        } else {
          this.$message.warning(res.msg)
        }
      }).catch(e => {
        this.opeLoading = false
      })
    },
    handleDetail (item) {
      this.selProject = cloneDeep(item)
      this.showOpe = true
      this.opeType = 'detail'
      this.getAllUsers(this.selProject)
      this.getMembers(this.selProject, true)
    },
    getAllUsers (project) {
      this.$request.get(`/api/users`, { status: 1 }).then(res => {
        if (res.code === 0) {
          this.userList = res.data.rows.filter(user => user.id !== project.created_user_id) || []
        } else {
          this.$message.warning(res.msg)
        }
      })
    },
    handleShowMembers (project) {
      this.showUsers = true
      this.selProject = project
      this.getMembers(project)
    },
    getMembers (project, isEdit) {
      this.$request.get(`/api/project/users`, {
        projectId: project.id
      }).then(res => {
        if (res.code === 0) {
          this.memberData = isEdit ? res.data.filter(user => user.id !== project.created_user_id) : res.data
          this.selProject.users = Array.from(this.memberData).map(user => user.id)
          this.selProjectInit = cloneDeep(this.selProject)
        } else {
          this.$message.warning(res.msg)
        }
      })
    },
    handleDeleteProject (id) {
      this.$confirm(this.$t('project.delProTip'), this.$t('delete'), {
        confirmButtonText: this.$t('ok'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        if (this.opeLoading) return
        this.opeLoading = true
        this.$request.delete(`/api/project/${id}`).then(res => {
          // console.log(res);
          this.opeLoading = true
          if (res.code === 0) {
            this.$message.success(this.$t('delSucc'))
            this.handleSearch()
          } else {
            this.$message.warning(res.msg)
          }
        }).catch(e => {
          this.opeLoading = false
        })
      }).catch(() => {})
    },
    /* handleDeleteMember(userId) {
        this.$confirm(this.$t('project.delUserTip'), this.$t('delete'), {
          confirmButtonText: this.$t('ok'),
          cancelButtonText: this.$t('Cancal'),
          type: 'warning'
        }).then(() => {
          this.$request.delete(`/api/project/users`, {
            projectId: this.selProject.id,
            userId: userId
          }).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: this.$t('delSucc')
              });
              this.getMembers(this.selProject);
            } else {
              this.$message.warning(res.msg);
            }
          });
        }).catch(() => {});
      }, */
    querySearchAsync (queryString, cb) {
      if (queryString != null && queryString.length > 0) {
        // 获取搜索数据
        this.$request.get(`/api/users/search`, { fuzzy: queryString }).then(res => {
          // 封装要显示的数据
          const list = []
          for (const v of res.data) {
            list.push({ value: v.username, id: v.id })
          }
          // 调用 callback 返回建议列表的数据,是一个数组类型
          cb(list)
        }, err => {
          console.log(err)
        })
      }
    },
    handleSelect (item) {
      console.log(item)
      const isExist = this.memberData.some((user) => {
        return user.username === item.value
      })
      if (isExist) {
        this.$message.warning(this.$t('project.singleTip'))
        return
      }
      this.$request.post(`/api/project/users`, {
        projectId: this.selProject.id,
        userId: item.id
      }).then(res => {
        if (res.code === 0) {
          console.log(res.data)
          this.toAddUserName = ''
          this.getMembers(this.selProject)
          // this.memberData = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  }
}
</script>
