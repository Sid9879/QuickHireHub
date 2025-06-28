import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-black flex items-center justify-center px-4 py-16">
      <div className="max-w-4xl bg-white bg-opacity-20 backdrop-blur-md rounded-xl p-10 shadow-lg">
        <h1 className="text-4xl font-extrabold mb-8 text-center">About QuickHireHub</h1>

        <section className="mb-8">
          <p className="text-lg leading-relaxed">
            Welcome to <span className="font-semibold">QuickHireHub</span>, your trusted platform connecting talented freelancers with clients worldwide. Our mission is simple: <strong>empower professionals to showcase their skills, find rewarding projects, and build meaningful collaborations</strong> in the digital economy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Who We Are</h2>
          <p className="text-lg leading-relaxed">
            At QuickHireHub, we believe the future of work is flexible, remote, and skill-driven. We are passionate about creating a seamless ecosystem where freelancers—from developers and designers to marketers and consultants—can thrive. Our platform offers everything you need to grow your freelance career or find the perfect talent for your project.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">What We Offer</h2>
          <ul className="list-disc list-inside space-y-2 text-lg leading-relaxed">
            <li><strong>Diverse Talent Pool:</strong> Discover skilled freelancers across multiple industries and expertise levels.</li>
            <li><strong>Secure Transactions:</strong> We prioritize trust and transparency, ensuring secure payments and fair contracts.</li>
            <li><strong>Easy Project Management:</strong> Simplified tools to manage your projects, communicate efficiently, and track progress.</li>
            <li><strong>Role-Based Profiles:</strong> Whether you are a freelancer or a client, customize your profile and experience to suit your needs.</li>
            <li><strong>Continuous Support:</strong> Our dedicated support team is always ready to assist you at every step.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
          <p className="text-lg leading-relaxed">
            We envision a world where every professional has the freedom to work on what they love, on their own terms. QuickHireHub strives to break down traditional barriers in employment, enabling a global community to collaborate and succeed together.
          </p>
        </section>

        <section className="text-center">
          <p className="text-lg leading-relaxed">
            Whether you're a freelancer looking for exciting projects or a business seeking skilled professionals, <strong>QuickHireHub is your go-to destination</strong>. Join us today and be part of the next generation of work.
          </p>
        </section>
      </div>
    </div>
  );
};

export default About;
