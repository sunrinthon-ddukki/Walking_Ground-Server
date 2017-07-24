var express = require('express');
var router = express.Router();

var User = require('../models/user');

router.post('/', function(req, res) { //회원가입
     User.findOne({id: req.body.id}, function(err, userCheck){
          if(err){
               console.log(err);
               res.json({result: 0});
               res.end();
               return;
          }

          if(userCheck !== null){
               res.json({result: 0, error: 1, error_msg: "이미 사용중인 아이디입니다."});
               res.end();
               return;
          }
          var newUser = new User();

          newUser.username = req.body.username;
          newUser.id = req.body.id;
          newUser.password = req.body.password;

          newUser.summary.step = 0;
          newUser.summary.win = 0;
          newUser.summary.win_streak = 0;
          newUser.summary.max_step = 0;

          newUser.daily_mission.goal = 2000;
          newUser.daily_mission.step = 0;
          newUser.daily_mission.isClear = false;

          newUser.save(function(err){
               if(err){
                    console.log(err);
                    res.json({result: 0});
                    res.end();
                    return;
               }
               res.json({result: 1});
               res.end();
          });
     });
});

router.get('/', function(req, res) { //로그인
     User.findOne({id: req.query.id}, function(err, user){
          if(err){
               console.log(err);
               res.json({result: 0});
               res.end();
               return;
          }
          if(user !== null){
               if(user.password === req.query.password){
                    res.json({result: 1, user: user});
                    res.end();
                    return;
               }
               else {
                    res.json({result: 0, error: 1, error_msg: "비밀번호를 확인해주세요"});
                    res.end();
                    return;
               }
          }
          else{
               res.json({result: 0, error: 1, error_msg: "아이디를 확인해주세요"});
               res.end();
               return;
          }
     });
});

router.post('/:id/daily_mission', function(req, res){
     User.findOne({id: req.params.id}, function(err, user){
          if(err){
               res.json({result: 0});
               res.end();
               return;
          }

          var newSummary = {
               step: user.summary.step + user.daily_mission.goal,
               win: user.summary.win + 1,
               win_streak: user.summary.win_streak + 1,
               max_step: user.daily_mission.goal
          };

          if(newSummary.max_step <= user.summary.max_step){
               newSummary.max_step = user.summary.max_step;
          }

          var newDaily_mission = {
               goal: user.daily_mission.goal,
               isClear: 1
          };


          User.findOneAndUpdate({id: req.params.id},
               {$set: {summary: newSummary, daily_mission: newDaily_mission}},
               function(err){

               if(err){
                    res.json({result: 0});
                    res.end();
                    return;
               }
               User.find({'daily_mission.isClear': 1}, function(err, users){
                    if(err){
                         res.json({result: 0});
                         res.end();
                         return;
                    }
                    res.json({result: 1, users: users});
                    res.end();
               });
          });
     });
});

router.post('/test', function(req, res){
     GameRestart();
});

function GameRestart(){
     var newDaily_mission = {
          goal: 2000,
          isClear: false
     };
     User.update({}, {$set: {daily_mission: newDaily_mission}}, {"multi": true},function(err){
          if(err){
               console.error(err);
               res.json({result: 0});
               res.end();
               return;
          }
          res.json({result: 1});
          res.end();
     });
}

setInterval(GameRestart,60*1000);

module.exports = router;
