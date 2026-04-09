'use client';
import Script from 'next/script';
import { Suspense } from 'react';
function NoraApp() {
  return (
    <>
      <div className="phone">
        <div className="status-bar">
          <div className="status-time" id="statusTime">12:55</div>
          <div className="status-icons">
            <span className="status-icon">📶</span>
            <span className="status-icon">🔋</span>
            <span className="status-icon" id="statusBattery">98%</span>
          </div>
        </div>
        <div className="screen active" id="coverScreen">
          <div className="cover">
            <div className="hero">
              <video autoPlay muted loop playsInline id="heroVideo">
                <source src="/nora-hero.mp4" type="video/mp4" />
              </video>
              <div className="hero-placeholder" id="heroPlaceholder">🌙</div>
            </div>
            <h1 className="title">Nora Reads You</h1>
            <p className="subtitle">Korean fortune-telling that actually gets you.</p>
            <button className="cta-button" id="startBtn">I&apos;m curious</button>
            <p className="footer-text">Free · Private · 3 min</p>
          </div>
        </div>
        <div className="screen" id="dmScreen">
          <div className="dm-header">
            <button className="back-btn" id="backBtn">←</button>
            <div className="avatar">
              <img src="/nora-avatar.jpg" alt="Nora" id="avatarImg" style={{display:'none'}} />
              <div className="avatar-placeholder" id="avatarPlaceholder">✨</div>
            </div>
            <div className="dm-name">Nora</div>
          </div>
          <div className="chat" id="chat">
            <div className="typing" id="typing">
              <span className="typing-text">Nora is typing</span>
              <div className="dots">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
          </div>
          <div className="input-area" id="inputArea">
            <div className="choices" id="choices"></div>
            <div className="category-grid" id="categoryGrid"></div>
            <div className="text-input-wrapper" id="textInput">
              <input type="text" className="text-input" id="textField" placeholder="" />
              <button className="send-btn" id="sendBtn">Send</button>
            </div>
            <div className="dropdown-group" id="dropdowns"></div>
          </div>
        </div>
        <div style={{textAlign:'center',padding:'15px',opacity:0.4,fontSize:'11px',color:'#9B8E82'}}>
          Questions or Thoughts? ▶{' '}
          <a href="mailto:hi@readnora.com" style={{color:'#9B8E82',textDecoration:'none'}}>
            hi@readnora.com
          </a>
        </div>
      </div>
      
      <!-- Reddit Pixel -->
        <script>
          !function(w,d){if(!w.rdt){var p=w.rdt=function(){p.sendEvent?p.sendEvent.apply(p,arguments):p.callQueue.push(arguments)};p.callQueue=[];var t=d.createElement("script");t.src="https://www.redditstatic.com/ads/pixel.js?pixel_id=a2_ilfjdrn45r2c",t.async=!0;var s=d.getElementsByTagName("script")[0];s.parentNode.insertBefore(t,s)}}(window,document);rdt('init','a2_ilfjdrn45r2c');rdt('track', 'PageVisit');
        </script>
        <!-- DO NOT MODIFY UNLESS TO REPLACE A USER IDENTIFIER -->
          <!-- End Reddit Pixel -->
      
      <Script id="nora-app-loader" strategy="afterInteractive">
        {`
        (function() {
        var s = document.createElement('script');
        s.src = '/nora-app.js';
        document.body.appendChild(s);
        })();
        `}
      </Script>
    </>
  );
}
export default function Page() {
  return (
    <Suspense>
      <NoraApp />
    </Suspense>
  );
}
