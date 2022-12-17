import { useEffect, useState, ReactNode } from 'react'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'

const getScrollTop = () => {
  return Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop)
}

type Props = {
  children?: ReactNode
}

export const Layout = ({ children }: Props) => {
  const [headerScrollClass,headerScrollClassSet] = useState('')

  const onScroll = () => {
    const height = getScrollTop();
    window.addEventListener('scroll', (e) => {
      height > 80?
        headerScrollClassSet("on"):
        headerScrollClassSet("");
    })
  }

  useEffect(() => {
    document.addEventListener("scroll",onScroll)
  },[])

  return (
    <div className={`${headerScrollClass}`}>
      <Header />
      <div className="contents">{children}</div>
      <Footer />
    </div>
  )
}
