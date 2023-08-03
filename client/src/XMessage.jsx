function XMessage({message}) {
    const XMessageStyle = {
        fontSize: "0.8em",
        color: 'red',
    }

    return (
        <><p style={XMessageStyle}>{message}</p></>
    )
}

export default XMessage;
