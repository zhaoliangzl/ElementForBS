<template>
    <div class="total">
        <div class="crumbs" style="color: #000;">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 注册</el-breadcrumb-item>
                <el-breadcrumb-item>注册基本信息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container" style="width: 70%">
            <div class="form-box">
                <el-form  :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
                    <el-form-item label="邮箱" class="f" prop="email">
                        <el-input v-model="ruleForm.email" placeholder="请输入您的邮箱">
                            <el-button slot="prepend" icon="el-icon-lx-mail"></el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="邮箱验证码" prop="code">
                        <el-input v-model="ruleForm.code" style="width: 50%" placeholder="请输入您的邮箱验证码" >
                            <el-button slot="prepend" icon="el-icon-lx-qrcode"></el-button>
                        </el-input>
                        <el-button type="primary" ref='timeText' @click="getCode()" style="margin-left: 10%">{{timeTextT}}</el-button>
                    </el-form-item>

                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="ruleForm.username" placeholder="请输入您的用户名"  @keyup.enter.native="submitForm('ruleForm')">
                            <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                        </el-input>
                    </el-form-item>

                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="ruleForm.name" placeholder="请输入您的姓名">
                            <el-button slot="prepend" icon="el-icon-lx-peoplefill"></el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="ruleForm.password" placeholder="请输入您的密码">
                            <el-button slot="prepend" icon="el-icon-lx-attention"></el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="password2">
                        <el-input v-model="ruleForm.password2" placeholder="请再次输入您的密码">
                            <el-button slot="prepend" icon="el-icon-lx-attentionfill"></el-button>
                        </el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="onSubmit('ruleForm')">注册</el-button>
                        <el-button @click="back()">返回
                        </el-button>
                    </el-form-item>
                    <p>注：注册即送50M的存储空间和100M每月的下行流量。</p>
                </el-form>
                <img class="img" src="../../../assets/img/heike.jpg"/>

            </div>


        </div>

        <vue-particles
                color="#dedede"
                :particleOpacity="0.7"
                :particlesNumber="80"
                shapeType="circle"
                :particleSize="4"
                linesColor="#dedede"
                :linesWidth="1"
                :lineLinked="true"
                :lineOpacity="0.4"
                :linesDistance="150"
                :moveSpeed="3"
                :hoverEffect="true"
                hoverMode="grab"
                :clickEffect="true"
                clickMode="push"
        >
        </vue-particles>

    </div>

</template>

<script>
    export default {
        name: 'Register',
        data: function(){
            return {
                timeTextT:"获取邮箱验证码",
                timeTextFlag:true,
                timer: '',
                timeNum:0,
                ruleForm: {
                    email:"",
                    name: '',
                    code:"",
                    username:'',
                    password:"",
                    password2:""
                },
                rules: {
                    email:[
                        { required: true, message: '请输入邮箱', trigger: 'blur' }
                    ],
                    code:[
                        { required: true, message: '请输入邮箱验证码', trigger: 'blur' }
                    ],
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ],
                    name: [
                        { required: true, message: '请输入姓名', trigger: 'blur' }
                    ],
                    password2: [
                        { required: true, message: '请输入确认密码', trigger: 'blur' }
                    ]
                }

            }
        },
        beforeDestroy: function () {
            clearInterval(this.timer);
        },
        mounted(){
            console.log("3333");
        },
        methods: {
            back(){
                this.$router.push('/login');
            },
            onSubmit(formName) {
                console.log(formName)
                console.log(this.$refs[formName])
                this.$refs[formName].validate((valid) => {

                    if(this.password != this.password2){
                        this.$message.error("两次的密码不一致");
                        return false;
                    }

                    console.log(valid)
                    if (valid) {
                        console.log(this.ruleForm)
                        //发起注册请求
                        this.$axios({
                            method:"POST",
                            url:this.URL+"/developerlogin/register",
                            headers:{
                                'Content-type': 'application/x-www-form-data'
                            },
                            params:{
                                username:this.ruleForm.username,
                                password:this.ruleForm.password,
                                name:this.ruleForm.name,
                                email:this.ruleForm.email,
                                code:this.ruleForm.code
                            }
                        }).then((res)=>{
                            if(res.data.resultStatus){
                                //账号密码正确
                                this.$message.success("注册成功");
                                this.$router.push('/login');
                            }else{
                                this.$message.error(res.data.errorMessage);
                            }
                            console.log(res.data);
                            console.log(this)
                            console.log(this.$router)
                        }).catch(function (e) {
                            console.log(e)
                        })



                    }else{
                        this.$message.error("请将信息填写完整");
                    }
                });
                //this.$message.success('提交成功！');
            },
            timex(){

                if(++this.timeNum >=60){
                    clearInterval(this.timer);
                    this.$refs.timeText.$el.style.backgroundColor = "#409EFF";
                    this.$refs.timeText.$el.style.color = "white";
                    this.timeTextFlag = true;
                    this.timeTextT = "获取邮箱验证码";
                    clearInterval(this.timer);
                    this.timeNum = 0;
                }else{
                    this.timeTextT = (61-this.timeNum)+"秒后重新发送"
                }
            },
            getCode(){
                if(this.timeTextFlag){
                    let myemail = this.ruleForm.email;

                    var myReg=/^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/;

                    if(myReg.test(myemail)){


                        console.log(this.$refs.timeText.$el)
                        //开始发送验证码
                        this.$axios({
                            method:"GET",
                            url:this.URL+"/developerlogin/getcheckcode?email="+myemail,
                        }).then((res)=>{
                            if(res.data.resultStatus){
                                //账号密码正确
                               //邮件发送成功
                                this.$message.success("邮件已经发送，请注意查收。");

                                this.timeTextFlag = false;
                                this.$refs.timeText.$el.style.backgroundColor = "white";
                                this.$refs.timeText.$el.style.color = "black";

                                this.timer = setInterval(this.timex, 1000);

                            }else{
                                this.$message.error(res.data.errorMessage);
                            }
                            // console.log(res.data);
                            // console.log(this)
                            // console.log(this.$router)
                        }).catch(function (e) {
                            console.log(e)
                        })



                        return true;
                    }else{
                        this.$message.error("请填写正确格式的邮箱地址");
                        return false;
                    }
                }else{
                    this.$message.error("请稍后再获取验证码");
                }

            }
        }
    }
</script>
<style>
    .form-box{
        width: 86%;
        display: -webkit-inline-box;
    }
    .total{
        margin-top: 100px;
        margin-left: 100px;
    }
    body{
        background-image: url(../../../assets/img/login-bg.jpg);
        background: no-repeat center top;
        background-size: contain;
    }
    #particles-js {
        background-image: url(../../../assets/img/register_bg.jpg);
        background-size: cover;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
    }
    .el-form-item__label{
        width: 100px;
    }
    /*.container{*/
        /*width: 70%;*/
    /*}*/
    .right{
        margin-top: -100%;
        float: right;
        width: 39%;

    }
    .img{
        width: 90%;
        height: 100%;

        padding-left: 10%;
    }
    .el-form{
        width: 65%;
    }
</style>