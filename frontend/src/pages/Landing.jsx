import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Camera, ShieldCheck, BarChart3, Brain, Users, Clock, ArrowRight, Zap } from 'lucide-react';
import * as THREE from 'three';

export default function Landing() {
  const canvasRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 500);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(scrolled / maxScroll);
    };

    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2
      });
    };
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current, 
      alpha: true,
      antialias: true 
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.position.z = 50;

    // Create flowing neural network
    const nodes = [];
    const connections = [];
    const nodeCount = 80;

    // Create nodes
    for (let i = 0; i < nodeCount; i++) {
      const nodeGeometry = new THREE.SphereGeometry(0.3, 16, 16);
      const nodeMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(0.55 + Math.random() * 0.1, 1, 0.6),
        transparent: true,
        opacity: 0.8
      });
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      
      // Position in 3D space
      const radius = 30 + Math.random() * 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      node.position.set(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      );
      
      node.userData.velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02
      );
      
      nodes.push(node);
      scene.add(node);
    }

    // Create connections between nearby nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const distance = nodes[i].position.distanceTo(nodes[j].position);
        if (distance < 15) {
          const points = [nodes[i].position, nodes[j].position];
          const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
          const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x3b82f6,
            transparent: true,
            opacity: Math.max(0, 0.3 - distance / 50)
          });
          const line = new THREE.Line(lineGeometry, lineMaterial);
          connections.push({ line, nodeA: nodes[i], nodeB: nodes[j] });
          scene.add(line);
        }
      }
    }

    // Create energy particles flowing through network
    const energyParticles = [];
    const energyCount = 200;
    
    for (let i = 0; i < energyCount; i++) {
      const particleGeometry = new THREE.SphereGeometry(0.1, 8, 8);
      const particleMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(0.55 + Math.random() * 0.15, 1, 0.7),
        transparent: true,
        opacity: 0.9
      });
      const particle = new THREE.Mesh(particleGeometry, particleMaterial);
      
      // Random starting position
      const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
      particle.position.copy(randomNode.position);
      particle.userData.targetNode = nodes[Math.floor(Math.random() * nodes.length)];
      particle.userData.progress = 0;
      particle.userData.speed = 0.01 + Math.random() * 0.02;
      
      energyParticles.push(particle);
      scene.add(particle);
    }

    // Create pulsing wave rings
    const waves = [];
    for (let i = 0; i < 3; i++) {
      const waveGeometry = new THREE.TorusGeometry(20 + i * 8, 0.05, 16, 100);
      const waveMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(0.55 + i * 0.03, 1, 0.5),
        transparent: true,
        opacity: 0.15
      });
      const wave = new THREE.Mesh(waveGeometry, waveMaterial);
      wave.rotation.x = Math.PI / 2;
      waves.push(wave);
      scene.add(wave);
    }

    // Create data stream particles
    const streamParticles = [];
    const streamCount = 1000;
    const streamGeometry = new THREE.BufferGeometry();
    const streamPositions = new Float32Array(streamCount * 3);
    const streamColors = new Float32Array(streamCount * 3);
    const streamSizes = new Float32Array(streamCount);

    for (let i = 0; i < streamCount; i++) {
      const i3 = i * 3;
      const angle = (i / streamCount) * Math.PI * 2;
      const radius = 40;
      
      streamPositions[i3] = Math.cos(angle) * radius;
      streamPositions[i3 + 1] = (Math.random() - 0.5) * 60;
      streamPositions[i3 + 2] = Math.sin(angle) * radius;

      const color = new THREE.Color().setHSL(0.55 + Math.random() * 0.1, 1, 0.6);
      streamColors[i3] = color.r;
      streamColors[i3 + 1] = color.g;
      streamColors[i3 + 2] = color.b;

      streamSizes[i] = Math.random() * 2;
    }

    streamGeometry.setAttribute('position', new THREE.BufferAttribute(streamPositions, 3));
    streamGeometry.setAttribute('color', new THREE.BufferAttribute(streamColors, 3));
    streamGeometry.setAttribute('size', new THREE.BufferAttribute(streamSizes, 1));

    const streamMaterial = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });

    const stream = new THREE.Points(streamGeometry, streamMaterial);
    scene.add(stream);

    // Animation
    let animationId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Move nodes organically
      nodes.forEach((node, i) => {
        node.position.add(node.userData.velocity);
        
        // Keep nodes within bounds
        const distance = node.position.length();
        if (distance > 50) {
          node.position.normalize().multiplyScalar(50);
          node.userData.velocity.negate();
        }
        
        // Pulse effect
        node.scale.setScalar(1 + Math.sin(time * 2 + i) * 0.2);
      });

      // Update connections
      connections.forEach(({ line, nodeA, nodeB }) => {
        const positions = line.geometry.attributes.position.array;
        positions[0] = nodeA.position.x;
        positions[1] = nodeA.position.y;
        positions[2] = nodeA.position.z;
        positions[3] = nodeB.position.x;
        positions[4] = nodeB.position.y;
        positions[5] = nodeB.position.z;
        line.geometry.attributes.position.needsUpdate = true;
      });

      // Animate energy particles
      energyParticles.forEach((particle) => {
        particle.userData.progress += particle.userData.speed;
        
        if (particle.userData.progress >= 1) {
          particle.userData.progress = 0;
          particle.userData.targetNode = nodes[Math.floor(Math.random() * nodes.length)];
        }
        
        particle.position.lerp(particle.userData.targetNode.position, particle.userData.progress);
        particle.scale.setScalar(1 + Math.sin(time * 5) * 0.3);
      });

      // Animate waves
      waves.forEach((wave, i) => {
        wave.rotation.z = time * 0.2 * (i + 1);
        wave.scale.setScalar(1 + Math.sin(time + i) * 0.1);
        wave.material.opacity = 0.15 + Math.sin(time * 2 + i) * 0.1;
      });

      // Animate data stream
      const positions = stream.geometry.attributes.position.array;
      for (let i = 0; i < streamCount; i++) {
        const i3 = i * 3;
        positions[i3 + 1] -= 0.2;
        
        if (positions[i3 + 1] < -30) {
          positions[i3 + 1] = 30;
        }
      }
      stream.geometry.attributes.position.needsUpdate = true;
      stream.rotation.y = time * 0.1;

      // Camera movement
      camera.position.x += (mousePos.x * 3 - camera.position.x) * 0.03;
      camera.position.y += (-mousePos.y * 3 - camera.position.y) * 0.03;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      renderer.dispose();
    };
  }, [mousePos, scrollProgress]);

  const features = [
    { icon: <Camera size={40} />, title: "Face Attendance", desc: "AI-powered biometric recognition", color: "from-blue-500 to-cyan-500" },
    { icon: <ShieldCheck size={40} />, title: "Secure Auth", desc: "Enterprise-grade security", color: "from-cyan-500 to-teal-500" },
    { icon: <Clock size={40} />, title: "Real-Time Sync", desc: "Instant data synchronization", color: "from-teal-500 to-green-500" },
    { icon: <Users size={40} />, title: "Team Management", desc: "Complete workforce control", color: "from-green-500 to-emerald-500" },
    { icon: <BarChart3 size={40} />, title: "Advanced Analytics", desc: "Deep insights & metrics", color: "from-emerald-500 to-blue-500" },
    { icon: <Brain size={40} />, title: "AI Assistant", desc: "Intelligent automation", color: "from-purple-500 to-pink-500" }
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-900 via-[#0a192f] to-black text-white overflow-hidden">
      {/* Three.js Background */}
      <canvas ref={canvasRef} className="fixed inset-0 -z-10" />

      {/* Gradient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-blue-900/5 to-transparent -z-5 pointer-events-none" />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        <div 
          className={`text-center transform transition-all duration-1000 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Floating Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 backdrop-blur-sm mb-8 animate-float">
            <Zap className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-300">Next-Gen HR Platform</span>
          </div>

          {/* Main Title */}
          <h1 className="relative mb-8">
            <div className="text-8xl md:text-[12rem] font-black tracking-tighter leading-none">
              <span className="inline-block relative">
                <span className="relative z-10 bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-400 text-transparent bg-clip-text animate-gradient-x">
                  IMPLOYEE
                </span>
                <span className="absolute inset-0 blur-3xl bg-gradient-to-r from-blue-600/50 via-cyan-600/50 to-teal-600/50 animate-pulse" />
              </span>
            </div>
          </h1>

          {/* Subtitle */}
          <p className="text-2xl md:text-4xl font-light text-gray-300 mb-6 tracking-wide">
            Where <span className="text-cyan-400 font-semibold">Intelligence</span> Meets{' '}
            <span className="text-blue-400 font-semibold">Efficiency</span>
          </p>

          {/* Description */}
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-400 mb-12 leading-relaxed">
            Revolutionary workforce management powered by cutting-edge AI, real-time analytics,
            and quantum-grade security. Transform your HR operations into a seamless digital experience.
          </p>

          {/* CTA */}
          <div className="flex justify-center mb-20">
            <Link
              to="/login"
              className="group relative px-12 py-5 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 font-bold text-xl transition-all duration-300 hover:scale-110 hover:shadow-[0_0_50px_rgba(59,130,246,0.5)]"
            >
              <span className="relative z-10 flex items-center gap-3">
                Launch Platform
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Link>
          </div>

          {/* Stats - FIXED LAYOUT */}
          <div className="grid grid-cols-3 gap-8 mt-24 max-w-4xl mx-auto">
            {[
              { value: '99.9%', label: 'Recognition Accuracy' },
              { value: '0.8s', label: 'Average Response' },
              { value: '∞', label: 'Scalability' }
            ].map((stat, i) => (
              <div 
                key={i} 
                className="relative group"
                style={{ 
                  animation: `float ${3 + i}s ease-in-out infinite`,
                  animationDelay: `${i * 0.2}s` 
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-400/20 blur-2xl group-hover:blur-3xl transition-all rounded-full" />
                <div className="relative text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 group-hover:border-cyan-500/50 transition-all">
                  <div className="text-5xl md:text-6xl font-black bg-gradient-to-r from-blue-400 to-cyan-300 text-transparent bg-clip-text mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SUPERPOWERS Section - Kept Exactly As Is */}
      <section className="relative py-40 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-6xl md:text-7xl font-black mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 text-transparent bg-clip-text">
                Superpowers
              </span>
            </h2>
            <p className="text-2xl text-gray-400 max-w-3xl mx-auto">
              Built for the future. Designed for today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative"
                style={{
                  animation: `fadeInUp 0.8s ease-out ${index * 0.1}s both`
                }}
              >
                <div className="relative h-full p-10 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl border border-white/10 hover:border-cyan-500/50 transition-all duration-500 overflow-hidden group-hover:scale-105">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500`} />
                  
                  <div className={`relative inline-flex p-5 rounded-2xl bg-gradient-to-br ${feature.color} mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-2xl`}>
                    {feature.icon}
                  </div>

                  <h3 className="text-3xl font-bold mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-blue-400 group-hover:bg-clip-text transition-all duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-lg leading-relaxed">
                    {feature.desc}
                  </p>

                  {/* Animated border lines on hover */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <div className="absolute bottom-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-blue-500 to-transparent transform translate-y-full group-hover:-translate-y-full transition-transform duration-1000" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-40 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="relative p-16 rounded-[3rem] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 via-cyan-600/30 to-teal-600/30 blur-3xl animate-gradient-xy" />
            <div className="absolute inset-0 bg-black/40 backdrop-blur-2xl" />
            <div className="absolute inset-0 border border-white/10 rounded-[3rem]" />
            
            <div className="relative z-10">
              <h2 className="text-5xl md:text-7xl font-black mb-8">
                <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-400 text-transparent bg-clip-text">
                  Ready to Elevate?
                </span>
              </h2>
              <p className="text-2xl text-gray-300 mb-12 max-w-2xl mx-auto">
                Join the future of workforce management. Experience the difference.
              </p>
              
              <Link
                to="/signup"
                className="group inline-flex items-center gap-4 px-14 py-6 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 rounded-full font-black text-2xl hover:scale-110 transition-all duration-300 hover:shadow-[0_0_80px_rgba(59,130,246,0.6)] relative overflow-hidden"
              >
                <span className="relative z-10">Start Your Journey</span>
                <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 py-12 text-center">
        <p className="text-gray-500 text-lg">
          © {new Date().getFullYear()} IMPLOYEE • Redefining Workforce Excellence
        </p>
      </footer>

      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes gradient-xy {
          0%, 100% { background-position: 0% 0%; }
          25% { background-position: 100% 0%; }
          50% { background-position: 100% 100%; }
          75% { background-position: 0% 100%; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes scroll {
          0% { transform: translateY(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(12px); opacity: 0; }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 5s ease infinite;
        }

        .animate-gradient-xy {
          background-size: 400% 400%;
          animation: gradient-xy 15s ease infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-scroll {
          animation: scroll 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}