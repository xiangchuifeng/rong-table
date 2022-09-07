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
  import { ref, toRefs, reactive, onMounted } from "vue";
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
});
</script>

<style lang="less" scoped>
  .page_wrap {
    height: 100vh;
    .list_search {
      height: 150px;
    }
    .table_blk {
      flex: 1;
      margin: 50px 0;
    }
    .some_other_blk {
      height: 100px;
    }
  }
  //  列表中 企业名称一项自定义 h()函数对应的 类名
  .tb_company_name {
    display: flex;
    align-items: center;
    .com_logo {
      float: left;
      margin-right: 15px;
      width: 48px;
      height: 48px;
      object-fit: cover;
      background-color: #ecf2ff;
    }

    .com_text {
      overflow: hidden;
      white-space: break-spaces;
    }
    .com_name {
      &:hover {
        color: #2f64e7;
      }
    }
    .tb_link_span.com_name {
      &:hover {
        color: #2f64e7;
      }
    }
  }
</style>
