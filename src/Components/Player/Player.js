import React, {useEffect, useReducer, useRef, useState} from "react";
import s from './Player.module.css'
import play from '../../Img/play.svg'   //Иконки для кнопки Play/Stop
import stop from '../../Img/stop.svg'   //
import load from '../../Img/loading.gif'/////////////////////
import vk from '../../Img/vk.png'       //Иконки для ссылок на поисковики (вк, яндекс, гугл, ютуб)
import ya from '../../Img/yandex.png'   //
import gl from '../../Img/google.png'   //
import yt from '../../Img/youtube.png'  /////////////////////
import Axios from "axios";              //Предпочитаю библиотеку Axios для AJAX запросов
import SearchButton from "../SearchButton/SearchButton"; //Компонент ссылки на поисковик

//Редьюсер с возможными состояниями кнопки Play/Stop
const btnReducer = (state, action) => {
    switch (action.type) {
        case 'PLAYING': //Музыка играет, отображается иконка Stop
            return {
                src: stop,
                alt: 'stop'
            }
        case 'STOPPED': //Музыка выключена, отображается иконка Play
            return {
                src: play,
                alt: 'play'
            }
        case 'LOADING': //Аудиопоток загружается, отображается крутилка
            return {
                src: load,
                alt: 'load'
            }
        default:
            throw new Error()
    }
}

//Самый крупный и основной компонент приложения, описывающий логику плеера.
//Здесь идет подключение к аудиопотоку, рендеринг кнопок аудиоплеера, получение данных с сервера и т.д.
const Player = () => {
    const json = 'https://myradio24.com/users/doomer/status.json' //Ссылка на JSON объект с данными - название песни/исполнителя, кол-во слушателей онлайн, следующая песня и т.д.
    const audioSrc = 'https://myradio24.org/doomer' //Ссылка на аудиопоток

    const initState = { //Изначально аудиопоток не проигрывается, должна отображаться кнопка Play
        src: play,
        alt: 'play'
    }
    const [btnState, btnDispatch] = useReducer(btnReducer, initState)


    const [song, setSong]     = useState('Загрузка...') //Название песни, пока не получены данные с сервера показывается Загрузка...
    const [artist, setArtist] = useState('Загрузка...') //Тоже самое для названия исполнителя
    const [volume, setVolume] = useState(0.75) //Начальная громкость аудиопотока

    const links = [ //Список ссылок на поисковики, по нему будут выводиться кнопки с соответствующими ссылками
        {
            src: vk,
            txt: 'Найти песню Вконтакте',
            href: `https://vk.com/audio?q=${artist}%20${song}&section=all`
        },
        {
            src: ya,
            txt: 'Найти песню в Яндекс.Музыке',
            href: `https://music.yandex.ru/search?text=${artist}%20${song}&section=all`
        },
        {
            src: gl,
            txt: 'Найти песню в Google',
            href: `https://www.google.com/search?q=${artist}+${song}`
        },
        {
            src: yt,
            txt: 'Найти песню на Youtube',
            href: `https://www.youtube.com/results?search_query=${artist}+${song}&section=all`
        }

    ]

    const audio = useRef(new Audio()) //Реф для обращения к аудиоэлементу

    const togglePlay = () => { //Функция обработки клика по кнопке Play/Stop.
        if(btnState.alt === 'play') { //Запуск аудиопотока. Выполняется, если аудиопоток не проигрывается и отображается иконка Play
            btnDispatch({type: 'LOADING'}) //Запускаем крутилку, которая показывает что аудиопоток грузится
            audio.current.src = new Audio(audioSrc).src //Обновляем аудиопоток, чтобы он играл "в прямом эфире".
                                                        //Без этой строчки, если остановить а потом снова запустить поток - он будет играть с того же места. Т.е. появится задержка по сравнению с прямым эфиром
            audio.current.play().then(r => {    //Непосредственно промис с запуском аудиопотока.
                btnDispatch({type: 'PLAYING'})  //По окончанию промиса, состояние кнопки меняется на PLAYING(вместо крутилки появляется иконка паузы)
                audio.current.volume = volume   //Задаем громкость потока
            }).catch(err => {                 //Если аудиопоток запустить не удалось,
                audio.current.pause()         //Останавливаем его,
                btnDispatch({type: 'STOPPED'})//меняем состояние на STOPPED
                console.log(err)              //и выводим ошибку в консоль. Когда-нибудь здесь будет реализован компонент с выводом сообщения об ошибке на экран
            })
        }
        else {                          //Если аудиопоток уже играет, по клику останавливаем его и меняем состояние на STOPPED
            audio.current.pause()
            btnDispatch({type: 'STOPPED'})
        }
    }

    const getDataFromServer = () => { //Функция получения информации о песне с сервера.
        Axios.get(json).then(r => {   //Делаем запрос на сервер
            setSong(r.data.songtitle) //Как только дожидаемся промиса, выводим данные об исполнителе на страницу и в тайтл
            setArtist(r.data.artist)
            document.title = r.data.artist + ' - ' + r.data.songtitle + ' | Doomer Today'
        }).catch(err => console.log(err)) //Если что-то пошло не так, ловим ошибку и выводим в консоль. Опять же, когда-нибудь будет реализован соответствующий компонент
    }

    useEffect(() => getDataFromServer(), []) //Делаем этот запрос при загрузке страницы

    useEffect(() => {   //А потом обновляем информацию каждые 10 секунд
        const interval = setInterval(getDataFromServer, 10000)
        return () => clearInterval(interval)
    }, [json])
    //Рендерим компонент
    return <div className={s.wrap}>
        <h2 className={s.song}>{song}</h2>      {/* Название песни */}
        <h2 className={s.artist}>{artist}</h2>  {/* Название артиста */}

        <div className={s.links_wrap}>          {/* Вывод массива из компонентов ссылок на поисковики */}
            {links.map(i => <SearchButton
                txt={i.txt}
                src={i.src}
                key={i.txt}
                href={i.href}
                style={i.class}/>)}
        </div>

        <div className={s.play_btn_wrap}>       {/* Кнопка Play/Stop */}
            <button className={s.play_btn}
                    onClick={togglePlay}>       {/* По клику изменяем состояние кнопки */}
                <img className={s.btn_img} // Иконка, изменяющаяся в зависимости от состояния кнопки
                     src={btnState.src}
                     alt={btnState.alt}/>
            </button>
        </div>
        {/* Ползунок громкости*/}
        <input type={'range'}
               className={s.volume}
               value={volume}
               min={0}
               max={1}
               step={0.01}
               onChange={e => { /* Обрабатываем изменение ползунка и меняем громкость аудиопотока */
                   setVolume(e.target.value)
                   audio.current.volume = e.target.value
        }}/>
        {/* Аудио-элемент для вывода аудиопотока */}
        <audio src={audioSrc}
               ref={audio}
        >Похоже, Ваш браузер не поддерживает тег Audio.</audio>
    </div>
}

export default Player