const router = require('express').Router()
const clubmodel = require('../models/Club.model.js')
const usermodel = require('../models/Users.js')
const achievementModel = require('../models/Achievement.model')

router.route('/').post((req,res)=>{
  const user_id = req.body.user_id;
  const pswd = req.body.pswd;
  const user={user_id,pswd}
  usermodel.find(user)
  .then(user=>{
      if(user.length===1){
        if(user[0].club_head===true)
          // site to redirect to on login success : ! Change to valid Get route -> view with admin features 
          res.redirect(`/admin/controls?id=${user[0]._id}`);
        else
          // user doesnt have admin privileges (Show UI popup) , may redirect to user login 
          // res.status(200).send('Sorry you donot have admin privileges !')
          res.render('adminLogin',{'alerts':"Sorry you donot have admin privileges !"});
      }
      else{
        //user doesn't exist :! change to admin login page retry
          res.redirect('/admin/');
      }
  }).catch((err)=>{
      res.json('Error: '+err);
  })
});

router.route('/create_club').post((req, res) => {
  var club = new clubmodel({
    name: req.body.club_name,
    head: req.body.head_name,
    description: req.body.club_description,
    logo: req.body.logo
  })

  club.save((err) => {
    console.error.bind(console, 'saving is not done yet')
  })

  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end(club)
})

router.route('/create_club').delete((req, res) => {
  const club = req.body.club_name

  clubmodel.deleteMany({ name: club }, (err) => {
    console.error.bind(console, 'not deleted')
  })
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end(club)
})

router.route('/club_head/create').post((req, res) => {
  const club_name = req.body.club_name
  var user = new usermodel({
    user_id: club_name,
    pswd: club_name,
    name: req.body.name,
    contact: req.body.contact,
    email_id: req.body.email_id,
    dp_url: req.body.dq_url,
    club_head: true,
    club_name: club_name,
    bio: req.body.bio
  })
  console.log(user.user_id)
  user.save((err) => {
    console.error.bind(console, 'saving not done yet')
  })
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end(user)
})

router.route('/club_head/update').post((req, res) => {
  var club_name = req.body.club_name
  var change = {
    user_id: club_name, 
    pswd: club_name,
    name: '',
    contact: '',
    email_id: '',
    dp_url: '',
    club_head: true,
    club_name: club_name,
    bio: ''
  }

  usermodel.findOneAndUpdate({ club_name: club_name }, change)
    .catch(err => {
      console.log(err)
    })

  res.status(200).send('Succesful')
})

router.route('/achievement/create').post((req,res)=>{
  var achievement = {
    title:req.body.title,
    caption:req.body.caption,
    description:req.body.description,
    pics_url:req.body.pics_url
  }

  achievement.save(err=>{
    console.log(err);
  })
  res.status(200).send('Achievement Created!')
})

router.route('/achievement/view/:id').get((req,res)=>{
  const id = req.params.id
  achievementModel.findById(id)
  .then(achievement=>{
    res.status(200).json(achievement)
  }).catch(err=>{
    res.status(400).send('Does not exist')
  })
})

router.route('/achievement/update/:id').post((req,res)=>{
  const id = req.params.id
  var achievement = {
    title:req.body.title,
    caption:req.body.caption,
    description:req.body.description,
    pics_url:req.body.pics_url
  }
  achievementModel.findByIdAndUpdate(id,achievement)
  .then(()=>{
    res.status(200).send('updated')
  }).catch(err=>{
    res.status(400).send(err)
  })
})

module.exports = router
