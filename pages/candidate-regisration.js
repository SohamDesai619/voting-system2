import React,{useState,useEffect,useCallback,useContext} from "react";
import {useRouter} from 'next/router';
import {useDropzone} from "react-dropzone";
import Image from "next/image";

//INTERNAL IMPORT

import { VotingContext } from "../context/Voter";
import Style from '../styles/allowedVoter.module.css';
import images from '../assets';
import Button from '../components/Button/Button';
import Input from "../components/Input/Input";

const candidateRegisteration = () =>{
  const[fileUrl,setFileUrl] = useState(null)
 const[candidateForm,setCandidateForm] = useState({
  name:"",
  address:"",
  age:"",
});

const router = useRouter();
const {setCandidate,uploadToIPFSCandidate,voterArray,getNewCandidate} = useContext(VotingContext)

//----VOTERS IMAGE DROP
const onDrop = useCallback(async (acceptedFiles) => {
  try {
      const url = await uploadToIPFSCandidate(acceptedFiles[0]); // Ensure uploadToIPFS includes authorization
      setFileUrl(url);
  } catch (error) {
      console.error("Error uploading to IPFS:", error);
  }
});

const{getRootProps,getInputProps} = useDropzone({
  onDrop,
  accept: {
    'image/jpeg': ['.jpeg', '.jpg'],
    'image/png': ['.png'],
    'image/gif': ['.gif'],
    'image/webm': ['.webm'],
  },
  maxSize:10000000,
})

useEffect(()=>{
  getNewCandidate();
  // console.log(voterArray);
},[]);

//---JSX PART

return( 
   
   <div className={Style.createVoter}>
    <div>
     {fileUrl && (
      <div className={Style.voterInfo}>
      <img src={fileUrl} alt="Voter Image"/>
      <div className={Style.voterInfo_paragraph}>
       <p>
        Name: <span>&nbsp; {candidateForm.name}</span>
       </p>
       <p>
        Add: &nbsp; <span>{candidateForm.address.slice(0,20)}</span>
       </p>
       <p>
        age: &nbsp; <span>{candidateForm.age}</span>
       </p>
      </div>    
      </div>
     )}

     {
      !fileUrl && (
        <div className={Style.sideInfo}>
          <div className={Style.sideInfo_box}>
            <h4>Create candidate For Voting</h4>
            <p>
              Blockchain voting organization, provide ethereum Blockchain system
            </p>
            <p className={Style.sideInfo_para}>Contract Candidate</p>
          </div>
          <div className={Style.card}>
            {/* {voterArray.map((el, i)=>(
             <div key={i+1} className={Style.card_box}>
              <div className={Style.image}>
                <img src="" alt="Profile Photo"/>
              </div>

              <div className={Style.card_info}>
                <p>
                  Name
                </p>
                <p>Address</p>
                <p>Details</p>
              </div>
             </div>
            ))} */}
          </div>
        </div>
      )
     }
    </div>
    <div className={Style.voter}>
      <div className={Style.voter_container}>
        <h1>Create New Candidate</h1>
        <div className={Style.voter__container__box}>
          <div className={Style.voter__container__box__div}>
            <div {...getRootProps()}>
              <input {...getInputProps()}/>

              <div className={Style.voter__container__box__div__info}>
                <p>Upload File: JPG,PNG,GIF,WEBM Max 10MB</p>

                <div className={Style.voter__container__box__div__image}>
                  <Image 
                  src={images.upload} 
                  alt="File Upload" 
                  width={150} 
                  height={150} 
                  objectFit="contain"
                  priority
                  />
                </div>
                <p>Drag & Drop File</p>
                <p>or Browse Media on your device</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={Style.input__container}>
        <Input inputType="text" title="Name" placeholder="Voter Name"
        handleClick={(e) => 
          setCandidateForm({ ...candidateForm, name:e.target.value})
        }
        />
        <Input inputType="text" title="Address" placeholder="Voter Address"
        handleClick={(e) => 
          setCandidateForm({ ...candidateForm, address:e.target.value})
        }
        />
        <Input inputType="text" title="Position" placeholder="Voter Position"
        handleClick={(e) => 
          setCandidateForm({ ...candidateForm, age:e.target.value})
        }
        />

        <div className={Style.Button}>
          <Button btnName="Authorized Candidate" handleClick={()=>setCandidate(candidateForm,fileUrl,router)}/>
        </div>
      </div>
    </div>

    <div className={Style.createdVoter}>
      <div className={Style.createdVoter_info}>
        <Image src={images.creator} alt="user Profile"/>
        <p>Notice For User</p>
        <p>Organizer<span>0x939939..</span></p>
        <p>Only organizer of voting contract can create voter</p>
      </div>
    </div>
   </div>


);
};

export default candidateRegisteration;
