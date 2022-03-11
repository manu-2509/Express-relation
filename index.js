const express = require('express');
const mongoose = require('mongoose');
const app= express();

app.use(express.json());

const connect=()=>{
    return mongoose.connect("mongodb://127.0.0.1:27017/library")
}

const sectionSchema = mongoose.Schema({
    section_name:{type:String, required:true}
},
{
    timestamps:true,
})

const Section = mongoose.model("section",sectionSchema)


const authorSchema = mongoose.Schema({
    first_name:{type:String, required:true},
    last_name:{type:String, required:true},
    sectionId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"section",
        required:true
    }
},
{
    timestamps:true,
})

const Author = mongoose.model("author",authorSchema)

const bookSchema = mongoose.Schema({
    book_name:{type:String, required:true},
    body:{type:String, required:true},
    AuthorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"author",
        required:true
    },
    sectionId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"section",
        required:true,
    }
},
{
    timestamps:true,
})

const Book = mongoose.model("book",bookSchema)


app.get("/section",async (req, res) => {
    try {
        const section = await Section.find().lean().exec();
        return res.status(200).send({section:section})
    } catch (err) {
        return res.status(500).send({err:err.message});
    }
})

app.post("/section",async (req, res) => {
    try {
        const section = await Section.create(req.body);
        return res.status(200).send({section:section});
    } catch (err) {
        return res.status(500).send({err:err.message});
    }
})

app.patch("/section/:id",async (req, res) => {
    try {
        const section =await Section.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
        }).lean()
        .exec();
        return res.status(200).send({section})
    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
})

app.get("/section/:sectionId/books",async (req, res)=>{
try {
    const book = await Book.find({sectionId:req.params.sectionId});
    return res.status(200).send({book:book});
} catch (err) {
    return res.status(500).send({err:err.message});
}
})
 
app.delete("/section/:id",async (req, res) => {
    try {
        const section =await Section.findByIdAndDelete(req.params.id).lean()
        .exec();
        return res.status(200).send({section})
    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
})
app.get("/author",async (req, res) => {
    try {
        const author = await Author.find().lean().exec();
        return res.status(200).send({author:author})
    } catch (err) {
        return res.status(500).send({err:err.message});
    }
})

app.post("/author",async (req, res) => {
    try {
        const author = await Author.create(req.body);
        return res.status(200).send({author:author});
    } catch (err) {
        return res.status(500).send({err:err.message});
    }
})


app.get("/author/:AuthorId/book",async (req, res) => {
    try {
        const book = await Book.find({AuthorId:req.params.AuthorId}).lean().exec();
        return res.status(200).send({book})
    } catch (err) {
        return res.status(500).send({err:err.message});
    }
})
app.get("/book/authorsection",async(req,res)=>{
    try {
        const book=await Book.find({$and:[{sectionId:req.query.sectionId},{authorId:req.query.authorId}]})
        .populate({path:"AuthorId",select:["first_name","last_name"]})
        .populate({path:"sectionId",select:["section_name"]})
        .lean()
        .exec()
        return res.status(200).send({book});
    } catch (err) {
        return res.status(500).send({err:err.message});
    }
})


app.get("/book",async (req, res) => {
    try {
        const book = await Book.find().lean().exec();
        return res.status(200).send({book:book})
    } catch (err) {
        return res.status(500).send({err:err.message});
    }
})

app.post("/book",async (req, res) => {
    try {
        const book = await Book.create(req.body);
        return res.status(200).send({book:book});
    } catch (err) {
        return res.status(500).send({err:err.message});
    }
})

app.listen(2000,async()=>{
try {
   await connect();
    
} catch (err) {
    console.log('err: ', err);
    
}
console.log("Listening to port 2000")
})