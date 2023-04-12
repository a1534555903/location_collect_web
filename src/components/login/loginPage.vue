<template>
  <div class="login-container">
    <el-form ref="form" :model="loginForm" label-width="80px">
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
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    // 提交表单
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 登录成功后的操作
          console.log('登录成功');
        } else {
          console.log('表单验证失败');
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
.login-container {
  width: 400px;
  margin: 50px auto;
}
</style>
