import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonIcon, IonFab, IonFabButton, IonButtons, IonBackButton} from '@ionic/react';
import DisplaySettings from '../components/Settings/DisplaySettings';
import {settingsOutline} from 'ionicons/icons';
import { getAllController } from '../scripts/superStore';

const Settings: React.FC = () => {
  return (
    <IonPage className="Home">
      <IonHeader>
        <IonToolbar>
          <IonTitle>PlantBotter</IonTitle>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <DisplaySettings controller={getAllController()}></DisplaySettings>
      </IonContent>
    </IonPage>
  );
};

export default Settings;
