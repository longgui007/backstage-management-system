<template>
  <div>
    skuform
    <div>
      <el-button type="primary">保存</el-button>
      <el-button type="default" @click="cancle">取消</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "skuFrom",
  methods:{
    cancle(){
      this.$emit('changeScence',{scence:0});
    }
  }
};
</script>

<style>
</style>