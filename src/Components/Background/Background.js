import React, {useEffect, useRef, useState} from "react";
import s from './Background.module.css'
import morning from '../../Media/morning.mp4'//Видеофайлы для вывода на бекграунд
import evening from '../../Media/evening.mp4'//
import night   from '../../Media/night.mp4'  ////////////////
import morningSvg from '../../Img/light_mode_black_24dp.svg'  //Иконки для кнопок изменения видеоряда
import eveningSvg from '../../Img/evening_white_24dp.svg'     //
import nightSvg   from '../../Img/nights_stay_black_24dp.svg' //
import Tippy from "@tippyjs/react"; //Библиотека Tippy.js для вывода подсказок на кнопках

//Данный компонент рендерит фоновый видеоряд в соответствии с временем суток на компьютере
const Background = () => {
    const videos = [ //Массив объектов, отвечающих ща текущий видеоряд
        {
            src: morning,
            txt: 'Утро',
            img: morningSvg
        },
        {
            src: evening,
            txt: 'Вечер',
            img: eveningSvg
        },
        {
            src: night,
            txt: 'Ночь',
            img: nightSvg
        }
    ]
    const [currentVideo, setCurrentVideo] = useState(evening) //Хук для определения видео, которое воспроизводится на фоне в данный момент. По умолчанию вечернее
    const video = useRef(currentVideo) //Реф для обращения к видеоэлементу

    const setVideoAccordingToTime = () => { //Данная функция проверяет время на компьютере и выводит на экран соответствующий видеоряд
        const date = new Date()     //Берем текущую дату
        let hours = date.getHours() //Достаем из нее часы
        if(hours > 16  && hours < 22) setCurrentVideo(evening) //С 16:01 по 21:59 выводится вечерний видеоряд
        else if(hours >= 6 && hours <= 16) setCurrentVideo(morning) //С 06:00 по 16:00 выводится утренний видеоряд
        else setCurrentVideo(night)                                 //С 22:00 по 05:59 выводится ночной видеоряд
    }

    useEffect(() => {
        setVideoAccordingToTime() //Проверяем время и задаем соответствующий видеоряд
        const interval = setInterval(setVideoAccordingToTime, 300000) //Перепроверяем время каждые 5 минут
        return clearInterval(interval)
    }, [])

    return <div className={s.wrap}>
        <p className={s.loading_text}>Загружаем видео...</p> {/* Пока видео не отображается, на фоне выводим вот такое сообщение */}
        {/* Сам видеоэлемент */}
        <video className={s.video}
               src={currentVideo}
               autoPlay={true}
               loop={true}
               muted={true}
               ref={video}
        >Похоже, Ваш браузер не поддерживает тег Video.</video>

        <div className={s.btns_wrap}>{/* Кнопки для ручного изменения видеоряда */}
            {videos.map(i => <Tippy className={'tippy'} content={i.txt}>{/* Обёртка из библиотеки Tippy для вывода подсказок */}
                <button className={s.btn}
                        key={i.txt}
                        onClick={e => setCurrentVideo(i.src)}> {/* По клику на кнопку меняем видеоряд на соответствующий */}

                    {/* Иконка дня/вечера/ночи, смотря за что отвечает кнопка */}
                    <img className={s.img}
                        src={i.img}
                        alt={i.txt}/>
                </button>
            </Tippy>)}
        </div>
    </div>
}

export default Background