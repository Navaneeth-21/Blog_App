const express = require('express');
const router = express.Router();
const Schema = require('../models/article');


router.get('/new_article', (req, res) => {

  res.render('./articles/new_article', { article: new Schema() });

});


router.get('/edit/:id', async (req, res) => {

  const article = await Schema.findById(req.params.id);

  res.render('./articles/edit_article', { article: article });

});


// we will get an array of slugs so findone()
router.get('/:slug', async (req, res) => {

  let article = await Schema.findOne({ slug: req.params.slug });

  if (!article) return res.status(404).json({ msg: 'No Article found' })

  res.render('./articles/show_article', { article: article })
});


router.put('/:id', async (req, res) => {
  try {
    let article = await Schema.findByIdAndUpdate(req.params.id);
    if (article) {
        article.title = req.body.title,
        article.description = req.body.description,
        article.markdown = req.body.markdown,

      await article.save();

      res.redirect(`/articles/${article.slug}`);
    }
    else {
      res.status(404).json({ error: `Article Not Found` });
    }

  } catch (error) {

    res.status(500).json({ err: 'Server Error' });

    console.log(error);
  }
});


router.post('/', async (req, res) => {
  try {
    let article = new Schema({
      title: req.body.title,
      description: req.body.description,
      markdown: req.body.markdown,
    });

    await article.save();

    res.redirect(`/articles/${article.slug}`);

  } catch (error) {

    res.status(500).json({ error: `Internal Server Error` })

    console.log(error);
  }
});


// DELETE /articles/:id - delete a specific resource by the id in the request
router.delete('/:id', async (req, res) => {
  try {
    let article = await Schema.findByIdAndDelete(req.params.id);

    if (!article) {
      return res.status(404).json({ msg: "No such article" });
    }
    res.redirect('/');

  } catch (error) {

    console.error(error);

    res.status(500).json({ error: `Server Error!` });
  }
});


module.exports = router;