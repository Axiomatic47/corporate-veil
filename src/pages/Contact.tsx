import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { Footer } from "@/components/Footer";

const Contact = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would handle the form submission
    console.log("Form submitted");
  };

  return (
    <div className="min-h-screen bg-[#1A1F2C] text-white flex flex-col">
      <div className="container mx-auto px-4 py-12 flex-grow">
        <Button
          variant="ghost"
          className="text-white mb-8"
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </Button>
        
        <h1 className="text-4xl font-serif mb-8">Contact Us</h1>
        
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
          <div>
            <label htmlFor="name" className="block mb-2">Name</label>
            <Input id="name" className="bg-[#2A2F3C] border-none" />
          </div>
          
          <div>
            <label htmlFor="email" className="block mb-2">Email</label>
            <Input id="email" type="email" className="bg-[#2A2F3C] border-none" />
          </div>
          
          <div>
            <label htmlFor="message" className="block mb-2">Message</label>
            <Textarea id="message" className="bg-[#2A2F3C] border-none" rows={6} />
          </div>
          
          <Button type="submit">Send Message</Button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;