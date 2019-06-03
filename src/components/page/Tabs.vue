<template>
    <div class="">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-copy"></i> 帮助文档</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-tabs v-model="message">
                <el-tab-pane v-for="li in list" v-key="`{li.helperClass.id}`" :label="`${li.helperClass.name}(${li.helpers.length})`"  :name="`${li.helperClass.name}`" >
                    <el-collapse  @change="handleChange" v-for="l in li.helpers" v-key="l">
                        <el-collapse-item :title="`${l.title}`" :name="`${l.id}`">
                            <div>
                                <pre class="code" v-html="`${l.content}`"></pre>
                            </div>
                            <div>注：仅为实例代码。</div>
                        </el-collapse-item>
                    </el-collapse>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'tabs',
        data() {
            return {
                activeNames: 1,
                message: 'first',
                showHeader: false,
                list:[],
            }
        },
        methods: {
            handleChange(val) {
                console.log(val);
            },

            handleRead(index) {
                const item = this.unread.splice(index, 1);
                console.log(item);
                this.read = item.concat(this.read);
            },
            handleDel(index) {
                const item = this.read.splice(index, 1);
                this.recycle = item.concat(this.recycle);
            },
            handleRestore(index) {
                const item = this.recycle.splice(index, 1);
                this.read = item.concat(this.read);
            },
            getHelper(){
                this.$axios({
                    method:"GET",
                    url:this.URL+"/helper/all",
                }).then((res)=>{
                    if(res.data.resultStatus){
                        console.log(res.data)
                        this.list = res.data.resultData;
                        //console.log("shezhi1"+res.data.resultData);
                    }else{
                        this.$message.error(res.data.errorMessage);
                        this.enable = true;
                    }
                }).catch(function (e) {
                    console.log(e)
                })
            },
        },
        computed: {
            unreadNum(){
                return this.unread.length;
            }
        },
        mounted(){
            //初始化加载
            //获取帮助文档列表
            //this.uploadLink = "123";
            this.getHelper();

        }
    }

</script>

<style>
.message-title{
    cursor: pointer;
}
.handle-row{
    margin-top: 30px;
}
.code{
    background-color: #b4bccc;
    color: black;
}
</style>

