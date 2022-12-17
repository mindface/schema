import { useRef } from "react";
import { Link } from "react-router-dom";

export function Header() {
  const header = useRef<HTMLHeadElement>(null)
  const pageList = [
    { id: '/', label: 'ホーム' },
    { id: '/about', label: 'このサービスについて' },
    { id: '/infoSettings', label: 'データ操作' },
    { id: '/infoPackEnto', label: 'データパック化' },
    { id: '/infoEnto', label: 'シュミュレート' },
    { id: '/infoRatio', label: '情報意味規定' }
    { id: '/imageCanvas', label: '画像比較' }
  ]
  
  return (
    <header className="header" ref={header}>
      <div className="logo-box">
        <img src="/images/logo.png" alt="" className="logo" />
        <img src="/images/scroll-logo.png" alt="" className="scroll-logo" />
      </div>
      <nav className="nav">
        {pageList.map((item) => <Link key={item.label} className="link" to={item.id}>{item.label}</Link>)}
      </nav>
    </header>
  )
}
