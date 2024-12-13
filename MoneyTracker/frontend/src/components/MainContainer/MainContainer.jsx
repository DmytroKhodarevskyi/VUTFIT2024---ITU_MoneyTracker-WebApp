/**
 * File: MainContainer.jsx
 * Description: Component for page base.
 * Author: Dmytro Khodarevskyi
 * 
 * Notes:
 * - _
 */


import "./MainContainer.css"

function MainContainer({children}) {

    return (
        <>
            <div className="main-container">
                {children}
            </div>
        </>
    )
}

export default MainContainer