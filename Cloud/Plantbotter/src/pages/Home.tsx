import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonIcon, IonFab, IonFabButton} from '@ionic/react';
import PlantCards from '../components/Home/PlantCards';
import {settingsOutline} from 'ionicons/icons';
import {getAllController, getLog, getLang, log, controller} from '../scripts/superStore';

const Home: React.FC = () => {
  return (
    <IonPage className="Home">
      <IonHeader>
        <IonToolbar>
          <IonTitle>PlantBotter</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <PlantCards controller={getAllController()}></PlantCards>
      </IonContent>
      <IonFab vertical="bottom" horizontal="end" slot="fixed" >
        <IonFabButton href="/settings" color="dark">
          <IonIcon icon={settingsOutline}></IonIcon>
        </IonFabButton>
      </IonFab>
    </IonPage>
  );
};

export default Home;
