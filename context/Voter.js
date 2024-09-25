import React,{useState,useEffect, Children} from 'react';
import Web3Modal from 'web3modal';
import {ethers} from "ethers";
import {create as ipfsHttpClient} from "ipfs-http-client";
import axios from "axios";
import {useRouter} from "next/router";

import {VotingAddress,VotingAddressABI} from "./constants";

// const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

const fetchContract = (signerOrProvider) => 
    new ethers.Contract(VotingAddress , VotingAddressABI,signerOrProvider);

    export const VotingContext = React.createContext();

    export const VotingProvider = ({children})=>{
        const votingTitle ='My first smart contract app'
        const router=useRouter();
        const [currentAccount,setCurrentAccount]=useState('');
        const[candidateLength,setCandidateLength]=useState('');
        const pushCandidate=[];
        const candidateIndex=[];
        const [candidateArray,setCandidateArray]=useState(pushCandidate);

        ///-------END OF CANDIDATE DATA

        const[error,setError]=useState('');
        const highestVote=[];

        //-----------------VOTER SECTION
        const pushVoter=[];
        const[voterArray,setVoterArray]=useState(pushVoter);
        const[voterLength,setVoterLength]=useState('');
        const[voterAddress,setVoterAddress]=useState([]);


        //-------CONNECTING METAMASK

        const checkIfWalletIsConnected = async()=>{
          if(!window.ethereum) return setError("Please Install Metamask");

          const account = await window.ethereum.request({method:"eth_account"})

          if(account.length){
            setCurrentAccount(account[0]);
          }
          else{
            setError("Please Install Metamask & Connect, Reload");
          }
        };
        

        //----CONNECT WALLET

        const connectWallet = async()=>{
          if(!window.ethereum) return setError("Please Install Metamask");

          const account = await window.ethereum.request({method: "eth_requestAccounts"});

          setCurrentAccount(account[0]);
        }

        //----UPLOAD TO IPFS VOTER IMAGE

        const uploadToIPFS = async (file) => {
          if (file){
          try {
           
          const formData = new FormData();
            formData.append('file', file); 
        
          const response = await axios({
            method: 'post',
            url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
            data: formData,
            headers: {
              pinata_api_key: `9652fbee2ea5c7c1bc32`,
              pinata_secret_api_key: `bdb2451e7e5d936371eecbe52e85db7fb57898c20a7ab0f5314220571be3c238`,

              'Content-Type':'multipart/form-data'
            }
          
          });
          const Imghash = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
        
          return Imghash;
          } catch (error) {
            console.log("Unable to upload image to Pinata");
          }
        }
        };

        ////--------CREATE Voter

        const createVoter = async(formInput,fileUrl,router)=>{
          try{
            const{name,address,position}=formInput;
            if(!name || !address || !position)
              return setError("Input data is missing")

            //CONNECTING SMART CONTRACT

            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect()
            const provider= new ethers.providers.Web3Provider(connection)
            const signer=provider.getSigner();
            const contract = fetchContract(signer)
            
            const data = JSON.stringify({name,address,position,image:fileUrl});
            
            const response = await axios({
              method: 'POST',
              url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
              data: data,
              headers: {
                pinata_api_key: `9652fbee2ea5c7c1bc32`,
              pinata_secret_api_key: `bdb2451e7e5d936371eecbe52e85db7fb57898c20a7ab0f5314220571be3c238`,
  
                'Content-Type':'application/json',
              },          

            });

            const url = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;

            const voter = await contract.voterRight(address, name, url, fileUrl);
            voter.wait();

            router.push("/voterList");
          } catch (error) {

            console.log(error);
          }
        }



        return(
            <VotingContext.Provider value={{votingTitle,checkIfWalletIsConnected,connectWallet,uploadToIPFS,createVoter}}>
                {children}
            </VotingContext.Provider>
        );
    };



const Voter = () => {
  return (
    <div>
      
    </div>
  )
}

export default Voter
