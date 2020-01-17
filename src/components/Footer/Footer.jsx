import React from 'react'

var style = {
    borderTop: "1px solid #E7E7E7",
    textAlign: "center",
    padding: "20px",
    position: "fixed",
    left: "0",
    bottom: "0",
    height: "10px",
    width: "100%",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1b1919',
    color: 'white',
    fontSize: 'small'
}

var phantom = {
    display: 'block',
    padding: '20px',
    height: '10px',
    width: '80%',
}

function Footer({ children }) {
    return (
        <div>
            <div style={phantom} />
            <div style={style}>
                {children}
            </div>
        </div>
    )
}

export default Footer

