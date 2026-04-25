import React, { createContext, useContext, useState, type ReactNode, useCallback } from 'react';

export interface TabContent {
  id: string;
  label: string;
  component: ReactNode;
  path: string; // Keep track of the path for navigation/identification
}

interface TabContextType {
  tabs: TabContent[];
  activeTabId: string | null;
  addTab: (tab: TabContent) => void;
  removeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
}

const TabContext = createContext<TabContextType | undefined>(undefined);

export const TabProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tabs, setTabs] = useState<TabContent[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);

  const addTab = useCallback((newTab: TabContent) => {
    setTabs((prevTabs) => {
      const existingTab = prevTabs.find((tab) => tab.id === newTab.id);
      if (existingTab) {
        setActiveTabId(newTab.id);
        return prevTabs;
      }
      setActiveTabId(newTab.id);
      return [...prevTabs, newTab];
    });
  }, []);

  const removeTab = useCallback((tabId: string) => {
    setTabs((prevTabs) => {
      const updatedTabs = prevTabs.filter((tab) => tab.id !== tabId);
      if (activeTabId === tabId) {
        // If the active tab is removed, activate the last remaining tab or null
        setActiveTabId(updatedTabs.length > 0 ? updatedTabs[updatedTabs.length - 1].id : null);
      }
      return updatedTabs;
    });
  }, [activeTabId]);

  const setActiveTab = useCallback((tabId: string) => {
    setActiveTabId(tabId);
  }, []);

  return (
    <TabContext.Provider value={{ tabs, activeTabId, addTab, removeTab, setActiveTab }}>
      {children}
    </TabContext.Provider>
  );
};

export const useTabs = () => {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error('useTabs must be used within a TabProvider');
  }
  return context;
};
