const mongoose = require('mongoose');
const slugify = require('slugify');
const marked = require('marked');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const dompurify = createDOMPurify(new JSDOM().window);
// converts our markdown into HTML

const createSchema = new mongoose.Schema({
    title:{
        type : String,
        required : true
    },
    description:{
        type : String,
    },
    markdown:{
        type : String,
        required : true
    },
    createdAt:{
        type : Date,
        default :  Date.now()
    },
    slug : {
      type : String,
      required : true,
      unique : true  
    },
    sanitizedHtml:{
        type : String,
        required : true,
    }
});

// pre function to convert the title  into a slug before saving it in DB
createSchema.pre('validate',function(next){
    if(this.title){
        this.slug = slugify(this.title ,{lower:true , strict:true   })
    }

    if(this.markdown){
        this.sanitizedHtml = dompurify.sanitize(marked.parse(this.markdown)) 
     // add time stamp for each version of the document
    }
    next();
});

module.exports = mongoose.model('Articles' , createSchema);