import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Logo from '../assets/logo.svg';

const Contacts = ({ contacts, changeChat }) => {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);

  useEffect(() => {
    const fetchData = async () => {
      const userData = JSON.parse(localStorage.getItem("chat-app-user"));

      if (userData) {
        setCurrentUserName(userData.username);
        setCurrentUserImage(userData.avatarImage);
      }
    };

    fetchData();
  }, []);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  return (
    <Container>
      {currentUserImage && (
        <>
          <Brand>
            <img src={Logo} alt="logo" />
            <h3>snappy</h3>
          </Brand>
          <ContactsList>
            {contacts.map((contact, index) => (
              <Contact
                key={contact._id}
                className={`contact ${index === currentSelected ? "selected" : ""}`}
                onClick={() => changeCurrentChat(index, contact)}
              >
                <Avatar>
                  <img src={`data:image/svg+xml;base64,${contact.avatarImage}`} alt="avatar" />
                </Avatar>
                <Username>
                  <h3>{contact.username}</h3>
                </Username>
              </Contact>
            ))}
          </ContactsList>
          <CurrentUser>
            <Avatar>
              <img src={`data:image/svg+xml;base64,${currentUserImage}`} alt="avatar" />
            </Avatar>
            <Username>
              <h2>{currentUserName}</h2>
            </Username>
          </CurrentUser>
        </>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  background-color: #080420;
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: center;

  img {
    height: 2rem;
  }

  h3 {
    color: white;
    text-transform: uppercase;
  }
`;

const ContactsList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
  gap: 0.8rem;

  &::-webkit-scrollbar {
    width: 0.2rem;

    &-thumb {
      background-color: #ffffff39;
      width: 0.1rem;
      border-radius: 1rem;
    }
  }
`;

const Contact = styled.div`
  background-color: #ffffff34;
  min-height: 5rem;
  cursor: pointer;
  width: 90%;
  border-radius: 0.2rem;
  padding: 0.4rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  transition: 0.5s ease-in-out;

  .avatar {
    img {
      height: 3rem;
    }
  }

  .username {
    h3 {
      color: white;
    }
  }

  &:hover {
    background-color: #ffffff59;
  }

  &.selected {
    background-color: #9a86f3;
  }
`;

const Avatar = styled.div`
  img {
    height: 4rem;
    max-inline-size: 100%;
  }
`;

const Username = styled.div`
  h2 {
    color: white;
  }
`;

const CurrentUser = styled.div`
  background-color: #0d0d30;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;

  .avatar {
    img {
      height: 4rem;
      max-inline-size: 100%;
    }
  }

  .username {
    h2 {
      color: white;
    }
  }

  @media screen and (min-width: 720px) and (max-width: 1080px) {
    gap: 0.5rem;

    .username {
      h2 {
        font-size: 1rem;
      }
    }
  }
`;

export default Contacts;
