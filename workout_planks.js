let video;
let poseNet;
let button;
let poses = [];
let skeletons = [];
let voice;

var feedback = [];
var counts = {"perfect":0,"hip_up":0,"hip_down":0};
var c_status = 0;









function setup() {
  var cnv = createCanvas(650,700);
  video = createCapture(VIDEO);
  voice = new p5.Speech();
  //voice.onLoad = voiceReady;
  video.size(width, height);
  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on('pose', gotPoses);
  video.hide();
  cnv.position(20,50);
}






function modelReady() {
  select('#status').html('Model Loaded');
}


function draw() {
  image(video, 0, 0, width, height);
  drawKeypoints();
  drawSkeleton();
}


function drawKeypoints()  {


  for (let i = 0; i < poses.length; i++) {
    for (let j = 0; j < poses[i].pose.keypoints.length; j++) {
      let keypoint = poses[i].pose.keypoints[j];
      if (keypoint.score > 0.2) {
        analyse(poses);
        fill(255, 0, 0);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);






      }
    }
  }
}








function drawSkeleton() {
  for (let i = 0; i < poses.length; i++) {
    for (let j = 0; j < poses[i].skeleton.length; j++) {
      let partA = poses[i].skeleton[j][0];
      let partB = poses[i].skeleton[j][1];
      stroke(255, 0, 0);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}


function gotPoses(results) {
  poses = results;
}


function calculate_line_distance(x1 , x2 , y1 , y2)
{
  var a = Math.abs(x1-x2);
  var b = Math.abs(y1 - y2);

  var c = a*a;
  var d = b*b;

  var e = Math.sqrt(c+d);

  return e;
}

function analyse(poses)
{






      var p1 = poses[0].pose.keypoints;

      //console.log(poses[0]);

      var l_sh =p1[5];
      var r_sh = p1[6];
      var l_hip = p1[11];
      var r_hip = p1[12];

      var l_elbow = p1[7];
      var r_elbow = p1[8];

      var l_wrist = p1[9];
      var r_wrist = p1[10];


      var nose = p1[0];
      var l_hip = p1[11];
      var r_hip = p1[12];

      var l_knee = p1[13];
      var r_knee = p1[14];

      var l_ankle = p1[15];
      var r_ankle = p1[16];

      //console.log("hip",l_hip);
      //console.log("ankle",l_ankle);
      console.log("l_: ",l_sh, l_hip);
      console.log("r_: ",r_sh, r_hip);
     
     var hipl = l_hip.position.y;
     var hipr = r_hip.position.y;
     var shl = l_sh.position.y;
     var shr = r_sh.position.y;


     

      var r = document.getElementById("feedback_1");
  


      //if(l_hip.score>0.01 || l_ankle>0.01 && poses[0].skeleton.length>5 )
      if(poses[0].skeleton.length>=2)
      {

        
        var hip = l_hip.position.y;
        var ankle = l_ankle.position.y;
        var ratio = hip/ankle;

        
        



        //================================ shoulder_hip hip_ankle angles ==========================================
        var l_dAx = Math.abs(l_sh.position.x - l_hip.position.x);
        var l_dAy = Math.abs(l_sh.position.y - l_hip.position.y);
        var l_dBx = Math.abs(l_ankle.position.x - l_hip.position.x);
        var l_dBy = Math.abs(l_ankle.position.y - l_hip.position.y);
        var l_angle = Math.atan2(l_dAx * l_dBy - l_dAy * l_dBx, l_dAx * l_dBx + l_dAy * l_dBy);
        if(l_angle < 0) {l_angle = l_angle * -1;}
        var left_degree_angle_sh_ah = l_angle * (180 / Math.PI);

        

        var r_dAx = Math.abs(r_sh.position.x - r_hip.position.x);
        var r_dAy = Math.abs(r_sh.position.y - r_hip.position.y);
        var r_dBx = Math.abs(r_knee.position.x - r_hip.position.x);
        var r_dBy = Math.abs(r_knee.position.y - r_hip.position.y);
        var r_angle = Math.atan2(r_dAx * r_dBy - r_dAy * r_dBx, r_dAx * r_dBx + r_dAy * r_dBy);
        if(r_angle < 0) {r_angle = r_angle * -1;}
        var right_degree_angle_sh_ah = r_angle * (180 / Math.PI);
       


        

        console.log("LEFT DEGREE",left_degree_angle_sh_ah,"  RIGHT DEGREE",right_degree_angle_sh_ah);

        //==========================================================================================================


      /*if(left_degree_angle_sh_ah >= 20 && left_degree_angle_sh_ah <=30 || right_degree_angle_sh_ah >=20 && right_degree_angle_sh_ah<=30)
      {
         t="perfect";
            counts[t]+=1;
            document.body.style.backgroundColor="hsl(180, 50%, 50%)";
        
      }
      */

     if(hipl>shl || hipr>shr)
     {
      t="hip down";
      counts[t]+=1;
     }

     else if(hipl<shl || hipr<shr)
     {
      t="hip up";
      counts[t]+=1;
     }
     /*

      if(left_degree_angle_sh_ah >=30 && right_degree_angle_sh_ah>=30)
      {
         t="hip_down";
            counts[t]+=1;
            document.body.style.backgroundColor="rgb(0,0,0)";
        
      }

      if( left_degree_angle_sh_ah<=11 && right_degree_angle_sh_ah<=11)
      {
        t="knee_down";
        counts[t]+=1;
        document.body.style.backgroundColor="rgb(0,0,0)";
      }


      if(l_elbow.score>0.1 && r_elbow.score>0.1)
      {
      var dist_lke = Math.abs(l_knee.position.y-l_elbow.position.y);
      var dist_rke = Math.abs(r_knee.position.y-r_elbow.position.y);

      if(dist_lke <=5 || dist_rke<=5 )
      {
        t="hip_up";
        counts[t]+=1;
      }

      }

      else if(l_wrist.score.y>0.1 && r_wrist.score.y>0.1)
      {
      var dist_lkw = Math.abs(l_knee.position.y - l_wrist.position.y);
      var dist_rkw = Math.abs(r_knee.position.y - r_wrist.position.y);

      if(dist_lkw <=5 || dist_rkw<=5)
      {
        t="hip_up";
        counts[t]+=1;
      }
      }

     */

        
    }

     setTimeout(count_feedback(counts), 10000);


    }
  


    function count_feedback(counts)
    {
      
      var a = document.getElementById("feedback");
      var r = document.getElementById("feedback_1");

      

      var scores={"perfect":0,"hip_up":0,"hip_down":0};



      document.body.style="rgb(0,0,0)";

      var l = [];
      l.push(counts.perfect);
      l.push(counts.hip_up);
      l.push(counts.hip_down);
   
      //console.log(l);


      const sum = l.reduce(add);


      function add(accumulator, a) {
      return accumulator + a;
      }

    
      var a1 = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
      var perfect = Math.floor(counts.perfect/sum*100);
      var hip_up= Math.floor(counts.hip_up/sum*100);
      var hip_down = Math.floor(counts.hip_down/sum*100);


      
      //console.log(ratio);

      var feedback;


        feedback = " your position is optimal, you may now begin"+"<br/>"+" perfect:"+perfect+"<br/>hip_up:"+hip_up+"<br/>hip_drop:"+hip_down;
        //feedback = "you may begin";
        a.style.color = "black";

        

        if(perfect>hip_up && perfect>hip_down)
        {
          r.innerHTML = "PERFECT ! , now continue to maintain this plank position";
          perfect-=1;

        }

        if(perfect<hip_up && hip_up>hip_down)
        {
          r.innerHTML = "YOU NEED TO LIFT YOUR HIP UP A,TAD MORE";
        }

        if(hip_down>perfect && hip_down>hip_up)
        {
          r.innerHTML = "YOU NEED TO DROP YOUR HIPS";
          perfect-=1;
          
        }


        
        r.style.display = "inline-block";
        r.style.color = "BLACK";



      a.style.display="inline-block";
      a.innerHTML =feedback;

      //setTimeout(call_out_feedback, 10000);
      check_for_feedback_change(r.innerHTML);
      
      //check_for_feedback_change(a.innerHTML);



    }


var temp_feed="";

function check_for_feedback_change(feedback)
{
  //console.log(feedback);
  if(temp_feed!=feedback)
  {
    temp_feed=feedback;
    setTimeout(call_out_feedback(temp_feed), 10000);
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





