import React from 'react';
import Image from 'next/image';

// Internal Import
import Style from "./card.module.css"
import images from '../../assets';

const Card = ({ candidateArray, giveVote }) => {
  // Ensure that candidateArray is valid and has elements
  if (!candidateArray || candidateArray.length === 0) {
    return <p>No candidates available</p>; // Fallback when there are no candidates
  }

  return (
    <div className={Style.card}>
      {candidateArray.map((el, i) => (
        <div className={Style.card_box} key={i}> {/* Adding the key here */}
          <div className={Style.image}>
            {/* Use Next.js Image component */}
            <Image src={el[3]} alt="profile" width={100} height={100} />
          </div>

          <div className={Style.card_info}>
            <h2>
              {el[1]} #{el[2].toNumber()}
            </h2>
            <p>{el[0]}</p>
            <p>Address: {el[6].slice(0, 30)}...</p>
            <p className={Style.total}>Total Vote</p> {/* Fixing the misplaced JSX */}
          </div>

          <div className={Style.card_vote}>
            <p>{el[4].toNumber()}</p>
          </div>

          <div className={Style.card_button}>
          <button onClick={() => {
    console.log("Vote button clicked:", el[2].toNumber(), el[6]);
    giveVote({ id: el[2].toNumber(), address: el[6] });
}}>
    Vote
</button>

          </div>
        </div>
      ))}
    </div>
  );
};

export default Card;