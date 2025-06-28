
import React, { useState } from 'react';
import axios from 'axios';

const Contact = () => {
  const [form, setForm] = useState({
    name: '', email: '', subject: '', message: ''
  });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/contact', form);
      alert('Message sent!');
    } catch (error) {
      alert('Failed to send message.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-lg mx-auto">
      <input name="name" placeholder="Your Name" onChange={handleChange} required className="input" />
      <input name="email" type="email" placeholder="Your Email" onChange={handleChange} required className="input" />
      <input name="subject" placeholder="Subject" onChange={handleChange} required className="input" />
      <textarea name="message" placeholder="Message" onChange={handleChange} required className="input" />
      <button type="submit" className="btn">Send Message</button>
    </form>
  );
};

export default Contact;
