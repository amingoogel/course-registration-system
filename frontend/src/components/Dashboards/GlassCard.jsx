function GlassCard({ children, className = "" }) {
    const glassBox =
      "bg-white/6 backdrop-blur-lg border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.08)]";
  
    return (
      <div className={[glassBox, "rounded-3xl", className].join(" ")}>
        {children}
      </div>
    );
  }
  
  export default GlassCard;
  