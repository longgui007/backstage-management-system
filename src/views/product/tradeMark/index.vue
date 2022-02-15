<template>
  <div>
    <!--添加按钮  -->
    <el-button type="primary" icon="el-icon-plus" @click="showDialog">添加</el-button>
    <!-- table表格 以列展示 -->
    <el-table style="width: 100%" :data="trademarkList" border>
      <el-table-column prop="id" label="序号" width="80px" align="center"></el-table-column>
      <el-table-column prop="tmName" label="品牌名称" align="center"></el-table-column>
      <el-table-column prop="prop" label="品牌Logo" align="center">
        <!-- 用作用域插槽 -->
        <!-- slot-scope里面使用解构赋值{row,$index}，就不用...了 -->
        <template slot-scope="{row,$index}">
          <img :src="row.logoUrl" alt="" style="width: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" align="center">
        <template slot-scope="{ row }">
          <el-button type="warning" @click="updataTrademark(row)">修改</el-button>
          <el-button type="danger" @click="deleteTrademark(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <el-pagination
      style="margin-top: 40px; textAlign: center"
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-sizes="[3, 5, 7]"
      layout=" prev, pager, next, jumper,->,sizes,total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    >
    </el-pagination>

    <!-- 对话框 -->
    <el-dialog
      :title="tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <!-- :model="tmForm"收集品牌信息，收集到tmForm身上，将来表单验证，实现双向绑定 -->
      <el-form ref="tmForm" :model="tmForm" :rules="rules" label-width="80px">
        <el-form-item label="品牌名称" prop='tmName'>
          <el-input v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌logo" prop='logoUrl'>
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureTradeMark">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "tradeMark",
  data() {
    return {
      //当前页
      page: 1,
      //总页数
      total: 0,
      //品牌数据
      trademarkList: [],
      //每页展示的数据数量
      limit: 3,
      //控制对话框显示
      dialogVisible: false,
      //添加时收集的表单数据
      tmForm: {
        tmName: "",
        logoUrl: "",
      },
      // 表单验证规则
      rules: {
        // 品牌名称验证规则
        tmName: [
          // 必须校验的字段（显示五角星），message，提示信息，trgger,用户行为设置（失焦/触发）
          {required: true, message: '请输入品牌名称', trgger: 'blur'},
          {min: 2, max: 10, message: '长度在2到10个字符', trgger: 'change'}
        ],
        // 品牌logo验证规则
        logoUrl: [
          {required: true, message: '请选择品牌图片'},
        ]
      }
    };
  },
  mounted() {
    // console.log(this.$API);
    this.getTrademarkList();
  },
  methods: {
    async getTrademarkList() {
      // alert(11);
      const { page, limit } = this;
      let result = await this.$API.trademark.reqTradeMarkList(page, limit);
      if (result.code == 200) {
        console.log(result.data);
        this.trademarkList = result.data.records;
        this.total = result.data.total;
      }
    },
    //点击分页器切换页数
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page = val;
      this.getTrademarkList();
    },
    //pageSize 改变时会触发
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.limit = val;
      this.getTrademarkList();
    },
    //关闭对话框
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    //上传图片成功回调
    handleAvatarSuccess(res, file) {
      // res时上传成功返回给前端的数据
      this.tmForm.logoUrl = URL.createObjectURL(file.raw);
      // console.log(res,file);
    },
    //上传图片之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //点击添加按钮时
    showDialog() {
      this.dialogVisible = true;
      this.tmForm = {
        tmName: "",
        logoUrl: "",
      };
    },
    //确定添加品牌信息
    async sureTradeMark() {
      this.dialogVisible = false;
      let result = await this.$API.trademark.reqTradeMarkAddOrUpate(
        this.tmForm
      );
      if (result.code == 200) {
        this.$message({
          type: "success",
          message: this.tmForm.id ? "修改成功" : "添加品牌成功",
        });
        this.page = this.tmForm.id ? this.page : 1;
        this.getTrademarkList();
      } 
    },
    //修改品牌信息
    updataTrademark(row) {
      // row：当前用户选择的品牌信息
      this.dialogVisible = true;
      // console.log(row);
      // 将已有的品牌信息赋值给tmForm进行展示
      // 直接进行赋值，在点击取消按钮时候图片已经被更换
      // this.tmForm = row;
      //做一层浅拷贝
      this.tmForm = { ...row };
      // this.tmForm = JSON.parse(JSON.stringify(row));
    },
    //删除品牌
    deleteTrademark(row) {
      console.log(row);
      this.$confirm(`你确定删除${row.tmName}吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // 向服务器发请求
          let result = await this.$API.trademark.reqDelTradeMark(row.id);
          // 如果删除成功
          if (result.code == 200) {
            // console.log(result.data);
            // 更新当前页面信息
            this.getTrademarkList();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            // 再次获取品牌列表数据长度 如果至少有一条数据，那么就在当前页，否则返回上一页
            this.hetPageList(this.list.length>=1?this.page:this.page-1);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>