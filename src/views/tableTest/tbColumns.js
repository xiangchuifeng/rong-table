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
