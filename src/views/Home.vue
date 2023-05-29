<template>
  <div class="page-home">
    <div class="form">
      <van-field clickable readonly v-model="listQuery.enterprise_parent" is-link name="picker"
        @click="companiesShowPicker = true" />
      <van-popup v-model:show="companiesShowPicker" position="bottom">
        <van-picker show-toolbar :columns="companiesArray" @confirm="companiesOnConfirm"
          @cancel="companiesShowPicker = false" />
      </van-popup>
      <van-field clickable readonly v-model="category" is-link name="picker" @click="categoryShowPicker = true" />
      <van-popup v-model:show="categoryShowPicker" position="bottom">
        <van-picker show-toolbar :columns="categoryArr" @confirm="categoryOnConfirm"
          @cancel="categoryShowPicker = false" />
      </van-popup>
      <van-field v-model="listQuery.name" :placeholder="placeholders[categoryIndex]" />
      <div style="margin: 16px;">
        <van-button round block type="info" @click="handleFilter">提交</van-button>
      </div>
    </div>
    <div class="van-list">
      <van-tabs v-model="listQuery.year" @change="yearChange($event)" color="#1989fa">
        <van-tab v-for="(item, index) in years" :title="item + '年'" :key="index" :name="item">
          <van-list v-model="listLoading" :finished="finished" finished-text="没有更多了" @load="onLoad">
            <Table-vant :option="option" :tableData="listData"></Table-vant>
          </van-list>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import dateformat from 'dateformat'
import Toast from "vant/lib/toast";
import "vant/lib/toast/style";
import TableVant from "@/components/TableVant";

// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import { getList } from '@/api/utils'

export default {
  name: 'Home',
  data() {
    return {
      companiesArray: ['国网省公司', '国网总部', '蒙西电网'],
      categoryArr: [{
        value: 0,
        name: 'enterprise',
        text: '查企业',
      }, {
        value: 1,
        name: 'project',
        text: '查产品',
      }, {
        value: 2,
        name: 'address',
        text: '查地区',
      }],
      years: [
        '2024',
        '2023',
        '2022',
        '2021',
        '2020',
      ],
      placeholders: [
        '输入企业名称，例如宏乐集团',
        '输入产品名称',
        '输入省份或地区名'
      ],
      category: '查企业',
      categoryIndex: 0,
      listQuery: {
        name: '',
        option: 'enterprise',
        enterprise_parent: '国网省公司',
        year: '2024',
      },
      equalObj: {},
      listData: [],
      listLoading: false,
      finished: false,
      page: 1,
      pageSize: 10,
      keywords: '',
      companiesShowPicker: false,
      categoryShowPicker: false,
      option: {
        column: [
          {
            title: '序号',
            field: 'index',
            key: 'a',
            renderBodyCell: ({ row, column, rowIndex }, h) => {
              return ++rowIndex;
            },
          },
          {
            title: '分标名称',
            field: 'scale',
            key: 'b'
          },
          {
            title: '包号',
            field: 'baohao',
            key: 'c'
          },
          {
            title: '中标企业名称',
            field: 'enterprise',
            key: 'd'
          },
          {
            title: '中标金额（万元）',
            field: 'amount',
            key: 'e'
          },
          {
            title: '中标项目名',
            field: 'project',
            key: 'f'
          },
        ]
      },
    }
  },
  components: {
    HelloWorld,
    TableVant
  },
  methods: {
    companiesOnConfirm(value) {
      this.listQuery.enterprise_parent = value;
      this.companiesShowPicker = false;
    },
    categoryOnConfirm(value) {
      this.category = value.text;
      this.categoryIndex = value.value;
      this.listQuery.option = value.name;
      this.categoryShowPicker = false;
    },
    getList(equalObj = {}, skip) {
      getList('itemList', true, equalObj, this.pageSize, skip).then(response => {
        let list = response;
        if (list.length <= 0) {
          this.finished = true;
        }

        for (let i = 0; i < list.length; i++) {
          this.listData.push(list[i].attributes);
        }
        this.listLoading = false;
      }).catch(err => {
        console.log(err);
        this.listLoading = false;
        this.$message.error(err.rawMessage);
      })
    },
    handleFilter(year) {

      // 清除相关状态
      this.page = 1;

      this.listData = [];
      this.finished = false;

      console.log('查询条件:', this.listQuery);
      // return
      // if(!this.listQuery.name || !this.listQuery.option){return}

      let equalObj = {};
      equalObj[`${this.listQuery.option}`] = this.listQuery.name.trim(); // 要过滤空字符串
      equalObj['enterprise_parent'] = this.listQuery.enterprise_parent;
      equalObj['year'] = this.listQuery.year;


      equalObj.blend = true;

      this.equalObj = equalObj;

      // this.getList(this.equalObj);
    },
    onLoad() {
      this.getList(this.equalObj, (this.page - 1) * this.pageSize);
      this.page++;
    },
    yearChange(year) {
      this.page = 1;

      this.listData = [];
      this.finished = false;
      this.listQuery.year = year;
      this.equalObj['year'] = this.listQuery.year;
    }
  },
  created() {
    let equalObj = {};
    equalObj[`${this.listQuery.option}`] = this.listQuery.name.trim(); // 要过滤空字符串
    equalObj['enterprise_parent'] = this.listQuery.enterprise_parent;
    equalObj['year'] = this.listQuery.year;
    this.equalObj = equalObj;
  }
}
</script>

<style lang="scss">
.page-home {
  .van-list {
    .van-tabs {
      .van-tabs__wrap {

        .van-tabs__nav {
          color: #666;
          font-weight: 600;
        }

        .van-tab--active {
          font-size: 16px;
          font-weight: 600;
        }
      }
      .van-tabs__content {

      }
    }
  }
}
</style>
