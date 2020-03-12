<template>
  <div class="offset">
    <table class="table table-bordered table-serialized long-labels table-striped table-hover inline dataTable no-footer sm">
      <thead>
        <slot name="columns">
          <tr>
            <th v-for="column in columns" :key="column">{{ column }}</th>
          </tr>
        </slot>
      </thead>
      <tbody>
        <tr v-for="(item, index) in displayedPosts" :key="index">
          <slot :row="item">
            <td v-for="column in columns" :key="column">{{ itemValue(item, column) }}</td>
          </slot>
        </tr>
      </tbody>
    </table>
    <nav aria-label="Page navigation example">
      <ul class="pagination justify-content-end">
        <li class="page-item disabled">
          <a class="page-link" href="#" v-if="page != 1" @click="page--">Anterior</a>
        </li>
        <li class="page-item" v-for="pageNumber in pages.slice(page - 1, page + 5)" v-bind:key="pageNumber" :class="{ active: pageNumber === pages }">
          <a class="page-link" href="#" @click="page = pageNumber">{{ pageNumber }}</a>
        </li>
        <li>
          <a class="page-link" href="#" @click="page++" v-if="page < pages.length">Próximo</a>
        </li>
      </ul>
    </nav>
  </div>
</template>
<script>
export default {
  name: "table-sivis2",
  props: {
    columns: Array,
    data: Array,
    page: Number,
    perPage: Number
  },
  data() {
    return {
      pages: []
    };
  },
  created: function() {
    this.setPages();
  },
  methods: {
    hasValue(item, column) {
      return item[column.toLowerCase()] !== "undefined";
    },
    itemValue(item, column) {
      return item[column.toLowerCase()];
    },
    setPages() {
      let index;
      var total = [];
      let numberOfPages = Math.ceil(this.data.length / this.perPage);

      for (index = 1; index <= numberOfPages; index++) {
        total.push(index);
      }
      this.pages = total;
      console.log("page setPages" + this.pages);
    },
    paginate(pagi) {
      let page = this.page;
      let perPage = this.perPage;
      let from = page * perPage - perPage;
      let to = page * perPage;
      return pagi.slice(from, to);
    }
  },
  computed: {
    displayedPosts() {
      console.log("page display:" + this.pages);

      return this.paginate(this.data);
    }
  },
  watch: {
    data() {
      this.setPages();
    }
  },

  filters: {
    trimWords(value) {
      return (
        value
          .split(" ")
          .splice(0, 20)
          .join(" ") + "..."
      );
    }
  }
};
</script>
<style>

button.page-link {
  display: inline-block;
}
button.page-link {
  font-size: 20px;
  color: #29b3ed;
  font-weight: 500;
}
.offset {
  width: 100% !important;
  margin: 20px auto;
}
</style>
