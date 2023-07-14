import React, {useState} from "react";
import NumberBox from "../Components/Number";
import { nanoid } from 'nanoid';
import ReactConfetti from "react-confetti";
import Popup from "reactjs-popup";

export default function Game() {
    const [game, setGame] = useState(false)
    const [easy, setEasy] = useState(false)
    const [medium, setMedium] = useState(false)
    const [hard, setHard] = useState(false)
    const [numbers, setNumbers] = useState([])
    const [numOrder, setNumOrder] = useState(1) // matches if the chosen numbers order true/false
    const [gameOn, setGameOn] = useState(false) //if game is active or not
    const [tip, setTip] = useState(0) // Gives an additional chance to see place of numbers
    const [lost, setLost] = useState(false)
    const [won, setWon] = useState(false)

    //depending on mode, randomize number's order and sets a numbers state
    React.useEffect(()=> {
        const arr= [];
        if(easy) {
            for(let i=1; i<=10; i++) {
                arr.push(generateNewNum(i))
            }
        }else if (medium) {
            for(let i=1; i<=15; i++) {
                arr.push(generateNewNum(i))
            }
        }else if (hard) {
                for(let i=1; i<=20; i++) {
                    arr.push(generateNewNum(i))
                }
            }

        setNumbers(arr.sort(() => Math.random() - 0.5));

    }, [easy, medium, hard])

    //generates numbers for placing in boxes
    function generateNewNum(number) {
        return {
            value: number,
            opened: false,
            clicked: false,
            id: nanoid()
        }
    }


    //method controling the number clicked is true/false
    function handleClick(num, id) {
        if(gameOn) {
            if(num===numOrder) {
                setNumbers(prevState => prevState.map(numObj => {
                    return numObj.id === id ?
                        {...numObj, opened:true, clicked:true} :
                        numObj
                }))
                setNumOrder(x=> x+1)
                if(numOrder=== 10) {
                    setWon(true)
                }
            }else {
                setGameOn(false)
                setLost(true)
            }
        }


    }
    //maps numbers array and puts numbers in a box and displays it in a NumberBox component
    function gameSetter() {
        return (numbers.map(num => (
                <NumberBox
                    key={num.id}
                    id={num.id}
                    number={num.value}
                    opened={num.opened}

                    handleClick={() => handleClick(num.value, num.id)} />
            )))
    }

    //onClick event method for showing place of numbers and after 2 seconds hides them
    function gameStarter() {
        setNumbers(prevState =>  prevState.map(num => {
            return ({...num, opened:true})
        }) )
        setGameOn(false)
        setTip(prevState => prevState +1)

        //hide numbers after 2 seconds
        setTimeout(()=> {
            setNumbers(prevState => prevState.map(num => {
                if(num.clicked) {
                    return num
                }else {
                    return ({...num, opened: false})
                }
            }))
            setGameOn(true)

        }, 2000)
    }

    //onClick event for setting default states for new game
    function newGame() {
        setEasy(false)
        setMedium(false)
        setHard(false)
        setGame(false)
        setNumOrder(1)
        setTip(0)
        setWon(false)
        setLost(false)
    }


    return(
        <div className={"main-page"}>
            {won && numOrder > numbers.length && <ReactConfetti />}
            <nav className={"navigation"}>
                <h1 onClick={newGame}>MEMORY GAME</h1>
                <div className={"info"}>
                    <Popup trigger=
                               {<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                                    className="bi bi-info-circle" viewBox="0 0 16 16">
                                   <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                   <path
                                       d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                               </svg>}
                           modal nested>
                        {
                            close => (
                                <div className='modal'>
                                    <div className='content'>
                                        <h3>HOW TO PLAY</h3>
                                        <ul>
                                            <li>Numbers are randomly distributed among boxes</li>
                                            <li>Choose difficulty mode</li>
                                            <li>After you start the game you will have 2 seconds to look at placement of numbers in boxes and remember them</li>
                                            <li>Select the boxes in an increasing order according to their numbers</li>
                                            <li>If you cannot proceed, you have one more chance to look at the positions of the numbers</li>
                                            <li>You can always start a new game</li>
                                        </ul>
                                    </div>
                                    <div onClick={() => close()} className={"close-btn"}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                             fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
                                            <path
                                                d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                            <path
                                                d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                                        </svg>
                                    </div>
                                </div>
                            )
                        }
                    </Popup>
                </div>
            </nav>

            {game && <button className={"new-game-button"} onClick={newGame}>Start New Game</button>}
            {!game &&
                <div className={"modes"}>

                    <button className={"mode-btn green glow-btn"} onClick={()=> {
                        setEasy(true)
                        setGame(true)
                    }}>Easy</button>
                    <button className={"mode-btn blue glow-btn"} onClick={()=> {
                        setMedium(true)
                        setGame(true)
                    }}>Medium</button>
                    <button className={"mode-btn red glow-btn"} onClick={()=> {
                        setHard(true)
                        setGame(true)
                    }}>Hard</button>

                </div>}
            { game &&<div className={"playground"}>
                {easy && gameSetter()}
                {medium && gameSetter()}
                {hard && gameSetter()}
            </div>}
            {lost && <h3>You Lost</h3>}
            {won && <h3>Congratulations</h3>}
            {game && !lost&& !won ? <button className={"start-btn"} onClick={!lost &&tip<2 &&gameStarter}>{tip===0 ? "Start Game": tip===1? "Look Again" : "Tip: 0"}</button> : ""}

            <footer className={"footer"}>Copyright © 2023 Code Inc. All Rights Reserved</footer>
        </div>
    )
}