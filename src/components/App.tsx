import PageLayout from '@/components/PageLayout';
import Home from '@/components/Home';
import PasswordGenerator from '@/components/PasswordGenerator';
import StrengthChecker from '@/components/StrengthChecker';
import Placeholder from '@/components/Placeholder';
import { useView } from '@/hooks/useView';

function App() {
  const [view, navigate] = useView('home');

  const renderView = () => {
    switch (view) {
      case 'home':
        return <Home onNavigate={navigate} />;
      case 'generator':
        return <PasswordGenerator />;
      case 'strength':
        return <StrengthChecker />;
      case 'passphrase':
        return (
          <Placeholder
            icon="📝"
            title="Passphrase 生成器"
            description="基于词库生成易记且高熵的密码短语"
            accent="purple"
          />
        );
      case 'vault':
        return (
          <Placeholder
            icon="🔒"
            title="加密保险箱"
            description="端到端加密的本地密码保险箱"
            accent="cyan"
          />
        );
      default:
        return <Home onNavigate={navigate} />;
    }
  };

  return (
    <PageLayout currentView={view} onNavigate={navigate}>
      {renderView()}
    </PageLayout>
  );
}

export default App;
