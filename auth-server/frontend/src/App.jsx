import Login from "./Components/Login";
import Register from "./Components/Register";
import {createBrowserRouter,  RouterProvider} from "react-router-dom";

function App() {
  const router = createBrowserRouter([
     {
      path : "/",
      element : <Login />
     },
     {
      path : "Register",
      element : <Register />
     }
  ]) 
  return (
    <>
     <RouterProvider router = {router}/>
    </>
  )
}

export default App
