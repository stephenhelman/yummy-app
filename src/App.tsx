import { AppShell } from './components/AppShell';
import { Success } from './components/Success';
import { Welcome } from './components/Welcome';
import { Wizard } from './components/Wizard';
import { useForm } from './form/FormContext';

export function App() {
  const { state } = useForm();
  const { step } = state;

  if (step === 'welcome') {
    return (
      <AppShell variant="welcome">
        <Welcome />
      </AppShell>
    );
  }
  if (step === 'success') {
    return (
      <AppShell variant="success">
        <Success />
      </AppShell>
    );
  }
  return (
    <AppShell variant="compact">
      <Wizard step={step} />
    </AppShell>
  );
}
