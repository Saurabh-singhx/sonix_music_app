
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';


export const GenderCard = ({
  selected,
  label,
  icon,
  onClick
}: {
  selected: boolean;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}) => {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all duration-300",
        selected
          ? "bg-indigo-500/10 border-indigo-500 text-indigo-400"
          : "bg-slate-900/50 border-slate-700 text-slate-400 hover:border-slate-600"
      )}
    >
      {selected && (
        <motion.div
          layoutId="gender-check"
          className="absolute top-2 right-2"
        >
          <div className="w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center">
            <Check className="w-3 h-3 text-white" />
          </div>
        </motion.div>
      )}
      <div className={cn(
        "p-2 rounded-full transition-colors",
        selected ? "bg-indigo-500/20" : "bg-slate-800"
      )}>
        {icon}
      </div>
      <span className="text-sm font-medium">{label}</span>
    </motion.button>
  );
};