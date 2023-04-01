import React, { useState, useEffect, startTransition } from 'react';
import Worker from './Worker';
import Task from './Task';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Fire from './firebase'
import 'firebase/compat/database';
import Login from './login';
import ProtectedRoute from './protected';
import AdminWindow from './AdminWindow';

function App() {
  return (
    <div>
<Router>
      
        <Routes>
        <Route exact path="/" element={<Login />}/>
        
        <Route exact path="/admin" element={<ProtectedRoute ProtectedComponent={<AdminWindow />} />}/>
          
         
        </Routes>
     
    </Router>
      {/* <AdminWindow />
      {allWorkers.map(worker => (
        <WorkerWindow key={worker.id} worker={worker} />
      ))} */}
    </div>
  );
}

export default App;
