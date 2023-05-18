### 基于 naive-ui 组件二次封装，适用于管理项目的列表页。

``` javascript

import RongTable from 'rong-table';

```
![v](https://img.shields.io/badge/rong--table-v1.1.3-brightgreen)

### 组件功能：
  - 可以设置静态数据，或者根据自己的api接口请求数据，api使用时候，要把自己封装好的api方法传入组件
  - 可以根据需要决定:
    - 是否使用表头
    - 是否使用分页
    - 是否传入初始搜索条件，
    - 是否重置分页的页码，翻页之后，搜索条件更新，一般要重置页码
    - 重载表格
    - 设置loading状态
    - 增加了columns监听，可以在一个表格上修改columns,使用于tab切换类，公用弹窗列表，起他多场景类表格

布局上面 组件高度根据父元素高度设置，实现相对于页面高度的自适应高度布局；即父元素要给一个 flex 布局，flex-direction 设为
column；给定高度，组件要加上当前对应页面的对应的 class 方便去计算自适应列表的高度。  

组件获取接口数据的方法 getData,在组件内部只有 监听到apiName改变、内部页码操作、首次加载时候会触发，其他情况可以根据应用场景在组件外部择机使用。

### props：

| prop               | type     | 必须 | 描述                                                                                                                                                                                                                   | 默认值 |
| :----------------- | :------- | :--- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----- |
| pageClass          | String   | 是   | 每个页面单独要对组件加一个类名，为了使布局铺满剩余高度                                                                                                                                                                 | --     |
| columns            | Array    | 是   | 对表格的每一项的字段相关配置，配置属性和 naive 的对应配置一样                                                                                                                                                          | --     |
| pagination         | Object   | 是   | 对分页进行的基础数据配置，基础不需要做更多配置，组件已有对应处理,配置属性和 naive 的对应配置一样                                                                                                                       | --     |
| apiFn              | Function | 否   | 请求接口时候，每一个项目中封装好的 请求接口的方法，如果不写，也可以使用静态数据                                                                                                                                        | --     |
| isSingle           | Boolean  | 否   | default:true ,表格是否有纵向纵向的分割线，即 是够为无边框的一行  |-- |
| postDataNormalKeys | Object   | 否   | 每个项目中的列表请求的基础参数，页码等，例如：{current,pageSize},根据前后端约定配置                                                                                                                                                                                 | --     |
| scrollX            | String   | 否   | 对表格的每一项的字段相关配置，配置属性和 naive 的对应配置一样                                                                                                                                                          | 1200   |
| searchObj          | Object   | 否   | 在初始进来 列表请求需要加一些初始筛选条件的时候可以绑定这个值，后面重载可从 getData(obj) 传参的形式载入筛选条件                                                                                                        | --     |
| autoHeight         | Boolean  | 否   | 默认是 false ,flex 1,自动使用外边父级的高度的，为 true 时候高度为自由高度，解决整体页面双滚动条问题,同时需要 flexHeight 设为 false；或者，另外 硬性通过 css 设置 table 的固定高度 也可以暂时解决整体页面双滚动条问题， | false  |
| needPagiantion     | Boolean  | 否   | 默认是 true,是否需要分页部分  | --  |
| noHeadLine         | Boolean  | 否   | 默认是 false ,是否需要头部   | -- |
| showJumper         | Boolean  | 否   | 默认是 false , 是否需要分页尾部的跳转功能 | -- |
|listname   | String | 否 | 接口返回的数据结构的分页列表层级对应的 key值，默认为 例如res.data.exg.list中的exg | -- |
|resDataKeys | Object | 否 | {listKey,totalKey},列表接口成功之后对应的key值自定义，详细逻辑见下文 | -- |
|preSetDataHandle | function | 否 |某些情况接口返回非表格数据结构，需要单独处理一下再赋值给表格，fn return {list,totalCount，otherProps..} | -- |
|rowProps | function| 否 | (rowData: object, rowIndex : number) => object  自定义行属性 | -- |

### methods:
- setLoading: 设置loading状态 ,setLoading(true/false)，
- setStaticData: 设置静态数据用, setStaticData(array)
- getData: 重载表格数据，当页面 searchBar(搜索条)存在时候，可以当搜索条触发时候，传递搜索条件，并重新请求表单数据，不传
  搜索条件，则重载数据
  - params：
    - searchObj: 搜索条件;
    - 'noNeedResetPage' 默认是搜索时候重置的，不需要重置，就带第二个参数 'noNeedResetPage';

### emit
- total(total,list)

#### resData 处理逻辑

```javascript
// 组件内部列表接口获取部分如下，可以按照约定对接接口
// 即接口返回数据结构约定为 res.data:{list,totalCount,...}
// 如果接口返回数据结构更深一级，也可以通过 res.data[props.listname]:{list,totalCount,...} 对接

// 或者 全部使用 自定义的key值：即res.data自定义的层级，对应自定义的 list total 的key
// 即 props.resDataKeys: {listKey,totalKey}
   props
    .apiFn(postData)
    .then((res) => {
      loading.value = false;
      if(props.resDataKeys){
        if (props.listname) {
          data.value = res.data[props.listname][props.resDataKeys.listKey];
          tbPagination.obj.total = res.data[props.listname][props.resDataKeys.totalKey];
        } else {
          data.value = res.data[props.resDataKeys.listKey];
          tbPagination.obj.total = res.data[props.resDataKeys.totalKey];
        }
      }else{
        if (props.listname) {
          data.value = res.data[props.listname].list;
          tbPagination.obj.total = res.data[props.listname].totalCount;
        } else {
          data.value = res.data.list;
          tbPagination.obj.total = res.data.totalCount;
        }
      }
      emit("total",  tbPagination.obj.total);
    })
    .catch((err) => {
      loading.value = false;
    });
```

### 示例用法

```javascript
// 组件外 页面设置垂直方向flex布局，表格组件布局父级 flex 1,撑满剩余高度。此为满屏布局，下面示例亦是如此。
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
  })
</script>
```

```javascript
// tbColumns.js
import { h } from "vue";
import { NTag, NRate,NButton } from "naive-ui";
export const injectActionsToColumns = (...actions) => [
  {
    title: "企业名称",
    key: "companyName",
    width: 220,
    ellipsis: {
      tooltip: { style: { maxWidth: "900px" } },
    },
    render(row) {
      let markArr = (row.certHonor && row.certHonor.slice(0, 3)) || [1, 2];
      const tagNodes = markArr.map((item) => {
        return h(
          NTag,
          {
            style: {
              marginRight: "5px",
              marginTop: "5px",
              padding: "5px 8px",
              lineHeight: 1,
              color: "#409EFF",
              background: "#ECF5FF",
              borderColor: "#D9ECFF",
            },
          },
          { default: () => item }
        );
      });
      return h(
        "div",
        {
          class: "tb_company_name",
        },
        [
          h("img", {
            class: "com_logo",
            src: row.logo ? logoBaseUrl + row.logo + ".jpg" : location.origin + "/assets/images/default_ent_logo.jpg",
          }),
          h("div", { class: "com_text" }, [
            h(
              "div",
              {
                class: "com_name pointer",
                onClick: () => {
                  linkToDetail(row.companyId);
                },
              },
              row.companyName
            ),
            ...tagNodes,
          ]),
        ]
      );
    },
  },
  {
    title: "法定代表人",
    key: "legalRep",
    width: 120,
    ellipsis: {
      tooltip: { style: { maxWidth: "900px" } },
    },
  },
  {
    title: "注册资本",
    key: "registeredCapital",
    width: 120,
    ellipsis: {
      tooltip: { style: { maxWidth: "900px" } },
    },
  },
  {
    title: "类型",
    key: "type",
    width: 120,
    ellipsis: {
      tooltip: { style: { maxWidth: "900px" } },
    },
    render(row, index) {
      const filtData = {
        N: "待处理",
        Y: "已处理",
        C: "客户取消",
      };
      return filtData[row.type];
    },
  },

  {
    fixed: "right",
    title: "操作",
    key: "opt",
    align: "center",
    width: "110",
    render: (row) => {
      return h(
        NButton,
        {
          size: "small",
          onClick: () => actions[0](row),
        },
        { default: () => "Send Email" }
      );
    },
  },
];
```

```javascript
// tbActions.js

let tableReload = null;

export const injectTableVars = (vars)=>{
  tableReload = vars.tableReload;
}

// 跳转
export const linkToDetail = (row)=>{
  window.alert('dsdd')
}

```

```javascript
// 如果不想满屏撑满的布局，可以设置 autoHeight，同时flexheight为false,父级取消垂直方向flex布局，即可实现自由高度，如下：
 <div class="ptable">
    <RongTable
      ref="rongTable"
      noHeadLine
      autoHeight
      :flexheight="false"
      pageClass="all_policy_list"
      :columns="columns"
      apiName="policy2Company"
      @total="setTotal"
    />
  </div>
  
```

### 本组件可以使用于大多数的基于naive-ui的前端项目的表格部分。另外如果样式和所涉及项目的UI样式不同，可以通过css去修改。也可以设置naive-ui的theme配置

##### 有需要协助的可以微 15858287521。