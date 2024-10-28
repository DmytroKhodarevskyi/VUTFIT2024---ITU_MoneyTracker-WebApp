import React from 'react'
import "./SummaryCard.css"

function SummaryCard({title, date, amount, trends, style_trends, img_src}) {

  // const formatAmount = (amount) => {
  //   return new Intl.NumberFormat('de-DE', {
  //       style: 'decimal',
  //       minimumFractionDigits: 2,
  //       maximumFractionDigits: 2
  //   }).format(amount);
  // };

  return (
    <>
          <div className='card'>
            <div className='card-top-container'>
                <div className='card-title-container'>
                    <h1 className='card-title'>{title}</h1>
                    <h2 className='card-date'>{date}</h2>
                </div>
                <img className='card-image' src={img_src} alt="Card" />
            </div>

            <div className='card-bottom-container'>
                <h1 className='card-amount'>{amount}</h1>
                <h2 className='card-trends' style={style_trends}>{trends}</h2>
            </div>
          </div>
    </>
  )
}

export default SummaryCard