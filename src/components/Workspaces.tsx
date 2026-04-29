import React, { useRef, useEffect } from 'react';
import { useTabs } from '../contexts/TabContext.tsx';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import {useUIStore} from "../hooks/store/useUIStore.ts";

const Workspaces: React.FC = () => {
    const { tabs, activeTabId, removeTab, setActiveTab } = useTabs();
    const scrollRef = useRef<HTMLDivElement>(null);
    const activeTabRef = useRef<HTMLDivElement>(null);

    const navigateTab = (direction: 'next' | 'prev') => {
        const currentIndex = tabs.findIndex(t => t.id === activeTabId);
        if (currentIndex === -1) return;

        let nextIndex;
        if (direction === 'next') {
            nextIndex = (currentIndex + 1) % tabs.length;
        } else {
            nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        }

        setActiveTab(tabs[nextIndex].id);
    };

    // Χειροκίνητο scroll στη μπάρα των tabs
    useEffect(() => {
        if (activeTabRef.current && scrollRef.current) {
            const container = scrollRef.current;
            const tab = activeTabRef.current;

            const containerWidth = container.offsetWidth;
            const tabOffsetLeft = tab.offsetLeft;
            const tabWidth = tab.offsetWidth;

            const targetScroll = tabOffsetLeft - (containerWidth / 2) + (tabWidth / 2);

            container.scrollTo({
                left: targetScroll,
                behavior: 'smooth'
            });
        }

        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 50);

    }, [activeTabId]);

    const collapsed = useUIStore((s) => s.sidebarCollapsed);

    if (tabs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 p-20 bg-gray-50">
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center max-w-sm">
                    <p className="text-xl font-semibold text-gray-600 mb-2">OMS Workspace</p>
                    <p className="text-sm">There are no active workspaces.</p>
                    <p className="text-sm mt-1">Select a section from the menu on the left to get started.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full w-full bg-gray-50">
            {/* Tab Bar Header */}
            <div className="relative h-[49px] bg-white border-b border-gray-200 flex-none w-full">

                {/* Fixed Navigator */}
                <div className="absolute left-0 top-0 bottom-0 z-30 flex items-center bg-white px-2 border-r border-gray-100 shadow-[4px_0_8px_rgba(0,0,0,0.05)] gap-1">
                    <button
                        onClick={() => navigateTab('prev')}
                        className="w-8 h-8 rounded-md hover:bg-gray-50 text-gray-400 hover:text-blue-600 transition-all flex items-center justify-center border border-transparent hover:border-gray-200"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={() => navigateTab('next')}
                        className="w-8 h-8 rounded-md hover:bg-gray-50 text-gray-400 hover:text-blue-600 transition-all flex items-center justify-center border border-transparent hover:border-gray-200"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>

                {/* Scrollable Tabs Area */}
                <div
                    ref={scrollRef}
                    className="tabs-scroll h-full overflow-x-auto overflow-y-hidden whitespace-nowrap select-none flex items-end pr-4 touch-pan-x"
                    style={{
                        width: `calc(100% - ${collapsed ? "85px" : "200px"})`,
                        marginLeft: '85px'
                    }}
                >
                    {tabs.map((tab) => {
                        const isActive = activeTabId === tab.id;
                        return (
                            <div
                                key={tab.id}
                                ref={isActive ? activeTabRef : null}
                                className={`
                                    flex items-center gap-3 px-4 py-2.5 rounded-t-lg text-[13px] font-medium cursor-pointer transition-all border-t border-x -mb-[1px] ml-1
                                    ${isActive
                                        ? "bg-gray-50 text-blue-600 border-gray-200 shadow-[0_-2px_8px_rgba(0,0,0,0.03)] z-10"
                                        : "bg-white text-gray-400 border-transparent hover:text-gray-600 hover:bg-gray-50"}
                                `}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <span className="truncate max-w-[150px]">{tab.label}</span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeTab(tab.id);
                                    }}
                                    className={`
                                        p-0.5 rounded-md flex items-center justify-center transition-colors
                                        ${isActive ? "hover:bg-gray-200 text-blue-400" : "hover:bg-gray-100 text-gray-300"}
                                    `}
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Tab Content Area */}
            <div className="flex-1 relative text-center">
                {tabs.map((tab) => {
                    const isActive = activeTabId === tab.id;
                    return (
                        <div
                            key={tab.id}
                            className={`absolute inset-0 w-full h-full transition-opacity duration-75 ${
                                isActive 
                                ? "opacity-100 z-10 visible" 
                                : "opacity-0 z-0 invisible pointer-events-none"
                            }`
                        }
                        >
                            <div className="p-4"
                                 style={{
                                     width: `calc(100% - ${collapsed ? "0%" : "10px"})`,
                                 }}>
                                {tab.component}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Workspaces;