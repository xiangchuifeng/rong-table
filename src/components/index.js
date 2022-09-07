
import RongTable from './RongTable'

const coms = [
  RongTable,
];

export default {
  install(Vue) {
    coms.forEach((item) => {
      Vue.component(item.name, item);
    });
  },
};
