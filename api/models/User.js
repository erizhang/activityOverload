/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	name : {
  		type: "string",
  		required: true
  	},
  	title: {
  		type: "string"
  	},
  	email: {
  		type: "string",
  		email: true,
  		required: true,
  		unique: true
  	},

    amin: {
      type: 'boolean',
      defaultsTo: false
    },

  	encryptedPassword: {
  		type: "string"
  	},

    toJSON: function(){
      var obj = this.toObject();
      delete obj.password;
      delete obj.confirmation;
      delete obj.encryptedPassword;
      delete obj.__csrf;
      return obj;
    }
  },

  beforeCreate: function(values, next){
    if (!values.password || values.password != values.confirmation){
      return next({err:["Password dones't match password confirmation."]});
    }

    require('bcrypt').hash(values.password, 10, function passwordEncrypted(err, encryptedPassword){
      if (err) return next(err);
      values.encryptedPassword = encryptedPassword;
      next();
    });
  }
};

