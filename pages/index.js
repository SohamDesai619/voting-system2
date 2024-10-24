import React, { useState, useEffect, useContext } from "react";
import Countdown from "react-countdown";

// INTERNAL Imports
import { VotingContext } from "../context/Voter";
import Style from '../styles/index.module.css';
import Card from "../components/Card/card";

const Index = () => {
    const {
        getNewCandidate,
        candidateArray,
        giveVote,
        currentAccount,
        checkIfWalletIsConnected,
        candidateLength,
        voterLength,
        getAllVoterData,
        declareWinner // Import declareWinner from context
    } = useContext(VotingContext);

    const [votingOpen, setVotingOpen] = useState(true);
    const [winner, setWinner] = useState(null);
    const [highestVotes, setHighestVotes] = useState(0); // To store highest vote count
    const [countdownEndTime, setCountdownEndTime] = useState(Date.now() + 10000); // Set countdown duration

    useEffect(() => {
        checkIfWalletIsConnected();
        getAllVoterData();
        getNewCandidate();
    }, []);

    // Function to handle countdown completion and declare the winner
    const handleCountdownComplete = async () => {
        setVotingOpen(false); // Close voting and registration
  
        // Fetch the winner from the contract and store it in state
        try {
            const [winnerAddress, highestVoteCount] = await declareWinner(); // Destructure the returned values
            console.log("Winner Address:", winnerAddress); // Log the winner address
            console.log("Highest Votes:", highestVoteCount.toString()); // Log the highest votes
            setWinner(winnerAddress.toString()); // Store winner in state
            setHighestVotes(highestVoteCount.toNumber()); // Store the highest votes
        } catch (error) {
            console.error("Error declaring winner:", error);
            // Optionally, set an error state to display to the user
        }
    };
  
    // Custom renderer to display countdown
    const countdownRenderer = ({ hours, minutes, seconds, completed }) => {
        if (completed) {
            return <span>00:00:00</span>;
        } else {
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
                                date={countdownEndTime}
                                renderer={countdownRenderer}
                                onComplete={handleCountdownComplete}
                            />
                        </small>
                    </div>
                </div>
            )}

            {/* Conditionally render the Card or a precise message based on voting status */}
            {votingOpen ? (
                <Card candidateArray={candidateArray} giveVote={giveVote} />
            ) : (
                <div className={Style.result_container}>
                    {winner ? (
                        <div className={Style.winner_announcement}>
                            <p>The winner is: <strong>{winner}</strong></p>
                        </div>
                    ) : (
                        <p className={Style.closed_message}>
                            Voting is closed. Await the results.
                        </p>
                    )}

                    {highestVotes > 0 && (
                        <div className={Style.vote_count}>
                            <p>Total Votes: <strong>{highestVotes}</strong></p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Index;
