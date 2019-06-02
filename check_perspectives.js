let video;
let poseNet;
let button;
let poses = [];
let skeletons = [];


var feedback = [];
var counts = {"perfect":0,"hips_invisible":0,"knees_invisible":0,"ankles_invisible":0}
var work;

function preload()
{
  work = loadJSON("/workout.json");
  console.log(work);


}

//var workout = work[0].name;

var target_squats = window.prompt("Target number of squats?");
sessionStorage.setItem("target_squats", target_squats);

function setup() {
  var cnv = createCanvas(650,700);
  video = createCapture(VIDEO);
  voice = new p5.Speech();

  video.size(width, height);
  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on('pose', gotPoses);
  video.hide();
  cnv.position(20 , 50);
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
      if (keypoint.score > 0.5) {
        analyse(poses);
        fill(255, 0, 255);
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
      stroke(255, 0, 255);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}


function gotPoses(results) {
  poses = results;
}


function analyse(poses)
{


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




      var hip=0;
      var ankle =0;
      var ratio=0;


      if(l_hip.score >= 0.5 && r_hip.score >= 0.5)
      {
        if(l_knee.score >=0.5 && r_knee.score >=0.5)
        {
          if(l_ankle.score >=0.5 && r_ankle.score >=0.5)
          {


            hip = Math.abs(l_hip.position.x - r_hip.position.x);
            ankle = Math.abs(l_ankle.position.x - r_ankle.position.x);

            ratio = ankle/hip;


            document.body.style.backgroundColor="hsl(180, 50%, 50%)";
            t="perfect";
            counts[t]+=1;




          }

          else
          {
            document.body.style.backgroundColor="rgb(0,0,0)";
            t="ankles_invisible";
            counts[t]+=1;
          }
        }

        else
        {
          document.body.style.backgroundColor="rgb(0,0,0)";
          t="knees_invisible";
          counts[t]+=1;
        }
      }

      else
      {
        document.body.style.backgroundColor="rgb(0,0,0)";
        t="hips_invisible";
        counts[t]+=1;

      }
  
     setTimeout(count_feedback(counts), 10000);

}





    function count_feedback(counts )
    {
      
      var a = document.getElementById("feedback");
      var r = document.getElementById("feedback_1");

      

      var scores={"perfect":0,"hips_invisible":0,"knees_invisible":0,"ankles_invisible":0};





      var l = [];
      l.push(counts.perfect);
      l.push(counts.hips_invisible);
      l.push(counts.knees_invisible);
      l.push(counts.ankles_invisible);



      const sum = l.reduce(add);


      function add(accumulator, a) {
      return accumulator + a;
      }

    
      //console.log(Math.max(counts));
      var a1 = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
      var standing = Math.floor(counts.standing/sum*100);
      var perfect = Math.floor(counts.perfect/sum*100);
      var hips_invisible = Math.floor(counts.hips_invisible/sum*100);
      var knees_invisible = Math.floor(counts.knees_invisible/sum*100);
      var ankles_invisible = Math.floor(counts.ankles_invisible/sum*100);


      


      var feedback = " perfect:"+perfect+"<br/>hips_invisible:"+hips_invisible+"<br/>knees_invisible:"+knees_invisible+"<br/>ankles_invisible:"+ankles_invisible;



        //r.innerHTML = "TRY POSITIONING YOURSELF , IN AN OPTIMAL SPACE OF A WORKOUT";



        if(perfect>hips_invisible && perfect>knees_invisible && perfect > ankles_invisible && perfect>50 )
        {
          r.innerHTML = "Target Position Achieved , Lets Begin";
          window.location.replace("workout_sumo_squat.html")

          //setTimeout(window.location.replace("workout_sumo_squat.html"),10000000);
        }
        else
        {
          r.innerHTML="Please Move Backwards";
        }

        /*
        if(perfect>hips_invisible && perfect>knees_invisible && perfect > ankles_invisible )
        {
          r.innerHTML = "Good!,retain this position to begin workout";
        }
        */

        if(perfect<hips_invisible && hips_invisible>knees_invisible && hips_invisible> ankles_invisible )
        {
          r.innerHTML = "time to place yourself a tad away from your laptop , need to see you working out";
        }

        if(knees_invisible>hips_invisible && knees_invisible>perfect && knees_invisible> ankles_invisible)
        {
          r.innerHTML = "you need to go back a little more , so your KNEES are visible";
        }

        if(ankles_invisible>hips_invisible && ankles_invisible>perfect && knees_invisible<ankles_invisible )
        {
          r.innerHTML = "you need to go back a little more,such that your ANKLES are visible";
        }

       

        
        r.style.display = "inline-block";
        r.style.color = "BLACK";
      



      a.style.display="inline-block";
      a.innerHTML =feedback;



    check_for_feedback_change(r.innerHTML);
    //call_out_feedback(r.innerHTML);

    reset_scoring();

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


  //reset_scoring();
}

function reset_scoring()
{
  counts.perfect=0;
  counts.hips_invisible=0;
  counts.knees_invisible=0;
  counts.ankles_invisible=0;
}

function call_out_feedback(feedback)
{
  var r = document.getElementById("feedback_1");
  var b = feedback;
  voice.setVoice("Moira");
  //voice.setRate(1);
  voice.speak(b);
  //setTimeout(call_out_feedback(b), 100000);
  
}