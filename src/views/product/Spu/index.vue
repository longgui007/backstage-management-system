<template>
  <div>
    <!-- 三级联动 -->
    <el-card>
      <div>
        <CategorySelect :show="scence==0" @getCategoryId="getCategoryId"></CategorySelect>
      </div>
    </el-card>
    
    <el-card style="margin-top:30px">
      <div v-show="scence==0">
        <!-- 展示Spu的表格 -->
        <el-button @click="addSpu" type="primary" icon="el-icon-plus" :disabled=!category3Id>添加SPU</el-button>
        <el-table
          :data="spuTableData"
          style="width: 100%" border>
          <el-table-column
           type="index"
            label="序号"
            width="80"
            align="center">
          </el-table-column>
          <el-table-column
            prop="spuName"
            label="SPU名称"
            width="width">
          </el-table-column>
          <el-table-column
            prop="description"
            label="SPU描述"
            width="width">
          </el-table-column>
          <el-table-column
            prop="prop"
            label="操作"
            width="width">
            <template slot-scope="{row,$index}">
              <!-- <div>{{row}}</div> -->
              <div>
                <HintButton icon="el-icon-plus" title="添加sku" size="mini" type="success" @click="addSku"></HintButton>
                <HintButton icon="el-icon-edit" title="修改spu" size="mini" type="warning" @click="updateSpu(row)"></HintButton>
                <HintButton icon="el-icon-info" title="查看当前spu全部sku列表" size="mini" type="info"></HintButton>
                <el-popconfirm title="设施">
                  
                </el-popconfirm>
                <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="deletSpu(row)">
                  <HintButton slot="reference" icon="el-icon-delete" title="删除spu" size="mini" type="danger"></HintButton>
                </el-popconfirm>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
        style="text-align:center"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[3, 5, 8]"
          :page-size="limit"
          layout=" prev, pager, next, jumper,->,sizes,total"
          :total="total">
        </el-pagination>
      </div>
      <!-- spuFrom -->
      <div v-show="scence==1">
        <SpuFrom @changeScence="changeScence" :spuId="spuId" ref="spu"></SpuFrom>
      </div>
       <!-- skuFrom -->
      <div v-show="scence==2">
        <SkuFrom @changeScence="changeScence" ref="sku"></SkuFrom>
      </div>
    </el-card>
  </div>
</template>

<script>
import SkuFrom from './SkuForm';
import SpuFrom from './SpuForm';
export default {
  name:'spu',
  data(){
    return {
    categoryShow:true,
    spuTableData:[],
    page:1,
    limit:3,
    total:3,
    category1Id:"",
    category2Id:"",
    category3Id:"",
    scence:"",
    spuId:''
    }
  },
  mounted(){
    this.getSpuList();
  },
  methods:{
    //请求spu数据
    async getSpuList(){
      const {page,limit,category3Id}=this;
      let result =await this.$API.spu.reqGetSPUList(page,limit,category3Id);
      console.log(result);
      if(result.code==200){
        this.spuTableData=result.data.records;
        this.total=result.data.total;
      }
    },
    //获取三级联动组件传来的id
    getCategoryId(categoryId){
      // console.log(categoryId)
      if(categoryId.category1Id){
        this.category1Id=categoryId.category1Id;
      }else if(categoryId.category2Id){
        this.category2Id=categoryId.category2Id;
      }else if(categoryId.category3Id){
        this.category3Id=categoryId.category3Id;
        this.getSpuList();
      }
    },
    //分页器切换展示多少页
    handleSizeChange(val){
      this.limit=val;
      this.getSpuList();
    },
    //分页器切换当前页
    handleCurrentChange(val){
      this.page=val;
      this.getSpuList();
    },
    //切换scence的值
    changeScence(val){
      // console.log(val);
      this.scence=val.scence;
    },
    //添加spu
    addSpu(){
      this.scence=1;
    },
    //添加sku
    addSku(){
      this.scence=2;
    },
    //修改spu
    updateSpu(row){
      this.scence=1;
      // console.log(row.id);
      this.spuId=row.id;
      this.$refs.spu.getSpuData(row);
      
    },
    //删除spu
    async deletSpu(row){
      // console.log(row);
      let result=await this.$API.spu.reqDeleteSpu(row.id);
      if(result.code==200){
        this.getSpuList();
      }
     
    }
  },
  components:{
    SkuFrom,
    SpuFrom
  }
}
</script>

<style>

</style>