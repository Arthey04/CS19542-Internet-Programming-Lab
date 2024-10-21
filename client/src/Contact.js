import React from 'react';
import { Container, Form, Button } from 'react-bootstrap';
// import './Contact.css'; // Import custom CSS file

const Contact = () => {
  return (
    <Container className="mt-5  text-light p-4 rounded">
      <h2 className="text-center mb-4">Contact Us</h2>
      <p className="text-center mb-4">
        We’d love to hear from you! Whether you have questions, feedback, or just want to chat about your dog’s emotions, feel free to reach out to us.
      </p>
      <Form>
        <Form.Group controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" placeholder="Enter your name" className=" text-light" />
        </Form.Group>

        <Form.Group controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" placeholder="Enter your email" className=" text-light" />
        </Form.Group>

        <Form.Group controlId="formMessage">
          <Form.Label>Message</Form.Label>
          <Form.Control as="textarea" rows={4} placeholder="Your message" className=" text-light" />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          Send Message
        </Button>
      </Form>
    </Container>
  );
};

export default Contact;

