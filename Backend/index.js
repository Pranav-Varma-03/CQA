const pool = require('./config/conn')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const port = 3001
const dotenv = require('dotenv');
const multer = require('multer')
const moment = require("moment")
const { query } = require('express')

dotenv.config();

app.use(cors())
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.put('/increasevotes/:postid',async(req,res)=>{
  await pool.connect().then(async (client) => {
    try {
       await client.query("SELECT update_upvotes_downvotes_post($1,1,0)", [req.params.postid])
      client.release()
      res.sendStatus(200)
    } catch (err_1) {
      client.release()
      console.log(err_1.stack)
    }
  })
})

app.put('/decreasevotes/:postid',async(req,res)=>{
  await pool.connect().then(async (client) => {
    try {
       await client.query("SELECT update_upvotes_downvotes_post($1,0,1)", [req.params.postid])
      client.release()
      res.sendStatus(200)
    } catch (err_1) {
      client.release()
      console.log(err_1.stack)
    }
  })
})

app.put('/increasecommentvotes/:commid',async(req,res)=>{
  await pool.connect().then(async (client) => {
    try {
       await client.query("SELECT update_upvotes_downvotes_comment($1,1,0)", [req.params.commid])
      client.release()
      res.sendStatus(200)
    } catch (err_1) {
      client.release()
      console.log(err_1.stack)
    }
  })
})

app.put('/decreasecommentvotes/:commid',async(req,res)=>{
  await pool.connect().then(async (client) => {
    try {
       await client.query("SELECT update_upvotes_downvotes_comment($1,0,1)", [req.params.commid])
      client.release()
      res.sendStatus(200)
    } catch (err_1) {
      client.release()
      console.log(err_1.stack)
    }
  })
})

app.post('/tagged_posts', async (req, res) => {
  let page = req.body.page
  let tags = req.body.tags
  let number = req.body.number
  let type = req.body.type
  await pool.connect().then(async (client) => {
    switch (type) {
      case 0:
        try {
          const result = await client
            .query("select post_id_out as post_id,user_id_out as user_id,title_out as title,body_out as body,image_out as image,time_created_out_time as time_created,edit_status_out as edit_status,upvotes_out as upvotes,downvotes_out as downvotes,tags_out as tags,availability_of_post_to_ans_out as availability_of_post_to_ans FROM search_posts_by_tags($1) limit $2 offset $3", [tags, parseInt(number), parseInt(page) * parseInt(number)])
          client.release()
          res.json(result.rows)
        } catch (err_1) {
          client.release()
          console.log(err_1.stack)
        }
        break;

      case 1:
        try {
          const result = await client
            .query("select post_id_out as post_id,user_id_out as user_id,title_out as title,body_out as body,image_out as image,time_created_out_time as time_created,edit_status_out as edit_status,upvotes_out as upvotes,downvotes_out as downvotes,tags_out as tags,availability_of_post_to_ans_out as availability_of_post_to_ans FROM search_posts_by_tags($1) ORDER BY upvotes LIMIT $2 OFFSET $3", [tags, parseInt(number), parseInt(page) * parseInt(number)])
          client.release()
          res.json(result.rows)
        } catch (err_1) {
          client.release()
          console.log(err_1.stack)
        }
        break;

      case 2:
        try {
          const result = await client
            .query("select post_id_out as post_id,user_id_out as user_id,title_out as title,body_out as body,image_out as image,time_created_out_time as time_created,edit_status_out as edit_status,upvotes_out as upvotes,downvotes_out as downvotes,tags_out as tags,availability_of_post_to_ans_out as availability_of_post_to_ans ,extract(epoch from current_timestamp - time_created_out_time::timestamp) as duration FROM  search_posts_by_tags($1) ORDER BY duration LIMIT $2 OFFSET $3", [tags, parseInt(number), parseInt(page) * parseInt(number)])
          client.release()
          res.json(result.rows)
        } catch (err_1) {
          client.release()
          console.log(err_1.stack)
        }
        break;
      default:
        break;
    }
  })
})

app.get('/users', async (req, res) => {
  let page = req.query.page;
  let number = req.query.number;
  let search = req.query.search;
  await pool.connect().then(async (client) => {
    try {
      const result = await client
        .query("SELECT CAST(user_id as VARCHAR(7)),username FROM users WHERE upper(replace(username,' ','')) LIKE upper(replace($1,' ','')) LIMIT $2 OFFSET $3", ['%' + search + '%', parseInt(number), parseInt(page) * parseInt(number)])
      client.release()
      res.json(result.rows)
    } catch (err_1) {
      client.release()
      console.log(err_1.stack)
    }
  })
});

app.get("/profile", async (req, res) => {
  await pool.connect().then(async (client) => {
    try {
      const result = await client
        .query('select * from users where user_id = $1', [parseInt(req.query.id)])
      client.release()
      if (result.rowCount == 0) {
        // res.sendStatus(404);
        res.send("404")
      }
      else {
        res.send(result.rows[0])
      }
      // res.json(result.rows)
    } catch (err_1) {
      client.release()
      console.log(err_1.stack)
    }
  })
})

app.get('/users/:id/:name', async (req, res) => {
  console.log(1567)
  await pool.connect().then(async (client) => {
    try {
      const result = await client
        .query('SELECT username FROM users WHERE user_id=$1', [parseInt(req.params.id)])
      client.release()
      if (result.rowCount == 0) {
        // res.sendStatus(404);
        res.send("404")
      }
      else {
        res.send(result.rows[0].username)
      }
      // res.json(result.rows)
    } catch (err_1) {
      //client.release()
      console.log(1)
      console.log(err_1.stack)
      console.log(2)
    }
  })
  //res.sendStatus(200);
})

app.post('/check-auth', async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  await pool.connect().then(async (client) => {
    try {
      const id_auth = await client
        .query('SELECT login($1,$2)', [username, password]);
      client.release()
      let id = id_auth.rows[0].login
      res.send(id.toString())
    } catch (err_1) {
      client.release()
      console.log(err_1.stack)
    }
  })
})

app.get("/posts", async (req, res) => {
  let page = req.query.page;
  let number = req.query.number;
  let search = req.query.search;
  let type = req.query.type;
  await pool.connect().then(async (client) => {
    switch (type) {
      case '0':
        try {
          const result = await client
            .query("SELECT post_id,title FROM posts WHERE upper(replace(title, ' ','')) LIKE upper(replace($1, ' ','')) LIMIT $2 OFFSET $3", ['%' + search + '%', parseInt(number), parseInt(page) * parseInt(number)])
          client.release()
          res.json(result.rows)
        } catch (err_1) {
          client.release()
          console.log(err_1.stack)
        }
        break;

      case '1':
        try {
          const result = await client
            .query("SELECT post_id,title FROM posts WHERE upper(replace(title, ' ','')) LIKE upper(replace($1, ' ','')) ORDER BY upvotes LIMIT $2 OFFSET $3", ['%' + search + '%', parseInt(number), parseInt(page) * parseInt(number)])
          client.release()
          res.json(result.rows)
        } catch (err_1) {
          client.release()
          console.log(err_1.stack)
        }
        break;

      case '2':
        try {
          const result = await client
            .query("SELECT post_id,title,extract(epoch from current_timestamp - time_created::timestamp) as duration FROM posts WHERE upper(replace(title, ' ','')) LIKE upper(replace($1, ' ','')) ORDER BY duration LIMIT $2 OFFSET $3", ['%' + search + '%', parseInt(number), parseInt(page) * parseInt(number)])
          client.release()
          res.json(result.rows)
        } catch (err_1) {
          client.release()
          console.log(err_1.stack)
        }
        break;
      default:
        break;
    }

  })
})

app.get('/posts/:postid/:postname', async (req, res) => {
  await pool.connect().then(async (client) => {
    try {
      const result = await client
        .query('SELECT *,find_user_name(user_id) as post_user,extract(epoch from current_timestamp - time_created::timestamp) as duration FROM posts WHERE post_id=$1', [req.params.postid])
      client.release()
      if (result.rowCount == 0) {
        // res.sendStatus(404);
        res.send("404")
      }
      else {
        res.send(result.rows[0])
      }
      // res.json(result.rows)
    } catch (err_1) {
      //client.release()
      console.log(1)
      console.log(err_1.stack)
      console.log(2)
    }
  })
  //res.sendStatus(200);
})

app.get('/user_posts', async (req, res) => {
  let page = req.query.page;
  let number = req.query.number;
  let id = req.query.id;
  let type = req.query.type;
  await pool.connect().then(async (client) => {
    switch (type) {
      case '0':
        try {
          const result = await client
            .query("select post_id_out as post_id,user_id_out as user_id,title_out as title,body_out as body,image_out as image,time_created_out_time as time_created,edit_status_out as edit_status,upvotes_out as upvotes,downvotes_out as downvotes,tags_out as tags,availability_of_post_to_ans_out as availability_of_post_to_ans,extract(epoch from current_timestamp - time_created_out_time::timestamp) as duration FROM search_posts_by_user_id(CAST($1 AS INT)) limit $2 offset $3", [parseInt(id), parseInt(number), parseInt(page) * parseInt(number)])
          client.release()
          if (result.rowCount === 0) {
            res.send("404")
          }
          else {
            res.json(result.rows)
          }
        } catch (err_1) {
          client.release()
          console.log(err_1.stack)
        }
        break;

      case '1':
        try {
          const result = await client
            .query("select post_id_out as post_id,user_id_out as user_id,title_out as title,body_out as body,image_out as image,time_created_out_time as time_created,edit_status_out as edit_status,upvotes_out as upvotes,downvotes_out as downvotes,tags_out as tags,availability_of_post_to_ans_out as availability_of_post_to_ans,extract(epoch from current_timestamp - time_created_out_time::timestamp) as duration FROM search_posts_by_user_id(CAST($1 AS INT)) ORDER BY upvotes LIMIT $2 OFFSET $3", [parseInt(id), parseInt(number), parseInt(page) * parseInt(number)])
          client.release()
          if (result.rowCount === 0) {
            res.send("404")
          }
          else {
            res.json(result.rows)
          }
        } catch (err_1) {
          client.release()
          console.log(err_1.stack)
        }
        break;

      case '2':
        try {
          const result = await client
            .query("select post_id_out as post_id,user_id_out as user_id,title_out as title,body_out as body,image_out as image,time_created_out_time as time_created,edit_status_out as edit_status,upvotes_out as upvotes,downvotes_out as downvotes,tags_out as tags,availability_of_post_to_ans_out as availability_of_post_to_ans ,extract(epoch from current_timestamp - time_created_out_time::timestamp) as duration FROM  search_posts_by_user_id(CAST($1 AS INT)) ORDER BY duration LIMIT $2 OFFSET $3", [parseInt(id), parseInt(number), parseInt(page) * parseInt(number)])
          client.release()
          if (result.rowCount === 0) {
            res.send("404")
          }
          else {
            res.json(result.rows)
          }
        } catch (err_1) {
          client.release()
          console.log(err_1.stack)
        }
        break;
      case '3':
        try {
          const result = await client
            .query("select post_id_out as post_id,user_id_out as user_id,title_out as title,body_out as body,image_out as image,time_created_out_time as time_created,edit_status_out as edit_status,upvotes_out as upvotes,downvotes_out as downvotes,tags_out as tags,availability_of_post_to_ans_out as availability_of_post_to_ans,extract(epoch from current_timestamp - time_created_out_time::timestamp) as duration FROM search_posts_by_user_id(CAST($1 AS INT)) ORDER BY upvotes DESC LIMIT $2 OFFSET $3", [parseInt(id), parseInt(number), parseInt(page) * parseInt(number)])
          client.release()
          if (result.rowCount === 0) {
            res.send("404")
          }
          else {
            res.json(result.rows)
          }
        } catch (err_1) {
          client.release()
          console.log(err_1.stack)
        }
        break;

      case '4':
        try {
          const result = await client
            .query("select post_id_out as post_id,user_id_out as user_id,title_out as title,body_out as body,image_out as image,time_created_out_time as time_created,edit_status_out as edit_status,upvotes_out as upvotes,downvotes_out as downvotes,tags_out as tags,availability_of_post_to_ans_out as availability_of_post_to_ans ,extract(epoch from current_timestamp - time_created_out_time::timestamp) as duration FROM  search_posts_by_user_id(CAST($1 AS INT)) ORDER BY duration DESC LIMIT $2 OFFSET $3", [parseInt(id), parseInt(number), parseInt(page) * parseInt(number)])
          client.release()
          if (result.rowCount === 0) {
            res.send("404")
          }
          else {
            res.json(result.rows)
          }
        } catch (err_1) {
          client.release()
          console.log(err_1.stack)
        }
        break;
      default:
        break;
    }
  })
})

app.get('/findid', async (req, res) => {
  let name = req.query.username;
  await pool.connect().then(async (client) => {
    try {
      const result = await client
        .query('select user_id from users where username = $1', [name])
      client.release()
      if (result.rowCount == 0) {
        // res.sendStatus(404);
        res.send("-1")
      }
      else {
        res.send(result.rows[0])
      }
      // res.json(result.rows)
    } catch (err_1) {
      client.release()
      console.log(err_1.stack)
    }
  })

})

app.get('/tags', async (req, res) => {
  let page = req.query.page;
  let number = req.query.number;
  let search = req.query.search;
  await pool.connect().then(async (client) => {
    try {
      const result = await client
        .query("SELECT tag_name FROM tags WHERE upper(replace(tag_name,' ','')) LIKE upper(replace($1,' ','')) LIMIT $2 OFFSET $3", ['%' + search + '%', parseInt(number), parseInt(page) * parseInt(number)])
      client.release()
      res.json(result.rows)
    } catch (err_1) {
      client.release()
      console.log(err_1.stack)
    }
  })
})

app.post('/create-post', async (req, res) => {
  await pool.connect().then(async (client) => {
    try {
      await client
        .query('INSERT INTO posts(user_id,title,body,tags) VALUES ($1,$2,$3,$4)', [parseInt(req.body.user_id), req.body.title, req.body.body, req.body.tags]);
      client.release()
      res.sendStatus(200)
    } catch (err_1) {
      client.release()
      console.log(300)
      console.log(err_1.stack)
      res.sendStatus(404)
    }
  })
})

app.put('/edit-post', async (req, res) => {
  await pool.connect().then(async (client) => {
    try {
      await client
        .query('UPDATE posts SET edit_status = 1,title = $2,body = $3,tags = $4 WHERE user_id  = $1 AND post_id = $5', [parseInt(req.body.user_id), req.body.title, req.body.body, req.body.tags, req.body.post_id]);
      client.release()
      res.sendStatus(200)
    } catch (err_1) {
      client.release()
      console.log(300)
      console.log(err_1.stack)
      res.sendStatus(404)
    }
  })
})

app.post('/anspost', async (req, res) => {
  await pool.connect().then(async (client) => {
    try {
      await client
        .query('INSERT INTO comments(post_id,user_id,body) values($1,$2,$3);', [req.body.post_id, parseInt(req.body.user_id), req.body.body]);
      client.release()
      res.sendStatus(200)
    } catch (err_1) {
      client.release()
      console.log(300)
      console.log(err_1.stack)
      res.sendStatus(404)
    }
  })
})

app.get('/:post_id/comments', async (req, res) => {
  await pool.connect().then(async (client) => {
    try {
      const result = await client
        .query('SELECT *,find_user_name(user_id) as usernameofcomm,extract(epoch from current_timestamp - time_created::timestamp) as duration FROM comments WHERE post_id=$1 LIMIT $2 OFFSET $3', [req.params.post_id, parseInt(req.query.number), parseInt(req.query.number) * parseInt(req.query.page)])
      client.release()
      //if(result.rowCount == 0)
      //{
      // res.sendStatus(404);
      // res.send("404")
      //}
      //else
      //{
      res.send(result.rows)
      // }
      // res.json(result.rows)
    } catch (err_1) {
      //client.release()
      console.log(1)
      console.log(err_1.stack)
      console.log(2)
    }
  })
})

app.post('/register', async (req, res) => {
  await pool.connect().then(async (client) => {
    try {
      const id_auth = await client
        .query('insert into users(username,gmail) values($1,$2)', [req.body.username, req.body.email]);
      client.release()
      res.sendStatus(200)
    } catch (err_1) {
      res.sendStatus(404)
      client.release()
      console.log(err_1.stack)
    }
  })
})

app.post('/delpost', async (req, res) => {
  await pool.connect().then(async (client) => {
    try {
      await client
        .query('select delete_post($1)', [req.body.post_id]);
      client.release()
      res.sendStatus(200)
    } catch (err_1) {
      res.sendStatus(404)
      client.release()
      console.log(err_1.stack)
    }
  })
})

app.post('/delcomm', async (req, res) => {
  await pool.connect().then(async (client) => {
    try {
      console.log(req.body.comm_id)
      const result = await client
        .query('select delete_comment($1)', [req.body.comm_id]);
      client.release()
      console.log(result)
      res.sendStatus(200)
    } catch (err_1) {
      console.log(err_1.stack)
      res.sendStatus(404)
      client.release()
    }
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

