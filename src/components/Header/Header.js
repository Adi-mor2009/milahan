import './Header.css'
function Header() {
    return(
        <div className="c-header">
            {/* <h1><i className="bi bi-music-note-beamed"></i> מילחן <span style={{color: "black", fontSize: 36}}><i className="bi bi-music-note"></i>מפתח ביבליוגרפי לאיתור שירים בשירונים</span></h1> */}
            <div className="lib-logo-img"></div>
            <h1>
            מילחן <span style={{fontSize: 36}}>
                <i className="bi bi-music-note"></i>מפתח ביבליוגרפי לאיתור שירים בשירונים</span>
            </h1>
            {/* <div className="lib-haifa-text">אוניברסיטת חיפה - הספרייה</div> */}
            {/* <div className="lib-logo-img"></div> */}
        </div>
    )
}

export default Header;