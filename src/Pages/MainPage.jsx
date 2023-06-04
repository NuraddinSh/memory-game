import React, {useState} from "react";
import NumberBox from "../Components/Number";
import { nanoid } from 'nanoid';
import ReactConfetti from "react-confetti";

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
                <h1>MEMORY GAME</h1>
            </nav>
            {game && <button className={"new-game-button"} onClick={newGame}>Start New Game</button>}
            {!game &&
                <div className={"modes"}>

                    <button className={"mode-btn"} onClick={()=> {
                        setEasy(true)
                        setGame(true)
                    }}>Easy</button>
                    <button className={"mode-btn"} onClick={()=> {
                        setMedium(true)
                        setGame(true)
                    }}>Medium</button>
                    <button className={"mode-btn"} onClick={()=> {
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
            {game && <button onClick={!lost &&tip<2 &&gameStarter}>{tip===0 ? "Start": tip===1? "Look Again" : "0"}</button>}

            <footer className={"footer"}>Copyright © 2023 Code Inc. All Rights Reserved</footer>
        </div>
    )
}