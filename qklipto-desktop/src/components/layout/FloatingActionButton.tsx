import React from 'react';
import { Plus } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';

interface FloatingActionButtonProps {
    onClick: () => void;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onClick }) => {
    const { currentView } = useUIStore();

    // Only show FAB on clips and favorites views
    if (currentView !== 'clips' && currentView !== 'favorites') {
        return null;
    }

    return (
        <button
            onClick={onClick}
            className="fixed bottom-20 left-1/2 transform -translate-x-1/2 w-14 h-14 bg-clipto-primary hover:bg-clipto-primaryLight active:bg-clipto-primaryDark rounded-full shadow-fab flex items-center justify-center transition-all duration-200 fab-ripple z-30 group"
            aria-label="Create new clip"
        >
            <Plus size={28} className="text-clipto-background group-hover:rotate-90 transition-transform duration-200" />
        </button>
    );
};
