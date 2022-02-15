<template>
  <div>
    <el-form ref="spuForm" :model="spuForm" label-width="80px">
      <el-form-item label="SPU名称">
        <el-input v-model="spuForm.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spuForm.tmId">
          <el-option :label="item.tmName" :value="item.id" v-for="(item,index) in trademarkList"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input type="textarea" v-model="spuForm.description" placeholder="描述"></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- 上传图片：action图片上传的地址  list-type: 文件列表的类型 on-preview:图片预览的时候会出发  on-remove:当删除图片的时候会出发 
         file-list：照片墙需要展示的数据【数组：数组里面的元素务必要有name、url属性】
         on-preview：图片预览功能
         on-remove:删除图片的时候会触发
        -->
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handlerSuccess"
          :file-list="spuImageList"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性" >
        <el-select v-model="attrIdAndAttrName" :placeholder="`还有${unSelectSaleAttr.length}条未选择`">
          <el-option :label="item.name" :value="`${item.id}:${item.name}`" v-for="(item,index) in unSelectSaleAttr"></el-option>
        </el-select>
        <el-button type="primary" :disabled="!attrIdAndAttrName" @click="addSaleAttr">添加销售属性</el-button>
      </el-form-item>

      <el-table
        :data="spuForm.spuSaleAttrList"
        style="width: 100%" border>
        <el-table-column
          type="index"
          prop="prop"
          label="序号"
          width="80">
        </el-table-column>
        <el-table-column
          prop="saleAttrName"
          label="属性名"
          width="width">
        </el-table-column>
        <el-table-column
          prop="spuSaleAttrValueList"
          label="属性值名称列表"
          width="width">
        </el-table-column>
        <el-table-column
          prop="prop"
          label="操作"
          width="width">
          <template slot-scope="{row}">
            <el-button type="danger"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>

    <div>
      <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
      <el-button type="default" @click="cancle">取消</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "SpuFrom",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      spuForm: {
        category3Id:"",
        description:"",        
        spuImageList:[],
        spuName: "",       
        spuSaleAttrList:[],
        tmId:'',
      },
      saleAttrList:[],
      trademarkList:[],
      saleData:[],
      attrIdAndAttrName: "", //收集未选择的销售属性的id-----
      spuImageList: [], //存储SPU图片的数据
    };
  },
  props:['spuId'],
  mounted(){
    this.getTrademarkList();
    this.getSaleAttrList();
  },
  methods: {
    //获取spu数据
    async getSpuData(row){
      // console.log(row); 
      let result=await this.$API.spu.reqSpu(row.id);  
      if(result.code==200){
        this.spuForm=result.data;
      }

      //获取spu图片的数据
      let spuImageResult = await this.$API.spu.reqSpuImageList(row.id);
      if (spuImageResult.code == 200) {
        let listArr = spuImageResult.data;
        //由于照片墙显示图片的数据需要数组，数组里面的元素需要有name与url字段
        //需要把服务器返回的数据进行修改
        listArr.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        //把整理好的数据赋值给
        this.spuImageList = listArr;
      }
    },
    //取消
    cancle() {
      this.$emit("changeScence", { scence: 0 });
      //清理数据
      //Object.assign:es6中新增的方法可以合并对象
      //组件实例this._data,可以操作data当中响应式数据
      //this.$options可以获取配置对象，配置对象的data函数执行，返回的响应式数据为空的
      Object.assign(this._data, this.$options.data());
    },
    //获取品牌列表
    async getTrademarkList(){
      let result=await this.$API.spu.reqTradeMarkList();
      if(result.code==200){
        this.trademarkList= result.data;
      }
      // console.log(result);
    },
    //获取销售属性
    async getSaleAttrList(){
      let result=await this.$API.spu.reqSaleAttrList();
      // console.log(result);
      if(result.code==200){
        this.saleAttrList= result.data;
      }
    },
    //照片墙图片预览的回调
    handlePictureCardPreview(file){
      this.dialogImageUrl=file.url;
      this.dialogVisible=true;
    },
    //照片墙删除某一个图片时触发
    handleRemove(file,fileList){
      this.spuImageList=fileList;
    },
    //照片墙图片上传成功的回调
    handlerSuccess(response,file,fileList){
      this.spuImageList=fileList;
    },
    //添加销售属性
    addSaleAttr(){
      const [baseSaleAttrId,saleAttrName]=this.attrIdAndAttrName.split(":");
      let newSaleAttr={
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList:[]
      };
      this.spuForm.spuSaleAttrList.push(newSaleAttr);
      this.attrIdAndAttrName="";
    },
    //保存按钮的回调
    async addOrUpdateSpu(){
      this.spuForm.spuImageList=this.spuImageList.map((item)=>{
        return{
          imageName:item.name,
          imageUrl:(item.response&&item.response.data)||item.url,
        };
      });
      let result=await this.$API.spu.reqAddOrUpdateSpu(this.spuForm);
      if(result.code==200){
        this.$message({type:'success',message:"保存成功"});
        this.$emit("changeScence",{
          scence:0,
          flag:this.spuForm.id?"修改":"添加",
        });
      }
      Object.assign(this._data,this.$options.data());
    }
  },
  computed:{
    unSelectSaleAttr(){
      let result=this.saleAttrList.filter((item)=>{
        return this.spuForm.spuSaleAttrList.every(item1=>{
          return item.name!=item1.saleAttrName;
        })
      });
      return result;
    }
  }
};
</script>

<style>
</style>