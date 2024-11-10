import React from 'react'

function NewThreadPopup( {newThreadPopup, setNewThreadPopup} ) {
  
    const handleDiscard = () => {
        setNewThreadPopup(false)
    }
    
    return (
    <>

        {
        ///////////////////////////////////////
        ///////////////////////////////////////
        ///////////////////////////////////////
        // TODO: Add the new thread popup here
        ///////////////////////////////////////
        ///////////////////////////////////////
        ///////////////////////////////////////
        }

         <div className="GroupView-new-thread-popup">
            <div className="GroupView-new-thread-popup-content">
              <h1 className="GroupView-new-thread-popup-title">Create new thread</h1>
              <input
                className="GroupView-new-thread-popup-input"
                type="text"
                placeholder="Thread title"
              />
              <textarea
                className="GroupView-new-thread-popup-textarea"
                placeholder="Thread description"
              />
              <button className="GroupView-new-thread-popup-button-create">Create</button>
              <button 
              onClick={handleDiscard}
              className="GroupView-new-thread-popup-button-discard">Discard</button>
            </div>
          </div>
    </>
  )
}

export default NewThreadPopup