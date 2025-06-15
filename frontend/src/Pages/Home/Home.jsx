import React from 'react'
import Navbar from '../../components/Navbar'
import Hero from '../../components/Hero'
import Features from '../../components/Features'
import Footer from '../../components/Footer'
import AllBusinesses from '../../components/AllBusinesses'

const Home = () => {
  return (
    <>
    <Navbar/>
    <Hero/>
    <AllBusinesses/>
    <Features/>
    <Footer/>
    </>
  )
}

export default Home