var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

module.exports = {
  connect: function() {
    mongoose.connect('mongodb://localhost:27017/nodeauth')
  }
}