import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Menu, X, Moon, Sun, Zap, Target, BarChart, Bell, Mail, Phone, MapPin, Github, Twitter, Linkedin } from 'lucide-react';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} transition-colors duration-300`}>
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            HabitTracker
          </div>
          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              <li><a href="#features" className="hover:text-purple-400 transition-colors">Features</a></li>
              <li><a href="#about" className="hover:text-purple-400 transition-colors">About</a></li>
              <li><a href="#testimonials" className="hover:text-purple-400 transition-colors">Testimonials</a></li>
              <li><Link to="/login" className="bg-purple-600 px-6 py-2 rounded-full hover:bg-purple-700 transition-colors">Login</Link></li>
            </ul>
          </nav>
          <div className="flex items-center space-x-4">
            <button onClick={toggleDarkMode} className="p-2 rounded-full bg-gray-800 dark:bg-gray-200">
              {isDarkMode ? <Sun className="text-yellow-400" /> : <Moon className="text-gray-800" />}
            </button>
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <nav className="mt-4 md:hidden">
            <ul className="flex flex-col space-y-2">
              <li><a href="#features" className="block py-2 hover:text-purple-400 transition-colors">Features</a></li>
              <li><a href="#about" className="block py-2 hover:text-purple-400 transition-colors">About</a></li>
              <li><a href="#testimonials" className="block py-2 hover:text-purple-400 transition-colors">Testimonials</a></li>
              <li><Link to="/login" className="block py-2 bg-purple-600 px-4 rounded-full hover:bg-purple-700 transition-colors text-center">Login</Link></li>
            </ul>
          </nav>
        )}
      </header>

      <main className="container mx-auto px-4 py-16">
        <section className="text-center mb-24">
          <h1 className="text-6xl font-bold mb-6 leading-tight">
            Transform Your Life, <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              One Habit at a Time
            </span>
          </h1>
          <p className="text-xl mb-12 max-w-2xl mx-auto">
            Empower your journey to self-improvement with our intuitive habit tracking tool. 
            Set goals, track progress, and achieve your dreams.
          </p>
          <Link to="/signup" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-10 py-4 rounded-full text-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 inline-flex items-center group">
            Start Your Journey
            <ArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </section>

        <section id="features" className="mb-32">
          <h2 className="text-4xl font-bold mb-16 text-center">
            Powerful Features to <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">Transform Your Habits</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            {[
              { icon: <Zap className="w-16 h-16 text-yellow-400" />, title: "Smart Tracking", description: "Our AI-powered system adapts to your behavior, providing personalized insights and suggestions to optimize your habit formation journey." },
              { icon: <Target className="w-16 h-16 text-green-400" />, title: "Goal Setting", description: "Set SMART goals with our intuitive interface. Break down big aspirations into manageable daily tasks and watch your progress unfold." },
              { icon: <BarChart className="w-16 h-16 text-blue-400" />, title: "In-depth Analytics", description: "Gain valuable insights with our comprehensive analytics. Visualize your progress, identify patterns, and make data-driven decisions to improve your habits." },
              { icon: <Bell className="w-16 h-16 text-red-400" />, title: "Smart Reminders", description: "Never miss a habit with our intelligent reminder system. It learns your optimal times and sends motivating notifications to keep you on track." }
            ].map((feature, index) => (
              <div key={index} className="bg-gray-800 p-8 rounded-2xl shadow-lg flex items-start space-x-6 transform hover:-translate-y-2 transition-all duration-300">
                <div className="flex-shrink-0 bg-gray-700 p-3 rounded-full">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-4 text-white">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="about" className="mb-32">
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-1 rounded-3xl shadow-xl">
            <div className="bg-gray-800 p-12 rounded-3xl text-white">
              <h2 className="text-4xl font-bold mb-8 text-center">About HabitTracker</h2>
              <p className="mb-12 text-xl max-w-3xl mx-auto text-center leading-relaxed text-gray-300">
                HabitTracker is your personal companion on the journey to self-improvement. We combine cutting-edge technology with proven psychological techniques to help you build lasting habits and achieve your full potential.
              </p>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gray-700 p-8 rounded-xl shadow-inner">
                  <h3 className="text-2xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">Our Mission</h3>
                  <p className="text-gray-300">To empower individuals to take control of their lives and unlock their full potential through the power of positive habits. We believe that small, consistent actions lead to extraordinary results.</p>
                </div>
                <div className="bg-gray-700 p-8 rounded-xl shadow-inner">
                  <h3 className="text-2xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">Our Approach</h3>
                  <p className="text-gray-300">We leverage behavioral science, user-centered design, and advanced analytics to create a habit-forming experience tailored to you. Our platform adapts to your unique needs and goals, ensuring long-term success.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="mb-32">
          <h2 className="text-4xl font-bold mb-16 text-center">
            What Our Users Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Sarah L.", role: "Fitness Enthusiast", quote: "HabitTracker has revolutionized my fitness journey. I've never been so consistent with my workouts!" },
              { name: "Mike R.", role: "Entrepreneur", quote: "As a busy entrepreneur, HabitTracker helps me stay on top of my personal development goals. It's a game-changer!" },
              { name: "Emily T.", role: "Student", quote: "I've improved my study habits significantly thanks to HabitTracker. My grades have never been better!" }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-xl shadow-lg">
                <p className="mb-4 italic text-gray-300">"{testimonial.quote}"</p>
                <p className="font-semibold text-white">{testimonial.name}</p>
                <p className="text-sm text-gray-400">{testimonial.role}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} py-16`}>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">HabitTracker</h3>
              <p className="text-gray-400">Empowering you to build better habits and transform your life.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-purple-400 transition-colors">Features</a></li>
                <li><a href="#about" className="text-gray-400 hover:text-purple-400 transition-colors">About Us</a></li>
                <li><a href="#testimonials" className="text-gray-400 hover:text-purple-400 transition-colors">Testimonials</a></li>
                <li><a href="/blog" className="text-gray-400 hover:text-purple-400 transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Legal</h4>
              <ul className="space-y-2">
                <li><a href="/privacy" className="text-gray-400 hover:text-purple-400 transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="text-gray-400 hover:text-purple-400 transition-colors">Terms of Service</a></li>
                <li><a href="/cookies" className="text-gray-400 hover:text-purple-400 transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Contact Us</h4>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-400">
                  <Mail className="mr-2 w-5 h-5" /> support@habittracker.com
                </li>
                <li className="flex items-center text-gray-400">
                  <Phone className="mr-2 w-5 h-5" /> +1 (555) 123-4567
                </li>
                <li className="flex items-center text-gray-400">
                  <MapPin className="mr-2 w-5 h-5" /> 123 Habit St, San Francisco, CA 94122
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">&copy; 2023 HabitTracker. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Github className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;