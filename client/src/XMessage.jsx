import { useEffect } from "react"

function XMessage({message, setMessage}) {
    useEffect(() => {
        if (message) {
            setTimeout(() => {
                setMessage("");
            }, 5000);
        }
    }, [message]);

    const XMessageStyle = {
        fontSize: "0.8em",
        color: 'red',
    }

    return (
        <><p style={XMessageStyle}>{message}</p></>
    )
}

export default XMessage;
