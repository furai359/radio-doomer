import s from './App.module.css'
import React from "react";
import Player from "./Components/Player/Player";
import Background from "./Components/Background/Background";

const App = () => {
  return <div className={s.wrap}>
    <Background/>
    <Player/>
    <a className={s.link}
       href={'https://t.me/DUMER'}
       target={'_blank'} rel={'noreferrer'}>При поддержке t.me/dumer
    </a>
  </div>
}

export default App;
