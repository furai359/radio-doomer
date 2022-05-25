import React from "react";
import s from './SearchButton.module.css'
import Tippy from "@tippyjs/react"; //Библиотека Tippy.js для вывода подсказок на кнопках

//Данный компонент выводит ссылку на поисковик(Вконтакте, Яндекс, Гугл, Ютуб и т.д.).
//Кнопка редиректит на соответствующий поисковик с по исполнителю + названию
const SearchButton = props => {/* Практически все данные передаются через пропсы в компоненте Player */
    return <Tippy className={'tippy'} content={props.txt}>
        <a className={s.btn}
              rel={"noreferrer"}
              target={'_blank'}
              href={props.href}
        >
        <img className={s.img}
             src={props.src}
             alt={props.txt}/>
        </a>
    </Tippy>
}

export default SearchButton