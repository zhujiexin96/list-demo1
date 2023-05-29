<template>
  <div class="table">
    <div>
      <span class="th" v-for="(item, index) in option.column" :key="index">{{ item.title }}</span>
    </div>
    <div v-for="(item, index) in tableData" :key="index" class="list-tr">
      <span v-for="(context, i) in option.column" :key="i">{{ i != 0 ? item[context.field] : index+1 }}</span>
    </div>
  </div>
</template>
<script>

export default {
  name: 'TableVant',
  props: {
    tableData: {
      type: Array,
      default: []
    },
    option: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      columnWidthResizeOption: {
        // default false
        enable: true,
        // column resize min width
        minWidth: 30,
        // column size change
        sizeChange: ({ column, differWidth, columnWidth }) => {
          this.columnResizeInfo.column = column;
          this.columnResizeInfo.differWidth = differWidth;
          this.columnResizeInfo.columnWidth = columnWidth;
        },
      },
    }
  },
  created() {
    // console.log(this.tableData);
  }
};
</script>

<style scoped>
.vant-table {
  width: 100%;
  overflow-x: scroll;
}

.table {
  width: 10rem !important;
}

.th {
  height: 1.2rem;
  line-height: .5rem;
  background-color: #1d9eef;
  text-align: center;
  font-size: .3rem;
  width: auto;
  white-space: nowrap;
  padding: 0 .2rem;
}

.list-tr td {
  width: auto;
  white-space: nowrap;
}

.list-tr {
  height: 1.2rem;
  line-height: .5rem;
}

td {
  text-align: center;
}
</style>

