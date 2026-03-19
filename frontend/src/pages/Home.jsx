import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Contact Form State
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [formStatus, setFormStatus] = useState({ loading: false, message: null, type: '' });

  // Handle Navbar Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mock Testimonials Data
  const testimonials = [
    { id: 1, name: "Sarah Johnson", rating: 5, text: "Excellent service! They helped me with my Java programming assignment and delivered it before the deadline. The code was well-structured and thoroughly commented. Highly recommend for any IT student!", date: "Dec 20, 2025" },
    { id: 2, name: "Michael Chen", rating: 5, text: "Got help with my quantity surveying cost estimation project. The calculations were accurate and the report was professionally formatted. They really understand construction management!", date: "Dec 18, 2025" },
    { id: 3, name: "Emma Williams", rating: 5, text: "Amazing experience! The team was very responsive and made revisions based on my feedback. My web development project scored an A+. Will definitely use their services again!", date: "Dec 15, 2025" }
  ];

  // Auto-slide Testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));

  // Smooth Scroll Helper
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Contact Form Submit Handler
  const handleContactSubmit = (e) => {
    e.preventDefault();
    setFormStatus({ loading: true, message: null, type: '' });
    
    // Mock API Call
    setTimeout(() => {
      setFormStatus({ 
        loading: false, 
        message: "Message sent successfully! We'll get back to you soon.", 
        type: 'success' 
      });
      setFormData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setFormStatus({ loading: false, message: null, type: '' }), 5000);
    }, 1500);
  };

  return (
    <div className="font-sans text-[#333]">
      
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-500 py-3 px-4 md:px-8 flex justify-between items-center ${isScrolled ? 'bg-[#212529] shadow-lg' : 'bg-transparent'}`}>
        <Link to="/" className="text-2xl font-bold text-white flex items-center gap-2 no-underline">
          <i className="bi bi-journal-text"></i> Assignment Service
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <button onClick={() => scrollToSection('hero')} className="text-white hover:text-gray-300 font-medium transition-colors">Home</button>
          <button onClick={() => scrollToSection('services')} className="text-white hover:text-gray-300 font-medium transition-colors">Services</button>
          <button onClick={() => scrollToSection('how-it-works')} className="text-white hover:text-gray-300 font-medium transition-colors">How It Works</button>
          <button onClick={() => scrollToSection('testimonials')} className="text-white hover:text-gray-300 font-medium transition-colors">Testimonials</button>
          <button onClick={() => scrollToSection('contact')} className="text-white hover:text-gray-300 font-medium transition-colors">Contact</button>
          
          <div className="flex gap-3 ml-4">
            <Link to="/login" className="bg-white text-[#212529] px-5 py-2 rounded-full font-bold hover:bg-gray-100 hover:-translate-y-0.5 transition-all no-underline">Login</Link>
            <Link to="/register" className="bg-[#667eea] text-white px-5 py-2 rounded-full font-bold hover:bg-[#764ba2] hover:-translate-y-0.5 transition-all no-underline">Register</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="min-h-screen relative flex items-center justify-center text-center px-4 pt-20" style={{
        background: `linear-gradient(rgba(8, 0, 58, 0.7), rgba(8, 0, 58, 0.7)), url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=2000') center/cover`
      }}>
        <div className="max-w-4xl text-white relative z-10 animate-fadeInUp">
          <h1 className="text-5xl md:text-[60px] font-bold mb-6 leading-tight">Professional Assignment Help for IT & QS Students</h1>
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
            We are committed to providing top-quality assignment assistance and helping students achieve academic excellence. Our experienced team specializes in IT programming and Quantity Surveying projects, ensuring timely delivery and exceptional results.
          </p>
          <Link to="/register" className="relative inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-8 py-4 rounded-full font-bold text-lg shadow-[0_10px_25px_rgba(102,126,234,0.4)] hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(102,126,234,0.6)] transition-all overflow-hidden group no-underline">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            Get Started Today <i className="bi bi-chevron-right group-hover:translate-x-1 transition-transform"></i>
          </Link>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="text-center mb-12 animate-fadeInUp">
          <p className="text-[#212EA0] font-bold uppercase tracking-widest text-sm mb-1">Our Services</p>
          <h2 className="text-[#000F38] text-4xl font-bold">What We Offer</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800', icon: 'bi-laptop', title: 'IT Assignments' },
            { img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800', icon: 'bi-calculator', title: 'QS Assignments' },
            { img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800', icon: 'bi-headset', title: '24/7 Support' }
          ].map((prog, idx) => (
            <div key={idx} className="relative rounded-xl overflow-hidden group h-[300px] cursor-pointer shadow-lg animate-fadeInUp" style={{animationDelay: `${idx * 0.1}s`}}>
              <img src={prog.img} alt={prog.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-[#000F38]/40 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 pt-20 group-hover:pt-0">
                <i className={`bi ${prog.icon} text-5xl mb-3`}></i>
                <p className="text-xl font-bold m-0">{prog.title}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Detailed Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#212529] mb-4">Our Specialized Services</h2>
            <p className="text-gray-500 text-lg">Expert help in two main academic areas</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* IT Card */}
            <div className="bg-white border border-gray-100 rounded-2xl p-8 md:p-12 text-center hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(0,0,0,0.1)] transition-all duration-300 group">
              <i className="bi bi-laptop text-[4rem] text-[#3498db] mb-6 block group-hover:scale-110 transition-transform"></i>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">IT Assignments</h3>
              <p className="text-gray-500 mb-8 leading-relaxed">
                From programming challenges to complex software projects, we provide comprehensive assistance across all IT disciplines. Our experts ensure your code is clean, efficient, and well-documented.
              </p>
              <ul className="text-left space-y-3 text-gray-600 font-medium">
                <li><i className="bi bi-check-circle-fill text-[#28a745] mr-2"></i> Java, Python, C++, JavaScript</li>
                <li><i className="bi bi-check-circle-fill text-[#28a745] mr-2"></i> Web Development (HTML, CSS, React)</li>
                <li><i class="bi bi-check-circle-fill text-[#28a745] mr-2"></i> Database Design & SQL</li>
                <li><i className="bi bi-check-circle-fill text-[#28a745] mr-2"></i> Mobile App Development</li>
                <li><i className="bi bi-check-circle-fill text-[#28a745] mr-2"></i> Data Structures & Algorithms</li>
                <li><i className="bi bi-check-circle-fill text-[#28a745] mr-2"></i> Software Engineering Projects</li>
              </ul>
            </div>

            {/* QS Card */}
            <div className="bg-white border border-gray-100 rounded-2xl p-8 md:p-12 text-center hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(0,0,0,0.1)] transition-all duration-300 group">
              <i className="bi bi-calculator text-[4rem] text-[#28a745] mb-6 block group-hover:scale-110 transition-transform"></i>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Quantity Surveying Assignments</h3>
              <p className="text-gray-500 mb-8 leading-relaxed">
                Professional assistance with construction cost management, project planning, and all aspects of quantity surveying. Get accurate calculations and detailed reports that meet industry standards.
              </p>
              <ul className="text-left space-y-3 text-gray-600 font-medium">
                <li><i className="bi bi-check-circle-fill text-[#28a745] mr-2"></i> Cost Estimation & Budgeting</li>
                <li><i className="bi bi-check-circle-fill text-[#28a745] mr-2"></i> Construction Management</li>
                <li><i className="bi bi-check-circle-fill text-[#28a745] mr-2"></i> Project Planning & Scheduling</li>
                <li><i className="bi bi-check-circle-fill text-[#28a745] mr-2"></i> Quantity Take-off & Measurement</li>
                <li><i className="bi bi-check-circle-fill text-[#28a745] mr-2"></i> Contract Administration</li>
                <li><i className="bi bi-check-circle-fill text-[#28a745] mr-2"></i> Bill of Quantities (BOQ)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-[#f8f9fa]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#212529] mb-4">How It Works</h2>
            <p className="text-gray-500 text-lg">Simple steps to get your assignment done</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: 'bi-person-plus', color: 'bg-[#3498db]', title: '1. Register Account', desc: 'Create your free account in minutes. Provide basic information and you\'re ready to start.' },
              { icon: 'bi-journal-text', color: 'bg-[#28a745]', title: '2. Submit Details', desc: 'Share your assignment requirements, deadline, and any specific instructions or files.' },
              { icon: 'bi-check-circle', color: 'bg-[#ffc107]', title: '3. Get Quote & Approve', desc: 'Receive a fair quote based on your requirements. Review and approve to proceed.' },
              { icon: 'bi-credit-card', color: 'bg-[#17a2b8]', title: '4. Pay & Receive', desc: 'Complete secure payment and our experts start working. Get your completed assignment on time.' }
            ].map((step, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl text-center shadow-sm hover:shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:-translate-y-1.5 transition-all duration-300">
                <div className={`w-20 h-20 ${step.color} text-white rounded-full flex items-center justify-center text-4xl mx-auto mb-6 shadow-md`}>
                  <i className={`bi ${step.icon}`}></i>
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-3">{step.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-[#667eea] font-bold uppercase tracking-widest text-sm mb-2">What Our Clients Say</p>
          <h2 className="text-4xl font-bold text-[#212529] mb-12">Student Testimonials</h2>

          <div className="relative px-12">
            <button onClick={prevSlide} className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#667eea] text-white flex items-center justify-center text-xl hover:bg-[#764ba2] hover:scale-110 shadow-lg transition-all z-10">
              <i className="bi bi-chevron-left"></i>
            </button>
            <button onClick={nextSlide} className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#667eea] text-white flex items-center justify-center text-xl hover:bg-[#764ba2] hover:scale-110 shadow-lg transition-all z-10">
              <i className="bi bi-chevron-right"></i>
            </button>

            <div className="overflow-hidden rounded-2xl">
              <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                {testimonials.map((test) => (
                  <div key={test.id} className="min-w-full px-4">
                    <div className="bg-white p-8 md:p-10 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] text-left border border-gray-50">
                      <div className="flex items-center gap-5 mb-6">
                        <img src={`https://ui-avatars.com/api/?name=${test.name.replace(' ', '+')}&background=667eea&color=fff&size=70`} alt={test.name} className="w-[70px] h-[70px] rounded-full border-4 border-[#667eea] object-cover" />
                        <div>
                          <h3 className="text-xl font-bold text-[#667eea] m-0">{test.name}</h3>
                          <div className="text-[#ffc107] text-lg">
                            {'★'.repeat(test.rating)}{'☆'.repeat(5 - test.rating)}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 text-lg italic leading-relaxed mb-4">"{test.text}"</p>
                      <p className="text-gray-400 text-sm m-0">{test.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 text-xl font-bold text-[#667eea]">
            Average Rating: <span className="text-[#ffc107] mx-2 text-2xl">★★★★★</span> 4.8 / 5.0
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-[#f8f9fa]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-[#667eea] font-bold uppercase tracking-widest text-sm mb-2">Get In Touch</p>
            <h2 className="text-4xl font-bold text-[#212529]">Contact Us</h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-10 items-start">
            
            {/* Contact Info */}
            <div className="w-full lg:w-1/2 bg-white p-10 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold text-[#667eea] mb-6">Send us a message</h3>
              <p className="text-gray-500 mb-8 leading-relaxed">
                Have questions about our services or need help with your assignment? Feel free to reach out to us. We're available 24/7 to assist you with your IT and Quantity Surveying assignments. Our team is committed to providing quick responses and quality support.
              </p>
              <ul className="space-y-4 text-gray-700 font-medium">
                <li className="flex items-center gap-3"><i className="bi bi-envelope text-[#3498db]"></i> assignmentservice.net@gmail.com</li>
                <li className="flex items-center gap-3"><i className="bi bi-telephone text-[#28a745]"></i> +94 788 769 570</li>
                <li className="flex items-center gap-3"><i className="bi bi-globe text-[#17a2b8]"></i> Available Worldwide - Remote Services</li>
                <li className="flex items-center gap-3"><i className="bi bi-headset text-[#f39c12]"></i> 24/7 Customer Support</li>
              </ul>
            </div>

            {/* Contact Form */}
            <div className="w-full lg:w-1/2 bg-white p-10 rounded-2xl shadow-sm border border-gray-100">
              <form onSubmit={handleContactSubmit}>
                <div className="mb-5">
                  <label className="block text-gray-800 font-bold mb-2 text-sm">Your Name</label>
                  <input type="text" id="name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#667eea] outline-none transition-colors" placeholder="Enter your full name" />
                </div>
                <div className="mb-5">
                  <label className="block text-gray-800 font-bold mb-2 text-sm">Email Address</label>
                  <input type="email" id="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#667eea] outline-none transition-colors" placeholder="Enter your email" />
                </div>
                <div className="mb-5">
                  <label className="block text-gray-800 font-bold mb-2 text-sm">Your Message</label>
                  <textarea id="message" rows="4" required value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#667eea] outline-none transition-colors resize-y" placeholder="Tell us about your assignment..."></textarea>
                </div>
                
                <button type="submit" disabled={formStatus.loading} className="bg-[#667eea] text-white font-bold py-3 px-8 rounded-lg hover:bg-[#5568d3] hover:-translate-y-0.5 hover:shadow-lg transition-all disabled:opacity-60 disabled:hover:translate-y-0">
                  {formStatus.loading ? 'Sending...' : 'Send Message'}
                </button>

                {formStatus.message && (
                  <div className={`mt-4 p-3 rounded-lg text-sm font-bold text-center ${formStatus.type === 'success' ? 'bg-[#d4edda] text-[#155724] border border-[#c3e6cb]' : 'bg-[#f8d7da] text-[#721c24] border border-[#f5c6cb]'}`}>
                    {formStatus.type === 'success' ? '✓ ' : '✗ '}{formStatus.message}
                  </div>
                )}
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="relative overflow-hidden bg-gradient-to-br from-[#1e3c72] via-[#2a5298] to-[#1e3c72] text-white pt-16">
        {/* Animated Top Border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#667eea] via-[#764ba2] to-[#667eea] animate-gradient-x bg-[length:200%_100%]"></div>
        
        <div className="max-w-7xl mx-auto px-6 pb-10 border-b border-white/10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand Col */}
          <div>
            <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-[#a8c0ff] mb-4">Assignment Service</h3>
            <p className="text-white/80 text-sm leading-relaxed mb-6">Professional IT & Quantity Surveying assignment help. We deliver quality solutions tailored to your academic needs.</p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-gradient-to-br hover:from-[#667eea] hover:to-[#764ba2] hover:-translate-y-1 transition-all"><i className="bi bi-facebook"></i></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-gradient-to-br hover:from-[#667eea] hover:to-[#764ba2] hover:-translate-y-1 transition-all"><i className="bi bi-twitter-x"></i></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-gradient-to-br hover:from-[#667eea] hover:to-[#764ba2] hover:-translate-y-1 transition-all"><i className="bi bi-linkedin"></i></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-gradient-to-br hover:from-[#667eea] hover:to-[#764ba2] hover:-translate-y-1 transition-all"><i className="bi bi-instagram"></i></a>
            </div>
          </div>

          {/* Quick Links Col */}
          <div>
            <h4 className="text-lg font-bold mb-5 relative pb-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-12 after:h-1 after:bg-gradient-to-r after:from-[#667eea] after:to-[#764ba2] after:rounded">Quick Links</h4>
            <ul className="space-y-3">
              <li><button onClick={() => scrollToSection('hero')} className="text-white/80 hover:text-white hover:translate-x-1 transition-all text-sm before:content-['→'] before:mr-2 before:opacity-0 hover:before:opacity-100">Home</button></li>
              <li><Link to="/about" className="text-white/80 hover:text-white hover:translate-x-1 transition-all text-sm before:content-['→'] before:mr-2 before:opacity-0 hover:before:opacity-100 no-underline">About Us</Link></li>
              <li><button onClick={() => scrollToSection('services')} className="text-white/80 hover:text-white hover:translate-x-1 transition-all text-sm before:content-['→'] before:mr-2 before:opacity-0 hover:before:opacity-100">Services</button></li>
              <li><button onClick={() => scrollToSection('contact')} className="text-white/80 hover:text-white hover:translate-x-1 transition-all text-sm before:content-['→'] before:mr-2 before:opacity-0 hover:before:opacity-100">Contact</button></li>
            </ul>
          </div>

          {/* Services Col */}
          <div>
            <h4 className="text-lg font-bold mb-5 relative pb-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-12 after:h-1 after:bg-gradient-to-r after:from-[#667eea] after:to-[#764ba2] after:rounded">Our Services</h4>
            <ul className="space-y-3">
              <li><button onClick={() => scrollToSection('services')} className="text-white/80 hover:text-white hover:translate-x-1 transition-all text-sm before:content-['→'] before:mr-2 before:opacity-0 hover:before:opacity-100">IT Assignments</button></li>
              <li><button onClick={() => scrollToSection('services')} className="text-white/80 hover:text-white hover:translate-x-1 transition-all text-sm before:content-['→'] before:mr-2 before:opacity-0 hover:before:opacity-100">Quantity Surveying</button></li>
              <li><button onClick={() => scrollToSection('services')} className="text-white/80 hover:text-white hover:translate-x-1 transition-all text-sm before:content-['→'] before:mr-2 before:opacity-0 hover:before:opacity-100">Programming Help</button></li>
              <li><button onClick={() => scrollToSection('services')} className="text-white/80 hover:text-white hover:translate-x-1 transition-all text-sm before:content-['→'] before:mr-2 before:opacity-0 hover:before:opacity-100">Project Support</button></li>
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h4 className="text-lg font-bold mb-5 relative pb-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-12 after:h-1 after:bg-gradient-to-r after:from-[#667eea] after:to-[#764ba2] after:rounded">Get In Touch</h4>
            <div className="space-y-4">
              <a href="https://wa.me/94788769570" target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-[#25D366]/50 hover:translate-x-1 transition-all group no-underline">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center text-white text-lg group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-md"><i className="bi bi-whatsapp"></i></div>
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-white/60 font-bold">WhatsApp</span>
                  <span className="block text-sm font-bold text-white">+94 788 769 570</span>
                </div>
              </a>
              <a href="mailto:assignmentservice.net@gmail.com" className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-[#f093fb]/50 hover:translate-x-1 transition-all group no-underline">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#f093fb] to-[#f5576c] flex items-center justify-center text-white text-lg group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-md"><i className="bi bi-envelope"></i></div>
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-white/60 font-bold">Email</span>
                  <span className="block text-sm font-bold text-white truncate max-w-[150px]">assignmentservice...</span>
                </div>
              </a>
            </div>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/70 text-sm m-0">&copy; 2026 Assignment Service. All rights reserved.</p>
          <div className="flex gap-4 text-sm">
            <Link to="/privacy-policy" className="text-white/70 hover:text-white transition-colors no-underline">Privacy Policy</Link>
            <Link to="/terms-and-conditions" className="text-white/70 hover:text-white transition-colors no-underline">Terms & Conditions</Link>
            <Link to="/return-policy" className="text-white/70 hover:text-white transition-colors no-underline">Return Policy</Link>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a href="https://wa.me/94788769570" target="_blank" rel="noreferrer" className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-br from-[#25D366] to-[#128C7E] rounded-full flex items-center justify-center text-white text-3xl shadow-[0_8px_25px_rgba(37,211,102,0.4)] hover:scale-110 hover:shadow-[0_12px_35px_rgba(37,211,102,0.6)] transition-all z-[1000] animate-pulse-whatsapp">
        <i className="bi bi-whatsapp"></i>
      </a>

      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeInUp { animation: fadeInUp 0.8s ease-out forwards; }
        
        @keyframes pulse-whatsapp { 
          0%, 100% { box-shadow: 0 8px 25px rgba(37, 211, 102, 0.4); } 
          50% { box-shadow: 0 8px 35px rgba(37, 211, 102, 0.6); } 
        }
        .animate-pulse-whatsapp { animation: pulse-whatsapp 2s infinite; }

        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x { animation: gradient-x 3s ease infinite; }
      `}</style>
    </div>
  );
};

export default Home;