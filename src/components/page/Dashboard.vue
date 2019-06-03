<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8" style="width:25%;">
                <el-card shadow="hover" class="mgb20" style="height:283px;">
                    <div class="user-info">

                        <img src="../../assets/img/img.jpg" class="user-avator" alt="">
                        <div class="user-info-cont">
                            <div class="user-info-name">{{user.username}}</div>
                            <div>{{role}}</div>
                        </div>

                        <div style="text-align: center;"  @click="getUserData()">
                            <i class="el-icon-refresh-right"></i>
                            <p style="font-size: 9px;">刷新信息</p>
                        </div>
                    </div>
                    <div class="user-info-list">姓名：<span>{{user.name}}</span></div>
                    <div class="user-info-list">邮箱：<span>{{user.email}}</span></div>
                    <div class="user-info-list">注册时间：<span style="margin-left: 42px;">{{user.time}}</span></div>
                </el-card>
                <el-card shadow="hover" style="height:220px;">
                    <div slot="header" class="clearfix">
                        <span>存储空间使用情况</span>
                    </div>
                    存储空间使用情况
                    <el-progress :percentage="user.size" color="#42b983"></el-progress>
                    数据流量使用情况
                    <el-progress :percentage="user.flow" color="#f1e05a"></el-progress>
                    <!--CSS-->
                    <!--<el-progress :percentage="3.7"></el-progress>-->
                    <!--HTML-->
                    <!--<el-progress :percentage="0.9" color="#f56c6c"></el-progress>-->
                </el-card>
            </el-col>
            <el-col :span="16" style="width:75%">
                <el-row :gutter="20" class="mgb20">
                    <el-col :span="8"  class="card">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-s-data grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{user.totalSize}}</div>
                                    <div class="text">数据空间总计</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8" class="card">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-3">
                                <i class="el-icon-folder-checked grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{user.useSize}}</div>
                                    <div class="text">已用数据空间</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8" class="card">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-folder-remove grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{user.surplusSize}}</div>
                                    <div class="text">剩余数据空间</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8" class="card">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-position grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{user.totalFlow}}</div>
                                    <div class="text">本月流量总计</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8" class="card">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-3">
                                <i class="el-icon-link grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{user.useFlow}}</div>
                                    <div class="text">本月使用流量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8" class="card">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-cloudy grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{user.surplusFlow}}</div>
                                    <div class="text">本月剩余流量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
                <el-card shadow="hover" style="height:403px;">
                    <div slot="header" class="clearfix">
                        <span>官方公告</span>
                        <el-button style="float: right; padding: 3px 0" type="text">反馈</el-button>
                    </div>
                    <el-table :data="todoList" :show-header="false" height="304" style="width: 100%;font-size:14px;">
                        <el-table-column width="150">
                            <template slot-scope="scope">
                                <!--<el-checkbox v-model="scope.row.status"></el-checkbox>-->
                                <div >{{scope.row.time|formatDate}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column>
                            <template slot-scope="scope">
                                <div class="todo-item" :class="" @click="show(scope.row.id)">{{scope.row.title}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column width="60">
                            <template slot-scope="scope">
                                <!--<i class="el-icon-edit"></i>-->
                                <i class="el-icon-menu" @click="show(scope.row.id)"></i>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="12">
                <el-card shadow="hover">
                    <schart ref="bar" class="schart" canvasId="bar" :data="d1" type="bar" :options="options"></schart>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card shadow="hover">
                    <schart ref="line" class="schart" canvasId="line" :data="d2" type="line" :options="options2"></schart>
                </el-card>
            </el-col>
        </el-row>

        <el-dialog title="公告详情" :visible.sync="showVisible" width="60%">
            <div>

                <h2 style="text-align: center">{{form.title}}</h2>
                <h4 style="text-align: center;margin-top: 5px;">{{form.time|formatDate}}</h4>
                <div v-html="form.content"></div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showVisible = false">关 闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import Schart from 'vue-schart';
    import bus from '../common/bus';
    export default {
        name: 'dashboard',
        data() {
            return {
                name: localStorage.getItem('dev_username'),
                todoList: [],
                user:{
                    email: "222222@163.com",
                    id: 0,
                    privateSecret: "",
                    privateUpladLink: "",
                    publicUploadLink: "",
                    name:"黄晓明",
                    time: "",
                    totalFlow: "0K",
                    totalSize: "0K",
                    useFlow: "0K",
                    useSize: "0K",
                    username: "小明",
                    surplusSize:"0K",
                    surplusFlow:"0K",
                    size:0,
                    flow:0
                },
                data: [],
                d1:[],
                d2:[],
                options: {
                    title: '最近七天用户流量使用记录',
                    showValue: false,
                    fillColor: 'rgb(45, 140, 240)',
                    bottomPadding: 30,
                    topPadding: 30
                },
                form:[],
                options2: {
                    title: '最近七天用户储存使用情况',
                    fillColor: '#FC6FA1',
                    axisColor: '#008ACD',
                    contentColor: '#EEEEEE',
                    bgColor: '#F5F8FD',
                    bottomPadding: 30,
                    topPadding: 30
                },
                showVisible:false,
            }
        },
        components: {
            Schart
        },
        computed: {
            role() {
                return this.name === 'admin' ? '超级管理员' : '普通用户';
            }
        },
        created(){
            this.handleListener();
            this.changeDate();
        },
        activated(){
            this.handleListener();
        },
        deactivated(){
            window.removeEventListener('resize', this.renderChart);
            bus.$off('collapse', this.handleBus);
        },
        mounted(){
            //初始化加载
            //获取类型分类列表
            //this.uploadLink = "123";
            this.getUserData();

        },
        filters: {
            formatDate: function (value) {
                let date = new Date(value);
                let y = date.getFullYear();
                let MM = date.getMonth() + 1;
                MM = MM < 10 ? ('0' + MM) : MM;
                let d = date.getDate();
                d = d < 10 ? ('0' + d) : d;
                let h = date.getHours();
                h = h < 10 ? ('0' + h) : h;
                let m = date.getMinutes();
                m = m < 10 ? ('0' + m) : m;
                let s = date.getSeconds();
                s = s < 10 ? ('0' + s) : s;
                return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
            }
        },
        methods: {
            show(id){
                console.log(id)
                let formx;
                for (let i = 0; i < this.todoList.length; i++) {
                    if(this.todoList[i].id == id){
                        formx = this.todoList[i];
                        break;
                    }
                }


                // console.log(this.todoList)
                this.form.title = formx.title;
                this.form.time = this.formatDate(formx.time);
                this.form.content = formx.content;

                console.log(this.form)
                this.showVisible = true;
            },
            formatDate: function (value) {
                let date = new Date(value);
                let y = date.getFullYear();
                let MM = date.getMonth() + 1;
                MM = MM < 10 ? ('0' + MM) : MM;
                let d = date.getDate();
                d = d < 10 ? ('0' + d) : d;
                let h = date.getHours();
                h = h < 10 ? ('0' + h) : h;
                let m = date.getMinutes();
                m = m < 10 ? ('0' + m) : m;
                let s = date.getSeconds();
                s = s < 10 ? ('0' + s) : s;
                return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
            },
            changeDate(){
                const now = new Date().getTime();
                this.data.forEach((item, index) => {
                    const date = new Date(now - (6 - index) * 86400000);
                    item.name = `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}`
                })
            },
            handleListener(){
                bus.$on('collapse', this.handleBus);
                // 调用renderChart方法对图表进行重新渲染
                window.addEventListener('resize', this.renderChart)
            },
            handleBus(msg){
                setTimeout(() => {
                    this.renderChart()
                }, 300);
            },
            renderChart(){
                this.$refs.bar.renderChart();
                this.$refs.line.renderChart();
            },
            getUserData(){
                let that =this;
                this.$axios({
                    method:"GET",
                    url:this.URL+"/developer/get?id="+localStorage.getItem("dev_id"),
                }).then((res)=>{
                    if(res.data.resultStatus){
                        console.log(res.data)
                        this.user.name = res.data.resultData.name;
                        this.user.email = res.data.resultData.eamil;
                        this.user.time = res.data.resultData.time;
                        this.user.totalFlow = this.bytesToSize(res.data.resultData.totalFlow);
                        this.user.totalSize = this.bytesToSize(res.data.resultData.totalSize);
                        this.user.useFlow = this.bytesToSize(res.data.resultData.useFlow);
                        this.user.useSize = this.bytesToSize(res.data.resultData.useSize);
                        this.user.username = res.data.resultData.username;

                        this.user.surplusSize = this.bytesToSize(res.data.resultData.totalSize-res.data.resultData.useSize);
                        this.user.surplusFlow = this.bytesToSize(res.data.resultData.totalFlow-res.data.resultData.useFlow);

                        this.user.size = Math.floor(res.data.resultData.useSize / res.data.resultData.totalSize*10000)/100;
                        console.log(this.user.size);

                        this.user.flow = Math.floor(res.data.resultData.useFlow / res.data.resultData.totalFlow*10000)/100;
                    }else{
                        this.$message.error(res.data.errorMessage);
                        this.enable = true;
                    }
                }).catch(function (e) {
                    console.log(e)
                })
                let d11 = [];
                this.$axios({
                    method:"GET",
                    url:this.URL+"/loger/log?id="+localStorage.getItem("dev_id"),
                }).then((res)=>{
                    if(res.data.resultStatus){
                        console.log(res.data)
                        if(that.d1.length<5){
                            for (let i = 0; i < res.data.resultData.length; i++) {

                                that.d1.push({"name":(res.data.resultData[i]['timeStr']).substr(0,10),"value":res.data.resultData[i]['flow']})
                                that.d2.push({"name":(res.data.resultData[i]['timeStr']).substr(0,10),"value":res.data.resultData[i]['size']})
                            }
                        }

                    }else{
                        this.$message.error(res.data.errorMessage);
                        this.enable = true;
                    }
                }).catch(function (e) {
                    console.log(e)
                })
                this.$axios({
                    method:"GET",
                    url:this.URL+"/adnotice/listbydev?page=1",
                }).then((res)=>{
                    if(res.data.resultStatus){
                        console.log(res.data)
                        this.todoList = res.data.resultData.list
                        // for (let i = 0; i < this.todoList.length; i++) {
                        //     this.todoList[i].time =
                        // }
                    }else{
                        this.$message.error(res.data.errorMessage);
                        this.enable = true;
                    }
                }).catch(function (e) {
                    console.log(e)
                })


            },
            bytesToSize(bytes) {
                if (bytes === 0) return '0 B';
                var k = 1000, // or 1024
                    sizes = ['B', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'],
                    i = Math.floor(Math.log(bytes) / Math.log(k));

                return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
            }


        }
    }

</script>


<style scoped>
    .text{
        font-size: 12px;
    }
    .card{
        width: 16.6666%;
    }
    .el-col-16 {
        width: 75%;
    }
    .el-row {
        margin-bottom: 20px;
    }

    .grid-content {
        display: flex;
        align-items: center;
        height: 100px;
    }

    .grid-cont-right {
        flex: 1;
        text-align: center;
        font-size: 14px;
        color: #999;
    }

    .grid-num {
        font-size: 30px;
        font-weight: bold;
    }

    .grid-con-icon {
        font-size: 50px;
        width: 100px;
        height: 100px;
        text-align: center;
        line-height: 100px;
        color: #fff;
    }

    .grid-con-1 .grid-con-icon {
        background: rgb(45, 140, 240);
    }

    .grid-con-1 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-2 .grid-con-icon {
        background: rgb(100, 213, 114);
    }

    .grid-con-2 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-3 .grid-con-icon {
        background: rgb(242, 94, 67);
    }

    .grid-con-3 .grid-num {
        color: rgb(242, 94, 67);
    }

    .user-info {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        border-bottom: 2px solid #ccc;
        margin-bottom: 20px;
    }

    .user-avator {
        width: 120px;
        height: 120px;
        border-radius: 50%;
    }

    .user-info-cont {
        padding-left: 50px;
        flex: 1;
        font-size: 14px;
        color: #999;
    }

    .user-info-cont div:first-child {
        font-size: 30px;
        color: #222;
    }

    .user-info-list {
        font-size: 14px;
        color: #999;
        line-height: 25px;
    }

    .user-info-list span {
        margin-left: 70px;
    }

    .mgb20 {
        margin-bottom: 20px;
    }

    .todo-item {
        font-size: 14px;
    }

    .todo-item-del {
        text-decoration: line-through;
        color: #999;
    }

    .schart {
        width: 100%;
        height: 300px;
    }

</style>
