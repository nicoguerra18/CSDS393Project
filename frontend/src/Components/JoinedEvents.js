import React, { useState, useEffect } from "react";
import { Row, Col, Card, Button, CardFooter } from "react-bootstrap";
import "./styles.css";
import JoinedEventDialog from "./JoinedEventDialog";
import DiscussionCard from "./DisucssionCard";
import { Modal } from "react-bootstrap";

function JoinedEvents() {
  const [myJoinedEvents, setMyJoinedEvents] = useState([]);

  useEffect(() => {
    fetchMyJoinedEventsData(); // Fetch event data when component mounts
  }, []);

  const fetchMyJoinedEventsData = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/eventsattending/nico/"
      );
      const myJoinedEventsData = await response.json();
      const parsedEventsData = JSON.parse(myJoinedEventsData);
      setMyJoinedEvents(parsedEventsData);
    } catch (error) {
      console.error("Error fetching my events data:", error);
    }
  };

  const leaveEvent = async (eventName) => {
    try {
      const response = await fetch(
        `http://localhost:8000/changeattendance/${eventName}/nico/`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        // Update the state to remove the event from the state when I leave
        setMyJoinedEvents(
          myJoinedEvents.filter((event) => event.input_name !== eventName)
        );

        // Fetch updated joined events data
        fetchMyJoinedEventsData();
      } else {
        console.error("Failed to leave event");
      }
    } catch (error) {
      console.error("Error leaving event:", error);
    }
  };

  return (
    <div className="event-cards-container">
      <Row className="g-4">
        {myJoinedEvents.map((event, index) => (
          <Col key={index}>
            <Card style={{ width: "17rem" }}>
              <Card.Img
                variant="top"
                src={`http://localhost:8000/media/` + event.input_image + "/"}
                className="card-img-top img-fluid"
                style={{ height: "150px" }}
              />
              {/* {console.log(`http://localhost:8000/` + event.input_image + "/")} */}
              <Card.Body>
                <Card.Title>{event.input_name}</Card.Title>
                <Card.Text>{event.input_description}</Card.Text>
                <JoinedEventDialog
                  eventName={event.input_name}
                  eventDescription={event.input_description}
                  eventDate={event.input_date}
                  eventLocation={event.input_location}
                  eventCreator={event.input_creator}
                />
              </Card.Body>
              <CardFooter>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => leaveEvent(event.input_name)}
                >
                  Leave Event{" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-person-dash"
                    viewBox="0 0 16 16"
                  >
                    <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M11 12h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1 0-1m0-7a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
                    <path d="M8.256 14a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10q.39 0 .74.025c.226-.341.496-.65.804-.918Q8.844 9.002 8 9c-5 0-6 3-6 4s1 1 1 1z" />
                  </svg>
                </Button>
              </CardFooter>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default JoinedEvents;
