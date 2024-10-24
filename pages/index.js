import React, { useState, useEffect, useContext } from "react";
import Countdown from "react-countdown";

// INTERNAL Imports
import { VotingContext } from "../context/Voter";
import Style from '../styles/index.module.css';
import Card from "../components/Card/card";

const index = () => {
  const {
    getNewCandidate,
    candidateArray,
    giveVote,
    currentAccount,
    checkIfWalletIsConnected,
    candidateLength,
    voterLength,
    getAllVoterData
  } = useContext(VotingContext);

  const [votingOpen, setVotingOpen] = useState(true); // State to track if voting/registration is allowed
  const [isCountdownComplete, setIsCountdownComplete] = useState(false); // Track if countdown has finished

  useEffect(() => {
    checkIfWalletIsConnected();
    getAllVoterData();
    // getNewCandidate();
  }, []);

  // Function to handle countdown completion
  const handleCountdownComplete = () => {
    setVotingOpen(false); // Close voting and registration
    setIsCountdownComplete(true); // Indicate countdown has finished
  };

  // Custom renderer to stop countdown at zero
  const countdownRenderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      return <span>00:00:00</span>; // Display 00:00:00 once countdown is done
    } else {
      // Render remaining time
      return (
        <span>
          {hours.toString().padStart(2, "0")}:
          {minutes.toString().padStart(2, "0")}:
          {seconds.toString().padStart(2, "0")}
        </span>
      );
    }
  };

  return (
    <div className={Style.home}>
      {currentAccount && (
        <div className={Style.winner}>
          <div className={Style.winner_info}>
            <div className={Style.candidate_list}>
              <p>
                No. of Candidates: <span>{candidateLength}</span>
              </p>
            </div>
            <div className={Style.candidate_list}>
              <p>
                No. of Voters: <span>{voterLength}</span>
              </p>
            </div>
          </div>

          <div className={Style.winner_message}>
            <small>
              <Countdown
                date={Date.now() + 10000} // 10 seconds for testing, replace with actual time
                renderer={countdownRenderer} // Custom renderer
                onComplete={handleCountdownComplete} // Handle countdown completion
              />
            </small>
          </div>
        </div>
      )}

      {/* Conditionally render the Card or a precise message based on voting status */}
      {votingOpen ? (
        <Card candidateArray={candidateArray} giveVote={giveVote} />
      ) : (
        <p className={Style.closed_message}>
          Voting and registration are closed. No further actions can be taken.
        </p>
      )}
    </div>
  );
};

export default index;
