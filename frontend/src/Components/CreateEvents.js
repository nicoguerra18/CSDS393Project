import { Button, Card } from "react-bootstrap";
import React from "react";
import { useState } from "react";
import { Row } from "react-bootstrap";
import { Form } from "react-bootstrap";
import "./styles.css";
import CSRFToken from "./crftoken";
import "@googlemaps/extended-component-library/place_picker.js";
import { PlacePicker } from "@googlemaps/extended-component-library/react";

function CreateEvents() {
  // const [show, setShow] = useState(false);
  // const [selectedEvent, setSelectedEvent] = useState("");

  // const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);

  const [formData, setFormData] = useState({
    name: "",
    date: "08-15-2323",
    image: null,
    location: null,
    keyword: "",
    creator: "",
    description: "",
    is_private: "",
  });

  const handleChange = (e) => {
    const { id, value, name, type } = e.target;
    const val = type === "checkbox" ? e.target.checked : value;
    setFormData({ ...formData, [id || name]: val });
  };

  const handleRadioChange = (e) => {
    const { value, name } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formdata = new FormData();
      formdata.append("name", formData.name);
      formdata.append("date", formData.date);
      formdata.append("location", formData.location);
      formdata.append("creator", formData.creator);
      formdata.append("description", formData.description);
      formdata.append("image", formData.image);
      formdata.append("selectedEvent", formData.selectedEvent);
      formdata.append("is_private", formData.is_private);
      console.log(formData);
      // send event form data to backend
      const response = await fetch("http://localhost:8000/EventDatabase/", {
        method: "POST",
        body: formdata,
      });

      console.log(response);
      // setShow(false);
      window.location.reload(); // refresh page
    } catch (error) {
      console.log("Error sending event data form:", error);
    }
  };

  const eventOptions = [
    "Meetups",
    "Concert",
    "Sports events",
    "Workshops",
    "Seminars",
    "Conferences",
    "Networking events",
    "Festivals",
    "Exhibitions",
    "Art shows",
    "Theater performances",
    "Movie screenings",
    "Fitness classes",
    "Yoga sessions",
    "Dance classes",
    "Cooking classes",
    "Wine tasting events",
    "Charity fundraisers",
    "Hackathons",
    "Book readings/signings",
    "Music festivals",
    "Food festivals",
    "Comedy shows",
    "Art workshops",
    "Technology expos",
    "Job fairs",
    "Product launches",
    "Outdoor adventures",
    "Cultural celebrations",
    "Science fairs",
    "Historical reenactments",
    "Virtual events",
    "Fashion shows",
    "Car shows",
    "Gaming tournaments",
    "Trivia nights",
    "DIY crafting events",
    "Poetry slams",
    "Photography exhibitions",
    "Environmental awareness events",
    "Other",
  ];

  return (
    <Row className="mx-auto">
      <Card>
        <Card.Body>
          <Card.Title>Create An Event</Card.Title>
          <Card.Text>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="name">
                <Form.Label>Event Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Event Title"
                  onChange={handleChange}
                />
              </Form.Group>
              <br />
              <Form.Group controlId="description">
                <Form.Label>Event Description</Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder="Event Decription"
                  rows={3}
                  onChange={handleChange}
                />
              </Form.Group>
              <br />
              <Form.Group controlId="image">
                <Form.Label>Event Image</Form.Label>
                <Form.Control type="file" onChange={handleFileChange} />
              </Form.Group>
              <br />
              <Form.Group controlId="date">
                <Form.Label>Event Date</Form.Label>
                <Form.Control
                  type="text"
                  onChange={handleChange}
                  placeholder="DD-MM-YYYY"
                />
              </Form.Group>
              <br />
              <Form.Group controlId="creator">
                <Form.Label>Creator</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your Username"
                  onChange={handleChange}
                />
              </Form.Group>
              <br />
              <Form.Group controlId="keyword">
                <Form.Label>Keyword</Form.Label>
                <Form.Control as="select" onChange={handleChange}>
                  <option value="">Select a keyword</option>
                  {eventOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <br />

              <Form.Group controlId="location">
                <Row>
                  <Form.Label>Event Location</Form.Label>
                </Row>
                <Row>
                  <PlacePicker
                    className="react-google-maps-autocomplete-container"
                    placeholder="Lookup an Address"
                  />
                </Row>
                <Form.Control
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Copy address from above or type address"
                />
              </Form.Group>
              <br />
              <Form.Group controlId="is_private">
                <Form.Label>Event Privacy</Form.Label>
                <div key={"inline-radio"} className="mb-3">
                  <Form.Check
                    inline
                    label="Public"
                    type="radio"
                    id={`inline-radio-1`}
                    value="False"
                    name="is_private" // Use name attribute for radio buttons
                    onChange={handleRadioChange}
                  />
                  <Form.Check
                    inline
                    label="Private"
                    type="radio"
                    id={`inline-radio-2`}
                    value="True"
                    name="is_private" // Use name attribute for radio buttons
                    onChange={handleRadioChange}
                  />
                </div>
              </Form.Group>
            </Form>
            <CSRFToken />
            <Row>
              <Button variant="success" type="submit" onClick={handleSubmit}>
                Create Event&nbsp;
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-hammer"
                    viewBox="0 0 16 16"
                  >
                    <path d="M9.972 2.508a.5.5 0 0 0-.16-.556l-.178-.129a5 5 0 0 0-2.076-.783C6.215.862 4.504 1.229 2.84 3.133H1.786a.5.5 0 0 0-.354.147L.146 4.567a.5.5 0 0 0 0 .706l2.571 2.579a.5.5 0 0 0 .708 0l1.286-1.29a.5.5 0 0 0 .146-.353V5.57l8.387 8.873A.5.5 0 0 0 14 14.5l1.5-1.5a.5.5 0 0 0 .017-.689l-9.129-8.63c.747-.456 1.772-.839 3.112-.839a.5.5 0 0 0 .472-.334" />
                  </svg>
                </span>
              </Button>
            </Row>
          </Card.Text>
        </Card.Body>
      </Card>
    </Row>
  );
}

export default CreateEvents;

