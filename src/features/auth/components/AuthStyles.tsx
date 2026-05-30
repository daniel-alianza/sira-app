export function AuthStyles() {
  return (
    <style>{`
      @keyframes drift {
        0%, 100% { transform: translate(0, 0) scale(1); }
        25% { transform: translate(30px, -20px) scale(1.05); }
        50% { transform: translate(-15px, -35px) scale(0.97); }
        75% { transform: translate(-30px, 10px) scale(1.02); }
      }
      @keyframes driftSlow {
        0%, 100% { transform: translate(0, 0) scale(1); }
        33% { transform: translate(-25px, 30px) scale(1.08); }
        66% { transform: translate(20px, -15px) scale(0.95); }
      }
      @keyframes pulseGlow {
        0%, 100% { opacity: 0.15; }
        50% { opacity: 0.3; }
      }
      @keyframes slideUp {
        from { transform: translateY(100%); }
        to { transform: translateY(0); }
      }
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-6px); }
        40% { transform: translateX(6px); }
        60% { transform: translateX(-4px); }
        80% { transform: translateX(4px); }
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(12px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes scaleIn {
        from { opacity: 0; transform: scale(0.96); }
        to { opacity: 1; transform: scale(1); }
      }
      .animate-drift { animation: drift 18s ease-in-out infinite; }
      .animate-drift-slow { animation: driftSlow 22s ease-in-out 2s infinite; }
      .animate-pulse-glow { animation: pulseGlow 6s ease-in-out infinite; }
      .animate-slide-up { animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      .animate-shake { animation: shake 0.4s ease-in-out; }
      .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
      .animate-scale-in { animation: scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      .stagger-1 { animation-delay: 0.08s; opacity: 0; }
      .stagger-2 { animation-delay: 0.16s; opacity: 0; }
      .stagger-3 { animation-delay: 0.24s; opacity: 0; }
      .stagger-4 { animation-delay: 0.32s; opacity: 0; }
      .stagger-5 { animation-delay: 0.40s; opacity: 0; }
      @media (hover: hover) {
        .card-lift {
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1),
                      box-shadow 0.5s ease;
        }
        .card-lift:hover {
          transform: perspective(1200px) rotateX(1.5deg) rotateY(1.5deg) scale(1.005);
          box-shadow: 0 40px 80px rgba(255, 77, 0, 0.12),
                      0 10px 30px rgba(0, 0, 0, 0.25);
        }
      }
      .auth-page {
        color-scheme: light;
      }
      .auth-page h1,
      .auth-page h2 {
        color: #0a2240;
      }
      .auth-page [data-slot="input"]:-webkit-autofill,
      .auth-page [data-slot="input"]:-webkit-autofill:hover,
      .auth-page [data-slot="input"]:-webkit-autofill:focus,
      .auth-page [data-slot="input"]:-webkit-autofill:active {
        -webkit-box-shadow: 0 0 0 1000px #ffffff inset !important;
        box-shadow: 0 0 0 1000px #ffffff inset !important;
        -webkit-text-fill-color: #0a2240 !important;
        caret-color: #0a2240;
        border-color: rgba(10, 34, 64, 0.12) !important;
        transition: background-color 99999s ease-out 0s;
      }
    `}</style>
  );
}
