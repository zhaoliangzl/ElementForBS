<template xmlns:v-clipboard="http://www.w3.org/1999/xhtml">
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 表单</el-breadcrumb-item>
                <el-breadcrumb-item>基本表单</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box" style="width: 100%;">
                <el-form ref="form" label-width="200px">
                    <el-form-item label="公有云单文件上传链接">
                        <el-input v-model="uploadLink"></el-input>
                    </el-form-item>
                    <!--<el-form-item label="公有云多文件上传链接">-->
                        <!--<el-input v-model="uploadLink"></el-input>-->
                    <!--</el-form-item>-->
                    <el-form-item v-if="!enable">
                        <el-button type="primary" @click="copyLink">复制公有链单文件上传链接</el-button>
                        <!--<el-button type="primary" @click="copyLink">复制公有链多文件上传链接</el-button>-->
                    </el-form-item>
                    <el-form-item label="私有云上传链接">
                        <el-input v-model="privateUploadLink"></el-input>
                    </el-form-item>
                    <el-form-item label="私有云上传密钥">
                        <el-input v-model="privateSecret"></el-input>
                    </el-form-item>
                    <el-form-item v-if="!enable">
                        <el-button type="primary" @click="copyLink">复制链接</el-button>
                        <el-button type="primary" @click="testTime">test时间戳</el-button>
                    </el-form-item>
                    <el-form-item v-if="enable">
                        <el-button type="primary" @click="generateUpLoadLink">生成上传链接</el-button>
                    </el-form-item>
                    <p>注意:请保护好您的密钥信息，私有链的上传请保护好您的密钥，防止被他人盗取您的流量。单文件上传文件参数名位file,多文件上传文件参数名为files</p>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import {Decrypt,Encrypt} from '@/js/utils.js'
    export default {
        name: 'GetUploadLink',
        data: function(){
            return {
                uploadLink:"",
                privateSecret:"",
                privateUploadLink:"",
                enable:false,
                message: 'first',
                showHeader: false,
            }
        },
        mounted(){
            //初始化加载
            //获取类型分类列表
            //this.uploadLink = "123";
            this.getUploadLink();

        },
        methods: {
            copyLink(){
                let that = this;
                this.$copyText(this.uploadLink).then(function (e) {
                    that.$message.success("复制成功");

                }, function (e) {
                    alert('复制失败')
                    console.log(e)
                })
            },
            onSubmit() {
                this.$message.success('提交成功！');
            },
            getUploadLink(){
                this.$axios({
                    method:"GET",
                    url:this.URL+"/developer/getuploadlink?id="+localStorage.getItem("dev_id"),
                }).then((res)=>{
                    if(res.data.resultStatus){
                        console.log(res.data)
                        this.uploadLink = res.data.resultData.publicUploadLink;
                        this.privateUploadLink = res.data.resultData.privateUploadLink;
                        this.privateSecret = res.data.resultData.privateSecret;
                        //console.log("shezhi1"+res.data.resultData);
                    }else{
                        this.$message.error(res.data.errorMessage);
                        this.enable = true;
                    }
                }).catch(function (e) {
                    console.log(e)
                })
            },
            testTime:function(){
                let secret = "b894a68fc2ce8ff3df13984755b2ed47";
                let tx = String(new Date().getTime()).substring(0,9)+"0000000";
                console.log("tx=>"+tx)
                let t = Encrypt(secret,tx);
                let x = "";
                for (let i = 0; i < t.length; i++) {
                    if(t[i] == "+"){
                        x += "%2b";
                       // console.log("找到+号，进行替换")
                    }else{
                        x += t[i];
                    }
                    //console.log(t[i])
                }
                // t = t.replace("+","%2b");
                console.log(x)
                this.$axios({
                    method:"GET",
                    url:this.URL+"/test/time?code="+x,
                }).then((res)=>{
                    if(res.data.resultStatus){
                        console.log(res.data)
                        //this.uploadLink = res.data.resultData;
                        //console.log("shezhi1"+res.data.resultData);

                    }else{
                        this.$message.error(res.data.errorMessage);
                        //this.enable = false;
                    }
                }).catch(function (e) {
                    console.log(e)
                })
              console.log("当前时间戳")
            },
            generateUpLoadLink(){
                this.$axios({
                    method:"GET",
                    url:this.URL+"/developer/generateuploadlink?id="+localStorage.getItem("dev_id"),
                }).then((res)=>{
                    if(res.data.resultStatus){
                        console.log(res.data)
                        this.uploadLink = res.data.resultData.publicUploadLink;
                        this.privateUploadLink = res.data.resultData.privateUploadLink;
                        this.privateSecret = res.data.resultData.privateSecret;
                        //console.log("shezhi1"+res.data.resultData);
                        this.enable = false;
                    }else{
                        this.$message.error(res.data.errorMessage);
                        //this.enable = false;
                    }
                }).catch(function (e) {
                    console.log(e)
                })

            },


        }
    }
</script>