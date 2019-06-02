
function getUserData()
{
    var email = sessionStorage.getItem("mail_id");
   // alert(email);
    var query = `
    {
        userdata(where: {email: {_eq: "`+email +`"}}) {
          age
          height
          username
          weight
        }
      }
      
  
  
`;
const url = "https://mysterious-refuge-54393.herokuapp.com/v1/graphql";
var opts = {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query })
};
fetch(url, opts)
  .then(res => res.json())
  .then(result => 
    {
      data = result.data.userdata[0];
      document.getElementById("usernamee").innerHTML=data.username;
      document.getElementById("height").innerHTML=data.height+" cm";
      document.getElementById("weight").innerHTML=data.weight+" kg"; 
      document.getElementById("age").innerHTML=data.age+" years";   })
  .catch(console.error);


  var query = `
  {
    workoutdata(order_by: {time_started: asc}, where: {email_user: {_eq: "`+email+`"}}) {
      time_started
      time_taken
    }
  }
  
  
    


`;
//const url = "https://mysterious-refuge-54393.herokuapp.com/v1/graphql";
var opts = {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ query })
};
fetch(url, opts)
.then(res => res.json())
.then(result => 
  {
    datadict = {};

    //console.log(result);
    data = result.data.workoutdata;

    data.forEach(function(element) {
            
     
     
     // console.log(x);
      var x = new Date(parseInt(element.time_started));
      var d = x.getDate()+"/"+(x.getMonth()+1) + "/" + x.getFullYear();
      console.log(d);
      if (!(d in datadict))
      {
          datadict[d] = 0 ;
      }
      datadict[d] =   datadict[d] + parseInt(element.time_taken) ;
    });
    
    console.log(datadict);
    var mygraph = document.getElementById("graph");
  
    var data = [
      {
        x: Object.keys(datadict),
        y: Object.values(datadict),
        type: 'bar',
        marker:{
          color: ['#2AF598', '#22E4AC', ' #1BD7BB', '#14C9CB','#2AF598', '#22E4AC', ' #1BD7BB' ]
        
        }
      }
        
    ];

    var layout = 
    {
      xaxis: {
        title: {
          text: 'Progress over the week',
        },
      },
      yaxis: {
        title: {
          text: 'Workout Time in Seconds',
          
        }
      }

    }
    
    
    
    Plotly.newPlot(mygraph, data, layout);
  })

.catch(console.error);


 
}

function setemail()
{
  var mail_id = document.getElementById("email").value;
    
        sessionStorage.setItem("mail_id",mail_id);
    var email = sessionStorage.getItem("mail_id");
   // alert(email);
       window.location = "../homepage.html";
     
}

function putUser()
{
  var mail_id = document.getElementById("emaill").value;
  sessionStorage.setItem("mail_id",mail_id);
  var username = document.getElementById("namee").value;
   //var password = document.getElementById("passwordd").value;
   var age = document.getElementById("agee").value;
   var weight = document.getElementById("weightt").value;
   var height = document.getElementById("heightt").value;


       const mutation = `
       mutation xyz {
        insert_userdata(objects: {age: `+age+`, email: "`+mail_id+`", height: `+height+`, username: "`+username+`", weight: `+weight+`}) {
          returning {
            age
          }
        }
      }
      
      
         
     
     
   `;
   const url = "https://mysterious-refuge-54393.herokuapp.com/v1/graphql";
   const opts = {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({ query : mutation })
   };
   fetch(url, opts)
     .then(res => res.json())
     .then(result =>
      {
        window.location = "../homepage.html";
      })
     .catch(console.error);   

     
  
     
}
