import React, { createContext, useState  , useEffect} from 'react'
import axios from 'axios'

export const myContext = createContext({});

export default function Context(props) {

    const [userObject, setuserObject] = useState();
    useEffect(()=>{
        axios.get("http://localhost:5000/getuser" , {withCredentials : true}).then(res =>{
            if(res.data){
                console.log(res.data)
                window.localStorage.setItem('userData' , JSON.stringify(res.data))
                setuserObject(res.data)
            }
        })
    },[])

    return (
        <myContext.Provider value={userObject}>
            {props.children}
        </myContext.Provider>
    )
}