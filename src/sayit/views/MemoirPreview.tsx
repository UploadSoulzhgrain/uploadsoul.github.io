
import React from 'react';

interface MemoirPreviewProps {
  onBack: () => void;
}

const MemoirPreview: React.FC<MemoirPreviewProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-[#FDFCF8] flex flex-col animate-fade-in">
      {/* Top Navigation */}
      <header className="px-4 py-6 flex items-center justify-between border-b border-black/5">
        <button 
          onClick={onBack}
          className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-dark-brown/60"
        >
          <span className="material-symbols-outlined text-sm">chevron_left</span>
          Chapters
        </button>
        <h1 className="text-xl font-handwriting italic text-dark-brown/80">Memoir Preview</h1>
        <button className="text-dark-brown/60">
          <span className="material-symbols-outlined">volume_up</span>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {/* Cover Hero Section */}
        <section className="relative h-[580px] w-full flex flex-col items-center justify-center bg-gradient-to-b from-[#7A8B7A] to-[#A8B5A3] p-8">
          <div className="flex items-center gap-4 mb-10">
            <div className="h-px w-8 bg-dark-brown/20"></div>
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-dark-brown/50">Page 1 of 12</span>
            <div className="h-px w-8 bg-dark-brown/20"></div>
          </div>

          <div className="text-center space-y-2 mb-10">
            <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-amber-gold">Chapter One</h4>
            <h2 className="text-4xl font-bold leading-tight max-w-[280px] mx-auto text-dark-brown">The Riverside Childhood</h2>
          </div>

          <div className="mb-10 text-dark-brown/20">
            <span className="material-symbols-outlined !text-4xl">auto_stories</span>
          </div>

          {/* Polaroid Photo Frame */}
          <div className="w-full max-w-[260px] bg-white p-3 pt-3 pb-10 shadow-2xl rotate-[-1deg] photo-shadow">
            <div className="aspect-[4/3] w-full overflow-hidden mb-2">
              <img 
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000&auto=format&fit=crop" 
                alt="Vintage Memory"
                className="w-full h-full object-cover sepia-[0.4] brightness-[0.9]"
              />
            </div>
          </div>
          
          <p className="mt-4 text-[11px] italic font-serif text-dark-brown/60">
            Summer of 1954: The gathering at the bend.
          </p>
        </section>

        {/* Action Buttons Area */}
        <section className="p-6 space-y-3 bg-[#FDFCF8]">
          <button className="w-full py-4 bg-[#1B4332] text-white rounded-md flex items-center justify-center gap-3 shadow-lg active:scale-[0.98] transition-all">
            <span className="material-symbols-outlined">menu_book</span>
            <span className="font-bold text-sm tracking-wide">Export as PDF / Album</span>
          </button>
          
          <button className="w-full py-4 border-2 border-[#D7C4A5] text-[#3E2723] rounded-md flex items-center justify-center gap-3 bg-cream/30 active:scale-[0.98] transition-all">
            <span className="material-symbols-outlined">family_history</span>
            <span className="font-bold text-sm tracking-wide">Share with Children</span>
          </button>
        </section>

        {/* Body Text Section */}
        <section className="px-8 py-10 space-y-8 bg-gradient-to-b from-[#FDFCF8] via-[#E8F0E8] to-[#D5E2D5] min-h-screen">
          <div className="prose prose-stone max-w-none font-serif leading-relaxed text-dark-brown/90 text-lg">
            <p>
              The ripples in the late afternoon, turning the river into a ribbon of molten gold. We spent our summers catching minnows and building forts under the weeping willow trees, oblivious to the world beyond the bend.
            </p>
            
            <p>
              Mother would call us for dinner from the porch, her voice carrying over the sound of the water. Those were simpler days, filled with the scent of pine needles and the cool touch of the river mud between our toes. Every stone had a story, and every ripple was a promise of a new adventure.
            </p>
            
            <p>
              It was there, among the reeds and the dragonflies, that I first learned to listen—not just with my ears, but with my heart. The river taught me that life is a flow, sometimes quiet and deep, sometimes rushing and wild, but always moving toward something larger than itself.
            </p>
          </div>

          <div className="flex justify-center gap-2 py-12">
            <div className="size-1.5 rounded-full bg-dark-brown/20"></div>
            <div className="size-1.5 rounded-full bg-dark-brown/20"></div>
            <div className="size-1.5 rounded-full bg-dark-brown/20"></div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default MemoirPreview;
