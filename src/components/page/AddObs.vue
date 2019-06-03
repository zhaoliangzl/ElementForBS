<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> OBS信息</el-breadcrumb-item>
                <el-breadcrumb-item>新增obs信息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form :rules="rules" ref="form" :model="form" label-width="210px">
                    <el-form-item label="OBS信息名称" prop="name">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="OBS类型" prop="type">
                        <el-select v-model="form.type" placeholder="请选择">
                            <el-option
                                    v-for="item in cities"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                <span style="float: left">{{ item.name }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.mark }}</span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="bucket名称" prop="bucketName">
                        <el-input v-model="form.bucketName"></el-input>
                    </el-form-item>
                    <el-form-item label="accessKeyId" prop="accessKeyId">
                        <el-input v-model="form.accessKeyId"></el-input>
                    </el-form-item>
                    <el-form-item label="secretAccessKey" prop="secretAccessKey">
                        <el-input v-model="form.secretAccessKey"></el-input>
                    </el-form-item>
                    <el-form-item label="endpoint" prop="endpoint">
                        <el-input v-model="form.endpoint"></el-input>
                    </el-form-item>
                    <el-form-item label="共享存储容量" prop="sharpSize">
                        <el-input v-model="form.sharpSize" style="width: 50%" type="number"></el-input>

                        <el-select v-model="form.sharpSizeUnit" placeholder="请选择存储单位" style="width: 40%">
                            <el-option
                                    v-for="item in sizeUnit"
                                    :key="item"
                                    :label="item"
                                    :value="item">
                                <span style="float: left">存储单位</span>
                                <span style="float: right; color: #8492a6; font-size: 13px">{{ item }}</span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="共享存储下行流量（每月）" prop="sharpSize">
                        <el-input v-model="form.sharpFlowSize" style="width: 50%" type="number"></el-input>

                        <el-select v-model="form.sharpFlowSizeUnit" placeholder="请选择存储单位" style="width: 40%">
                            <el-option
                                    v-for="item in sizeUnit"
                                    :key="item"
                                    :label="item"
                                    :value="item">
                                <span style="float: left">存储单位</span>
                                <span style="float: right; color: #8492a6; font-size: 13px">{{ item }}</span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="立即提交申请" prop="delivery">
                        <el-switch v-model="form.delivery"></el-switch>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit('form')">表单提交</el-button>
                        <el-button>取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>

    </div>
</template>

<script>
    export default {
        name: 'addObs',
        data: function(){
            return {
                form: {
                    name: '',
                    // beginTime: '',
                    // endTime: '',
                    type:'',
                    delivery: false,
                    bucketName:'',
                    accessKeyId:'',
                    secretAccessKey:'',
                    endpoint:'',
                    sharpSize:'',
                    sharpSizeUnit:'',
                    sharpFlowSize:'',
                    sharpFlowSizeUnit:'',
                },

                cities: [],
                sizeUnit:[
                    "MB",
                    "GB",
                ],
                rules: {
                    name: [
                        { required: true, message: '请输入OBS信息名称', trigger: 'blur' }
                    ],
                    sharpSize: [
                        { required: true, message: '请输入共享存储容量', trigger: 'blur' }
                    ],
                    accountTime: [
                        { required: true, message: '请选择共享月结日', trigger: 'blur' }
                    ],
                    type: [
                        { required: true, message: '请选择OBS类型', trigger: 'blur' }
                    ],
                    // delivery: [
                    //     { required: true, message: '请输入用户名', trigger: 'blur' }
                    // ],
                    bucketName: [
                        { required: true, message: '请输入bucket名称', trigger: 'blur' }
                    ],
                    accessKeyId: [
                        { required: true, message: '请输入accessKeyId', trigger: 'blur' }
                    ],
                    secretAccessKey: [
                        { required: true, message: '请输入secretAccessKey', trigger: 'blur' }
                    ],
                    endpoint: [
                        { required: true, message: '请输入endpoint', trigger: 'blur' }
                    ]
                }
            }
        },
        mounted(){
            //初始化加载
            //获取类型分类列表

            this.getClazzList();

        },
        methods: {

            onSubmit(formName) {
                const userId = localStorage.getItem("dev_id");
                //console.log(userId)
                if(!userId || userId == undefined || userId == "undefined"){
                    this.$message.error("会话过期请重新登陆");
                    this.$router.push('/');
                    return false;
                }

                if(this.form.sharpSizeUnit == ""){
                    this.$message.error("请选择存储单位");
                    return false;
                }
                if(this.form.sharpFlowSizeUnit == ""){
                    this.$message.error("请选择存储单位");
                    return false;
                }

                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let s1 = 0;
                        let s2 = 0;
                        if(this.form.sharpSizeUnit == "MB"){
                            s1 = this.form.sharpSize*1024*1024;
                        }else{
                            s1 = this.form.sharpSize*1024*1024*1024;
                        }
                        if(this.form.sharpFlowSizeUnit == "MB"){
                            s2 = this.form.sharpFlowSize*1024*1024;
                        }else{
                            s2 = this.form.sharpFlowSize*1024*1024*1024;
                        }

                        this.$axios({
                            method:"POST",
                            url:this.URL+"/obs/add",
                            headers:{
                                'Content-type': 'application/x-www-form-data'
                            },
                            params:{
                                name:this.form.name,
                                clazzid:this.form.type,
                                userid:userId,
                                ak:this.form.accessKeyId,
                                sk:this.form.secretAccessKey,
                                endpoint:this.form.endpoint,
                                bucketname:this.form.bucketName,
                                sharpSize:s1,
                                sharpFlowSize:s2,
                                delivery:this.form.delivery,
                            }
                        }).then((res)=>{
                            if(res.data.resultStatus){
                                console.log(res.data)
                                this.$message.success('添加完成！');
                                this.form.name = "";
                                this.form.type= "";
                                this.form.accessKeyId= "";
                                this.form.secretAccessKey= "";
                                this.form.endpoint= "";
                                this.form.bucketName= "";

                                this.form.sharpSize= "";
                                this.form.sharpFlowSize= "";
                                this.form.sharpFlowSizeUnit= "";
                                this.form.sharpSizeUnit= "";
                                this.form.delivery= false;
                            }else{
                                this.$message.error(res.data.errorMessage);
                            }
                        }).catch(function (e) {
                            console.log(e)
                        })

                    }else{
                        this.$message.error('请填写完整信息！');
                    }
                })
                //this.$message.success('提交成功！');
            },
            getClazzList(){
                //初始化提交
                this.$axios({
                    method:"GET",
                    url:this.URL+"/clazz/alllist",
                }).then((res)=>{
                    if(res.data.resultStatus){
                        console.log(res.data)
                        this.cities = res.data.resultData;
                    }else{
                        this.$message.error(res.data.errorMessage);
                    }
                }).catch(function (e) {
                    console.log(e)
                })

            }
        }
    }
</script>