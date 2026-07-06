'use client';

import { ReactNode, useState } from 'react';

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
  icon?: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  variant?: 'line' | 'pill';
}

export function Tabs({
  tabs,
  defaultTab,
  variant = 'line',
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '');

  const lineVariant = 'border-b-2 pb-4';
  const pillVariant = 'rounded-lg px-4 py-2';

  return (
    <div className="w-full">
      <div className={variant === 'line' ? 'border-b border-gray-200' : 'bg-gray-50 p-1 rounded-lg inline-flex gap-1'}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 font-medium text-base transition-all duration-300 ${
              activeTab === tab.id
                ? variant === 'line'
                  ? `${lineVariant} text-midnight-950 border-midnight-950`
                  : `${pillVariant} bg-white text-midnight-950 shadow-sm`
                : variant === 'line'
                  ? `${lineVariant} text-gray-600 border-transparent hover:text-midnight-950 hover:border-gray-300`
                  : `${pillVariant} text-gray-600 hover:text-midnight-950`
            }`}
          >
            {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tabs.map((tab) => (
          activeTab === tab.id && (
            <div key={tab.id} className="animate-fadeIn">
              {tab.content}
            </div>
          )
        ))}
      </div>
    </div>
  );
}
