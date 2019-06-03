<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 演示</el-breadcrumb-item>
                <el-breadcrumb-item>私有接口图片上传演示</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="content-title">拖拽上传</div>
            <!--<div class="plugins-tips">-->
            <!--Element UI自带上传组件。-->
            <!--访问地址：<a href="http://element.eleme.io/#/zh-CN/component/upload" target="_blank">Element UI Upload</a>-->
            <!--</div>-->


            <!--<el-select v-model="selectObs" placeholder="请选择" style="width: 100%">-->
            <!--<el-option-->
            <!--v-for="item in obsList"-->
            <!--:key="item.id"-->
            <!--:label="item.name"-->
            <!--:value="item.id">-->
            <!--<span style="float: left">{{ item.name }}</span>-->
            <!--<span style="float: right; color: #8492a6; font-size: 13px">https://{{item.endpoint}}/{{item.bucketName}}</span>-->
            <!--</el-option>-->
            <!--</el-select>-->



            <el-upload
                    class="upload-demo"
                    drag
                    :action="uploadUrl"
                    :data="uploadData"
                    :on-success="fileSuccess"
                    :file-list = "fileList"
                    :before-upload = "uploadBefore"
                    multiple>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">任何文件均可上传</div>
            </el-upload>
            <div class="form-box" style="margin-top: 30px;width:100%;">
                <el-form ref="info" :model="info" label-width="150px">
                    <el-form-item label="私有上传链接">
                        <el-input v-model="info.privateUpladLinkS"></el-input>
                    </el-form-item>
                    <el-form-item label="私有上传密钥">
                        <el-input v-model="info.privateSecretS"></el-input>
                    </el-form-item>
                    <el-form-item label="加密后的参数">
                        <el-input v-model="info.encySecret"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="success" @click="xianLink">显示链接</el-button>
                        <el-button type="primary" @click="copyLink">复制链接</el-button>
                        <el-button type="success" @click="xianSecret">显示密钥</el-button>
                        <el-button type="primary" @click="copySecret">复制密钥</el-button>
                    </el-form-item>

                </el-form>
            </div>
            <p>
                注意：本接口为测试接口，开发者可以通过F12开发者调试工具分析本接口的请求以及返回参数。公共上传接口需要使用您的公共接口密钥，这里上传将浪费您的流量，请注意。
            </p>

        </div>
    </div>
</template>

<script>
    import VueCropper  from 'vue-cropperjs';
    import {Decrypt,Encrypt} from '@/js/utils.js';
    export default {
        name: 'uploadPrivate',
        data: function(){
            return {
                defaultSrc: require('../../assets/img/img.jpg'),
                fileList: [],
                uploadData:{
                    secret:""
                },
                imgSrc: '',
                cropImg: '',
                dialogVisible: false,
                selectObs:"",
                enAbleUpload:false,
                uploadUrl:"",
                info:{
                    privateUpladLink:"",
                    privateSecret:"",
                    privateUpladLinkS:"*************************************************************************",
                    privateSecretS:"*************************************************************************",
                    encySecret:""
                },
                time:null
            }
        },
        components: {
            VueCropper
        },
        mounted(){
            clearInterval(this.timer)
            console.log("页面加载");
            let userId = localStorage.getItem("dev_id");
            console.log(userId)

            //开始请求数据库，获取可以上传的obs列表
            this.$axios({
                method:"GET",
                url:this.URL+"/developer/getuploadlink?id="+userId,
            }).then((res)=>{
                if(res.data.resultStatus){
                    console.log(res.data)
                    this.info.privateUpladLink = res.data.resultData.privateUploadLink;
                    this.info.privateSecret = res.data.resultData.privateSecret;
                    this.uploadUrl = this.info.privateUpladLink;
                    this.uploadData.secret = this.info.privateSecret;
                    console.log(this.uploadUrl)
                    this.$message.success("获取链接成功！");
                    this.ency();
                    this.setTimer();
                }else{
                    this.$message.error(res.data.errorMessage);
                }
            }).catch(function (e) {
                console.log(e)
            })

        },
        methods:{
            setTimer: function () {

                this.timer = setInterval( () => {
                    let that = this;
                    //console.log(that.info.privateSecret.substr(0,16).length)
                    let t = Encrypt(new Date().getTime(),that.info.privateSecret.substr(0,16));
                    //console.log("初始加密的长度"+t.length)
                    let x = "";
                    for (let i = 0; i < t.length; i++) {
                        if(t[i] == "+"){
                            x += "%2b";
                            // console.log("找到+号，进行替换")
                        }
                        // else if(t[i] == "/"){
                        //     x += "%3b";
                        // }else if(t[i] == "&"){
                        //     x += "%4b";
                        // }
                        else{
                            x += t[i];
                        }
                        //console.log(t[i])
                    }
                    // t = t.replace("+","%2b");
                    //console.log(x)
                    this.info.encySecret = x;
                    this.uploadData.secret = x;

                }, 5000)

            },
            xianLink(){
                this.info.privateUpladLinkS = this.info.privateUpladLink
            },
            copyLink(){
                let that = this;
                this.$copyText(this.info.privateUpladLink).then(function (e) {
                    that.$message.success("复制成功");

                }, function (e) {
                    alert('复制失败')
                    console.log(e)
                })
            },
            xianSecret(){
                this.info.privateSecretS = this.info.privateSecret
            },
            copySecret(){
                let that = this;
                this.$copyText(this.info.privateSecret).then(function (e) {
                    that.$message.success("复制成功");

                }, function (e) {
                    alert('复制失败')
                    console.log(e)
                })
            },
            uploadBefore(){
                //this.ency()
                console.log("上传之前")
            },
            fileSuccess(response){
                console.log(response)
                let mycars=new Array();
                mycars['uid'] = response.resultData;
                mycars['name'] = response.resultData;
                mycars['text'] = response.resultData;
                this.fileList.push(mycars)
                console.log(this.fileList)
            },
            setImage(e){
                console.log("ssss")
                const file = e.target.files[0];
                if (!file.type.includes('image/')) {
                    return;
                }
                const reader = new FileReader();
                reader.onload = (event) => {
                    this.dialogVisible = true;
                    this.imgSrc = event.target.result;
                    this.$refs.cropper && this.$refs.cropper.replace(event.target.result);
                };
                reader.readAsDataURL(file);
            },
            cropImage () {
                console.log("sswww")
                this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL();
            },
            cancelCrop(){
                this.dialogVisible = false;
                this.cropImg = this.defaultSrc;
            },
            imageuploaded(res) {
                console.log("上传服务器")
                console.log(res)
            },
            handleError(){
                this.$notify.error({
                    title: '上传失败',
                    message: '图片上传接口上传失败，可更改为自己的服务器接口'
                });
            },
            //私有密钥需要加密才可以使用
            ency(){
                // let tx = String(new Date().getTime()).substring(0,9)+"0000000";
                // //console.log("tx=>"+tx)
                //console.log(this.info.privateSecret)
                //console.log(this.info.privateSecret.length)
                //let t = Encrypt(this.info.privateSecret,tx);
                let t = Encrypt(new Date().getTime(),this.info.privateSecret);
                //console.log("初始加密的长度"+t.length)
                let x = "";
                for (let i = 0; i < t.length; i++) {
                    if(t[i] == "+"){
                        x += "%2b";
                        // console.log("找到+号，进行替换")
                    }
                    // else if(t[i] == "/"){
                    //     x += "%3b";
                    // }else if(t[i] == "&"){
                    //     x += "%4b";
                    // }
                    else{
                        x += t[i];
                    }
                    //console.log(t[i])
                }
                // t = t.replace("+","%2b");
               // console.log(x)
                this.info.encySecret = x
                this.uploadData.secret = this.info.encySecret;
                //console.log(x.length)
            },

        },
        created(){
            this.cropImg = this.defaultSrc;
            console.log("beginUpload")

        },
        distroyed: function () {

            clearInterval(this.timer)

        }
    }
</script>

<style scoped>
    .upload-demo{
        margin-top: 30px;
    }
    .content-title{
        font-weight: 400;
        line-height: 50px;
        margin: 10px 0;
        font-size: 22px;
        color: #1f2f3d;
    }
    .pre-img{
        width: 100px;
        height: 100px;
        background: #f8f8f8;
        border: 1px solid #eee;
        border-radius: 5px;
    }
    .crop-demo{
        display: flex;
        align-items: flex-end;
    }
    .crop-demo-btn{
        position: relative;
        width: 100px;
        height: 40px;
        line-height: 40px;
        padding: 0 20px;
        margin-left: 30px;
        background-color: #409eff;
        color: #fff;
        font-size: 14px;
        border-radius: 4px;
        box-sizing: border-box;
    }
    .crop-input{
        position: absolute;
        width: 100px;
        height: 40px;
        left: 0;
        top: 0;
        opacity: 0;
        cursor: pointer;
    }
</style>