import React from 'react';
import { Scissors, Clock, ArrowRight, Sparkles, Flame, Droplets, Crown } from 'lucide-react';
import { formatINR } from '../utils/bookingEngine';

interface ServiceCardProps {
  service: {
    id: string;
    title: string;
    description: string;
    startingPrice: number;
    duration: string;
    icon: string;
    image: string;
  };
  onSelectService: (serviceName: string) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onSelectService }) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Scissors':
        return <Scissors className="w-5 h-5" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5" />;
      case 'Flame':
        return <Flame className="w-5 h-5" />;
      case 'Droplets':
        return <Droplets className="w-5 h-5" />;
      case 'Crown':
        return <Crown className="w-5 h-5" />;
      default:
        return <Scissors className="w-5 h-5" />;
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-sm hover:shadow-lg hover:border-amber-400/60 transition-all duration-300 flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        
        <div className="absolute top-3 left-3 w-9 h-9 rounded-xl bg-stone-900/90 text-amber-400 backdrop-blur-sm flex items-center justify-center shadow-md">
          {getIcon(service.icon)}
        </div>

        <div className="absolute bottom-3 left-3 right-3 text-white">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1">
            <Clock className="w-3 h-3 inline" /> {service.duration}
          </span>
          <h3 className="text-lg font-bold font-serif-display text-white mt-0.5">
            {service.title}
          </h3>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
          {service.description}
        </p>

        <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-stone-400 block">Starting from</span>
            <span className="text-base font-bold text-stone-900 font-serif-display tabular-nums">
              {formatINR(service.startingPrice)}
            </span>
          </div>

          <button
            onClick={() => onSelectService(service.title)}
            className="py-2 px-3.5 rounded-xl bg-stone-900 hover:bg-amber-500 hover:text-stone-950 text-white text-xs font-semibold transition-all flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            <span>Book</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
