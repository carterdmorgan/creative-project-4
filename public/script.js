var app = new Vue({
  el: '#app',
  data: {
    editFood: {},
    title: "",
    barcode: "",
    amount: null,
    foods: [],
  },
  created() {
    this.getFoods();
  },
  methods: {
    async getFoods() {
      try {
        let response = await axios.get("/api/foods");
        this.foods = response.data;
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async addFood() {
      console.log('trying here')
      try {
        let r2 = await axios.post('/api/foods', {
          title: this.title,
          barcode: this.barcode,
          amount: this.amount
        });
        this.title = "";
        this.barcode = "";
        this.amount = null;
        this.getFoods();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    selectEditFood(food) {
      this.editFood = food;
    },
    cancelEdit() {
      this.editFood = {};
    },
    async uploadEdit() {
      try {
        let response = await axios.put("api/foods/" + this.editFood._id, this.editFood )
        this.editFood = {};
        this.getFoods();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async deleteFood(food) {
      try {
        let response = await axios.delete("api/foods/" + food._id);
        this.getFoods();
        return true;
      } catch (error) {
        console.log(error);
      }
    }
  }
});