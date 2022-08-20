module.exports = {
  onLoad: function(option) {
    if (option.data) {
      let {
        data,
        ..._option
      } = option
      this._option = {
        ..._option,
        ...JSON.parse(data)
      }
    } else {
      this._option = option
    }
  }
}
