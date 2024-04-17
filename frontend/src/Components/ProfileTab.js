import { Card, Container, ToastContainer } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { Row } from "react-bootstrap";
import { Button } from "react-bootstrap";
import "./styles.css";
import { Col } from "react-bootstrap";
import MyEvents from "./MyEvents";
import { Tabs } from "react-bootstrap";
import { Tab } from "react-bootstrap";
import { useState } from "react";
import CSRFToken from "./crftoken";
import { useEffect } from "react";
import Toast from "react-bootstrap/Toast";
import defaultImage from "./default.jpg";
import JoinedEvents from "./JoinedEvents";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import { useAuth0 } from '@auth0/auth0-react';
import InvitesDisplay from "./InvitesDisplay";

// NEED TO ADD A FILE IN ORDER FOR FOR THE PUT REQUEST TO GO THROUGH

function ProfileTab() {
  const { isAuthenticated } = useAuth0();

  return (
    (isAuthenticated && (
      <Container>
        <Row className="mx-auto">
          <Col>
            <Row>
              <PersonalInfo />
            </Row>
          </Col>
          <Col>
            <Tabs defaultActiveKey="MyEvents" id="ProfileTabs" className="mb-3">
              <Tab eventKey="MyEvents" title="Created Events">
                <MyEvents />
              </Tab>
              <Tab eventKey="eventsJoined" title="Events Joined">
                <JoinedEvents />
              </Tab>
              <Tab eventKey="PendingInvites" title="Pending Invites">
                <InvitesDisplay />
              </Tab>
              <Tab eventKey="MyGroups" title="My Groups">
                Coming soon in feature 3!
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Container>
    )) ||
    (!isAuthenticated && (
      <Container>
        <Row>
          <Col className="text-center">
            <Card style={{ margin: 50 }}>
              <h1 style={{ margin: 50 }}> You are not Signed in</h1>
              <Row>
                <Col>
                  <LoginButton />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Container>
    ))
  );
}

function PersonalInfo() {
  // call to backend to update profile info
  // update profile info in user profile
  const { user } = useAuth0();
  const [formData, setFormData] = useState({
    profileName: "ryan2",
    username: user.email,
    password: "password",
    bio: "Enter bio here",
    
  });
  

  
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const toggleShowSuccessToast = () => setShowSuccessToast(!showSuccessToast);
  const toggleShowErrorToast = () => setShowErrorToast(!showErrorToast);

  

  // DEAFULT PROFILE IS 1******
  // currently it always calls profile 1 data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const profileResponse = await fetch(`http://localhost:8000/profilesearch/${encodeURIComponent(user.email)}`);
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setFormData(profileData);
        } else {
          // If the profile does not exist, create a new one
          console.error('Profile not found, creating a new user profile.');
          const newProfile = {
            ...formData
            // Populate with other default fields if necessary
          };
          const createResponse = await fetch('http://localhost:8000/profiles/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newProfile), 
          });
  
          if (createResponse.ok) {
            console.log('New profile created successfully');
            const newProfileData = await createResponse.json();
            setFormData(newProfileData);
          } else {
            // If the POST request fails, log the response for debugging
            console.error('Failed to create a new profile:', await createResponse.text());
          }
        }
      } catch (error) {
        console.error('There was an error fetching or creating the profile:', error);
      }
    };
  
    if (user?.email) {
      fetchProfileData();
    }
  }, [user?.email]); // Re-run effect if user's email changes
  

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      profilePicture: file,
      profilePictureUrl: URL.createObjectURL(file), // Create URL for the file
    });
  };

  // Update profile method
  const handleFormSubmit = async (e) => {
    e.preventDefault();

      // Check if all required fields except profilePicture are filled
    const { profileName, username, password, bio } = formData;
    if (!profileName || !username || !password || !bio) {
      // If any of the fields are empty, display an error toast and do not submit
      setShowErrorToast(true);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("profileName", formData.profileName);
      formDataToSend.append("username", formData.username);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("bio", formData.bio);
      formDataToSend.append("profilePicture", formData.profilePicture);
      console.log(formData.profilePicture);

      const response = await fetch(
        "http://localhost:8000/profilesearch/" + user.email,
        {
          method: "PATCH",
          body: formDataToSend,
        }
      );

      if (response.ok) {
        // Profile updated successfully
        console.log("Profile updated successfully");
        setShowSuccessToast(true);
        setShowErrorToast(false);
      } else {
        // Handle error
        console.error("Error updating profile");
        setShowErrorToast(true);
        setShowSuccessToast(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  console.log(JSON.stringify({ profilePicture: formData.profilePicture }));
  var profilePictureUrl = "http://localhost:8000" + formData.profilePicture;
  //console.log(profilePictureUrl);

  return (
    <Row className="mx-auto">
      <Card style={{ width: "34rem" }}>
        <Card.Title>Profile</Card.Title>
        <Card.Img
          src={profilePictureUrl || defaultImage}
          alt="Profile Picture"
        />
        <Form onSubmit={handleFormSubmit}>
          <CSRFToken />
          <Form.Group className="mb-3" controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="profileName"
              value={formData.profileName}
              onChange={handleFormChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={formData.username}
              onChange={handleFormChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="text"
              name="password"
              value={formData.password}
              onChange={handleFormChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBio">
            <Form.Label>Bio</Form.Label>
            <Form.Control
              as="textarea"
              name="bio"
              value={formData.bio}
              onChange={handleFormChange}
            />
          </Form.Group>

          <Form.Group controlId="formEventImage">
            <Form.Label>Profile Picture</Form.Label>
            <Form.Control type="file" onChange={handleFileChange} />
          </Form.Group>
          <br />

          <Button
            variant="primary"
            type="submit"
            onClick={handleFormSubmit}
            className="mb-3"
          >
            Edit/Save
          </Button>

          <LogoutButton />
        </Form>
      </Card>

      <ToastContainer className="p-3" position="top-end" style={{ zIndex: 1 }}>
        <Toast
          show={showSuccessToast}
          bg="success"
          onClose={toggleShowSuccessToast}
        >
          <Toast.Header>
            <strong className="me-auto">Success</strong>
          </Toast.Header>
          <Toast.Body className={"Dark" && "text-white"}>
            Profile Information Updated Successfully!
          </Toast.Body>
        </Toast>
        <Toast show={showErrorToast} bg="danger" onClose={toggleShowErrorToast}>
          <Toast.Header>
            <strong className="me-auto">Error</strong>
          </Toast.Header>
          <Toast.Body className={"Dark" && "text-white"}>
            Error updating profile information
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </Row>
  );
}

export default ProfileTab;
