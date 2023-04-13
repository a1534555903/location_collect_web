<template>
  <div class="reset-password">
    <el-form :model="form" :rules="rules" ref="form" label-width="80px" class="reset-password-form">
      <el-form-item label="原密码" prop="oldPassword">
        <el-input type="password" v-model="form.oldPassword" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input type="password" v-model="form.newPassword" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="confirmNewPassword">
        <el-input type="password" v-model="form.confirmNewPassword" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      form: {
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      },
      rules: {
        oldPassword: [
          { required: true, message: '请输入原密码', trigger: 'blur' },
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能少于6位', trigger: 'blur' },
        ],
        confirmNewPassword: [
          { required: true, message: '请确认新密码', trigger: 'blur' },
          { validator: this.checkPassword, trigger: 'blur' },
        ],
      },
    };
  },
  computed: {
    ...mapState(['user']),
  },
  methods: {
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const { oldPassword, newPassword } = this.form;
          this.$axios.post('/resetPassword', { oldPassword, newPassword })
              .then(res => {
                if (res.data.code === 200) {
                  this.$message.success('密码重置成功');
                } else {
                  this.$message.error(res.data.msg || '密码重置失败');
                }
              })
              .catch(error => {
                this.$message.error(error.message || '密码重置失败');
              });
        }
      });
    },
    handleReset() {
      this.$refs.form.resetFields();
    },
    checkPassword(rule, value, callback) {
      if (value !== this.form.newPassword) {
        callback(new Error('两次输入的密码不一致'));
      } else {
        callback();
      }
    },
  },
};
</script>

<style scoped>
.reset-password {
  background-color: #f0f2f5;
  padding: 20px;
}

.reset-password-form {
  max-width: 400px;
  margin: 0 auto;
}
</style>
