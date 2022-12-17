import { Routes, Route } from 'react-router-dom'
import { Login } from './pages/Login'
import { Home } from './pages/Home'
import { About } from './pages/About'
import { InfoSettings } from './pages/InfoSettings'
import { InfoEnto } from './pages/InfoEnto'
import { InfoRatio } from './pages/InfoRatio'
import { InfoPackEnto } from './pages/InfoPackEnto'
import { ImageCanvas } from './pages/ImageCanvas'
import { Layout } from './layout/index'
import './App.css'
import './App.sass'

function App() {
  function checkerogin() {
    // if (user.name === '') {
    //   navigate('/login')
    // }
  }

  // useEffect(() => {
  //   checkerogin()
  // }, [])

  return (
    <div className="bg-b-c wrapper">
      <Routes>
        <Route
          path="/login"
          element={
            <Layout>
              <Login />
            </Layout>
          }
        />
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/about"
          element={
            <Layout>
              <About />
            </Layout>
          }
        />
        <Route
          path="/infoSettings"
          element={
            <Layout>
              <InfoSettings />
            </Layout>
          }
        />
        <Route
          path="/infoEnto"
          element={
            <Layout>
              <InfoEnto />
            </Layout>
          }
        />
        <Route
          path="/infoPackEnto"
          element={
            <Layout>
              <InfoPackEnto />
            </Layout>
          }
        />
        <Route
          path="/infoRatio"
          element={
            <Layout>
              <InfoRatio />
            </Layout>
          }
        />
        <Route
          path="/imageCanvas"
          element={
            <Layout>
              <ImageCanvas />
            </Layout>
          }
        />
      </Routes>
    </div>
  )
}

export default App
