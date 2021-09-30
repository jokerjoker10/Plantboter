import { IonContent, IonFab, IonFabButton, IonFabList, IonIcon, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { ellipsisHorizontalCircleOutline, personOutline, warningOutline } from 'ionicons/icons';
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
            <IonIcon icon={ellipsisHorizontalCircleOutline}></IonIcon>
          </IonFabButton>
          <IonFabList side="bottom">
            <IonFabButton href="/user">
              <IonIcon icon={personOutline}></IonIcon>
            </IonFabButton>
          </IonFabList>
        </IonFab>
      </IonHeader>
      <IonContent fullscreen className="background">


      </IonContent>
    </IonPage>
  );
};

export default Home;