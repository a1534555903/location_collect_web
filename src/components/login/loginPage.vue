<template>
  <div class="login-container">
    <el-form ref="form" :model="loginForm" label-width="80px" :rules="rules">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="loginForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="loginForm.password" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm" style="display: block; margin: 0 auto;">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {ElMessageBox} from "element-plus";

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ]
      }
    };
  },
  methods: {
    // 提交表单
    submitForm() {
      this.$refs.form.validate((valid) => {
            if (valid) {
              //axios发送Get请求到url
              this.$axios.get(this.$store.state.url + '/web/admin/login',
                  {
                    params: {
                      username: this.loginForm.username,
                      password: this.loginForm.password
                    }
                  })
                  .then((res) => {
                    // console.log(res);
                    // console.log(res.data);
                    if (res.data === 'success') {
                      // 用vue route 跳转到主页
                      this.$router.push('/index');
                    } else {
                      ElMessageBox.alert('用户名或密码错误', '提示', {
                        confirmButtonText: '确定',
                        callback: action => {
                          this.$refs.form.clearValidate();
                        }
                      });
                      return false;
                    }
                  });
            } else {
              ElMessageBox.alert('请检查输入的内容', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  this.$refs.form.clearValidate();
                }
              });
              return false;
            }
          }
      )
      ;
    }
  }
}
;
</script>

<style scoped>
.login-container {
  width: 400px;
  margin: 50px auto;
}
</style>
