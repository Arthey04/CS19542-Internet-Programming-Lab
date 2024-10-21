import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import serviceImg1 from './images/service_img5.jpeg';
import serviceImg2 from './images/service_img2.jpeg';
import serviceImg3 from './images/service_img3.jpg';
import './ServicesPage.css'; // Import custom CSS file

const ServicesPage = () => {
  const services = [
    {
      title: 'Dog Emotion Detection',
      description: 'Detect various emotions like happiness, sadness, relaxation, or anger in your dog using our sentiment analysis model.',
      imgUrl: serviceImg1,
    },
    {
      title: 'Real-time Analysis',
      description: 'Upload a picture of your dog, and receive real-time feedback on your dog\'s emotions using our machine learning model.',
      imgUrl: serviceImg2,
    },
    {
      title: 'Emotion Report',
      description: 'Get a detailed report on your dog\'s emotional patterns based on multiple uploaded images.',
      imgUrl: serviceImg3,
    },
  ];

  return (
    <Container className="mt-5 bg-dark text-light p-4 rounded">
      <h2 className="text-center mb-4">Our Services</h2>
      <Row>
        {services.map((service, index) => (
          <Col key={index} md={4} className="mb-4">
            <Card className="bg-secondary text-light">
              <Card.Img
                variant="top"
                src={service.imgUrl}
                className={index === 0 ? 'small-image' : ''} // Apply small-image class to the first image
              />
              <Card.Body>
                <Card.Title>{service.title}</Card.Title>
                <Card.Text>{service.description}</Card.Text>
                <Button variant="light">Learn More</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ServicesPage;
