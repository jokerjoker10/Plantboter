import { IonContent, IonFab, IonFabButton, IonFabList, IonIcon, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { ellipsisVerticalOutline, personOutline, logOutOutline, settingsOutline, hardwareChipOutline } from 'ionicons/icons';
import PlantList from '../components/home/plantlist';
import './Home.css';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Plantboter</IonTitle>
        </IonToolbar>
        <IonFab vertical="top" horizontal="end">
          <IonFabButton>
            <IonIcon icon={ellipsisVerticalOutline}></IonIcon>
          </IonFabButton>
          <IonFabList side="bottom">
            <IonFabButton href="/user">
              <IonIcon icon={personOutline}></IonIcon>
            </IonFabButton>
            <IonFabButton href="/settings">
              <IonIcon icon={hardwareChipOutline}></IonIcon>
            </IonFabButton>
            <IonFabButton href="/logout" color="danger">
              <IonIcon icon={logOutOutline}></IonIcon>
            </IonFabButton>
          </IonFabList>
        </IonFab>
      </IonHeader>
      <IonContent fullscreen className="background">
        <PlantList></PlantList>
      </IonContent>
    </IonPage>
  );
};

export default Home;