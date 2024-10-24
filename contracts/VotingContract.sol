// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract Create {
    using Counters for Counters.Counter;

    Counters.Counter public _voterID;
    Counters.Counter public _candidateID;

    address public votingOrganizer;

    // Candidate for voting
    struct Candidate {
        uint256 candidateID;
        string age;
        string name;
        string image;
        uint256 voteCount;
        address _address;
        string ipfs;
    }

    event CandidateEvent(
        uint256 indexed candidateID,
        string age,
        string name,
        string image,
        uint256 voteCount,
        address _address,
        string ipfs
    );

    address[] public candidateAddress;
    mapping(address => Candidate) public candidates;

    // Voter
    struct Voter {
        uint256 voter_voterID;
        string voter_name;
        string voter_image;
        address voter_address;
        uint256 voter_allowed;
        bool voter_voted;
        uint256 voter_vote;
        string voter_ipfs;
    }

    event VoterCreated(
        uint256 indexed voter_voterID,
        string voter_name,
        string voter_image,
        address voter_address,
        uint256 voter_allowed,
        bool voter_voted,
        uint256 voter_vote,
        string voter_ipfs
    );

    mapping(address => Voter) public voters;
    address[] public voterAddress;
    address[] public votedVoters;

    constructor() {
        votingOrganizer = msg.sender;
    }

    function setCandidate(
    address _address,
    string memory _age,
    string memory _name,
    string memory _image,
    string memory _ipfs
) public {
    require(votingOrganizer == msg.sender, "Only Organizer can create Candidate");

    // Check if candidate is already registered
    require(candidates[_address]._address == address(0), "Candidate already exists");

    _candidateID.increment();
    uint256 idNumber = _candidateID.current();

    Candidate storage candidate = candidates[_address];
    candidate.age = _age;
    candidate.name = _name;
    candidate.candidateID = idNumber;
    candidate.image = _image;
    candidate.voteCount = 0;
    candidate.ipfs = _ipfs;
    candidate._address = _address;

    candidateAddress.push(_address);

    emit CandidateEvent(
        idNumber,
        _age,
        _name,
        _image,
        candidate.voteCount,
        _address,
        _ipfs
    );
}


    function getCandidate() public view returns (address[] memory) {
        return candidateAddress;
    }

    function getCandidateLength() public view returns (uint256) {
        return candidateAddress.length;
    }

    function getCandidatedata(address _address)
        public
        view
        returns (
            string memory,
            string memory,
            uint256,
            string memory,
            uint256,
            string memory,
            address
        )
    {
        return (
            candidates[_address].age,
            candidates[_address].name,
            candidates[_address].candidateID,
            candidates[_address].image,
            candidates[_address].voteCount,
            candidates[_address].ipfs,
            candidates[_address]._address
        );
    }

    // Voter Section
    function voterRight(
    address _address,
    string memory _name,
    string memory _image,
    string memory _ipfs
) public {
    require(votingOrganizer == msg.sender, "Only organizer can create voter not you");

    // Check if voter is already registered
    require(voters[_address].voter_address == address(0), "Voter already exists");

    _voterID.increment();
    uint256 idNumber = _voterID.current();

    Voter storage voter = voters[_address];
    voter.voter_allowed = 1;
    voter.voter_name = _name;
    voter.voter_image = _image;
    voter.voter_address = _address;
    voter.voter_voterID = idNumber;
    voter.voter_vote = 1000;
    voter.voter_voted = false;
    voter.voter_ipfs = _ipfs;

    voterAddress.push(_address);

    emit VoterCreated(
        idNumber,
        _name,
        _image,
        _address,
        voter.voter_allowed,
        voter.voter_voted,
        voter.voter_vote,
        _ipfs
    );
}


    function vote(address _candidateAddress, uint256 _candidateVoteId)
        external
    {
        Voter storage voter = voters[msg.sender];

        require(!voter.voter_voted, "You have already voted");
        require(voter.voter_allowed != 0, "You have no rights to vote");

        voter.voter_voted = true;
        voter.voter_vote = _candidateVoteId;

        votedVoters.push(msg.sender);

        candidates[_candidateAddress].voteCount += voter.voter_allowed;
    }

    function getVoterLength() public view returns (uint256) {
        return voterAddress.length;
    }

    function getVoterdata(address _address)
        public
        view
        returns (
            uint256,
            string memory,
            string memory,
            address,
            string memory,
            uint256,
            bool
        )
    {
        return (
            voters[_address].voter_voterID,
            voters[_address].voter_name,
            voters[_address].voter_image,
            voters[_address].voter_address,
            voters[_address].voter_ipfs,
            voters[_address].voter_allowed,
            voters[_address].voter_voted
        );
    }

    function getVotedVoterList() public view returns (address[] memory) {
        return votedVoters;
    }

    function getVoterList() public view returns (address[] memory) {
        return voterAddress;
    }
}