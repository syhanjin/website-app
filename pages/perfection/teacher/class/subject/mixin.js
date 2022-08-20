module.exports = {
  computed: {
    baseURL(){
      return '/perfection/class/' + this._option.class_id + '/subject/' + this._option.subject
    }
  }
}