<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 基础表格</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
                <el-select v-model="select_cate" placeholder="筛选省份" class="handle-select mr10">
                    <el-option key="1" label="广东省" value="广东省"></el-option>
                    <el-option key="2" label="湖南省" value="湖南省"></el-option>
                </el-select>
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="30" align="center"></el-table-column>
                <el-table-column prop="originalName" label="文件名称" sortable >

                </el-table-column>
                <el-table-column prop="uploadTime" label="上传时间" >
                </el-table-column>
                <el-table-column prop="enable" label="可用性" :formatter="getAvailable">
                </el-table-column>
                <el-table-column prop="size" label="文件大小" :formatter="getFileSize">

                </el-table-column>
                <el-table-column prop="type" label="文件类型" :formatter="getType">

                </el-table-column>
                <el-table-column prop="uploadIp" label="上传IP" >

                </el-table-column>
                <el-table-column label="操作"  align="center" width="250">
                    <template slot-scope="scope">
                        <!--{{tableData.available}}-->
                        <el-button type="text" icon="el-icon-paperclip" @click="handleEdit(scope.$index, scope.row)">获取下载链接</el-button>
                        <el-button type="text" icon="el-icon-download" @click="handleSub(scope.$index, scope.row)">下载</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :total="total">
                </el-pagination>
            </div>
        </div>

         <!--编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="50px">
                <el-form-item label="日期">
                    <el-date-picker type="date" placeholder="选择日期" v-model="form.date" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="提示" :visible.sync="check" width="300px" center>
            <div class="del-dialog-cnt">现在立即提交审核？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="check = false">取 消</el-button>
                <el-button type="primary" @click="checkNow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'filetable',
        data() {
            return {
                // url: './vuetable.json',
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,

                form: {
                    name: '',
                    time: '',
                    bucketName: '',
                    shen:false,
                },
                idx: -1,
                total:0,
                //审核标志位
                check:false,
                //当前选中对象
                selectRow :[]
            }
        },
        created() {
            this.getData();
        },
        computed: {
            data() {
                return this.tableData.filter((d) => {
                    let is_del = false;
                    for (let i = 0; i < this.del_list.length; i++) {
                        if (d.name === this.del_list[i].name) {
                            is_del = true;
                            break;
                        }
                    }
                    if (!is_del) {
                        if (d.address.indexOf(this.select_cate) > -1 &&
                            (d.name.indexOf(this.select_word) > -1 ||
                                d.address.indexOf(this.select_word) > -1)
                        ) {
                            return d;
                        }
                    }
                })
            }
        },
        methods: {
            getAvailable(row, column){

                let number = row.enable;
                if(number == true){
                    return '可用';
                }else {
                    return '不可用';
                }
            },
            getType(row, column){

                let number = row.type;
                if(number == null || number == false){
                    return '公共读';
                }else {
                    return '私有读';
                }
            },
            getFileSize(row, column){

                var fileSizeByte = row.size;
                var fileSizeMsg = "";
                if (fileSizeByte < 1048576) fileSizeMsg = (fileSizeByte / 1024).toFixed(2) + "KB";
                else if (fileSizeByte == 1048576) fileSizeMsg = "1MB";
                else if (fileSizeByte > 1048576 && fileSizeByte < 1073741824) fileSizeMsg = (fileSizeByte / (1024 * 1024)).toFixed(2) + "MB";
                else if (fileSizeByte > 1048576 && fileSizeByte == 1073741824) fileSizeMsg = "1GB";
                else if (fileSizeByte > 1073741824 && fileSizeByte < 1099511627776) fileSizeMsg = (fileSizeByte / (1024 * 1024 * 1024)).toFixed(2) + "GB";
                else fileSizeMsg = "文件超过1TB";
                return fileSizeMsg;

            },

            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            checkNow(){
               console.log("开始提交审核")
               console.log(this.selectRow)
               this.check = false;
                this.$axios({
                    method:"GET",
                    url:this.URL+"/obs/obstoshen?id="+this.selectRow.id,
                }).then((res)=>{
                    if(res.data.resultStatus){
                        //账号密码正确
                        console.log(res)
                    }else{
                        this.$message.error(res.data.errorMessage+":"+res.data.resultData.message);
                    }
                    console.log(res.data);
                    // console.log(this)
                    // console.log(this.$router)
                }).catch(function (e) {
                    console.log(e)
                })

                //CW8IIOCILA1DEJEP8IZN



            },
            // 获取 easy-mock 的模拟数据
            getData() {
                let id = localStorage.getItem("dev_id");
                this.$axios({
                    method:"GET",
                    url:this.URL+"/uploadinfo/listbydev?page="+this.cur_page+"&id="+id,
                }).then((res)=>{
                    if(res.data.resultStatus){
                        //账号密码正确
                        console.log(res)
                        this.tableData = res.data.resultData.list;
                        this.total = res.data.resultData.totalNumber;
                        console.log(this.tableData)

                    }else{
                        this.$message.error(res.data.errorMessage);
                    }
                }).catch(function (e) {
                    console.log(e)
                })

            },
            search() {
                this.is_search = true;
            },
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleEdit(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.form = {
                    name: item.name,
                    time: item.time,
                    bucketName: item.bucketName
                }
                this.editVisible = true;
            },
            handleSub(index, row){
                this.selectRow = row;
                console.log(this.selectRow)
                console.log(this.selectRow.downloadUrl)
                const element = document.createElement('a');
                element.href = this.selectRow.downloadUrl+"";
                element.download = this.selectRow.originalName;
                element.click();
            },
            handleDelete(index, row) {
                this.idx = index;
                this.delVisible = true;
            },
            delAll() {
                const length = this.multipleSelection.length;
                let str = '';
                this.del_list = this.del_list.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i].name + ' ';
                }
                this.$message.error('删除了' + str);
                this.multipleSelection = [];
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 保存编辑
            saveEdit() {
                this.$set(this.tableData, this.idx, this.form);
                this.editVisible = false;
                this.$message.success(`修改第 ${this.idx+1} 行成功`);
            },
            // 确定删除
            deleteRow(){
                this.tableData.splice(this.idx, 1);
                this.$message.success('删除成功');
                this.delVisible = false;
            }
        }
    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
    .table{
        width: 100%;
        font-size: 14px;
    }
    .red{
        color: #ff0000;
    }
    .mr10{
        margin-right: 10px;
    }
    .container {
        width: 95%;
    }
</style>
