<!-- 
  组件说明：
  可以看后备库页面(/backLib)的应用示例 
  props:
    pageClass: String,每个页面单独要对组件加一个类名，为了使布局铺满剩余高度
    columns: Array, 对表格的每一项的字段相关配置，配置属性和 naive 的对应配置一样，
    pagination: Object,对分页进行的基础数据配置，基础不需要多更多配置，组件已有对应处理
    //apiName: String,表格接口请求时候的 接口名字，
    apiFn:Function,请求接口时候，每一个项目中封装好的 请求接口的方法
    postDataNormalKeys:Object，每个项目中的 列表请求的基础参数，页码等。
    isSingle:Boolean  default:true ,表格是否有纵向纵向的分割线，即 是够为无边框的一行
    scrollX:String,
      表格右侧按钮列固定时候使用的出现滚动的宽度数值，即naive ui,表格的 scroll-x
      有更多需求，可以沟通再加扩展功能
    searchObj: 在初始进来 列表请求需要加一些初始筛选条件的时候可以绑定这个值，
              后面重载可从 getData(obj) 传参的形式载入筛选条件
    autoHeight: 默认是false ,flex 1,自动使用外边父级的高度的，为true时候高度为自由高度，解决整体页面双滚动条问题,同时需要flexHeight 设为 false；
                或者，另外 硬性通过css设置table的固定高度 也可以暂时解决整体页面双滚动条问题，
    needPagiantion: 默认 true,是否需要分页
    listname: 接口返回的分页列表对应的 key值，默认为 list,res.data.list
    resDataKeys: {listKey,totalKey},列表接口成功之后对应的key值自定义

    showJumper:boolean 是否需要跳转页 default:true
    preSetDataHandle: function, 某些情况接口返回非表格数据结构，需要单独处理一下再赋值给表格，fn return {list,totalCount，otherProps..}
    rowProps:function  (rowData: object, rowIndex : number) => object  自定义行属性
    
  methods:
    setLoading: 设置loading状态 ,setLoading(true/false)
    setStaticData: 设置静态数据用, setStaticData(array),注意，设置静态数据时候，请不要传递apiFn,或者等接口请求完毕后加延时设置静态数据
    getData: 重载表格数据，当页面searchBar(搜索条)存在时候，可以当搜索条触发时候，传递搜索条件
    ，并重新请求表单数据，不传搜索条件，则重载数据
      params: (searchObj, noNeedReset)
      searchObj: 搜索条件
      'noNeedResetPage' 默认是搜索时候重置的，不需要重置，就带第二个参数 'noNeedResetPage'
  emit
    total(total,list)
 -->
<template>
  <div :class="[autoHeight ? '' : 'vx-flex_item', pageClass]" class="tb_block_wrap table">
    <!-- :style="{ height: autoHeight ? 'auto' : `${height}px` }" -->
    <n-data-table
      class="ld_rong_table"
      :class="noHeadLine ? 'no_head_tb' : ''"
      :columns="columns0"
      :data="data"
      :style="{ height: autoHeight ? 'auto' : heightStr }"
      :loading="loading"
      :pagination="false"
      :bordered="false"
      :flex-height="flexHeight"
      single-line
      :scroll-x="scrollX || 1200"
      :row-props="rowProps"
    />

    <n-pagination
      v-if="needPagiantion"
      class="ld_pagination"
      v-model:page="tbPagination.obj.currentPage"
      v-model:page-size="tbPagination.obj.pageSize"
      v-model:item-count="tbPagination.obj.total"
      @update:page="currentPageChange"
      :page-slot="7"
      :show-quick-jumper="showJumper"
      :show-size-picker="pagconfig0.obj.showSizePicker"
      :page-sizes="pagconfig0.obj.pageSizes"
    >
      <template v-if="showJumper" #prefix="{ itemCount }"> 共 {{ itemCount }} 条 </template>
      <template v-if="showJumper" #suffix="{ endIndex }"> 页 </template>
    </n-pagination>
  </div>
</template>

<script>
  export default {
    name: "RongTable",
  };
</script>

<script setup>
  import { ref, toRefs, toRef, watch, reactive, onMounted } from "vue";
  const props = defineProps({
    pageClass: String,
    columns: Array,
    pagination: Object,
    pagConfig: Object,
    searchObj: Object,
    apiName: String,
    scrollX: String,
    listname: {
      type: String,
      default: "",
    },
    resDataKeys: {
      type: Object,
      default: null,
    },
    noHeadLine: {
      type: Boolean,
      default: false,
    },
    autoHeight: {
      type: Boolean,
      default: false,
    },
    flexHeight: {
      type: Boolean,
      default: true,
    },
    apiFn: {
      type: Function,
      default: null,
    },
    postDataNormalKeys: Object,
    needPagiantion: {
      type: Boolean,
      default: true,
    },
    showJumper: {
      type: Boolean,
      default: true,
    },
    preSetDataHandle: Function,
    rowProps: Function,
  });
  const emit = defineEmits(["total"]);
  const setColumnsNullSpace = (cols)=>{
    let handledCols=[];
    const nullStr = ['',undefined,null,'null']
    handledCols = cols.map(item=>{
      let o = item;
      if(!o.render){
        o.render = (row)=>{
          return nullStr.includes(String(row[item.key]))?'-':row[item.key]
        }
      }
      return o;
    })
    return handledCols
  }

  const height = ref(200);
  const heightStr = ref(props.needPagination ? "calc(100% - 48px)" : "100%");
  const loading = ref(true);

  const columns0 = toRef(props, "columns");
  columns0.value = setColumnsNullSpace(columns0.value)
  watch(
    () => props.columns,
    (n) => {
      loading.value = true;
      columns0.value = setColumnsNullSpace(n);
    },
    { deep: true }
  );

  const pagconfig0 = reactive({
    obj: {
      showSizePicker: (props.pagConfig && props.pagConfig.showSizePicker) || false,
      pageSizes: (props.pagConfig && props.pagConfig.pageSizes) || [10, 20, 30],
    },
  });

  const defaultPagination = {
    currentPage: 1,
    pageSize: 10,
    total: 0,
  };
  let tbPagination = reactive({
    obj: {
      ...defaultPagination,
      ...props.pagination,
    },
  });

  const data = ref([]);

  let search = reactive(props.searchObj || {});

  const apiName0 = ref(props.apiName);

  const setStaticData = (val) => {
    loading.value = false;
    data.value = val;
  };

  const getData = (obj, noNeedReset) => {
    if (noNeedReset) {
    } else {
      tbPagination.obj.currentPage = 1;
    }
    if (obj) {
      search = {
        ...search,
        ...obj,
      };
    }
    let postData = {};
    if (props.postDataNormalKeys) {
      postData = {
        ...props.postDataNormalKeys,
        ...search,
      };
    } else {
      postData = {
        currPage: tbPagination.obj.currentPage,
        pageSize: tbPagination.obj.pageSize,
        ...search,
      };
    }
    if (props.apiFn) {
      if (props.apiFn) {
        loading.value = true;
        props
          .apiFn(postData)
          .then((res0) => {
            loading.value = false;
            let res = res0;
            if (props.preSetDataHandle) {
              // 返回的非表格数据结构数据 需要单独预处理一下再赋值给表格
              res.data = props.preSetDataHandle(res0.data);
            }

            if (props.resDataKeys) {
              if (props.listname) {
                data.value = res.data[props.listname][props.resDataKeys.listKey];
                tbPagination.obj.total = res.data[props.listname][props.resDataKeys.totalKey];
              } else {
                data.value = res.data[props.resDataKeys.listKey];
                tbPagination.obj.total = res.data[props.resDataKeys.totalKey];
              }
            } else {
              if (props.listname) {
                data.value = res.data[props.listname].list;
                tbPagination.obj.total = res.data[props.listname].totalCount;
              } else {
                data.value = res.data.list;
                tbPagination.obj.total = res.data.totalCount;
              }
            }
            emit("total", tbPagination.obj.total);
          })
          .catch((err) => {
            loading.value = false;
          });
      }
    } else {
      let staticData = [];
      data.value = staticData;
      loading.value = false;
    }
  };

  const setLoading = (flag) => {
    loading.value = flag;
  };

  defineExpose({
    setLoading,
    getData,
    setStaticData,
    // updateSearchObj,
  });

  watch(
    () => props.pagination,
    (n) => {
      tbPagination.obj = {
        ...tbPagination.obj,
        ...n,
      };
    }
  );

  // watch(
  //   () => props.apiName,
  //   (n) => {
  //     console.log(n, "l--");
  //     props.apiFn = n;
  //     tbPagination.obj = defaultPagination;
  //     getData();
  //   },
  //   { deep: true }
  // );

  watch(
    () => props.apiFn,
    (n) => {
      tbPagination.obj = defaultPagination;
      getData();
    },
    { deep: true }
  );

  watch(
    () => props.searchObj,
    (n) => {
      search = n;
      // getData();
    },
    { deep: true }
  );

  const currentPageChange = (page) => {
    console.log(page, "jk---");
    getData("", "noNeedReset");
  };

  const getInnerPageHeight = (classStr) => document.querySelector(classStr).offsetHeight;

  const getTableWrapHeight = () => {
    let h = getInnerPageHeight(`.${props.pageClass}.tb_block_wrap`);
    if (!props.needPagiantion) {
      height.value = h;
    } else {
      height.value = h - 48;
    }
  };
  const watchResize = () => {
    window.onresize = () => {
      getTableWrapHeight();
    };
  };

  onMounted(() => {
    setTimeout(() => {
      if (!props.autoHeight) {
        getTableWrapHeight();
        watchResize();
      }

      if (!props.apiFn) {
        // xx
      } else {
        getData();
      }
    }, 10);
  });
</script>

<style lang="less" scoped>
  @import url("../assets/shot.less");
  .ld_pagination {
    float: right;
    margin-top: 20px;
  }
  .tb_block_wrap {
    :deep(.n-data-table-th),
    :deep(.n-data-table-td) {
      font-size: 16px;
    }
  }
</style>

<style lang="less">
  .no_head_tb {
    .n-data-table-base-table-header {
      display: none;
    }
  }
</style>
