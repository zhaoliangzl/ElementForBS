<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 演示</el-breadcrumb-item>
                <el-breadcrumb-item>公共接口图片上传演示</el-breadcrumb-item>
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
                    :on-success="fileSuccess"
                    :file-list = "fileList"
                    :before-upload = "uploadBefore"
                    multiple>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">任何文件均可上传</div>
            </el-upload>
            <p>
                注意：本接口为测试接口，开发者可以通过F12开发者调试工具分析本接口的请求以及返回参数。公共上传接口需要使用您的公共接口密钥，这里上传将浪费您的流量，请注意。
            </p>
            <!--<div class="content-title">支持裁剪</div>-->
            <!--<div class="plugins-tips">-->
                <!--vue-cropperjs：一个封装了 cropperjs 的 Vue 组件。-->
                <!--访问地址：<a href="https://github.com/Agontuk/vue-cropperjs" target="_blank">vue-cropperjs</a>-->
            <!--</div>-->
            <!--<div class="crop-demo">-->
                <!--<img :src="cropImg" class="pre-img">-->
                <!--<div class="crop-demo-btn">选择图片-->
                    <!--<input class="crop-input" type="file" name="image" accept="image/*" @change="setImage"/>-->
                <!--</div>-->
            <!--</div>-->

            <!--<el-dialog title="裁剪图片" :visible.sync="dialogVisible" width="30%">-->
                <!--<vue-cropper ref='cropper' :src="imgSrc" :ready="cropImage" :zoom="cropImage" :cropmove="cropImage" style="width:100%;height:300px;"></vue-cropper>-->
                <!--<span slot="footer" class="dialog-footer">-->
                    <!--<el-button @click="cancelCrop">取 消</el-button>-->
                    <!--<el-button type="primary" @click="dialogVisible = false">确 定</el-button>-->
                <!--</span>-->
            <!--</el-dialog>-->
        </div>
    </div>
</template>

<script>
    import VueCropper  from 'vue-cropperjs';
    export default {
        name: 'uploadToObs',
        data: function(){
            return {
                defaultSrc: require('../../assets/img/img.jpg'),
                fileList: [],
                uploadData:[],
                imgSrc: '',
                cropImg: '',
                dialogVisible: false,
                selectObs:"",
                enAbleUpload:false,
                uploadUrl:""
            }
        },
        components: {
            VueCropper
        },
        mounted(){
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
                     this.uploadUrl = res.data.resultData.publicUploadLink;
                    console.log(this.uploadUrl)
                    this.$message.success("获取链接成功！");
                }else{
                    this.$message.error(res.data.errorMessage);
                }
            }).catch(function (e) {
                console.log(e)
            })
        },
        methods:{
            uploadBefore(){
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
            }
        },
        created(){
            this.cropImg = this.defaultSrc;
            console.log("beginUpload")

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