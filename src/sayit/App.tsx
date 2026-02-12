
import React, { useState, useEffect } from 'react';
import { AppView } from './types';
import Home from './views/Home';
import MemoirRoom from './views/MemoirRoom';
import Collection from './views/Collection';
import TimeCapsule from './views/TimeCapsule';
import Settings from './views/Settings';
import MemoirPreview from './views/MemoirPreview';
import MoodTreeHollow from './views/MoodTreeHollow';
import LetterToFuture from './views/LetterToFuture';
import BottomNav from './components/BottomNav';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [activeTopic, setActiveTopic] = useState<string | undefined>(undefined);

  const navigateToMemoirWithTopic = (topic: string) => {
    setActiveTopic(topic);
    setCurrentView(AppView.MEMOIR_ROOM);
  };

  const handleBackToHome = () => {
    setActiveTopic(undefined);
    setCurrentView(AppView.HOME);
  };

  // Render the appropriate view based on state
  const renderView = () => {
    switch (currentView) {
      case AppView.HOME:
        return <Home onNavigate={setCurrentView} onStartInterview={navigateToMemoirWithTopic} />;
      case AppView.MEMOIR_ROOM:
        return <MemoirRoom onBack={handleBackToHome} initialTopic={activeTopic} />;
      case AppView.COLLECTION:
        return <Collection onSelectChapter={() => setCurrentView(AppView.MEMOIR_PREVIEW)} />;
      case AppView.TIME_CAPSULE:
        return <TimeCapsule onStartWriting={() => setCurrentView(AppView.LETTER_TO_FUTURE)} />;
      case AppView.LETTER_TO_FUTURE:
        return <LetterToFuture onBack={() => setCurrentView(AppView.TIME_CAPSULE)} />;
      case AppView.SETTINGS:
        return <Settings onBack={() => setCurrentView(AppView.HOME)} />;
      case AppView.MEMOIR_PREVIEW:
        return <MemoirPreview onBack={() => setCurrentView(AppView.COLLECTION)} />;
      case AppView.MOOD_TREE_HOLLOW:
        return <MoodTreeHollow onBack={() => setCurrentView(AppView.HOME)} />;
      default:
        return <Home onNavigate={setCurrentView} onStartInterview={navigateToMemoirWithTopic} />;
    }
  };

  return (
    <div className="max-w-md mx-auto bg-cream min-h-screen flex flex-col shadow-2xl overflow-hidden relative">
      <main className="flex-1 flex flex-col h-full overflow-y-auto pb-24">
        {renderView()}
      </main>
      
      {/* Hide bottom nav in focused rooms */}
      {currentView !== AppView.MEMOIR_ROOM && 
       currentView !== AppView.MEMOIR_PREVIEW && 
       currentView !== AppView.MOOD_TREE_HOLLOW &&
       currentView !== AppView.LETTER_TO_FUTURE && (
        <BottomNav activeView={currentView} onNavigate={setCurrentView} />
      )}
    </div>
  );
};

export default App;
