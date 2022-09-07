# 基于 naive-ui 组件二次封装，适用于管理项目的列表页。

目前包含有 列表部分和分页部分，可以传入请求 api,请求参数，载入数据，可以实现数据重载，

布局上面 组件高度根据父元素高度设置，实现相对于页面高度的自适应高度布局；即父元素要给一个 flex 布局，flex-direction 设为
column；给定高度，组件要加上当前对应页面的对应的 class 方便去计算自适应列表的高度。

## props：

| prop               | type     | 必须 | 描述                                                                                                                                                                                                                   | 默认值 |
| :----------------- | :------- | :--- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----- |
| pageClass          | String   | 是   | 每个页面单独要对组件加一个类名，为了使布局铺满剩余高度                                                                                                                                                                 | --     |
| columns            | Array    | 是   | 对表格的每一项的字段相关配置，配置属性和 naive 的对应配置一样                                                                                                                                                          | --     |
| pagination         | Object   | 是   | 对分页进行的基础数据配置，基础不需要做更多配置，组件已有对应处理,配置属性和 naive 的对应配置一样                                                                                                                       | --     |
| apiFn              | Function | 否   | 请求接口时候，每一个项目中封装好的 请求接口的方法，如果不写，也可以使用静态数据                                                                                                                                        | --     |
| postDataNormalKeys | Object   | 否   | 个项目中的 列表请求的基础参数，页码等                                                                                                                                                                                  | --     |
| scrollX            | String   | 否   | 对表格的每一项的字段相关配置，配置属性和 naive 的对应配置一样                                                                                                                                                          | 1200   |
| searchObj          | Object   | 否   | 在初始进来 列表请求需要加一些初始筛选条件的时候可以绑定这个值，后面重载可从 getData(obj) 传参的形式载入筛选条件                                                                                                        | --     |
| autoHeight         | Boolean  | 否   | 默认是 false ,flex 1,自动使用外边父级的高度的，为 true 时候高度为自由高度，解决整体页面双滚动条问题,同时需要 flexHeight 设为 false；或者，另外 硬性通过 css 设置 table 的固定高度 也可以暂时解决整体页面双滚动条问题， | false  |

## methods:

- setStaticData: 设置静态数据用;
- getData: 重载表格数据，当页面 searchBar(搜索条)存在时候，可以当搜索条触发时候，传递搜索条件，并重新请求表单数据，不传
  搜索条件，则重载数据
  - params：
    - searchObj: 搜索条件;
    - 'noNeedResetPage' 默认是搜索时候重置的，不需要重置，就带第二个参数 'noNeedResetPage';

```javascript
<template>
  <div class="page_wrap flex_col">
    <div class="list_search lay_border"></div>
    <div class="table_blk vx-flex-column lay_border">
      <RongTable
        ref="rongTable"
        pageClass="test_table"
        :columns="columns"
        :searchObj="searchObj.obj"
        @total="setTotal"
        scrollX="1300"
      />
    </div>
    <div class="some_other_blk lay_border"></div>
  </div>
</template>
<script setup>
  import RongTable from 'rong-table'
  import { injectActionsToColumns } from "./tbColumns";
  import { injectTableVars, linkToDetail } from "./tbActions";
  const columns = ref(injectActionsToColumns(linkToDetail));
  const rongTable = ref(null);
  let searchObj = reactive({});
  const tableReload = () => {
    rongTable.value.getData(searchObj);
  };
  const total = ref("-");
  const setTotal = (num) => {
    total.value = num;
  };
  const setStaticTableData = () => {
    let staticData = [
      {
        address: "奥斯卡就好达会计师的喀什大空间和",
        type: "Y",
        legalRep:'里存栏',
        companyName: "美丽阿斯",
      },
      {
        address: "空间和",
        type: "N",
        legalRep:'话卡基础项目拿你们',
        companyName: "圣诞节回访客户的首付款",
      },
      {
        address: "空间和",
        type: "N",
        legalRep:'话卡基础项目拿你们',
        companyName: "圣诞节回访客户的首付款",
      },
      {
        address: "空间和",
        type: "N",
        legalRep:'话卡基础项目拿你们',
        companyName: "圣诞节回访客户的首付款",
      },
    ];
    rongTable.value.setStaticData(staticData);
  };
  onMounted(() => {
    injectTableVars({
      tableReload
    })
    setStaticTableData()
</script>
```
