import React, { useState, useEffect} from 'react';
import Worker from './Worker';
import Task from './Task';
import Fire from './firebase'
import 'firebase/compat/database';
import { getStorage,ref,
  uploadBytes,
  getDownloadURL, } from 'firebase/storage';
import { v4 } from "uuid";


  
  const tasks = [
    // Task(1, 'Task 1', 'John Doe', 'pending'),
    // Task(2, 'Task 2', 'Jane Doe', 'pending'),
    // Task(3, 'Task 3', 'Jim Doe', 'pending')
  ];

function AdminWindow() {
    const arr = [];
  const temp = [];
  const db = Fire.database();
  const storage = getStorage(Fire);
  const [data, setData] = useState([]);
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  var [show,setShow] = useState(false);
  var today = new Date();
  var month = today.getMonth() + 1;
  var date = today.getDate();
  var year = today.getFullYear();
  var time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
  var exact_date = `${date}:${month}:${year}`
   
  const [allTasks, setAllTasks] = useState(tasks);
  


  // const initState = async ()=> {
  //   var starCountRef =  db.ref();
  //   console.log(starCountRef);
  //   const response = await starCountRef.get('value');

  //   console.log(response.val());
  //   setData([response.val()]);
  // }
  function filterArray(array) {

    let newArray = [];
    let uniqueObject = {};

    for (let i in array) {
      var  objTitle = array[i]['Order_time'];      
        uniqueObject[objTitle] = array[i];
    };
      
    for (let i in uniqueObject) {
        newArray.push(uniqueObject[i]);
    };

    return newArray;

}
    function removeDuplicates(arr) {
        return arr.filter((item, 
            index) => arr.indexOf(item) === index);
    }
    const getdates = async () => {
      var starCountRef =  db.ref();
     await starCountRef.once('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          var childKey = childSnapshot.key;
          
          var childData = childSnapshot.val();
         
          // ...
              console.log(childKey);
              
              temp.push(childKey);
          
          
        });
        
      });
      let newtemp = removeDuplicates(temp);
      setDates(newtemp);
    }
    
  const listen = async (name) => {
    var starCountRef =  db.ref(name).orderByChild("Order_time");
    await starCountRef.once('value', (snapshot) => {
       snapshot.forEach((childSnapshot) => {
         var childKey = childSnapshot.key;
         
         var childData = childSnapshot.val();
        
         // ...
             
             arr.push(childData);
         
         
       });
       
     });
 
     let newArr = filterArray(arr);
     setData(newArr);
  }

      useEffect(() => {
        
  
        getdates();

    }, []);

    
    //Date Functions 
 
  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };
   const reset = () => {
   setShow("");
   setSelectedDate("");
   var dropDown = document.getElementById("inputGroupSelect01");  
   dropDown.selectedIndex = 0;
  }
  const getdetails = ()=>{
  setShow(true);
    listen(selectedDate);
    
 }

  // Function to update a task status
  const updateTaskStatus = (taskId, newStatus, amount, date, order, title) => {
    setAllTasks(
      allTasks.map(task => {
        if (task.id === taskId) {
          return { ...task, status: newStatus };
        }
        return task;
      })
    );
    setData(data.map(task => {
      if (task.id === taskId) {
        return { ...task, status: newStatus };
      }
      return task;
    }));
   
    var postListRef = db.ref(selectedDate);
var newPostRef = postListRef.child(taskId);
newPostRef.update({
      id : taskId,
      date: date,
      Order_time: order,
      title : title,
      amount : amount,
      status : newStatus
});
  };

   



  //Function to add a new task
  const addTask = (title, amount) => {
    setAllTasks([
      ...allTasks,
      Task(allTasks.length + 1, title, amount, 'pending')
    ]);
    setData(
      [
        ...data,
        Task(data.length + 1, title, amount, 'pending')
      ]
    )
    
    var postListRef = db.ref(exact_date);
var newPostRef = postListRef.child((data.length+1));
newPostRef.set({
      id : data.length + 1,
      date: `${date}:${month}:${year}`,
      Order_time: time,
      title : title,
      amount : amount ,
      status : "Pending",
      url: imageUrls
});
    tasks.push(allTasks);
    getdates();
  };

  //image
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);

  
  
  
  const uploadFile = () => {
    const imageRef = ref(storage, `${exact_date}/${(data.length + 1)}/${imageUpload.name + v4()}`);
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImageUrls((prev) => [...prev, url]);
      });
    });
    alert("image uploaded!, now add the Party details")
  };

  //modal
  const hel=()=>{
    const exampleModal = document.getElementById('exampleModal')
    exampleModal.addEventListener('show.bs.modal', event => {
      // Button that triggered the modal
      const button = event.relatedTarget
      // Extract info from data-bs-* attributes
      const recipient = button.getAttribute('data-bs-whatever')
      // If necessary, you could initiate an AJAX request here
      // and then do the updating in a callback.
      //
      // Update the modal's content.
      const demo = data.filter(task => task.id == `${recipient}`);
      
      const modalBodyInput = exampleModal.querySelector('.modal-body img')
       console.log(recipient,demo);
       if(demo[0].url){
        modalBodyInput.src = demo[0].url
       }
       else{
        modalBodyInput.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png'
       }
      
    })
  }
  
  const dateTasks = data.filter(task => task.date === selectedDate);

  return (
    <div>
        <h3 className='text-center'>
  Bittu Pansari
  <br/>
  <small class="text-muted">Dasti Account Ledger!</small>
</h3>

<br/>
<br/>
<figure class="text-center">
<p class="h4"><b>Hello Satyam, Select the date, to get the details!.</b></p>
</figure>
<div class="container text-center">
  <div class="row">
  <div class="col"></div>
  <div className="col-sm-12 col-md-4"><div className="input-group mb-3">
  <label className="input-group-text" htmlFor="inputGroupSelect01">Date</label>
  <select value={selectedDate} onChange={handleDateChange} className="form-select" id="inputGroupSelect01">
    <option selected>Select a date...</option>
    {dates.map((date) => (
        <option key={date} value={date}>
          {date}
        </option>
      ))}
  </select>
  
</div></div>
    <div class="col-sm-12 col-md-4">
    { show ? <button class="btn btn-secondary btn-lg" onClick={reset}>Reset</button> 
  :
  <button class="btn btn-secondary btn-lg" onClick={getdetails}>Get details</button>
  }
    <br/>
    <br/>
    </div>
    <div class="col"></div>
  </div>
</div>
{show  && <> 
  <div class="table-responsive">
<table className="table table-bordered border-secondary">
  <thead>
    <tr>
      <th scope="col">Id</th>
      <th scope="col">Date and Order-Time</th>
      <th scope="col">Party Name/Description</th>
      <th scope="col">Bills</th>
      <th scope="col">Amount</th>
      <th scope="col">Payment Status</th>
      <th scope="col">Change Status</th>
    </tr>
  </thead>
  <tbody>
  {dateTasks.length < 1 ? <h3>no tasks</h3>  : dateTasks.map((task,i) => (
          <tr key={i}  className={task.status === 'Pending' ? 'table-danger' :'table-success'}>
      
          <th  scope="row">{task.id}</th>
          <td>{task.date} /  {task.Order_time}</td>
          <td>{task.title}</td>
          <td><button type="button" onClick={hel} class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever={task.id}>
  Show Image
</button>
{/* modal */}
<div class="modal fade " id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-fullscreen">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
      <div class="container text-center">
  <div class="row">
    <div class="col">
    </div>
    <div class="col-sm-12 col-md-4">
    <img class="img-fluid" src='' />
  </div>
   <div class="col">
    </div>
</div> 
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
</div>
</td>
          <td>{task.amount}</td>
          <td>{task.status}</td>
          <td><button className='btn btn-success'
                  onClick={() => {
                    updateTaskStatus(task.id, 'Recieved',task.amount,task.date,task.Order_time,task.title);
                  }}
                >
                  Payment Received
                </button></td>
          
        </tr>  
          ))}
    
    
  </tbody>
</table> 
</div></>}
        

       




<br/>
<br/>
<div className="container text-center">
  <div className="row">
    <div className="col">
    <h3>Add New Entry!</h3>
    </div>
    <figure class="text-center">
<p class="h5">First Upload the bills if any!</p>
</figure>
<div class="container text-center">
  <div class="row">
    <div class="col-sm-12 col-md-4">
    </div>
    <div class="col-sm-12 col-md-4">
    <div class="input-group mb-3">
  <label class="input-group-text" for="inputGroupFile01">Upload</label>
  <input type="file"   onChange={(event) => {
          setImageUpload(event.target.files[0]);
        }} class="form-control" id="inputGroupFile01"/>
</div>
  
    </div>
    <div class="col-sm-12 col-md-4">
    </div>
  </div>
</div>
 
<br/>
<br/>

<div class="container text-center">
  <div class="row">
    <div class="col">
    </div>
    <div class="col">
    <button class="btn btn-secondary btn-lg" onClick={uploadFile}> Upload Image</button>
    </div>
    <div class="col">
    </div>
  </div>
</div>
    </div>
    <form
          onSubmit={e => {
            e.preventDefault();
            addTask(e.target.taskTitle.value, e.target.amount.value);
            e.target.taskTitle.value = '';
            e.target.amount.value = '';
            setImageUrls([]);
            
          }}
        >
          <br/>
          <div className="row">
    <div className="col">
    <div className="input-group">
  <span className="input-group-text">Party Name/Order Description</span>
  <textarea className="form-control" rows="3" aria-label="With textarea" name="taskTitle"></textarea>
</div>
    </div>
    </div>
    <br/>
  <div className="row">
    <div className="col">
    <div className="input-group">
  <span className="input-group-text">Amount</span>
  <textarea className="form-control" rows="1" aria-label="With textarea" name="amount"></textarea>
</div>
    
    </div>
    </div>


 
 
<br/>
<br/>
    <div className="row">
    <div className="col">
    <button type="submit"className="btn btn-secondary btn-lg">Add Entry</button>
    </div>
    </div>
           
         
          
        </form>
        
      </div>
      


      
      <br/>
      <br/>
      <footer className='footer'>
    <div className="copyright text-center">&copy; Developed by DayaRam and Sons. Version 1.0 @2023</div>
      </footer> 
</div>
  )
}

export default AdminWindow
