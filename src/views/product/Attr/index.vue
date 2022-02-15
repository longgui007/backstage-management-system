<template>
  <div>
    <el-card style="margin: 20px 0px">
      <CategorySelect @getCategoryId="getCategoruId" :show="attrTableShow"></CategorySelect>
    </el-card>
    <el-card>
      <!-- 添加属性名表单 -->
      <el-form :inline="true" :model="formAttr" class="demo-form-inline" v-if="attrFormShow">
        <el-form-item label="属性名">
          <el-input v-model="formAttr.attrName" placeholder="属性名"></el-input>
        </el-form-item>
        <!-- 添加属性名 -->
        <el-button type="primary" @click="addAttrValue" :disabled="!formAttr.attrName">添加属性值</el-button>
        <el-button @click="cacel">取消</el-button>
      </el-form>
      
      <!-- 添加属性按钮 -->
      <el-button type="primary" @click="addAttr" :disabled="!category3Id" v-if="!attrFormShow">添加属性</el-button>
      
      <!-- 属性表格 -->
      <el-table :data="attrTableData" style="width: 100%" v-if="attrTableShow" border>
        <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
        <el-table-column prop="attrName" label="属性名称" width="150">
        </el-table-column>
        <el-table-column prop="prop" label="属性值列表">
          <template slot-scope="{ row, $index }">
            <!-- <div>{{row}}</div> -->
            <el-tag
              type="success"
              v-for="(item, indx) in row.attrValueList"
              :key="item.id"
              >{{ item.valueName }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作">
          <template slot-scope="{ row, $index }">
            <div>
              <el-button type="warning" @click="updataAttr(row)">修改</el-button>
              <el-button type="danger">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="!attrTableShow" > 
        <!-- 添加属性值表格 -->
        <el-table :data="formAttr.attrValueList" style="width: 100%" border>
          <el-table-column prop="id" label="序号" width="80" align="center">
          </el-table-column>
          </el-table-column>
          <el-table-column prop="prop" label="属性值列表">
            <template slot-scope="{ row, $index }">
              <!-- <div>{{row}}</div> -->
              <!-- <el-tag
                type="success"
                v-for="(item, indx) in row.attrValueList"
                :key="item.id"
                >{{ item.valueName }}</el-tag
              > -->
              <el-input v-if="row.flag" size="mini" v-model="row.valueName" placeholder="属性值"></el-input> 
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作">
            <template slot-scope="{ row, $index }">
              <div>
                <el-button type="danger" @click="deleteAttrValue($index)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <el-button type="primary" :disabled="formAttr.attrValueList.length<1" @click="addOrUpdateAttr">保存</el-button>
        <el-button @click="cacel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import CloneDeep from 'lodash/cloneDeep';
export default {
  name: "attr",
  data() {
    return {
      categoryId: {}, //三级分类的id
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrTableData: [], //属性表格数据
      formAttr: {
        //添加属性名表单数据
        attrName: "",
        attrValueList: [
         
        ],
        categoryId: 0,
        categoryLevel: 3,
      },
      attrFormShow: false, //控制表单的显示与隐藏
      attrTableShow: true,
    };
  },
  methods: {
    //自定义事件
    getCategoruId(categoryId) {
      // console.log(categoryId);
      if (categoryId.category1Id) {
        // alert(1);
        this.category1Id = categoryId.category1Id;
        this.category2Id = "";
        this.category3Id = "";
      } else if (categoryId.category2Id) {
        // alert(2);
        this.category2Id = categoryId.category2Id;
        this.category3Id = "";
      } else {
        // alert(3);
        this.category3Id = categoryId.category3Id;
        this.getAttrList();
      }
    },
    //请求属性的数据
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this;
      console.log(category1Id, category2Id, category3Id);
      let result = await this.$API.attr.resGetAttrInfoList(
        category1Id,
        category2Id,
        category3Id
      );
      // console.log(result);
      if (result.code == 200) {
        this.attrTableData = result.data;
      }
    },
    //添加属性名提交表单
    addAttr() {
      this.attrFormShow = true;
      this.attrTableShow = false;
      this.formAttr={
        attrName:'',
        attrValueList:[],
        categoryId:this.category3Id,
        categoryLevel:3
      }
    },
    //addAttrValue
    addAttrValue() {
      // alert(1);
      this.formAttr.attrValueList.push({
        attrId:this.formAttr.id,
        valueName:"",
        flag:true
      });

    },
    //保存按钮，进行添加属性或者修改属性的操作
    async addOrUpdateAttr(){
      this.formAttr.attrValueList=this.formAttr.attrValueList.filter(item=>{
        if(item.valueName!=''){
          delete item.flag;
          return true;
        }
      });
      try {
        
        let result=await this.$API.attr.reqAddAttr(this.formAttr);
        console.log(result);
      } catch (error) {
        
      }
    },
    //取消
    cacel(){
      this.attrFormShow=false;
      this.attrTableShow=true;
    },
    //删除属性值
    deleteAttrValue(index){
      console.log(index);
      this.formAttr.attrValueList.splice(index,1);
      console.log(this.formAttr.attrValueList);
      // this.formAttr=row;
    },
    //修改属性
    updataAttr(row){
      console.log(row);
      this.attrTableShow=false;
      this.formAttr=CloneDeep(row);
      this.formAttr.attrValueList.forEach((item)=>{
        this.$set(item,"flag",true);
      })
    }
  },
};
</script>

<style>
</style>