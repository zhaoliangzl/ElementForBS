<template>
    <div class="total">

        <div class="container">
            <div class="form-box">

                <el-form  :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
                    <div class="crumbs" style="color: #000;">
                        <el-breadcrumb separator="/">
                            <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 忘记密码</el-breadcrumb-item>
                            <el-breadcrumb-item>找回密码</el-breadcrumb-item>
                        </el-breadcrumb>
                    </div>


                    <el-form-item label="邮箱" class="f" prop="email" style="margin-top: 20px;">
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


                    <el-form-item v-if="flag" label="新密码" prop="password">
                        <el-input v-model="ruleForm.password" placeholder="请输入您的密码">
                            <el-button slot="prepend" icon="el-icon-lx-attention"></el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item v-if="flag" label="确认新密码" prop="password2">
                        <el-input v-model="ruleForm.password2" placeholder="请再次输入您的密码">
                            <el-button slot="prepend" icon="el-icon-lx-attentionfill"></el-button>
                        </el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="onSubmit('ruleForm')">{{buttonText}}</el-button>
                        <el-button @click="back()">返回
                        </el-button>
                    </el-form-item>
                </el-form>
                <img class="img" src="../../../assets/img/yongzheng.jpg"/>

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
                buttonText:"验证邮箱",
                ruleForm: {
                    email:"",
                    code:"",
                    password:"",
                    password2:""
                },
                //邮箱验证通过标志
                flag : false,
                id:0,
                rules: {
                    email:[
                        { required: true, message: '请输入邮箱', trigger: 'blur' }
                    ],
                    code:[
                        { required: true, message: '请输入邮箱验证码', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
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
                if(this.flag){
                    //现在是去更改密码
                    this.$refs[formName].validate((valid) => {
                        console.log(valid)
                        if (valid) {
                            if(this.password != this.password2){
                                this.$message.error("两次的密码不一致");
                                return false;
                            }
                            console.log(this.ruleForm)
                            //发起注册请求
                            this.$axios({
                                method:"POST",
                                url:this.URL+"/developerlogin/changepwd",
                                headers:{
                                    'Content-type': 'application/x-www-form-data'
                                },
                                params:{
                                    password:this.ruleForm.password,
                                    email:this.ruleForm.email,
                                    code:this.ruleForm.code
                                }
                            }).then((res)=>{
                                if(res.data.resultStatus){
                                    //账号密码正确
                                    this.$message.success("修改成功");
                                    this.$router.push('/');
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


                }else{
                    //现在是验证邮箱
                    //现在
                    console.log("验证邮箱")
                    let myemail = this.ruleForm.email;

                    var myReg=/^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/;

                    if(myReg.test(myemail) && this.code != ""){
                        //提交邮箱验证
                        this.$axios({
                            method:"POST",
                            url:this.URL+"/developerlogin/getcheckmail2",
                            headers:{
                                'Content-type': 'application/x-www-form-data'
                            },
                            params:{
                                email:this.ruleForm.email,
                                code:this.ruleForm.code
                            }
                        }).then((res)=>{
                            console.log(res)
                            if(res.data.resultStatus){
                                //账号密码正确
                                this.id = res.data.resultData.id;
                                this.flag = true;
                                this.buttonText = "确认修改";
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
                        this.$message.error("请填写完整信息");
                    }
                }
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
                            url:this.URL+"/developerlogin/getcheckmail?email="+myemail,
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
        background-image: url(../../../assets/img/forgetpass.jpg);
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
    .container{
        width: 70%;
    }
    .right{
        margin-top: -100%;
        float: right;
        width: 39%;

    }
    .img{
        width: 90%;
        height: 100%;
        max-width: 545px;

        padding-left: 10%;
    }
    .el-form{
        width: 65%;
    }
</style>