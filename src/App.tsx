import React, { useState } from 'react';
import Cube from './components/Cube'
function App() {
  const [child,setChild] = useState()
  const [inputOne,setInputOne]=useState('')
  
  const [inputTwo,setInputTwo]=useState('')
  return (
    <div className="App">
      <p>无提示转动</p>
      <input type="text" value={inputOne} onChange={(e)=>setInputOne(e.target.value)}/>
      <button onClick={()=>{child.rotate(inputOne)}}>转动</button>
      <br/>
      <p>有提示转动</p>
      <input type="text" value={inputTwo} onChange={(e)=>setInputTwo(e.target.value)}/>
      <button onClick={()=>{child.rotateWithTips(inputTwo)}}>转动</button>
      <Cube width={'450px'} height={'450px'} size={1} onRef={(c:any)=>{setChild(c)}}></Cube>
    </div>
  );
}

export default App;
