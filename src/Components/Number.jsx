import React from "react";

// component returns box for wrapping a number
export default function NumberBox(props) {
    //css for not showing numbers greater than 10
    const styles = {
        opacity: props.number > 10? '0' : `1`,
    }

    return (
        <div className={"number-box"} onClick={props.handleClick}>
            <h2 className={"inner-box"} style={styles}>{props.opened ? props.number : ``}</h2>
        </div>
    )
}