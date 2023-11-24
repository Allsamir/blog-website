const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
          title : {
                    type: String,
                    required : true
          },

          body : {
                    type: String,
                    require : true
          }
});



module.exports = postSchema;