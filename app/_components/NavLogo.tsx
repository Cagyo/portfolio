export function NavLogo() {
  return (
    <a href="#hero" className="flex items-center gap-3 cursor-pointer group">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-heading font-black text-xs flex-shrink-0 overflow-hidden">
        <span>OB</span>
      </div>
      <span className="font-heading font-bold text-sm text-white/80 group-hover:text-white transition-colors hidden sm:block">
        Oleksii Berliziev
      </span>
    </a>
  );
}
