import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonIcon, IonFab, IonFabButton, IonButtons, IonBackButton, IonMenu, IonItem, IonList } from '@ionic/react';
import DisplaySettings from '../components/Settings/DisplaySettings';
import { menuController } from '@ionic/core';
import {settingsOutline} from 'ionicons/icons';
import { getAllController } from '../scripts/superStore';

const Settings: React.FC = () => {

  
  menuController.get("setting-menue").then((menue)=>{
    menue?.open();
  })

  return (
    <IonPage className="Home">
      <IonMenu side="start" contentId="setting-menue">
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle></IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            <IonItem>Controller</IonItem>
          </IonList>
        </IonContent>
      </IonMenu>

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
