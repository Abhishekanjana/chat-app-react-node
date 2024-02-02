import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import loader from '../assets/loader.gif';
import { setAvatarRoute } from "../utils/APIRoutes";
import { Buffer } from 'buffer';

const api = 'https://api.multiavatar.com/45678945';

function SetAvatar() {
  const navigate = useNavigate();
  const [avatarList, setAvatarList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatarIndex, setSelectedAvatarIndex] = useState(undefined);

  const toastOptions = {
    position: 'bottom-right',
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: 'dark',
  };

  useEffect(() => {
    const checkUser = () => {
      if (!localStorage.getItem("chat-app-user")) {
        navigate("/login");
      }
    };

    checkUser();
  }, [navigate]);

  const setProfilePicture = async () => {
    try {
      if (selectedAvatarIndex === undefined) {
        toast.error("Please select an avatar", toastOptions);
        return;
      }

      const userData = localStorage.getItem("chat-app-user");
      if (!userData) {
        toast.error("User data not found. Please log in.", toastOptions);
        navigate("/login");
        return;
      }

      const user = JSON.parse(userData);
      const response = await axios.post(setAvatarRoute(user._id), {
        image: avatarList[selectedAvatarIndex],
      });

      const { isSet, image } = response.data;

      if (isSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = image;
        localStorage.setItem("chat-app-user", JSON.stringify(user));
        navigate("/");
      } else {
        toast.error("Error setting avatar. Please try again.", toastOptions);
      }
    } catch (error) {
      console.error("Error setting avatar:", error);
      toast.error("Error setting avatar. Please try again.", toastOptions);
    }
  };

  useEffect(() => {
    const fetchAvatars = async () => {
      try {
        const data = [];
        for (let i = 0; i < 4; i++) {
          const imageResponse = await axios.get(`${api}/${Math.round(Math.random() * 100)}`);
          const buffer = Buffer.from(imageResponse.data);
          data.push(buffer.toString('base64'));
        }
        setAvatarList(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching avatars:", error);
        toast.error('Error fetching avatars', toastOptions);
      }
    };

    fetchAvatars();
  }, []);

  return (
    <Container>
      {isLoading ? (
        <img src={loader} alt="loader" className="loader" />
      ) : (
        <>
          <div className="title-container">
            <h1>Pick an Avatar as your profile picture</h1>
          </div>
          <div className="avatars">
            {avatarList.map((avatar, index) => (
              <div
                className={`avatar ${selectedAvatarIndex === index ? 'selected' : ''}`}
                key={index}
                onClick={() => setSelectedAvatarIndex(index)}
              >
                <img src={`data:image/svg+xml;base64,${avatar}`} alt={`avatar-${index}`} />
              </div>
            ))}
          </div>
          <button onClick={setProfilePicture} className="submit-btn">
            Set as Profile Picture
          </button>
          <ToastContainer />
        </>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;

  .loader {
    max-inline-size: 100%;
  }

  .title-container {
    h1 {
      color: white;
    }
  }

  .avatars {
    display: flex;
    gap: 2rem;

    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;

      img {
        height: 6rem;
        transition: 0.5s ease-in-out;
      }
    }

    .selected {
      border: 0.4rem solid #4e0eff;
    }
  }

  .submit-btn {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;

    &:hover {
      background-color: #4e0eff;
    }
  }
`;

export default SetAvatar;
