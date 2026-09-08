import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import NavBar from "./components/NavBar.jsx"
import Home from './Pages/Home.jsx'
import Event from "../src/Pages/Events.jsx";
import { BrowserRouter } from 'react-router-dom'
import { Routes , Route } from 'react-router-dom'

import MyTicket from './Pages/MyTicket.jsx'



import MainLayout from './layouts/MainLayout.jsx'

import AdminEventDetails from './Pages/AdminEventDetails.jsx'

import EventDetail from './Pages/EventDetail.jsx'

import AdminDashBoard from './Pages/AdminDashBoard.jsx'

import TicketDetails from './Pages/TicketDetails.jsx'

import './App.css'
import Register from './Pages/Register.jsx'

import Login from './Pages/Login.jsx'
import { CreateEvent } from './Pages/CreateEvent.jsx'
import EventDetails from './Pages/EventDetail.jsx'


function App() {


  return (
   
      <>

     <Routes>

      <Route element={<MainLayout />}>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/events"
          element={< Event />}
        />

        <Route
  path="/events/:id"
  element={<EventDetail />}
/>

         <Route
  path="/my-tickets"
  element={<MyTicket />}
/>

<Route
  path="/my-tickets/:id"
  element={<TicketDetails />}
/>

 <Route
  path="/create-event"
  element = {<CreateEvent />}
/>

<Route
  path="/admin"
  element = {<AdminDashBoard  />}
/>

 <Route
    path="/admin/events/:id"
    element={<AdminEventDetails />}
  />

     

      </Route>


        <Route
          path="/register"
          element={ < Register />}
        />

        <Route
  path="/login"
  element={<Login />}
/>

    </Routes>

      </>
   
   
  )
}

export default App
