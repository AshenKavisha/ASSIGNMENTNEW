import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [formStatus, setFormStatus] = useState({ loading: false, message: null, type: '' });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const testimonials = [
    { id: 1, name: 'Sarah Johnson', rating: 5, text: 'Excellent service! They helped me with my Java programming assignment and delivered it before the deadline. The code was well-structured and thoroughly commented. Highly recommend for any IT student!', date: 'Dec 20, 2024' },
    { id: 2, name: 'Michael Chen', rating: 5, text: 'Got help with my quantity surveying cost estimation project. The calculations were accurate and the report was professionally formatted. They really understand construction management!', date: 'Dec 18, 2024' },
    { id: 3, name: 'Emma Williams', rating: 5, text: 'Amazing experience! The team was very responsive and made revisions based on my feedback. My web development project scored an A+. Will definitely use their services again!', date: 'Dec 15, 2024' },
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide(p => (p + 1) % testimonials.length), 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const nextSlide = () => setCurrentSlide(p => (p + 1) % testimonials.length);
  const prevSlide = () => setCurrentSlide(p => (p === 0 ? testimonials.length - 1 : p - 1));

  const scrollToSection = id => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ loading: true, message: null, type: '' });
    try {
      const res = await fetch('/api/contact/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setFormStatus({ loading: false, message: data.message || "Message sent successfully! We'll get back to you soon.", type: 'success' });
        setFormData({ name: '', email: '', phone: '', message: '' });
        setTimeout(() => setFormStatus({ loading: false, message: null, type: '' }), 5000);
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } catch (err) {
      setFormStatus({ loading: false, message: err.message || 'Failed to send message. Please try again.', type: 'error' });
    }
  };

  return (
      <div style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", color: '#333', lineHeight: 1.6 }}>

        {/* ── NAVBAR ── */}
        <nav style={{
          position: 'fixed', top: 0, width: '100%', zIndex: 1000,
          padding: '10px 0', transition: 'all 0.5s ease',
          backgroundColor: isScrolled ? '#212529' : 'transparent',
          boxShadow: isScrolled ? '0 5px 15px rgba(0,0,0,0.1)' : 'none',
        }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
              <i className="bi bi-journal-text"></i> Assignment Service
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
              {['hero','services','how-it-works','testimonials','contact'].map((id, i) => (
                  <button key={id} onClick={() => scrollToSection(id)} style={{ background: 'none', border: 'none', color: '#fff', fontWeight: 500, cursor: 'pointer', fontSize: 15, padding: '4px 8px', borderRadius: 5, transition: 'background 0.2s' }}
                          onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.1)'}
                          onMouseLeave={e => e.target.style.background = 'none'}>
                    {['Home','Services','How It Works','Testimonials','Contact'][i]}
                  </button>
              ))}
              <button onClick={() => scrollToSection('pricing')} style={{ background: 'none', border: 'none', color: '#fff', fontWeight: 500, cursor: 'pointer', fontSize: 15, padding: '4px 8px', borderRadius: 5, transition: 'background 0.2s' }}
                      onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.1)'}
                      onMouseLeave={e => e.target.style.background = 'none'}>Pricing</button>
              <Link to="/login" style={{ background: '#fff', color: '#212529', padding: '8px 20px', borderRadius: 20, fontWeight: 600, textDecoration: 'none', transition: 'all 0.3s ease', display: 'inline-block' }}>Login</Link>
              <Link to="/register" style={{ background: '#667eea', color: '#fff', padding: '8px 20px', borderRadius: 20, fontWeight: 600, textDecoration: 'none', transition: 'all 0.3s ease', display: 'inline-block' }}>Register</Link>
            </div>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section id="hero" style={{
          width: '100%', minHeight: '100vh',
          background: `linear-gradient(rgba(8,0,58,0.7),rgba(8,0,58,0.7)), url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=2000') center/cover`,
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        }}>
          <div style={{ maxWidth: 800, padding: '0 20px' }}>
            <h1 style={{ fontSize: 'clamp(36px,6vw,60px)', fontWeight: 600, marginBottom: 20 }}>
              Professional Assignment Help for IT &amp; QS Students
            </h1>
            <p style={{ maxWidth: 700, margin: '10px auto 30px', fontSize: 18, opacity: 0.95 }}>
              We are committed to providing top-quality assignment assistance and helping students achieve academic excellence. Our experienced team specializes in IT programming and Quantity Surveying projects, ensuring timely delivery and exceptional results.
            </p>
            <Link to="/register" style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: '#fff', padding: '14px 28px', borderRadius: 30, fontWeight: 700, fontSize: 16,
              textDecoration: 'none', boxShadow: '0 10px 25px rgba(102,126,234,0.4)',
              transition: 'all 0.4s ease',
            }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 15px 35px rgba(102,126,234,0.6)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(102,126,234,0.4)'; }}>
              Get Started Today <i className="bi bi-chevron-right"></i>
            </Link>
          </div>
        </section>

        {/* ── PROGRAMS ── */}
        <div style={{ textAlign: 'center', color: '#212EA0', fontSize: 15, fontWeight: 600, textTransform: 'uppercase', margin: '70px 0 30px' }}>
          <p style={{ margin: 0 }}>Our Services</p>
          <h2 style={{ fontSize: 32, color: '#000F38', marginTop: 5, textTransform: 'none' }}>What We Offer</h2>
        </div>
        <section style={{ margin: '0 auto 80px', width: '90%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
          {[
            { img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800', icon: 'https://img.icons8.com/ios-filled/50/ffffff/laptop.png', label: 'IT Assignments' },
            { img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800', icon: 'https://img.icons8.com/ios-filled/50/ffffff/calculator.png', label: 'QS Assignments' },
            { img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800', icon: 'https://img.icons8.com/ios-filled/50/ffffff/online-support.png', label: '24/7 Support' },
          ].map((p, i) => (
              <div key={i} style={{ flex: '1 1 30%', position: 'relative', overflow: 'hidden', borderRadius: 10, minWidth: 200 }}
                   onMouseEnter={e => e.currentTarget.querySelector('.caption').style.opacity = '1'}
                   onMouseLeave={e => e.currentTarget.querySelector('.caption').style.opacity = '0'}>
                <img src={p.img} alt={p.label} style={{ width: '100%', height: 300, objectFit: 'cover', borderRadius: 10, display: 'block' }} />
                <div className="caption" style={{
                  position: 'absolute', inset: 0, borderRadius: 10,
                  background: 'rgba(0,15,152,0.4)', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', color: '#fff',
                  opacity: 0, transition: '0.4s', cursor: 'pointer',
                }}>
                  <img src={p.icon} alt="" style={{ width: 60, marginBottom: 10, height: 'auto' }} />
                  <p style={{ fontSize: 18, fontWeight: 500, margin: 0 }}>{p.label}</p>
                </div>
              </div>
          ))}
        </section>

        {/* ── SERVICES ── */}
        <section id="services" style={{ padding: '100px 0', background: '#fff', position: 'relative', overflow: 'hidden' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 2 }}>
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <span style={{ display: 'inline-block', background: 'linear-gradient(135deg,#667eea,#764ba2)', color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: 3, padding: '6px 18px', borderRadius: 20, marginBottom: 16 }}>WHAT WE OFFER</span>
              <h2 style={{ fontSize: 40, fontWeight: 800, color: '#212529', marginBottom: 14 }}>Our Specialized Services</h2>
              <p style={{ fontSize: 16, color: '#6c757d', maxWidth: 520, margin: '0 auto' }}>Expert help in two main academic areas — delivered by professionals who know your field</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 28, marginBottom: 60 }}>
              {/* IT Card */}
              <ServiceCard
                  iconBg="linear-gradient(135deg,#667eea,#764ba2)"
                  icon="bi-laptop" tag="Technology" tagColor="#667eea" tagBg="rgba(102,126,234,0.08)"
                  borderTop="linear-gradient(90deg,#667eea,#764ba2)"
                  title="IT Assignments"
                  desc="From programming challenges to complex software projects, we provide comprehensive assistance across all IT disciplines. Our experts ensure your code is clean, efficient, and well-documented."
                  items={['Java, Python, C++, JavaScript','Web Development (HTML, CSS, React)','Database Design & SQL','Mobile App Development','Data Structures & Algorithms','Software Engineering Projects']}
                  checkBg="rgba(102,126,234,0.1)" checkColor="#667eea"
                  btnBg="linear-gradient(135deg,#667eea,#764ba2)" btnShadow="rgba(102,126,234,0.3)"
                  btnLabel="Get IT Help"
              />
              {/* QS Card */}
              <ServiceCard
                  iconBg="linear-gradient(135deg,#11998e,#38ef7d)"
                  icon="bi-calculator" tag="Construction" tagColor="#11998e" tagBg="rgba(17,153,142,0.08)"
                  borderTop="linear-gradient(90deg,#11998e,#38ef7d)"
                  title="Quantity Surveying"
                  desc="Professional assistance with construction cost management, project planning, and all aspects of quantity surveying. Get accurate calculations and detailed reports that meet industry standards."
                  items={['Cost Estimation & Budgeting','Construction Management','Project Planning & Scheduling','Quantity Take-off & Measurement','Contract Administration','Bill of Quantities (BOQ)']}
                  checkBg="rgba(17,153,142,0.1)" checkColor="#11998e"
                  btnBg="linear-gradient(135deg,#11998e,#38ef7d)" btnShadow="rgba(17,153,142,0.3)"
                  btnLabel="Get QS Help"
              />
            </div>

            {/* Stats Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#0f0c29,#302b63)', borderRadius: 20, padding: '32px 40px', flexWrap: 'wrap', gap: 20 }}>
              {[['500+','Projects Completed'],['98%','Satisfaction Rate'],['24/7','Support Available'],['100%','On-time Delivery']].map(([num, txt], i, arr) => (
                  <React.Fragment key={i}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1, minWidth: 120 }}>
                      <span style={{ fontSize: 34, fontWeight: 800, background: 'linear-gradient(135deg,#667eea,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{num}</span>
                      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: 500, textAlign: 'center' }}>{txt}</span>
                    </div>
                    {i < arr.length - 1 && <div style={{ width: 1, height: 50, background: 'rgba(255,255,255,0.1)', flexShrink: 0 }}></div>}
                  </React.Fragment>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section id="how-it-works" style={{ padding: '100px 0', background: '#f8f9fa', position: 'relative' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <span style={{ display: 'inline-block', background: 'linear-gradient(135deg,#667eea,#764ba2)', color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: 3, padding: '6px 18px', borderRadius: 20, marginBottom: 16 }}>SIMPLE PROCESS</span>
              <h2 style={{ fontSize: 40, fontWeight: 800, color: '#212529', marginBottom: 12 }}>How It Works</h2>
              <p style={{ fontSize: 16, color: '#6c757d' }}>Four easy steps to get your assignment done professionally and on time</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 24 }}>
              {[
                { icon: 'bi-person-plus-fill', bg: 'linear-gradient(135deg,#667eea,#764ba2)', num: '01', title: 'Register Account', desc: "Create your free account in minutes. Provide basic information and you're ready to start." },
                { icon: 'bi-journal-text', bg: 'linear-gradient(135deg,#11998e,#38ef7d)', num: '02', title: 'Submit Details', desc: 'Share your assignment requirements, deadline, and any specific instructions or files.' },
                { icon: 'bi-patch-check-fill', bg: 'linear-gradient(135deg,#f7971e,#ffd200)', num: '03', title: 'Get Quote & Approve', desc: 'Receive a fair quote based on your requirements. Review and approve to proceed.' },
                { icon: 'bi-rocket-takeoff-fill', bg: 'linear-gradient(135deg,#17a2b8,#48c9b0)', num: '04', title: 'Pay & Receive', desc: 'Complete secure payment and our experts start working. Get your assignment delivered on time.' },
              ].map((step, i) => (
                  <div key={i} style={{ background: '#fff', borderRadius: 20, padding: '40px 24px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', transition: 'all 0.3s ease', position: 'relative' }}
                       onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.12)'; }}
                       onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)'; }}>
                    <div style={{ position: 'relative', display: 'inline-block', marginBottom: 24 }}>
                      <div style={{ width: 80, height: 80, borderRadius: '50%', background: step.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, color: '#fff', margin: '0 auto', boxShadow: '0 8px 20px rgba(0,0,0,0.15)' }}>
                        <i className={`bi ${step.icon}`}></i>
                      </div>
                      <span style={{ position: 'absolute', bottom: -6, right: -6, width: 28, height: 28, borderRadius: '50%', background: '#212529', color: '#fff', fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{step.num}</span>
                    </div>
                    <h4 style={{ fontSize: 18, fontWeight: 700, color: '#212529', marginBottom: 12 }}>{step.title}</h4>
                    <p style={{ color: '#6c757d', fontSize: 14, margin: 0 }}>{step.desc}</p>
                  </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 50 }}>
              <p style={{ color: '#6c757d', marginBottom: 16 }}>Ready to get started?</p>
              <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg,#667eea,#764ba2)', color: '#fff', padding: '14px 32px', borderRadius: 12, fontWeight: 700, textDecoration: 'none', boxShadow: '0 6px 20px rgba(102,126,234,0.3)', transition: 'all 0.3s ease' }}>
                Start Now <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
          </div>
        </section>

        {/* ── PRICING ── */}
        <section id="pricing" style={{ padding: '100px 0', background: '#fff' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <p style={{ color: '#667eea', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 3, fontSize: 13, marginBottom: 8 }}>PRICING</p>
              <h2 style={{ fontSize: 40, fontWeight: 800, color: '#212529', marginBottom: 12 }}>Popular Packages</h2>
              <p style={{ color: '#6c757d', maxWidth: 560, margin: '0 auto' }}>Transparent pricing for exceptional work. Every project is unique, but these packages give you a starting point.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 28 }}>
              <PricingCard icon="bi-lightning-fill" name="Basic Assignment" desc="Perfect for simple tasks & small assignments" price="1,500" currency="Rs" period="one-time"
                           features={['Single subject assignment','Up to 10 pages','Basic documentation','1 revision included','3-5 day delivery']} />
              <PricingCard icon="bi-stars" name="University Project" desc="For businesses ready to stand out" price="3,500" currency="Rs" period="one-time" perPerson featured badge="Most Popular"
                           features={['Phase-based development with digital agreement','Customized project according to university guidelines','Complete documentation and source code','Regular progress updates and reviews']} />
              <PricingCard icon="bi-trophy-fill" name="Custom Website" desc="Complex applications & systems" price="15,000" currency="Rs" period="project-based" plus
                           features={['Fully responsive and modern UI design','Customized features based on requirements','Secure and optimized performance','Cross-browser and device compatibility','Deployment and basic maintenance support','SEO-friendly structure for better visibility']} />
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section id="testimonials" style={{ padding: '100px 0', background: 'linear-gradient(135deg,#0f0c29 0%,#302b63 50%,#24243e 100%)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', width: 500, height: 500, background: 'radial-gradient(circle,rgba(102,126,234,0.12) 0%,transparent 70%)', borderRadius: '50%', top: -150, right: -100, pointerEvents: 'none' }}></div>
          <div style={{ position: 'absolute', width: 350, height: 350, background: 'radial-gradient(circle,rgba(118,75,162,0.1) 0%,transparent 70%)', borderRadius: '50%', bottom: -100, left: -80, pointerEvents: 'none' }}></div>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
            <div style={{ textAlign: 'center', marginBottom: 60, position: 'relative', zIndex: 2 }}>
              <span style={{ display: 'inline-block', background: 'linear-gradient(135deg,#667eea,#764ba2)', color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: 3, padding: '6px 18px', borderRadius: 20, marginBottom: 16 }}>TESTIMONIALS</span>
              <h2 style={{ fontSize: 40, fontWeight: 800, color: '#fff', marginBottom: 12 }}>What Our Clients Say</h2>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', maxWidth: 480, margin: '0 auto' }}>Real feedback from students we've helped achieve academic success</p>
            </div>

            <div style={{ position: 'relative', maxWidth: 800, margin: '0 auto', padding: '0 70px', zIndex: 2 }}>
              <button onClick={prevSlide} style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg,#667eea,#764ba2)', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(102,126,234,0.4)' }}>
                <i className="bi bi-chevron-left"></i>
              </button>
              <button onClick={nextSlide} style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg,#667eea,#764ba2)', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(102,126,234,0.4)' }}>
                <i className="bi bi-chevron-right"></i>
              </button>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ display: 'flex', transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1)', transform: `translateX(-${currentSlide * 100}%)` }}>
                  {testimonials.map(t => (
                      <div key={t.id} style={{ minWidth: '100%', flexShrink: 0, padding: '0 10px' }}>
                        <div style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 24, padding: '44px 40px 36px', position: 'relative', borderTop: '3px solid transparent', backgroundClip: 'padding-box' }}>
                          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg,#667eea,#764ba2,#f5576c)', borderRadius: '24px 24px 0 0' }}></div>
                          <i className="bi bi-quote" style={{ fontSize: 52, color: 'rgba(102,126,234,0.4)', display: 'block', marginBottom: 20, lineHeight: 1 }}></i>
                          <p style={{ fontSize: 16, lineHeight: 1.8, color: 'rgba(255,255,255,0.85)', fontStyle: 'italic', marginBottom: 30 }}>"{t.text}"</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                            <img src={`https://ui-avatars.com/api/?name=${t.name.replace(' ', '+')}&background=667eea&color=fff&size=70`} alt={t.name} style={{ width: 52, height: 52, borderRadius: '50%', border: '3px solid rgba(102,126,234,0.6)', objectFit: 'cover', flexShrink: 0 }} />
                            <div style={{ flex: 1 }}>
                              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{t.name}</h3>
                              <div style={{ color: '#ffc107', fontSize: 14, letterSpacing: 2 }}>{'★'.repeat(t.rating)}</div>
                            </div>
                            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: 0, whiteSpace: 'nowrap' }}>{t.date}</p>
                          </div>
                        </div>
                      </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: 40, color: 'rgba(255,255,255,0.8)', fontSize: 16, position: 'relative', zIndex: 2 }}>
              <i className="bi bi-star-fill" style={{ color: '#ffc107', marginRight: 8 }}></i>
              Average Rating: <span style={{ color: '#ffc107', fontWeight: 700, fontSize: 20, margin: '0 6px' }}>4.8</span> / 5.0
            </div>
          </div>
        </section>

        {/* ── CONTACT ── */}
        <section id="contact" style={{ padding: '100px 0', background: '#f8f9fa', position: 'relative', overflow: 'hidden' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <span style={{ display: 'inline-block', background: 'linear-gradient(135deg,#667eea,#764ba2)', color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: 3, padding: '6px 18px', borderRadius: 20, marginBottom: 16 }}>GET IN TOUCH</span>
              <h2 style={{ fontSize: 40, fontWeight: 800, color: '#212529', marginBottom: 12 }}>Contact Us</h2>
              <p style={{ color: '#6c757d', maxWidth: 480, margin: '0 auto' }}>Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 40, alignItems: 'start' }}>

              {/* Info Panel */}
              <div style={{ background: 'linear-gradient(135deg,#667eea,#764ba2)', borderRadius: 24, padding: '44px 36px', color: '#fff' }}>
                <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Let's talk about your assignment</h3>
                <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 32, lineHeight: 1.7 }}>Have questions about our services or need help? We're available 24/7 to assist you with IT and Quantity Surveying assignments.</p>
                {[
                  { icon: 'bi-envelope-fill', bg: 'linear-gradient(135deg,#f093fb,#f5576c)', label: 'Email Us', value: 'assignmentservice.net@gmail.com', href: 'mailto:assignmentservice.net@gmail.com' },
                  { icon: 'bi-telephone-fill', bg: 'linear-gradient(135deg,#4facfe,#00f2fe)', label: 'Call Us', value: '+94 788 769 570', href: 'tel:+94788769570' },
                  { icon: 'bi-globe2', bg: 'linear-gradient(135deg,#43e97b,#38f9d7)', label: 'Location', value: 'Available Worldwide — Remote Services' },
                  { icon: 'bi-clock-fill', bg: 'linear-gradient(135deg,#fa709a,#fee140)', label: 'Support Hours', value: '24/7 Customer Support' },
                ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 14, background: 'rgba(255,255,255,0.1)', borderRadius: 14, marginBottom: 14, border: '1px solid rgba(255,255,255,0.15)', transition: 'all 0.3s', textDecoration: 'none', color: '#fff' }}
                         {...(item.href ? { as: 'a', href: item.href } : {})}>
                      <div style={{ width: 46, height: 46, borderRadius: 12, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                        <i className={`bi ${item.icon}`}></i>
                      </div>
                      <div>
                        <span style={{ display: 'block', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>{item.label}</span>
                        <span style={{ fontSize: 14, color: '#fff', fontWeight: 500 }}>{item.value}</span>
                      </div>
                    </div>
                ))}
                <div style={{ display: 'flex', gap: 12, marginTop: 24, alignItems: 'center' }}>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>Follow us:</span>
                  {[['bi-facebook','#'], ['bi-instagram','#'], ['bi-whatsapp','https://wa.me/94788769570']].map(([icon, href], i) => (
                      <a key={i} href={href} target="_blank" rel="noreferrer" style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', textDecoration: 'none', fontSize: 16, transition: 'all 0.3s' }}>
                        <i className={`bi ${icon}`}></i>
                      </a>
                  ))}
                </div>
              </div>

              {/* Form Panel */}
              <div style={{ background: '#fff', borderRadius: 24, padding: '44px 36px', boxShadow: '0 8px 40px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0' }}>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: '#212529', marginBottom: 28 }}>Send a Message</h3>
                <form onSubmit={handleContactSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#495057', marginBottom: 8 }}>Your Name</label>
                      <div style={{ position: 'relative' }}>
                        <i className="bi bi-person" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#667eea' }}></i>
                        <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Full name" style={{ width: '100%', padding: '12px 14px 12px 40px', border: '1.5px solid #e9ecef', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'border 0.2s' }} onFocus={e => e.target.style.borderColor = '#667eea'} onBlur={e => e.target.style.borderColor = '#e9ecef'} />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#495057', marginBottom: 8 }}>Email Address</label>
                      <div style={{ position: 'relative' }}>
                        <i className="bi bi-envelope" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#667eea' }}></i>
                        <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="Your email" style={{ width: '100%', padding: '12px 14px 12px 40px', border: '1.5px solid #e9ecef', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor = '#667eea'} onBlur={e => e.target.style.borderColor = '#e9ecef'} />
                      </div>
                    </div>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#495057', marginBottom: 8 }}>Phone Number</label>
                    <div style={{ position: 'relative' }}>
                      <i className="bi bi-telephone" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#667eea' }}></i>
                      <input type="tel" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="Your phone number" style={{ width: '100%', padding: '12px 14px 12px 40px', border: '1.5px solid #e9ecef', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor = '#667eea'} onBlur={e => e.target.style.borderColor = '#e9ecef'} />
                    </div>
                  </div>
                  <div style={{ marginBottom: 24 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#495057', marginBottom: 8 }}>Your Message</label>
                    <div style={{ position: 'relative' }}>
                      <i className="bi bi-chat-dots" style={{ position: 'absolute', left: 14, top: 14, color: '#667eea' }}></i>
                      <textarea required rows={5} value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} placeholder="Tell us about your assignment or ask any questions..." style={{ width: '100%', padding: '12px 14px 12px 40px', border: '1.5px solid #e9ecef', borderRadius: 10, fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor = '#667eea'} onBlur={e => e.target.style.borderColor = '#e9ecef'} />
                    </div>
                  </div>
                  <button type="submit" disabled={formStatus.loading} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg,#667eea,#764ba2)', color: '#fff', border: 'none', padding: '14px 32px', borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '0 6px 20px rgba(102,126,234,0.3)', transition: 'all 0.3s', opacity: formStatus.loading ? 0.7 : 1 }}>
                    <span>{formStatus.loading ? 'Sending...' : 'Send Message'}</span>
                    <i className="bi bi-send-fill"></i>
                  </button>
                  {formStatus.message && (
                      <div style={{ marginTop: 16, padding: '12px 16px', borderRadius: 10, fontSize: 14, fontWeight: 600, background: formStatus.type === 'success' ? '#d4edda' : '#f8d7da', color: formStatus.type === 'success' ? '#155724' : '#721c24', border: `1px solid ${formStatus.type === 'success' ? '#c3e6cb' : '#f5c6cb'}` }}>
                        {formStatus.type === 'success' ? '✓ ' : '✗ '}{formStatus.message}
                      </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ background: 'linear-gradient(135deg,#1e3c72 0%,#2a5298 50%,#1e3c72 100%)', color: '#fff', padding: '60px 0 0', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg,#667eea,#764ba2,#667eea)', backgroundSize: '200% 100%', animation: 'gradientShift 3s ease infinite' }}></div>
          <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 40, paddingBottom: 40, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>

              {/* Brand */}
              <div>
                <h3 style={{ fontSize: 28, fontWeight: 700, marginBottom: 15, background: 'linear-gradient(135deg,#fff,#a8c0ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Assignment Service</h3>
                <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, marginBottom: 20, fontSize: 14 }}>Professional IT & Quantity Surveying assignment help. We deliver quality solutions tailored to your academic needs.</p>
                <div style={{ display: 'flex', gap: 12 }}>
                  {['bi-facebook','bi-twitter-x','bi-linkedin','bi-instagram'].map((icon, i) => (
                      <a key={i} href="#" style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', textDecoration: 'none', transition: 'all 0.3s' }}
                         onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(135deg,#667eea,#764ba2)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                         onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'none'; }}>
                        <i className={`bi ${icon}`}></i>
                      </a>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20, paddingBottom: 10, borderBottom: '3px solid', borderImage: 'linear-gradient(90deg,#667eea,#764ba2) 1' }}>Quick Links</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {[['Home','#hero'],['About Us','/about'],['Services','#services'],['Testimonials','/feedback/all'],['Contact','#contact']].map(([label, href], i) => (
                      <li key={i} style={{ marginBottom: 12 }}>
                        <a href={href} style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: 14, transition: 'all 0.3s', display: 'inline-block' }}
                           onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.paddingLeft = '20px'; }}
                           onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; e.currentTarget.style.paddingLeft = '0'; }}>
                          {label}
                        </a>
                      </li>
                  ))}
                </ul>
              </div>

              {/* Services */}
              <div>
                <h4 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20, paddingBottom: 10, borderBottom: '3px solid', borderImage: 'linear-gradient(90deg,#667eea,#764ba2) 1' }}>Our Services</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {['IT Assignments','Quantity Surveying','Programming Help','Cost Estimation','Project Support'].map((item, i) => (
                      <li key={i} style={{ marginBottom: 12 }}>
                        <a href="#services" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: 14, transition: 'all 0.3s', display: 'inline-block' }}
                           onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.paddingLeft = '20px'; }}
                           onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; e.currentTarget.style.paddingLeft = '0'; }}>
                          {item}
                        </a>
                      </li>
                  ))}
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20, paddingBottom: 10, borderBottom: '3px solid', borderImage: 'linear-gradient(90deg,#667eea,#764ba2) 1' }}>Get In Touch</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {[
                    { icon: 'bi-whatsapp', bg: 'linear-gradient(135deg,#25D366,#128C7E)', label: 'WhatsApp', value: '+94 788 769 570', href: 'https://wa.me/94788769570' },
                    { icon: 'bi-phone', bg: 'linear-gradient(135deg,#667eea,#764ba2)', label: 'Phone', value: '+94 788 769 570', href: 'tel:+94788769570' },
                    { icon: 'bi-envelope', bg: 'linear-gradient(135deg,#f093fb,#f5576c)', label: 'Email', value: 'assignmentservice.net@gmail.com', href: 'mailto:assignmentservice.net@gmail.com' },
                    { icon: 'bi-geo-alt-fill', bg: 'linear-gradient(135deg,#4facfe,#00f2fe)', label: 'Location', value: 'Available Worldwide' },
                  ].map((item, i) => (
                      <li key={i} style={{ marginBottom: 12 }}>
                        <a href={item.href || '#'} target={item.href?.startsWith('http') ? '_blank' : undefined} rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 12, background: 'rgba(255,255,255,0.05)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', textDecoration: 'none', color: '#fff', transition: 'all 0.3s' }}
                           onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateX(5px)'; }}
                           onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'none'; }}>
                          <div style={{ width: 40, height: 40, borderRadius: 10, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <i className={`bi ${item.icon}`}></i>
                          </div>
                          <div>
                            <span style={{ display: 'block', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>{item.label}</span>
                            <span style={{ fontSize: 13, fontWeight: 500 }}>{item.value}</span>
                          </div>
                        </a>
                      </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Footer Bottom */}
            <div style={{ padding: '24px 0', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, margin: 0 }}>&copy; 2026 Assignment Service. All rights reserved.</p>
              <div style={{ display: 'flex', gap: 20 }}>
                {[['Privacy Policy','/privacy-policy.html'],['Terms & Conditions','/terms-and-conditions.html'],['Return Policy','/return-policy.html']].map(([label, href], i) => (
                    <a key={i} href={href} style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: 14, transition: 'color 0.2s' }}
                       onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                       onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>
                      {label}
                    </a>
                ))}
              </div>
            </div>
          </div>

          {/* WhatsApp Float */}
          <a href="https://wa.me/94788769570" target="_blank" rel="noreferrer" style={{ position: 'fixed', bottom: 32, right: 32, width: 56, height: 56, background: 'linear-gradient(135deg,#25D366,#128C7E)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 28, textDecoration: 'none', boxShadow: '0 8px 25px rgba(37,211,102,0.4)', zIndex: 1000, transition: 'all 0.3s', animation: 'pulseWA 2s infinite' }}
             onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; }}
             onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}>
            <i className="bi bi-whatsapp"></i>
          </a>
        </footer>

        <style>{`
        @keyframes gradientShift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes pulseWA { 0%,100%{box-shadow:0 8px 25px rgba(37,211,102,0.4)} 50%{box-shadow:0 8px 35px rgba(37,211,102,0.7)} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing: border-box; }
        input, textarea { font-family: inherit; }
        @media (max-width: 768px) {
          nav > div { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
      </div>
  );
};

/* ── Helper Components ── */
const ServiceCard = ({ iconBg, icon, tag, tagColor, tagBg, borderTop, title, desc, items, checkBg, checkColor, btnBg, btnShadow, btnLabel }) => {
  const [hovered, setHovered] = useState(false);
  return (
      <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
           style={{ background: '#fff', borderRadius: 24, padding: '40px 36px', border: hovered ? '1.5px solid transparent' : '1.5px solid #f0f0f0', position: 'relative', overflow: 'hidden', transition: 'all 0.4s', transform: hovered ? 'translateY(-10px)' : 'none', boxShadow: hovered ? '0 24px 60px rgba(0,0,0,0.1)' : '0 4px 24px rgba(0,0,0,0.05)' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: borderTop, opacity: hovered ? 1 : 0, transition: 'opacity 0.3s', borderRadius: '24px 24px 0 0' }}></div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, color: '#fff', transition: 'transform 0.4s', transform: hovered ? 'rotate(-8deg) scale(1.1)' : 'none' }}>
            <i className={`bi ${icon}`}></i>
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', padding: '5px 14px', borderRadius: 20, background: tagBg, color: tagColor }}>{tag}</span>
        </div>
        <h3 style={{ fontSize: 24, fontWeight: 800, color: '#212529', marginBottom: 12 }}>{title}</h3>
        <p style={{ fontSize: 14.5, color: '#6c757d', lineHeight: 1.7, marginBottom: 24 }}>{desc}</p>
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px', borderTop: '1px solid #f0f0f0', paddingTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {items.map((item, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, color: '#495057', fontWeight: 500 }}>
                <span style={{ width: 22, height: 22, borderRadius: 6, background: checkBg, color: checkColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>✓</span>
                {item}
              </li>
          ))}
        </ul>
        <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 28px', borderRadius: 12, fontSize: 14, fontWeight: 700, textDecoration: 'none', color: '#fff', background: btnBg, boxShadow: `0 6px 20px ${btnShadow}`, transition: 'all 0.3s' }}>
          {btnLabel} <i className="bi bi-arrow-right"></i>
        </Link>
      </div>
  );
};

const PricingCard = ({ icon, name, desc, price, currency, period, perPerson, featured, badge, plus, features }) => {
  const [hovered, setHovered] = useState(false);
  return (
      <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
           style={{ position: 'relative', borderRadius: 24, padding: featured ? '48px 36px' : '40px 36px', border: featured ? 'none' : '1.5px solid #f0f0f0', background: featured ? 'linear-gradient(135deg,#0f0c29,#302b63)' : '#fff', color: featured ? '#fff' : '#212529', boxShadow: hovered ? '0 20px 50px rgba(0,0,0,0.15)' : '0 4px 20px rgba(0,0,0,0.05)', transform: hovered ? 'translateY(-8px)' : 'none', transition: 'all 0.3s' }}>
        {badge && <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg,#667eea,#764ba2)', color: '#fff', padding: '6px 20px', borderRadius: 20, fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' }}>{badge}</div>}
        <div style={{ width: 60, height: 60, borderRadius: 16, background: featured ? 'rgba(255,255,255,0.15)' : 'linear-gradient(135deg,#667eea,#764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, color: '#fff', marginBottom: 20 }}>
          <i className={`bi ${icon}`}></i>
        </div>
        <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>{name}</h3>
        <p style={{ fontSize: 14, color: featured ? 'rgba(255,255,255,0.7)' : '#6c757d', marginBottom: 20 }}>{desc}</p>
        <div style={{ marginBottom: 4 }}>
          <span style={{ fontSize: 14, color: featured ? 'rgba(255,255,255,0.6)' : '#6c757d' }}>{currency}</span>
          <span style={{ fontSize: 42, fontWeight: 800, margin: '0 4px' }}>{price}</span>
          {plus && <span style={{ fontSize: 24, fontWeight: 700 }}>+</span>}
          {perPerson && <span style={{ fontSize: 13, color: featured ? 'rgba(255,255,255,0.6)' : '#6c757d', marginLeft: 6 }}>Per Person</span>}
        </div>
        <p style={{ fontSize: 13, color: featured ? 'rgba(255,255,255,0.5)' : '#adb5bd', marginBottom: 28 }}>{period}</p>
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px' }}>
          {features.map((f, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, marginBottom: 12, color: featured ? 'rgba(255,255,255,0.85)' : '#495057' }}>
                <i className="bi bi-check2" style={{ color: featured ? '#38ef7d' : '#667eea', fontWeight: 700, fontSize: 16, flexShrink: 0, marginTop: 1 }}></i>
                {f}
              </li>
          ))}
        </ul>
        <Link to="/login" style={{ display: 'block', textAlign: 'center', padding: '14px', borderRadius: 12, fontWeight: 700, fontSize: 14, textDecoration: 'none', letterSpacing: 1, background: featured ? 'linear-gradient(135deg,#667eea,#764ba2)' : 'transparent', color: featured ? '#fff' : '#667eea', border: featured ? 'none' : '2px solid #667eea', transition: 'all 0.3s' }}>
          GET STARTED
        </Link>
      </div>
  );
};

export default Home;