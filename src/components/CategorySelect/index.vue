<template>
  <div>
    <el-form :inline="true" :model="formCategory" class="demo-form-inline" :disabled="!show">
      <el-form-item label="一级分类">
        <el-select v-model="formCategory.category1Id" placeholder="请选择" @change="handler1">
          <el-option :label="category1item.name" :value="category1item.id" v-for='(category1item,category1index) in category1List' :key="category1item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select v-model="formCategory.category2Id" placeholder="请选择" @change="handler2">
          <el-option :label="category2item.name" :value="category2item.id" v-for='(category2item,category2index) in category2List' :key="category2item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类" >
        <el-select v-model="formCategory.category3Id" placeholder="请选择" @change="handler3">
          <el-option :label="category3item.name" :value="category3item.id" v-for='(category3item,category3index) in category3List' :key="category3item.id"></el-option>
        </el-select>
  </el-form-item>
  
</el-form>
  </div>
</template>

<script>
export default {
    name:'CategorySelect',
    data() {
      return {
        formCategory: {
          category1Id:'',
          category2Id:'',
          category3Id:'',
        },
        category1List:[],
        category2List:[],
        category3List:[],
      }
    },
    props:['show'],
    mounted(){
      this.getCategoryList();
      // console.log(this.show)
    },
    methods: {
      onSubmit() {
        console.log('submit!');
      },
      //获取一级分类数据
      async getCategoryList(){
        let result1=await this.$API.attr.reqCategory1();
        if(result1.code==200){
          this.category1List=result1.data;
          // console.log(this.category1List);
        }
        
      },
      //一级分类回调
      async handler1(){
        this.category2List=[];
        this.category3List=[];
        this.formCategory.category2Id='';
        this.formCategory.category3Id='';
        // console.log(this.formCategory.category1Id);
        const {category1Id} =this.formCategory;
        this.$emit('getCategoryId',{category1Id});
        let result=await this.$API.attr.reqCategory2(category1Id);
        if(result.code==200){
          this.category2List=result.data;
          // console.log(this.category2List);
        }
      },
      //二级分类回调
      async handler2(){
        const {category2Id} =this.formCategory;
        this.$emit('getCategoryId',{category2Id});
        this.category3List=[];
        this.formCategory.category3Id='';
        let result=await this.$API.attr.reqCategory3(category2Id);
        if(result.code==200){
          // console.log(result.data);
          this.category3List=result.data;
        }
      },
      //三级分类回调
      handler3(){
        const {category3Id} =this.formCategory;
        this.$emit('getCategoryId',{category3Id});
      }
    }
}
</script>

<style>

</style>