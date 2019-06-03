<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">开发者登录</div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="请输入您的用户名/账号">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="请输入您的密码" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')">
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
                <div class="login-btn">
                    <el-button type="success" @click="register()">没有账号？点击注册</el-button>
                </div>
                <div class="login-btn">
                    <el-button type="danger" @click="forgetpass()">忘记密码？点击找回</el-button>
                </div>
                <p class="login-tips" style="color: black;">Tips : 长治学院毕设-赵亮-15407248<br/>基于spring cloud的OBS云存储管理系统。</p>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        data: function(){
            return {
                ruleForm: {
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
            }
        },
        mounted(){
            localStorage.clear();
        },
        methods: {

            submitForm(formName) {
                var that = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        //现在去服务器获取验证
                        console.log(this.URL)
                        this.$axios({
                            method:"POST",
                            url:this.URL+"/developerlogin/login",
                            headers:{
                                'Content-type': 'application/x-www-form-data'
                            },
                            params:{
                                username:this.ruleForm.username,
                                password:this.ruleForm.password
                            }
                        }).then((res)=>{
                            if(res.data.resultStatus){
                                //账号密码正确
                                // console.log(res)
                                localStorage.setItem('dev_id',res.data.resultData.id);
                                localStorage.setItem('dev_name',res.data.resultData.name);
                                localStorage.setItem('dev_username',res.data.resultData.username);
                                this.$router.push('/');
                            }else{
                                this.$message.error(res.data.errorMessage);
                            }
                            // console.log(res.data);
                            // console.log(this)
                            // console.log(this.$router)
                        }).catch(function (e) {
                            // console.log(e.message)
                            that.$message.error(e.message);
                        })
                        // localStorage.setItem('ms_username',this.ruleForm.username);
                        // this.$router.push('/');
                    } else {
                        console.log('error submit!!');
                        this.$message.error("请填写账号和密码");
                        return false;
                    }
                });
            },
            register:function(){
                var that = this;
                console.log("前往注册")
                this.$router.push('/register');
            },
            forgetpass:function(){
                var that = this;
                console.log("找回密码")
                this.$router.push('/forgetpass');
            },
        }
    }
</script>

<style scoped>
    .el-form {
        width: 82%;
    }
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
        background-image: url(../../../assets/img/login-bg.jpg);
        background-size: 100%;
    }
    .ms-title{
        width:100%;
        line-height: 50px;
        text-align: center;
        font-size:20px;
        color: #fff;
        border-bottom: 1px solid #ddd;
    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:350px;
        margin:-190px 0 0 -175px;
        border-radius: 5px;
        background: rgba(255,255,255, 0.3);
        overflow: hidden;
    }
    .ms-content{
        padding: 30px 30px;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
        margin-bottom: 10px;
    }
    .login-tips{
        font-size:12px;
        line-height:30px;
        color:#fff;
    }
</style>