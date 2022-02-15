//平台属性
 import request from '@/utils/request';

 //一级分类数据 GET /admin/product/getCategory1
 export const reqCategory1=()=>request({url:'/admin/product/getCategory1',method:'get'});

 //二级分类数据 GET /admin/product/getCategory2/{category1Id}
 export const reqCategory2=(category1Id)=>request({url:`/admin/product/getCategory2/${category1Id}`,method:'get'});

 //三级分类数据 GET /admin/product/getCategory3/{category2Id}
 export const reqCategory3=(category2Id)=>request({url:`/admin/product/getCategory3/${category2Id}`,method:'get'});

 //获取平台属性数据列表 GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
 export const resGetAttrInfoList=(category1Id,category2Id,category3Id)=>
 request({url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,method:'get'});

 //添加属性名 属性值 POST /admin/product/saveAttrInfo
 export const reqAddAttr = (data)=>request({url:'/admin/product/saveAttrInfo',method:'post',data});
//  {
//     "attrName": "string",
//     "attrValueList": [
//       {
//         "attrId": 0,
//         "id": 0,
//         "valueName": "string"
//       }
//     ],
//     "categoryId": 0,
//     "categoryLevel": 0,
//     "id": 0
//   }