let video;
let poseNet;
let button;
let poses = [];
let skeletons = [];


var feedback = [];
var counts = {"perfect":0,"bend_both":0};
var c_status = 0;


let lang ;
let speechRec;

var target_squats = sessionStorage.getItem("target_squats");



function setup() {
  var cnv = createCanvas(650,700);
  video = createCapture(VIDEO);
  voice = new p5.Speech();

  video.size(width, height);


  poseNet = ml5.poseNet(video,modelReady);
  poseNet.on('pose', gotPoses);
  video.hide();

  //lang = navigator.language || 'en-US';
  //speechRec = new p5.SppechRec(lang,stopping_planks())
  cnv.position(20 , 50);
}

var initial_timestamp;
var initial_day;
var final_timestamp;
var time_taken;


function stopping_planks()
{
  //if("stop workout" in speechRec.resultString)
  //{
    var d1 = new Date();
    final_timestamp = d1.getTime();
    time_taken = (final_timestamp - initial_timestamp)/1000;
    //window.location.replace(url);

  //}
}


function modelReady() {
  select('#status').html('Model Loaded');
}


function draw() {
  image(video, 0, 0, width, height);
  drawKeypoints();
  drawSkeleton();
}


var buff = false;


function drawKeypoints()  {




  for (let i = 0; i < poses.length; i++) {
    for (let j = 0; j < poses[i].pose.keypoints.length; j++) {
      let keypoint = poses[i].pose.keypoints[j];
      if (keypoint.score > 0.2) {
        analyse(poses);
        //get_catch(); 
        fill(255, 0, 255);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);


      }
    }
  }

}





function drawSkeleton(buff) {


  for (let i = 0; i < poses.length; i++) {
    for (let j = 0; j < poses[i].skeleton.length; j++) {
      let partA = poses[i].skeleton[j][0];
      let partB = poses[i].skeleton[j][1];
      stroke(0, 0, 255);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}


/*

function all_wrong(){

  buff= true;
  for (let i = 0; i < poses.length; i++) {
    for (let j = 0; j < poses[i].skeleton.length; j++) {
      let partA = poses[i].skeleton[j][0];
      let partB = poses[i].skeleton[j][1];
      stroke(255, 0, 0);
      strokeWeight(4);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }

}


function all_right(){
    buff=true;
    for (let i = 0; i < poses.length; i++) {
    for (let j = 0; j < poses[i].skeleton.length; j++) {
      let partA = poses[i].skeleton[j][0];
      let partB = poses[i].skeleton[j][1];
      //stroke(0, 255, 0);
      strokeWeight(4);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}

*/


function gotPoses(results) {
  poses = results;
}




var workout_log = [];

function analyse(poses)
{
      //console.log(poses);
      var p1 = poses[0].pose.keypoints;


      var l_sh =p1[5];
      var r_sh = p1[6];
      var l_hip = p1[11];
      var r_hip = p1[12];
      var nose = p1[0];
      var l_hip = p1[11];
      var r_hip = p1[12];

      var l_knee = p1[13];
      var r_knee = p1[14];

      var l_ankle = p1[15];
      var r_ankle = p1[16];


      var r = document.getElementById("feedback_1");
  


      if(l_hip.score >= 0.5 || r_hip.score >= 0.5 )

      {

        var hip = Math.abs(l_hip.position.x - r_hip.position.x);
        var ankle = Math.abs(l_ankle.position.x - r_ankle.position.x);

        var ratio = ankle/hip;

        // get the perpective right 
        //check ankle hip distance 
        //do squat


        var l_ka_y = l_knee.position.y - l_ankle.position.y;
        var l_ka_x = l_knee.position.x - l_ankle.position.x;

        var l_hk_x = l_knee.position.x - l_hip.position.x;
        var l_hk_y = l_knee.position.y - l_hip.position.y;


        var r_ka = r_knee.position.y - r_ankle.position.y;
        var r_hk = r_knee.position.x - r_hip.position.x;
       

        var l_dAx = Math.abs(l_knee.position.x - l_ankle.position.x);
        var l_dAy = Math.abs(l_knee.position.y - l_ankle.position.y);
        var l_dBx = Math.abs(l_knee.position.x - l_hip.position.x);
        var l_dBy = Math.abs(l_knee.position.y - l_hip.position.y);
        var l_angle = Math.atan2(l_dAx * l_dBy - l_dAy * l_dBx, l_dAx * l_dBx + l_dAy * l_dBy);
        if(l_angle < 0) {l_angle = l_angle * -1;}
        var left_degree_angle = l_angle * (180 / Math.PI);

        

        var r_dAx = Math.abs(r_knee.position.x - r_ankle.position.x);
        var r_dAy = Math.abs(r_knee.position.y - r_ankle.position.y);
        var r_dBx = Math.abs(r_knee.position.x - r_hip.position.x);
        var r_dBy = Math.abs(r_knee.position.y - r_hip.position.y);
        var r_angle = Math.atan2(r_dAx * r_dBy - r_dAy * r_dBx, r_dAx * r_dBx + r_dAy * r_dBy);
        if(r_angle < 0) {r_angle = r_angle * -1;}
        var right_degree_angle = r_angle * (180 / Math.PI);

      //console.log("LEFT DEGREE",left_degree_angle,"  RIGHT DEGREE",right_degree_angle);
      /*
      if(ratio>1.5 && ratio<2)
      {
        t="wider_legs";
        counts[t]+=1;
        document.body.style.backgroundColor="hsl(16, 100%, 66%)";
      }
      */


      if(left_degree_angle > 20 && left_degree_angle < 70 && right_degree_angle>20 && right_degree_angle<70)
      {
        t="perfect";
        counts[t]+=1;
        workout_log.push(t);

        document.body.style.backgroundColor="hsl(180, 50%, 50%)";
        
      }
  
      if(left_degree_angle < 13 && left_degree_angle > 7 && right_degree_angle<13 && right_degree_angle>7)
      {
        t="bend_both";
        counts[t]+=1;
        
        document.body.style.backgroundColor="hsl(16, 100%, 66%)";
        
      }
    
      
      /*if(left_degree_angle<7 || right_degree_angle<7 && poses[0].skeleton.length>=5)
      {
        t="standing";
        counts[t]+=1;
        document.body.style.backgroundColor="hsl(240, 100%, 90%)";
        workout_log.push(t);
        

        
      }
      */
        
      
      }


     setTimeout(count_feedback(counts,ratio,p1), 10000);
     //setTimeout(squat_counter(workout_log));
     //workout_log=[];
    // save_to_json(counts.perfect , counts.standing);

    }



    function count_feedback(counts , ratio , p1)
    {
      



      var a = document.getElementById("feedback");
      var r = document.getElementById("feedback_1");



      

      var scores={"perfect":0,"bend_both":0};





      var l = [];
      l.push(counts.perfect);
      //l.push(counts.wider_legs);
      l.push(counts.bend_both);
      //l.push(counts.standing);

      //console.log(l);


      const sum = l.reduce(add);


      function add(accumulator, a) {
      return accumulator + a;
      }

    
      //console.log(Math.max(counts));
      var a1 = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
      var standing = Math.floor(counts.standing/sum*100);
      var perfect = Math.floor(counts.perfect/sum*100);
     // var wider_legs = Math.floor(counts.wider_legs/sum*100);
      var bend_both = Math.floor(counts.bend_both/sum*100);

      var feedback;

      if(ratio >=1)
      {
        feedback = "You may now begin";
        a.style.color = "green";

        

        //r.innerHTML = "YOU MAY SQUAT";

        if( perfect > bend_both)
        {
          r.innerHTML = "PERFECT !";
          //document.body.style.backgroundColor="hsl(180, 50%, 50%)";
          //all_right();

          counts.perfect -= 1;
          //counts.wider_legs += 1;
          //counts.bend_both+=1;


        }

        if(bend_both>perfect)
        {
          r.innerHTML = "You need to squat";
          //"YOU NEED TO BEND BOTH YOUR LEGS A LITTLE MORE";
          counts.bend_both -=1;
          
          //counts.perfect+=2;
          
          /*buff = true;
          stroke(0,0,255);
          //hip to knee
          line(p1[11].position.x,p1[11].position.y ,p1[13].position.x , p1[13].position.y);
          line(p1[12].position.x,p1[12].position.y ,p1[14].position.x , p1[14].position.y);
          //knee to ankle
          line(p1[13].position.x,p1[13].position.y ,p1[15].position.x , p1[15].position.y);
          line(p1[14].position.x,p1[14].position.y ,p1[16].position.x , p1[16].position.y);
          */


        }
        
        r.style.display = "inline-block";
        r.style.color = "BLACK";
      }
      else
      {
        feedback = "Please place your legs wider than your hips";
        document.body.style.backgroundColor="rgb(0, 0, 0)";
        a.style.color = "black";
        //r.style.display = "none";

        //all_wrong();
      }


      a.style.display="inline-block";
      a.innerHTML =feedback;
      
      var f = document.getElementById("feedback_2");
      f.innerHTML="squats done:"+squat_count;
      f.style.display="inline-block";

      var f1 = document.getElementById("feedback_3");

      f1.innerHTML="squat target:"+target_squats;
      
      check_for_feedback_change(r.innerHTML);
      check_for_squat_change(r.innerHTML);




    }

var temp_feed="";
var temp_feed_1="";
var squat_count = 0;


function check_for_feedback_change(feedback)
{

  if(temp_feed!=feedback)
  {
    temp_feed=feedback;


    setTimeout(call_out_feedback(temp_feed), 10000);

  }
  
}



function submit()
{
    var d = new Date();
    final_timestamp = d.getTime();
    console.log(initial_timestamp);
    console.log(final_timestamp);
    time_taken = (final_timestamp - initial_timestamp)/1000;
    //squat_count
    sessionStorage.setItem("initial_timestamp",initial_timestamp);
    sessionStorage.setItem("time_taken",time_taken);
    var email = sessionStorage.getItem("mail_id");

          const mutation = `
       mutation xyz {
        insert_workoutdata(objects: {time_taken: "`+time_taken+`", email_user: "`+email+`", time_started: "`+initial_timestamp+`", reps: `+squat_count+`}) {
          returning {
            email_user
          }
        }
      
  }`;
   const url = "https://mysterious-refuge-54393.herokuapp.com/v1/graphql";
   const opts = {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({ query : mutation })
   };
   fetch(url, opts)
     .then(res => res.json())
     .then(result =>
      { console.log(result);
       window.location = "../homepage.html";
      })
     .catch(console.error);   

     
    //window.location.replace("homepage.html");
}


function check_for_squat_change(feedback)
{
  if(feedback=="PERFECT !" && temp_feed1!=feedback)
  {
    squat_count+=1;
  }
  temp_feed1=feedback;

  if(squat_count==1)
  {
    var d = new Date();
    initial_timestamp = d.getTime();
  }
  if(squat_count==target_squats)
  {
    var f = document.getElementById('feedback_1');
    f.innerHTML = "Amazing , target achieved !";
    var result = document.getElementById('result');
    result.style.display="inline-block"; 
  }


}



function call_out_feedback(feedback)
{
  var r = document.getElementById("feedback_1");
  var b = feedback;
  voice.setVoice("Moira");
  voice.setRate(0.8);
  voice.speak(b);
  //setTimeout(call_out_feedback(b), 100000);

}


var c_perfect=0;
var c_standing=0;



function save_to_json(perfect,standing)
{
  c_perfect = perfect;
  c_standng = standing;

}


function reset_scores()
{
  counts.perfect=0;
  counts.bend_both=0;
  counts.standing=0;
}

  

function render_graph()
  {




    var time = new Date();


    var trace1 = {
    name:'good',
    x: [],
    y: [],
    model: 'lines',
    line: {
    color: '#80CAF6',
    shape: 'spline'


    }
  }


  var trace2 = {
  name:'slouching',
  x: [],
  y: [],
  xaxis: 'x2',
  yaxis: 'y2',
  mode: 'lines',
  line: {color: '#DF56F1'}


  };


var layout = {
    title: {
    text:'Monitor your Health over time',
    font: {
      family: 'Verdana',
      size: 24
    }},
    xaxis: {
   
    type: 'date',
    domain: [0, 1],
    showticklabels: false
  },
  yaxis: {
    title: {
      text:'Performance',
      font: {
        family: 'Verdana',
        size: 12,
        color: '#7f7f7f'
      }},
    domain: [0.6,1]
  },
  xaxis2: {
    type: 'date',
        title: {
      text: 'Time',
      font: {
        family: 'Verdana',
        size: 12,
        color: '#7f7f7f'
      }}
    ,
    domain: [0, 1]
  },
  yaxis2: {
        title: {
      text: 'Performance',
      font: {
        family: 'Verdana',
        size: 12,
        color: '#7f7f7f'
      }},
    domain: [0, 0.4]},
};




var data = [trace1,trace2];


Plotly.plot('graph', data, layout);


var cnt = 0;


var interval = setInterval(function() {


  var time = new Date();


  var update = {
    x: [[time], [time]],
    y: [[c_perfect], [c_standing]]
  }


  Plotly.extendTraces('graph', update, [0,1])


  if(cnt === 10) clearInterval(interval);
}, 1000);


}