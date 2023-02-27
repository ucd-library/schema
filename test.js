const express = require('express');
const app = express();
const fs = require('fs');
const matter = require('gray-matter');

const port = 4400
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    const page = matter.read(__dirname + '/index.md');
    let result = page.content;
    res.render("pages/index", {
        page: result
    });
})

app.get('/about', (req, res) => {
    const page = matter.read(__dirname + '/about.md');
    let result = page.content;
    res.render("pages/about", {
        page: result
    });
})
app.get('/context', (req, res) => {
       const posts = fs.readdirSync(__dirname + '/_contexts').filter(file => file.endsWith('.md'));
       res.render("pages/contexts", {
         posts: posts
       });
})


app.get("/catalog", (req, res) => {
    const posts = fs.readdirSync(__dirname + '/_schemas').filter(file => file.endsWith('.md'));
    res.render("pages/catalog", {
      posts: posts
    });
});

app.get("/:article", (req, res) => {

    // read the markdown file
    const file = matter.read(__dirname + '/_schemas/' + req.params.article + '.md');
    var result = file.content;
  
    res.render("pages/article", {
      post: result,
      title: file.data.title,
      description: file.data.description,
    });
});

app.listen(port, () => {
  console.log(`App listening at port ${port}`)
})