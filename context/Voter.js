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

          const account = await window.ethereum.request({method:"eth_accounts"})

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
              pinata_api_key: `dac25d62ee862c249e72`,
              pinata_secret_api_key: `ba997ee1fa06fee5d49a613d6eb64e0bd0586dc51d35ff68104e3b3128b5872d`,

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
      //-----UPLOAD TO IPFS CANDIDATE IMAGE  
const uploadToIPFSCandidate = async (file) => {
  if (file){
  try {
   
  const formData = new FormData();
    formData.append('file', file); 

  const response = await axios({
    method: 'post',
    url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
    data: formData,
    headers: {
      pinata_api_key: `dac25d62ee862c249e72`,
      pinata_secret_api_key: `ba997ee1fa06fee5d49a613d6eb64e0bd0586dc51d35ff68104e3b3128b5872d`,

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
                pinata_api_key: `dac25d62ee862c249e72`,
              pinata_secret_api_key: `ba997ee1fa06fee5d49a613d6eb64e0bd0586dc51d35ff68104e3b3128b5872d`,
  
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
        };

        ////-------CREATE VOTER

        const getAllVoterData = async() => {
          try{
            const web3Modal = new Web3Modal();
          const connection = await web3Modal.connect()
          const provider= new ethers.providers.Web3Provider(connection)
          const signer=provider.getSigner();
          const contract = fetchContract(signer);


          //VOTER LIST
          const voterListData = await contract.getVoterList();
          setVoterAddress(voterListData);

          voterListData.map(async(eL)=>{
            const singleVoterData = await contract.getVoterdata(eL);
            pushVoter.push(singleVoterData);

          });

          //VOTER LENGTH

          const voterList = await contract.getVoterLength();
          setVoterLength(voterList.toNumber());
          }
          catch (error) {
           setError("Something Went Wrong");
          }         
        };

        ////---GIVE VOTE
        const giveVote = async(id) => {
        try {


        } catch (error) {
          console.log(error)
        }
        
        }

        const setCandidate = async (candidateForm,fileUrl,router) =>{
          const {name,address,age} = candidateForm;

          if(!name || !address || !age) return console.log("Input Data is missing");

          console.log(name,address,age,fileUrl)

           const web3Modal = new Web3Modal();
           const connection = await web3Modal.connect();
           const provider = new ethers.providers.Web3Provider(connection);
           const signer = provider.getSigner();
           const contract = fetchContract(signer)
           const data= JSON.stringify({
             name,
             address,
             age,
             image: fileUrl
           })
           const response = await axios({
             method:"POST",
             url:"https://api.pinata.cloud/pinning/pinJSONToIPFS",
             data:data,
             headers:{
               pinata_api_key:"dac25d62ee862c249e72",
               pinata_secret_api_key:"ba997ee1fa06fee5d49a613d6eb64e0bd0586dc51d35ff68104e3b3128b5872d",
               'Content-Type':'application/json',
             },
           })
           const url = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`
           const candidate = await contract.setCandidate(
             address,
             age,
             name,
             fileUrl,
             url
           );
           candidate.wait()
           router.push("/");
        }

        //--GET CANDIDATE DATA

        const getNewCandidate = async()=>{
          try{
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect()
            const provider= new ethers.providers.Web3Provider(connection)
            const signer=provider.getSigner();
            const contract = fetchContract(signer)

            //------All CANDIDATE
            const allCandidate = await contract.getCandidate();
            console.log(allCandidate);

            allCandidate.map(async(el)=>{
              const singleCandidateData = await contract.getCandidatedata(el);

              pushCandidate.push(singleCandidateData);
              candidateIndex.push(singleCandidateData[2].toNumber());
              
            });
            

            const allCandidateLength = await contract.getCandidateLength();
            setCandidateLength(allCandidateLength.toNumber());
          } catch(error){
            console.log(error);
          }
        };

        useEffect(()=>{
          getNewCandidate()
        },[])



        return(
            <VotingContext.Provider value={{votingTitle,
            checkIfWalletIsConnected,
            connectWallet,
            uploadToIPFS,
            createVoter,
            getNewCandidate,
            setCandidate,
            error,
            voterArray,
            voterLength,
            voterAddress,
            currentAccount,
            candidateLength,
            candidateArray,
            uploadToIPFSCandidate,
            getAllVoterData,
            giveVote}}>
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
